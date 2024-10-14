import * as typewriter from '@cdklabs/typewriter';
import { code } from '@cdklabs/typewriter';
import { CliConfig, makeConfig } from '../lib/config';

async function main() {
  const config = makeConfig();

  // Create a new module
  const scope = new typewriter.Module('aws-cdk');

  // Add a function to the module ...
  const parseCommandLineArguments = new typewriter.FreeFunction(scope, {
    name: 'myFunction',
  });

  // ... add statements to the function body
  parseCommandLineArguments.addBody(code.stmt.ret(code.expr.lit(1)));

  // Emit the code
  const renderer = new typewriter.TypeScriptRenderer();
  // eslint-disable-next-line no-console
  console.log(renderer.render(scope));

  const yargsStuff = `
return yargs
  .env('CDK')
  .usage('Usage: cdk -a <cdk-app> COMMAND')
` + addCommands(config);
}

function addCommands(config: CliConfig) {
  for (const command of Object.keys(config)) {
    for (const _option of Object.keys((config as any)[command])) {
      return `.command(['synthesize [STACKS..]', 'synth [STACKS..]'], 'Synthesizes and prints the CloudFormation template for this stack', (yargs: Argv) => yargs`
    }
  }
}

main().then(() => {

}).catch(() => {

});