import * as yargs from 'yargs';
import { compileCurrentPackage } from '../lib/compile';
import { lintCurrentPackage } from '../lib/lint';
import { shell } from '../lib/os';
import { cdkBuildOptions, currentPackageJson, CompilerOverrides } from '../lib/package-info';
import { Timers } from '../lib/timer';

async function main() {
  const args = yargs
    .env('CDK_BUILD')
    .usage('Usage: cdk-build')
    .option('jsii', {
      type: 'string',
      desc: 'Specify a different jsii executable',
      defaultDescription: 'jsii provided by node dependencies',
    })
    .option('tsc', {
      type: 'string',
      desc: 'Specify a different tsc executable',
      defaultDescription: 'tsc provided by node dependencies',
    })
    .option('eslint', {
      type: 'string',
      desc: 'Specify a different eslint executable',
      defaultDescription: 'eslint provided by node dependencies',
    })
    .argv;

  const options = cdkBuildOptions();
  const env = options.env;

  if (options.pre) {
    await shell(options.pre, { timers, env });
  }

  // See if we need to call cfn2ts
  if (options.cloudformation) {
    if (typeof options.cloudformation === 'string') {
      // There can be multiple scopes, ensuring it's always an array.
      options.cloudformation = [options.cloudformation];
    }
    await shell(['cfn2ts', ...options.cloudformation.map(scope => `--scope=${scope}`)], { timers, env });
  }

  const overrides: CompilerOverrides = { eslint: args.eslint, jsii: args.jsii, tsc: args.tsc };
  await compileCurrentPackage(options, timers, overrides);
  await lintCurrentPackage(options, overrides);

  if (options.post) {
    await shell(options.post, { timers, env });
  }
}

const timers = new Timers();
const buildTimer = timers.start('Total time');

main().catch(e => {
  process.stderr.write(`${e.toString()}\n`);
  process.stderr.write('Build failed.');
  process.stderr.write('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n');
  process.exit(1);
}).finally(() => {
  buildTimer.end();
  process.stdout.write(`Build times for ${currentPackageJson().name}: ${timers.display()}\n`);
});
