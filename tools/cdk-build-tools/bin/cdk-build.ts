import yargs = require('yargs');
import { compileCurrentPackage } from '../lib/compile';
import { shell } from '../lib/os';
import { cdkBuildOptions } from '../lib/package-info';
import { Timers } from '../lib/timer';

async function main() {
  const args = yargs
    .env('CDK_BUILD')
    .usage('Usage: cdk-build')
    .option('jsii', {
      type: 'string',
      desc: 'Specify a different jsii executable',
      defaultDescription: 'jsii provided by node dependencies'
    })
    .option('tsc', {
      type: 'string',
      desc: 'Specify a different tsc executable',
      defaultDescription: 'tsc provided by node dependencies'
    })
    .option('tslint', {
      type: 'string',
      desc: 'Specify a different tslint executable',
      defaultDescription: 'tslint provided by node dependencies'
    })
    .option('eslint', {
      type: 'string',
      desc: 'Specify a different eslint executable',
      defaultDescription: 'eslint provided by node dependencies'
    })
    .argv;

  const options = cdkBuildOptions();

  if (options.pre) {
    await shell(options.pre, { timers });
  }

  // See if we need to call cfn2ts
  if (options.cloudformation) {
    if (typeof options.cloudformation === 'string') {
      // There can be multiple scopes, ensuring it's always an array.
      options.cloudformation = [options.cloudformation];
    }
    await shell(['cfn2ts', ...options.cloudformation.map(scope => `--scope=${scope}`)], { timers });
  }

  await compileCurrentPackage(timers, { eslint: args.eslint, jsii: args.jsii, tsc: args.tsc, tslint: args.tslint });
}

const timers = new Timers();
const buildTimer = timers.start('Total time');

main().then(() => {
  buildTimer.end();
}).catch(e => {
  buildTimer.end();
  process.stderr.write(`${e.toString()}\n`);
  process.stderr.write(`Build failed. ${timers.display()}\n`);
  process.stderr.write(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n`);
  process.exit(1);
});
