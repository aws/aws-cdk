// This only runs at build time, and is not used after
// eslint-disable-next-line import/no-extraneous-dependencies
import { Expression, FreeFunction, Module, Statement, Type, TypeScriptRenderer, code } from '@cdklabs/typewriter';
import { CliConfig, makeConfig } from '../../../../tools/@aws-cdk/yargs-gen/lib/config';

async function main() {
  const scope = new Module('aws-cdk');
  const parseCommandLineArguments = new FreeFunction(scope, {
    name: 'parseCommandLineArguments',
    parameters: [{
      name: 'initTemplateLanguages',
      type: Type.STRING,
    },
    {
      name: 'migrateSupportedLanguages',
      type: Type.arrayOf(Type.STRING),
    },
    {
      name: 'defaultBrowserCommand',
      type: Type.mapOf(Type.STRING),
    }],
  });
  parseCommandLineArguments.addBody(makeYargs(makeConfig()));

  const renderer = new TypeScriptRenderer();
  // eslint-disable-next-line no-console
  console.log(renderer.render(scope));
}

interface MiddlewareExpression {
  callbacks: Expression;
  applyBeforeValidation?: Expression;
}

function makeYargs(config: CliConfig): Statement {
  const preamble = `yargs
  .env('CDK')
  .usage('Usage: cdk -a <cdk-app> COMMAND')
  `;

  let yargsExpr = code.expr.directCode(preamble);
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

    for (const option of Object.keys(commandFacts.options ?? {})) {
      // each option can define at most one middleware call; if we need more, handle a list of these instead
      let middleware: MiddlewareExpression | undefined = undefined;
      const optionFacts = commandFacts.options![option];
      const optionArgs: { [key: string]: Expression } = {};
      for (const optionProp of Object.keys(optionFacts)) {
        switch (optionProp) {
          case 'middleware':
            // middleware is a separate function call, so we can't store it with the regular option arguments, as those will all be treated as parameters:
            // .option('R', { type: 'boolean', hidden: true }).middleware(yargsNegativeAlias('R', 'rollback'), true)
            middleware = {
              callbacks: code.expr.lit(optionFacts.middleware!.callbacks.toString()),
              applyBeforeValidation: code.expr.lit(optionFacts.middleware!.applyBeforeValidation),
            };
            break;

          default:
            optionArgs[optionProp] = code.expr.lit((optionFacts as any)[optionProp]);
        }
      }

      optionsExpr = optionsExpr.callMethod('option', code.expr.lit(`${option}`), code.expr.object(optionArgs));
      if (middleware) {
        optionsExpr = optionsExpr.callMethod('middleware', middleware.callbacks, middleware.applyBeforeValidation ?? code.expr.UNDEFINED);
        middleware = undefined;
      }
    }

    // tail-recursive?
    yargsExpr = commandFacts.options
      ? yargsExpr.callMethod('command', code.expr.directCode(`['${command}${commandArg}'${aliases}]`), code.expr.lit(commandFacts.description), optionsExpr)
      : yargsExpr.callMethod('command', code.expr.directCode(`['${command}${commandArg}'${aliases}]`), code.expr.lit(commandFacts.description));
  }

  return code.stmt.ret(yargsExpr);
}

/*
function makeEpilogue(prefix: Expression) {
  let completeThing = prefix.callMethod('version', code.expr.lit(version.DISPLAY_VERSION));
  completeThing = completeThing.callMethod('demandCommand', code.expr.lit(1), code.expr.lit("''")); // just print help
  completeThing = completeThing.callMethod('recommendCommands');
  completeThing = completeThing.callMethod('help');
  completeThing = completeThing.callMethod('alias', code.expr.lit('h'), code.expr.lit('help'));
  completeThing = completeThing.callMethod('epilogue', code.expr.lit([
    'If your app has a single stack, there is no need to specify the stack name',
    'If one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.',
  ].join('\n\n')));

  completeThing = completeThing.callMethod('parse', code.expr.ident('args'));

  return completeThing;
}
*/

main().then(() => {

}).catch(() => {

});