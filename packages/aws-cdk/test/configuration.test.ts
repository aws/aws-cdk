import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { Command, Configuration } from '../lib/settings';

const state: {
  previousWorkingDir?: string;
  tempDir?: string;
} = {};

beforeEach(async () => {
  state.previousWorkingDir = process.cwd();
  state.tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aws-cdk-test'));
  // eslint-disable-next-line no-console
  console.log('Temporary working directory:', state.tempDir);
  process.chdir(state.tempDir);
});

afterEach(async () => {
  // eslint-disable-next-line no-console
  console.log('Switching back to', state.previousWorkingDir, 'cleaning up', state.tempDir);
  process.chdir(state.previousWorkingDir!);
  await fs.remove(state.tempDir!);
});

describe('Configuration build option', () => {
  test('CLI build option is equivalent to config file build setting', async () => {
    // Test configuration from CLI option
    const cliConfig = new Configuration({
      commandLineArguments: {
        build: '/build.sh',
        _: [Command.LS],
      },
    });
    await cliConfig.load();

    // Test configuration from cdk.json
    await fs.writeJSON('cdk.json', {
      build: '/build.sh',
    });
    const fileConfig = new Configuration();
    await fileConfig.load();

    // Assert both configurations have the same build value
    expect(cliConfig.commandLineArgSettings.get(['build'])).toEqual('/build.sh');
    expect(fileConfig.commandLineArgSettings.get(['build'])).toEqual('/build.sh');
    // Assert both configurations are equivalent
    expect(cliConfig.commandLineArgSettings.get(['build'])).toEqual(fileConfig.commandLineArgSettings.get(['build']));
  });

  test('CLI build option overrides config file setting', async () => {
    // Create config file with one build path
    await fs.writeJSON('cdk.json', {
      build: '/default-build.sh',
    });

    // Create configuration with CLI option
    const config = new Configuration({
      commandLineArguments: {
        build: '/cli-build.sh',
        _: [Command.LS],
      },
    });
    await config.load();

    // Assert CLI option takes precedence
    expect(config.commandLineArgSettings.get(['build'])).toEqual('/cli-build.sh');
  });
});
