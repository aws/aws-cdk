import * as yargs from 'yargs';
import { compileCurrentPackage } from '../lib/compile';
import { lintCurrentPackage } from '../lib/lint';
import { shell } from '../lib/os';
import { cdkBuildOptions, CompilerOverrides, currentPackageJson, genScript } from '../lib/package-info';
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
    .option('gen', {
      type: 'boolean',
      desc: 'Execute gen script',
      default: true,
    })
    .option('fix', {
      type: 'boolean',
      desc: 'Fix linter errors',
      default: false,
    })
    .argv;

  const options = cdkBuildOptions();
  const env = options.env;

  if (options.pre) {
    const commands = options.pre.join(' && ');
    await shell([commands], { timers, env });
  }

  const gen = genScript();
  if (args.gen && gen) {
    await shell([gen], { timers, env });
  }

  const overrides: CompilerOverrides = { eslint: args.eslint, jsii: args.jsii, tsc: args.tsc };
  await compileCurrentPackage(options, timers, overrides);
  await lintCurrentPackage(options, { ...overrides, fix: args.fix });

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
