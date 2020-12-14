import * as yargs from 'yargs';
import { lintCurrentPackage } from '../lib/lint';
import { cdkBuildOptions } from '../lib/package-info';

async function main() {
  const args = yargs
    .usage('Usage: cdk-lint')
    .option('eslint', {
      type: 'string',
      desc: 'Specify a different eslint executable',
      defaultDescription: 'eslint provided by node dependencies',
    })
    .option('fix', {
      type: 'boolean',
      desc: 'Fix the found issues',
      default: false,
    })
    .argv;

  const options = cdkBuildOptions();

  await lintCurrentPackage(options, { eslint: args.eslint, fix: args.fix });
}

main().catch(e => {
  process.stderr.write(`${e.toString()}\n`);
  process.stderr.write('Linting failed.\n');
  process.exit(1);
});
