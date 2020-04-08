jest.mock('child_process');
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
  });
  bockfs.workingDirectory('/home/project');
  bockfs.executable('/home/project/cloud-executable');
});

afterEach(() => {
  bockfs.restore();
});

test('validates --app key is present', async () => {
  // GIVEN no config key for `app`
  await expect(execProgram(sdkProvider, config)).rejects.toThrow(
    '--app is required either in command-line, in cdk.json or in ~/.cdk.json'
  );

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

test('bypasses synth when app points to a cloud assembly', async () => {
  // GIVEN
  bockfs.workingDirectory('/home/project');
  config.settings.set(['app'], 'cdk.out');
  writeOutputAssembly();

  // WHEN
  const cloudAssembly = await execProgram(sdkProvider, config);
  expect(cloudAssembly.artifacts).toEqual([]);
  expect(cloudAssembly.directory).toEqual('cdk.out');
});

function writeOutputAssembly() {
  const asm = testAssembly({
    stacks: []
  });
  bockfs.write('/home/project/cdk.out/manifest.json', JSON.stringify(asm));
}
