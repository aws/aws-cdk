jest.mock('child_process');
import * as sinon from 'sinon';
import { execProgram } from '../../lib/api/cxapp/exec';
import { setVerbose } from '../../lib/logging';
import { Configuration } from '../../lib/settings';
import * as bockfs from '../bockfs';
import { testAssembly } from '../util';
import { mockSpawn } from '../util/mock-child_process';
import { MockSdkProvider } from '../util/mock-sdk';

setVerbose(true);

let sdkProvider: MockSdkProvider;
let config: Configuration;
beforeEach(() => {
  sdkProvider = new MockSdkProvider();
  config = new Configuration();

  config.settings.set(['output'], 'cdk.out');

  // insert contents in fake filesystem
  bockfs({
    '/home/project/cloud-executable': 'ARBITRARY',
    '/home/project/windows.js': 'ARBITRARY',
    'home/project/executable-app.js': 'ARBITRARY'
  });
  bockfs.workingDirectory('/home/project');
  bockfs.executable('/home/project/cloud-executable');
  bockfs.executable('/home/project/executable-app.js');
});

afterEach(() => {
  sinon.restore();
  bockfs.restore();
});

test('validates --app key is present', async () => {
  // GIVEN no config key for `app`
  await expect(execProgram(sdkProvider, config)).rejects.toThrow(
    '--app is required either in command-line, in cdk.json or in ~/.cdk.json'
  );

});

test('bypasses synth when app points to a cloud assembly', async () => {
  // GIVEN
  config.settings.set(['app'], 'cdk.out');
  writeOutputAssembly();

  // WHEN
  const cloudAssembly = await execProgram(sdkProvider, config);
  expect(cloudAssembly.artifacts).toEqual([]);
  expect(cloudAssembly.directory).toEqual('cdk.out');
});

test('the application set in --app is executed', async () => {
  // GIVEN
  config.settings.set(['app'], 'cloud-executable');
  mockSpawn({
    commandLine: ['cloud-executable'],
    sideEffect: () => writeOutputAssembly(),
  });

  // WHEN
  await execProgram(sdkProvider, config);
});

test('the application set in --app is executed as-is if it contains a filename that does not exist', async () => {
  // GIVEN
  config.settings.set(['app'], 'does-not-exist');
  mockSpawn({
    commandLine: ['does-not-exist'],
    sideEffect: () => writeOutputAssembly(),
  });

  // WHEN
  await execProgram(sdkProvider, config);
});

test('the application set in --app is executed with arguments', async () => {
  // GIVEN
  config.settings.set(['app'], 'cloud-executable an-arg');
  mockSpawn({
    commandLine: ['cloud-executable', 'an-arg'],
    sideEffect: () => writeOutputAssembly(),
  });

  // WHEN
  await execProgram(sdkProvider, config);
});

test('application set in --app as `*.js` always uses handler on windows', async () => {
  // GIVEN
  sinon.stub(process, 'platform').value('win32');
  config.settings.set(['app'], 'windows.js');
  mockSpawn({
    commandLine: [process.execPath, 'windows.js'],
    sideEffect: () => writeOutputAssembly(),
  });

  // WHEN
  await execProgram(sdkProvider, config);
});

test('application set in --app is `*.js` and executable', async () => {
  // GIVEN
  config.settings.set(['app'], 'executable-app.js');
  mockSpawn({
    commandLine: ['executable-app.js'],
    sideEffect: () => writeOutputAssembly(),
  });

  // WHEN
  await execProgram(sdkProvider, config);
});

function writeOutputAssembly() {
  const asm = testAssembly({
    stacks: []
  });
  bockfs.write('/home/project/cdk.out/manifest.json', JSON.stringify(asm));
}
