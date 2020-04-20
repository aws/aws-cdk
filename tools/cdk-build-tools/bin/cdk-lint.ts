import * as yargs from 'yargs';
import { lintCurrentPackage } from '../lib/lint';
import { cdkBuildOptions } from '../lib/package-info';

async function main() {
  const args = yargs
    .usage('Usage: cdk-lint')
    .option('tslint', {
      type: 'string',
      desc: 'Specify a different tslint executable',
      defaultDescription: 'tslint provided by node dependencies',
    })
    .option('eslint', {
      type: 'string',
      desc: 'Specify a different eslint executable',
      defaultDescription: 'eslint provided by node dependencies',
    })
    .argv;

  const options = cdkBuildOptions();

  await lintCurrentPackage(options, { eslint: args.eslint, tslint: args.tslint });
}

main().catch(e => {
  process.stderr.write(`${e.toString()}\n`);
  process.stderr.write('Linting failed.\n');
  process.exit(1);
});
