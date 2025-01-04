import { $E, Expression, ExternalModule, FreeFunction, IScope, Module, SelectiveModuleImport, Statement, ThingSymbol, Type, TypeScriptRenderer, code, expr } from '@cdklabs/typewriter';
import { EsLintRules } from '@cdklabs/typewriter/lib/eslint-rules';
import * as prettier from 'prettier';
import { generateDefault, lit } from './util';
import { CliConfig, CliOption, YargsOption } from './yargs-types';

// to import lodash.clonedeep properly, we would need to set esModuleInterop: true
// however that setting does not work in the CLI, so we fudge it.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cloneDeep = require('lodash.clonedeep');

export class CliHelpers extends ExternalModule {
  public readonly browserForPlatform = makeCallableExpr(this, 'browserForPlatform');
  public readonly cliVersion = makeCallableExpr(this, 'cliVersion');
  public readonly isCI = makeCallableExpr(this, 'isCI');
  public readonly yargsNegativeAlias = makeCallableExpr(this, 'yargsNegativeAlias');
}

function makeCallableExpr(scope: IScope, name: string) {
  return $E(expr.sym(new ThingSymbol(name, scope)));
}

export async function renderYargs(config: CliConfig, helpers: CliHelpers): Promise<string> {
  const scope = new Module('aws-cdk');

  scope.documentation.push( '-------------------------------------------------------------------------------------------');
  scope.documentation.push('GENERATED FROM packages/aws-cdk/lib/config.ts.');
  scope.documentation.push('Do not edit by hand; all changes will be overwritten at build time from the config file.');
  scope.documentation.push('-------------------------------------------------------------------------------------------');

  scope.addImport(new SelectiveModuleImport(scope, 'yargs', ['Argv']));
  helpers.import(scope, 'helpers');

  // 'https://github.com/yargs/yargs/issues/1929',
  // 'https://github.com/evanw/esbuild/issues/1492',
  scope.addInitialization(code.comment('eslint-disable-next-line @typescript-eslint/no-require-imports'));
  scope.addInitialization(code.stmt.constVar(code.expr.ident('yargs'), code.expr.directCode("require('yargs')")));

  const parseCommandLineArguments = new FreeFunction(scope, {
    name: 'parseCommandLineArguments',
    export: true,
    returnType: Type.ANY,
    parameters: [
      { name: 'args', type: Type.arrayOf(Type.STRING) },
    ],
  });
  parseCommandLineArguments.addBody(makeYargs(config, helpers));

  const ts = new TypeScriptRenderer({
    disabledEsLintRules: [EsLintRules.MAX_LEN], // the default disabled rules result in 'Definition for rule 'prettier/prettier' was not found'
  }).render(scope);

  return prettier.format(ts, {
    parser: 'typescript',
    printWidth: 150,
    singleQuote: true,
    trailingComma: 'all',
  });
}

