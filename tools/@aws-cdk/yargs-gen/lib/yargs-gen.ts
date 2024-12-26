import { Expression, FreeFunction, Module, SelectiveModuleImport, Statement, Type, TypeScriptRenderer, code } from '@cdklabs/typewriter';
import { EsLintRules } from '@cdklabs/typewriter/lib/eslint-rules';
import * as prettier from 'prettier';
import { CliConfig, YargsOption } from './yargs-types';

export async function renderYargs(config: CliConfig): Promise<string> {
  const scope = new Module('aws-cdk');

  scope.documentation.push( '-------------------------------------------------------------------------------------------');
  scope.documentation.push('GENERATED FROM packages/aws-cdk/lib/config.ts.');
  scope.documentation.push('Do not edit by hand; all changes will be overwritten at build time from the config file.');
  scope.documentation.push('-------------------------------------------------------------------------------------------');

  scope.addImport(new SelectiveModuleImport(scope, 'yargs', ['Argv']));

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
      { name: 'browserDefault', type: Type.STRING },
      { name: 'availableInitLanguages', type: Type.arrayOf(Type.STRING) },
      { name: 'migrateSupportedLanguages', type: Type.arrayOf(Type.STRING) },
      { name: 'version', type: Type.STRING },
      { name: 'yargsNegativeAlias', type: Type.ANY },
    ],
  });
  parseCommandLineArguments.addBody(makeYargs(config));

  const ts = new TypeScriptRenderer({
    disabledEsLintRules: [
      EsLintRules.COMMA_DANGLE,
      EsLintRules.COMMA_SPACING,
      EsLintRules.MAX_LEN,
      EsLintRules.QUOTES,
      EsLintRules.QUOTE_PROPS,
    ],
  }).render(scope);

  return prettier.format(ts, {
    parser: 'typescript',
    printWidth: 150,
    singleQuote: true,
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
function makeYargs(config: CliConfig): Statement {
  let yargsExpr: Expression = code.expr.ident('yargs');
  yargsExpr = yargsExpr
    .callMethod('env', lit('CDK'))
    .callMethod('usage', lit('Usage: cdk -a <cdk-app> COMMAND'));

  // we must compute global options first, as they are not part of an argument to a command call
  yargsExpr = makeOptions(yargsExpr, config.globalOptions);

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
    optionsExpr = makeOptions(optionsExpr, commandFacts.options ?? {});

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

  return code.stmt.ret(makeEpilogue(yargsExpr));
}

function makeOptions(prefix: Expression, options: { [optionName: string]: YargsOption }) {
  let optionsExpr = prefix;
  for (const option of Object.keys(options)) {
    // each option can define at most one middleware call; if we need more, handle a list of these instead
    let middlewareCallback: Expression | undefined = undefined;
    const optionProps = options[option];
    const optionArgs: { [key: string]: Expression } = {};
    for (const optionProp of Object.keys(optionProps)) {
      if (optionProp === 'negativeAlias') {
        // middleware is a separate function call, so we can't store it with the regular option arguments, as those will all be treated as parameters:
        // .option('R', { type: 'boolean', hidden: true }).middleware(yargsNegativeAlias('R', 'rollback'), true)
        middlewareCallback = code.expr.builtInFn('yargsNegativeAlias', lit(option), lit(optionProps.negativeAlias));
      } else {
        const optionValue = (optionProps as any)[optionProp];
        if (optionValue && optionValue.dynamicType === 'parameter') {
          optionArgs[optionProp] = code.expr.ident(optionValue.dynamicValue);
        } else if (optionValue && optionValue.dynamicType === 'function') {
          const inlineFunction: string = optionValue.dynamicValue.toString();
          const NUMBER_OF_SPACES_BETWEEN_ARROW_AND_CODE = 3;
          // this only works with arrow functions, like () =>
          optionArgs[optionProp] = code.expr.directCode(inlineFunction.substring(inlineFunction.indexOf('=>') + NUMBER_OF_SPACES_BETWEEN_ARROW_AND_CODE));
        } else {
          optionArgs[optionProp] = lit(optionValue);
        }
      }
    }

    optionsExpr = optionsExpr.callMethod('option', lit(option), code.expr.object(optionArgs));
    if (middlewareCallback) {
      optionsExpr = optionsExpr.callMethod('middleware', middlewareCallback, lit(true));
      middlewareCallback = undefined;
    }
  }

  return optionsExpr;
}

function makeEpilogue(prefix: Expression) {
  let completeDefinition = prefix.callMethod('version', code.expr.ident('version'));
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

function lit(value: any): Expression {
  switch (value) {
    case undefined:
      return code.expr.UNDEFINED;
    case null:
      return code.expr.NULL;
    default:
      return code.expr.lit(value);
  }
}
