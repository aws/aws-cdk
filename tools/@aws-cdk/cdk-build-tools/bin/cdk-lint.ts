import * as yargs from 'yargs';
import { lintCurrentPackage } from '../lib/lint';
import { cdkBuildOptions, currentPackageJson } from '../lib/package-info';
import { Timers } from '../lib/timer';

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

  await lintCurrentPackage(options, timers, { eslint: args.eslint, fix: args.fix });
}

const timers = new Timers();
const buildTimer = timers.start('Total time');

main().catch(e => {
  process.stderr.write(`${e.toString()}\n`);
  process.stderr.write('Linting failed.\n');
  process.exit(1);
}).finally(() => {
  buildTimer.end();
  process.stdout.write(`Lint times for ${currentPackageJson().name}: ${timers.display()}\n`);
});
