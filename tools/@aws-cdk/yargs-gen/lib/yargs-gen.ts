import { Expression, FreeFunction, Module, SelectiveModuleImport, Statement, Type, TypeScriptRenderer, code } from '@cdklabs/typewriter';
import { NULL } from '@cdklabs/typewriter/lib/expressions/builder';
import { CliConfig, YargsOption } from './yargs-types';

export async function renderYargs(config: CliConfig): Promise<string> {
  const scope = new Module('aws-cdk');

  scope.addImport(new SelectiveModuleImport(scope, 'yargs', ['Argv']));

  scope.addInitialization(
    code.comment('-------------------------------------------------------------------------------------------'),
    code.comment('GENERATED FROM packages/aws-cdk/lib/config.ts.'),
    code.comment('Do not edit by hand; all changes will be overwritten at build time from the config file.'),
    code.comment('-------------------------------------------------------------------------------------------'),
  );
  //  'https://github.com/yargs/yargs/issues/1929',
  //  'https://github.com/evanw/esbuild/issues/1492',
  //  'eslint-disable-next-line @typescript-eslint/no-require-imports',
  scope.addInitialization(code.stmt.constVar(code.expr.ident('yargs'), code.expr.directCode("require('yargs')")));

  const parseCommandLineArguments = new FreeFunction(scope, {
    name: 'parseCommandLineArguments',
    export: true,
    returnType: Type.ANY,
    parameters: [
      { name: 'args', type: Type.arrayOf(Type.STRING) },
      { name: 'browserDefault', type: Type.STRING, optional: true },
      { name: 'availableInitLanguages', type: Type.arrayOf(Type.STRING) },
      { name: 'migrateSupportedLanguages', type: Type.arrayOf(Type.STRING) },
      { name: 'version', type: Type.STRING },
      { name: 'yargsNegativeAlias', type: Type.ANY },
    ],
  });
  parseCommandLineArguments.addBody(makeYargs(config/*, scope*/));

  return new TypeScriptRenderer().render(scope);
}

interface MiddlewareExpression {
  callback: Expression;
  applyBeforeValidation?: Expression;
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
function makeYargs(config: CliConfig/*, scope: ScopeImpl*/): Statement {
  let yargsExpr: Expression = code.expr.ident('yargs');
  yargsExpr = yargsExpr.callMethod('usage', lit('Usage: cdk -a <cdk-app> COMMAND'));

  // we must compute global options first, as they are not part of an argument to a command call
  yargsExpr = makeOptions(yargsExpr, config.globalOptions);

  for (const command of Object.keys(config.commands)) {
    const commandFacts = config.commands[command];
    const commandArg = commandFacts.arg
      ? ` [${commandFacts.arg?.name}${commandFacts.arg?.variadic ? '..' : ''}]`
      : '';
    const aliases = commandFacts.aliases
      ? commandFacts.aliases.map((alias) => `, '${alias} ${commandArg}'`)
      : '';

    // must compute options before we compute the full command, because in yargs, the options are an argument to the command call.
    let optionsExpr: Expression = code.expr.directCode('(yargs: Argv) => yargs');
    optionsExpr = makeOptions(optionsExpr, commandFacts.options ?? {});

    yargsExpr = commandFacts.options
      ? yargsExpr.callMethod('command', code.expr.directCode(`['${command}${commandArg}'${aliases}]`), lit(commandFacts.description), optionsExpr)
      : yargsExpr.callMethod('command', code.expr.directCode(`['${command}${commandArg}'${aliases}]`), lit(commandFacts.description));
  }

  return code.stmt.ret(makeEpilogue(yargsExpr));
}

function makeOptions(prefix: Expression, options: { [optionName: string]: YargsOption }) {
  let optionsExpr = prefix;
  for (const option of Object.keys(options)) {
    // each option can define at most one middleware call; if we need more, handle a list of these instead
    let middleware: MiddlewareExpression | undefined = undefined;
    const optionProps = options[option];
    const optionArgs: { [key: string]: Expression } = {};
    for (const optionProp of Object.keys(optionProps)) {
      if (optionProp === 'middleware') {
        // middleware is a separate function call, so we can't store it with the regular option arguments, as those will all be treated as parameters:
        // .option('R', { type: 'boolean', hidden: true }).middleware(yargsNegativeAlias('R', 'rollback'), true)
        middleware = {
          callback: code.expr.builtInFn(optionProps.middleware!.callback, lit(optionProps.middleware!.args)),
          applyBeforeValidation: lit(optionProps.middleware!.applyBeforeValidation),
        };
        break;
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
    if (middleware) {
      optionsExpr = optionsExpr.callMethod('middleware', middleware.callback, middleware.applyBeforeValidation ?? code.expr.UNDEFINED);
      middleware = undefined;
    }
  }

  return optionsExpr;
}

function makeEpilogue(prefix: Expression) {
  let completeDefinition = prefix.callMethod('version', code.expr.ident('version'));
  completeDefinition = completeDefinition.callMethod('demandCommand', lit(1), lit("''")); // just print help
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
    case NULL:
      return code.expr.NULL;
    default:
      return code.expr.lit(value);
  }
}