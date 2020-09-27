import * as fs from 'fs-extra';
import * as yargs from 'yargs';
import { shell } from '../lib/os';
import { cdkBuildOptions, configFilePath, hasIntegTests, unitTestFiles } from '../lib/package-info';
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
    .option('nodeunit', {
      type: 'string',
      desc: 'Specify a different nodeunit executable',
      default: require.resolve('nodeunit/bin/nodeunit'),
      defaultDescription: 'nodeunit provided by node dependencies',
    })
    .argv;

  const options = cdkBuildOptions();

  const defaultShellOptions = {
    timers,
    env: {
      CDK_DISABLE_STACK_TRACE: '1',
    },
  };

  if (options.test) {
    await shell(options.test, defaultShellOptions);
  }

  const testFiles = await unitTestFiles();
  const useJest = options.jest;

  if (useJest) {
    if (testFiles.length > 0) {
      throw new Error(`Jest is enabled, but ${testFiles.length} nodeunit tests were found!: ${testFiles.map(f => f.filename)}`);
    }
    await shell([args.jest], defaultShellOptions);
  } else if (testFiles.length > 0) {
    const testCommand: string[] = [];

    // We cannot pass the nyc.config.js config file using '--nycrc-path', because
    // that can only be a filename relative to '--cwd', but if we set '--cwd'
    // nyc doesn't find the source files anymore.
    //
    // We end up symlinking nyc.config.js into the package.
    const nycConfig = 'nyc.config.js';

    // Delete file if it exists
    try {
      await fs.unlink(nycConfig);
    } catch (e) {
      if (e.code !== 'ENOENT') { return; }
    }

    await fs.ensureSymlink(configFilePath('nyc.config.js'), nycConfig);
    testCommand.push(...[args.nyc, '--clean']);

    testCommand.push(args.nodeunit);
    testCommand.push(...testFiles.map(f => f.path));

    await shell(testCommand, defaultShellOptions);
  }

  // Run integration test if the package has integ test files
  if (await hasIntegTests()) {
    await shell(['cdk-integ-assert'], defaultShellOptions);
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
