import * as typewriter from '@cdklabs/typewriter';
import { code } from '@cdklabs/typewriter';
import { CliConfig, makeConfig } from '../lib/config';

async function main() {
  const scope = new typewriter.Module('aws-cdk');
  const parseCommandLineArguments = new typewriter.FreeFunction(scope, {
    name: 'parseCommandLineArguments',
  });
  parseCommandLineArguments.addBody(makeYargs(makeConfig()));

  const renderer = new typewriter.TypeScriptRenderer();
  // eslint-disable-next-line no-console
  console.log(renderer.render(scope));
}

function makeYargs(config: CliConfig): typewriter.Statement {
  const preamble = `yargs
  .env('CDK')
  .usage('Usage: cdk -a <cdk-app> COMMAND')
  `;

  let yargsExpr = code.expr.directCode(preamble);
  for (const command of Object.keys(config.commands)) {
    // eslint-disable-next-line no-console
    console.log('in loop');
    const commandFacts = config.commands[command];
    const commandArg = commandFacts.arg
      ? ` [${commandFacts.arg?.name}${commandFacts.arg?.variadic ? '..' : ''}]`
      : '';
    const aliases = commandFacts.aliases
      ? commandFacts.aliases.map((alias) => `, '${alias} ${commandArg}'`)
      : '';
    yargsExpr = yargsExpr.callMethod('command', code.expr.directCode(`['${command}${commandArg}'${aliases}]`), code.expr.lit(commandFacts.description), code.expr.directCode('(yargs: Argv) => yargs'));

    for (const option of Object.keys(commandFacts.options ?? {})) {
      // eslint-disable-next-line no-console
      console.log('in loop 2');
      const optionFacts = commandFacts.options![option];
      const optionArgs: { [key: string]: typewriter.Expression } = {};
      for (const optionProp of Object.keys(optionFacts)) {
        // eslint-disable-next-line no-console
        console.log('in loop 3');
        optionArgs[optionProp] = code.expr.lit((optionFacts as any)[optionProp]);
      }

      yargsExpr = yargsExpr.callMethod('option', code.expr.lit(`${option}`), code.expr.object(optionArgs));
    }
  }

  return code.stmt.ret(yargsExpr);
}

main().then(() => {

}).catch(() => {

});