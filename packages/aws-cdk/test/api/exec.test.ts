jest.mock('child_process');
import { execProgram } from "../../lib/api/cxapp/exec";
import { setVerbose } from "../../lib/logging";
import { Configuration } from "../../lib/settings";
import * as bockfs from '../bockfs';
import { testAssembly } from "../util";
import { mockSpawn } from '../util/mock-child_process';
import { MockSdkProvider } from "../util/mock-sdk";

setVerbose(true);

let sdkProvider: MockSdkProvider;
let config: Configuration;
beforeEach(() => {
  sdkProvider = new MockSdkProvider();
  config = new Configuration();

  config.settings.set(['output'], 'cdk.out');

  // Put contents in fake filesystem
  bockfs({
    '/home/project/cloud-executable1': 'CONTENTS_DONT_MATTER'
  });
  bockfs.workingDirectory('/home/project');
  bockfs.executable('/home/project/cloud-executable1');
});

afterEach(() => {
  bockfs.restore();
});

test('the application in --app is executed', async () => {
  // GIVEN
  config.settings.set(['app'], 'cloud-executable1');
  mockSpawn({
    commandLine: ['cloud-executable1'],
    sideEffect: () => writeOutputAssembly(),
  });

  // WHEN
  await execProgram(sdkProvider, config);

  // THEN: mockSpawn has been called with the right executable
});

function writeOutputAssembly() {
  const asm = testAssembly({
    stacks: []
  });
  bockfs.write('/home/project/cdk.out/manifest.json', JSON.stringify(asm));
}