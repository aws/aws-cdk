import yargs = require('yargs');
import { compileCurrentPackage } from '../lib/compile';
import { shell } from '../lib/os';
import { cdkBuildOptions } from '../lib/package-info';
import { Timers } from '../lib/timer';

interface Arguments extends yargs.Arguments {
  jsii?: string;
  tsc?: string;
}

async function main() {
  const args: Arguments = yargs
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
    .argv as any;

  const options = cdkBuildOptions();

  if (options.pre) {
    await shell(options.pre, timers);
  }

  // See if we need to call cfn2ts
  if (options.cloudformation) {
    await shell(['cfn2ts', `--scope=${options.cloudformation}`], timers);
  }

  await compileCurrentPackage(timers, { jsii: args.jsii, tsc: args.tsc });
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