// Use the following configuration for array arguments:
//
//     { type: 'array', default: [], nargs: 1, requiresArg: true }
//
// The default behavior of yargs is to eat all strings following an array argument:
//
//   ./prog --arg one two positional  => will parse to { arg: ['one', 'two', 'positional'], _: [] } (so no positional arguments)
//   ./prog --arg one two -- positional  => does not help, for reasons that I can't understand. Still gets parsed incorrectly.
//
// By using the config above, every --arg will only consume one argument, so you can do the following:
//
//   ./prog --arg one --arg two position  =>  will parse to  { arg: ['one', 'two'], _: ['positional'] }.
function makeYargs(config: CliConfig, helpers: CliHelpers): Statement {
  let yargsExpr: Expression = code.expr.ident('yargs');
  yargsExpr = yargsExpr
    .callMethod('env', lit('CDK'))
    .callMethod('usage', lit('Usage: cdk -a <cdk-app> COMMAND'));

  // we must compute global options first, as they are not part of an argument to a command call
  yargsExpr = makeOptions(yargsExpr, config.globalOptions, helpers);

  for (const command of Object.keys(config.commands)) {
    const commandFacts = config.commands[command];
    const commandArg = commandFacts.arg
      ? ` [${commandFacts.arg?.name}${commandFacts.arg?.variadic ? '..' : ''}]`
      : '';
    const aliases = commandFacts.aliases
      ? commandFacts.aliases.map((alias) => `, '${alias}${commandArg}'`)
      : '';

    // must compute options before we compute the full command, because in yargs, the options are an argument to the command call.
    let optionsExpr: Expression = code.expr.directCode('(yargs: Argv) => yargs');
    optionsExpr = makeOptions(optionsExpr, commandFacts.options ?? {}, helpers);

    const commandCallArgs: Array<Expression> = [];
    if (aliases) {
      commandCallArgs.push(code.expr.directCode(`['${command}${commandArg}'${aliases}]`));
    } else {
      commandCallArgs.push(code.expr.directCode(`'${command}${commandArg}'`));
    }
    commandCallArgs.push(lit(commandFacts.description));

    if (commandFacts.options) {
      commandCallArgs.push(optionsExpr);
    }

    yargsExpr = yargsExpr.callMethod('command', ...commandCallArgs);
  }

  return code.stmt.ret(makeEpilogue(yargsExpr, helpers));
}

function makeOptions(prefix: Expression, options: { [optionName: string]: CliOption }, helpers: CliHelpers) {
  let optionsExpr = prefix;
  for (const option of Object.keys(options)) {
    const theOption: CliOption = {
      // Make the default explicit (overridden if the option includes an actual default)
      // 'notification-arns' is a special snowflake that should be defaulted to 'undefined', but https://github.com/yargs/yargs/issues/2443
      // prevents us from doing so. This should be changed if the issue is resolved.
      ...(option === 'notification-arns' ? {} : { default: generateDefault(options[option].type) }),
      ...options[option],
    };
    const optionProps: YargsOption = cloneDeep(theOption);
    const optionArgs: { [key: string]: Expression } = {};

    // Array defaults
    if (optionProps.type === 'array') {
      optionProps.nargs = 1;
      optionProps.requiresArg = true;
    }

    for (const optionProp of Object.keys(optionProps).filter(opt => !['negativeAlias'].includes(opt))) {
      const optionValue = (optionProps as any)[optionProp];
      if (optionValue instanceof Expression) {
        optionArgs[optionProp] = optionValue;
      } else {
        optionArgs[optionProp] = lit(optionValue);
      }
    }

    // Register the option with yargs
    optionsExpr = optionsExpr.callMethod('option', lit(option), code.expr.object(optionArgs));

    // Special case for negativeAlias
    // We need an additional option and a middleware:
    // .option('R', { type: 'boolean', hidden: true }).middleware(yargsNegativeAlias('R', 'rollback'), true)
    if (theOption.negativeAlias) {
      const middleware = helpers.yargsNegativeAlias.call(lit(theOption.negativeAlias), lit(option));
      optionsExpr = optionsExpr.callMethod('option', lit(theOption.negativeAlias), code.expr.lit({
        type: 'boolean',
        hidden: true,
      }));
      optionsExpr = optionsExpr.callMethod('middleware', middleware, lit(true));
    }
  }

  return optionsExpr;
}

function makeEpilogue(prefix: Expression, helpers: CliHelpers) {
  let completeDefinition = prefix.callMethod('version', helpers.cliVersion());
  completeDefinition = completeDefinition.callMethod('demandCommand', lit(1), lit('')); // just print help
  completeDefinition = completeDefinition.callMethod('recommendCommands');
  completeDefinition = completeDefinition.callMethod('help');
  completeDefinition = completeDefinition.callMethod('alias', lit('h'), lit('help'));
  completeDefinition = completeDefinition.callMethod('epilogue', lit([
    'If your app has a single stack, there is no need to specify the stack name',
    'If one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.',
  ].join('\n\n')));

  completeDefinition = completeDefinition.callMethod('parse', code.expr.ident('args'));

  return completeDefinition;
}

