import { Expression, FreeFunction, Module, Statement, TypeScriptRenderer, code } from '@cdklabs/typewriter';
import { CliConfig, makeConfig } from '../lib/config';

async function main() {
  const scope = new Module('aws-cdk');
  const parseCommandLineArguments = new FreeFunction(scope, {
    name: 'parseCommandLineArguments',
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

main().then(() => {

}).catch(() => {

});