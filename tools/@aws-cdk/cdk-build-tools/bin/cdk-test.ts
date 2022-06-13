import * as yargs from 'yargs';
import { shell } from '../lib/os';
import { cdkBuildOptions, unitTestFiles, hasIntegTests } from '../lib/package-info';
import { Timers } from '../lib/timer';

async function main() {
  const args = yargs
    .env('CDK_TEST')
    .usage('Usage: cdk-test')
    .option('jest', {
      type: 'string',
      desc: 'Specify a different jest executable',
      default: require.resolve('jest/bin/jest'),
      defaultDescription: 'jest provided by node dependencies',
    })
    .option('nyc', {
      type: 'string',
      desc: 'Specify a different nyc executable',
      default: require.resolve('nyc/bin/nyc'),
      defaultDescription: 'nyc provided by node dependencies',
    })
    .argv;

  const options = cdkBuildOptions();

  const defaultShellOptions = {
    timers,
    env: {
      CDK_DISABLE_STACK_TRACE: '1',
    },
  };

  const unitTestOptions = {
    ...defaultShellOptions,
    env: {
      ...defaultShellOptions.env,

      // by default, fail when deprecated symbols are used in tests.
      // tests that verify behaviour of deprecated symbols must use the `testDeprecated()` API.
      JSII_DEPRECATED: 'fail',
    },
  };

  if (options.test) {
    await shell(options.test, unitTestOptions);
  }

  const testFiles = await unitTestFiles();
  if (testFiles.length > 0) {
    await shell([args.jest], unitTestOptions);
  }

  // Run integration test if the package has integ test files
  if (await hasIntegTests()) {
    await shell(['integ-runner'], defaultShellOptions);
  }
}

const timers = new Timers();
const buildTimer = timers.start('Total time');

main().then(() => {
  buildTimer.end();
  process.stdout.write(`Tests successful. ${timers.display()}\n`);
}).catch(e => {
  buildTimer.end();
  process.stderr.write(`${e.toString()}\n`);
  process.stderr.write(`Tests failed. ${timers.display()}\n`);
  process.stderr.write('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n');
  process.exit(1);
});
