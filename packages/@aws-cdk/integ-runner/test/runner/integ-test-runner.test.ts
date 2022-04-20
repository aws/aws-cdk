import * as child_process from 'child_process';
import { SynthFastOptions, DestroyOptions, ListOptions, SynthOptions, DeployOptions } from 'cdk-cli-wrapper';
import * as fs from 'fs-extra';
import { IntegTestRunner } from '../../lib/runner';
import { MockCdkProvider } from '../helpers';

let cdkMock: MockCdkProvider;
let synthMock: (options: SynthOptions) => void;
let synthFastMock: (options: SynthFastOptions) => void;
let deployMock: (options: DeployOptions) => void;
let listMock: (options: ListOptions) => string;
let destroyMock: (options: DestroyOptions) => void;
let spawnSyncMock: jest.SpyInstance;
let removeSyncMock: jest.SpyInstance;
beforeEach(() => {
  cdkMock = new MockCdkProvider({ directory: 'test/test-data' });
  listMock = jest.fn().mockImplementation(() => {
    return 'stackabc';
  });
  synthMock = jest.fn().mockImplementation();
  deployMock = jest.fn().mockImplementation();
  destroyMock = jest.fn().mockImplementation();
  synthFastMock = jest.fn().mockImplementation();
  cdkMock.mockSynth(synthMock);
  cdkMock.mockList(listMock);
  cdkMock.mockDeploy(deployMock);
  cdkMock.mockSynthFast(synthFastMock);
  cdkMock.mockDestroy(destroyMock);
  spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('stdout'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  });
  jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });
  jest.spyOn(process.stdout, 'write').mockImplementation(() => { return true; });
  jest.spyOn(fs, 'moveSync').mockImplementation(() => { return true; });
  jest.spyOn(fs, 'removeSync').mockImplementation(() => { return true; });
  removeSyncMock = jest.spyOn(fs, 'rmdirSync').mockImplementation(() => { return true; });
  jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { return true; });
});

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe('IntegTest runIntegTests', () => {
  test('with defaults', () => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.test-with-snapshot.js',
      directory: 'test/test-data',
    });
    integTest.runIntegTestCase({
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(2);
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledTimes(0);
    expect(deployMock).toHaveBeenCalledWith({
      app: 'test-with-snapshot.integ.snapshot',
      requireApproval: 'never',
      pathMetadata: false,
      assetMetadata: false,
      context: expect.any(Object),
      versionReporting: false,
      lookups: false,
      stacks: ['stack1'],
      output: 'cdk-integ.out.test-with-snapshot',
    });
    expect(deployMock).toHaveBeenCalledWith({
      app: 'node integ.test-with-snapshot.js',
      requireApproval: 'never',
      pathMetadata: false,
      assetMetadata: false,
      context: expect.any(Object),
      versionReporting: false,
      lookups: false,
      stacks: ['stack1'],
      output: 'cdk-integ.out.test-with-snapshot',
    });
    expect(destroyMock).toHaveBeenCalledWith({
      app: 'node integ.test-with-snapshot.js',
      pathMetadata: false,
      assetMetadata: false,
      context: expect.any(Object),
      versionReporting: false,
      force: true,
      stacks: ['stack1'],
      output: 'cdk-integ.out.test-with-snapshot',
    });
  });

  test('no snapshot', () => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.integ-test1.js',
      directory: 'test/test-data',
    });
    integTest.generateSnapshot();
    integTest.runIntegTestCase({
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(1);
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledTimes(1);
    expect(deployMock).toHaveBeenCalledWith({
      app: 'node integ.integ-test1.js',
      requireApproval: 'never',
      pathMetadata: false,
      assetMetadata: false,
      versionReporting: false,
      context: expect.not.objectContaining({
        'vpc-provider:account=12345678:filter.isDefault=true:region=test-region:returnAsymmetricSubnets=true': expect.objectContaining({
          vpcId: 'vpc-60900905',
        }),
      }),
      lookups: false,
      stacks: ['stack1'],
      output: 'cdk-integ.out.integ-test1',
    });
    expect(destroyMock).toHaveBeenCalledWith({
      app: 'node integ.integ-test1.js',
      pathMetadata: false,
      assetMetadata: false,
      versionReporting: false,
      context: expect.any(Object),
      force: true,
      stacks: ['stack1'],
      output: 'cdk-integ.out.integ-test1',
    });
  });

  test('with lookups', () => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.test-with-snapshot-assets-diff.js',
      directory: 'test/test-data',
    });
    integTest.runIntegTestCase({
      testCase: {
        stacks: ['test-stack'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(2);
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledTimes(1);
    expect(deployMock).toHaveBeenCalledWith({
      app: 'test-with-snapshot-assets-diff.integ.snapshot',
      requireApproval: 'never',
      pathMetadata: false,
      assetMetadata: false,
      context: expect.objectContaining({
        'vpc-provider:account=12345678:filter.isDefault=true:region=test-region:returnAsymmetricSubnets=true': expect.objectContaining({
          vpcId: 'vpc-60900905',
        }),
      }),
      versionReporting: false,
      lookups: true,
      stacks: ['test-stack'],
      output: 'cdk-integ.out.test-with-snapshot-assets-diff',
    });
    expect(deployMock).toHaveBeenCalledWith({
      app: 'node integ.test-with-snapshot-assets-diff.js',
      requireApproval: 'never',
      pathMetadata: false,
      assetMetadata: false,
      context: expect.objectContaining({
        'vpc-provider:account=12345678:filter.isDefault=true:region=test-region:returnAsymmetricSubnets=true': expect.objectContaining({
          vpcId: 'vpc-60900905',
        }),
      }),
      versionReporting: false,
      lookups: true,
      stacks: ['test-stack'],
      output: 'cdk-integ.out.test-with-snapshot-assets-diff',
    });
    expect(synthFastMock).toHaveBeenCalledWith({
      execCmd: ['node', 'integ.test-with-snapshot-assets-diff.js'],
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
        CDK_CONTEXT_JSON: expect.anything(),
      }),
      output: 'test-with-snapshot-assets-diff.integ.snapshot',
    });
    expect(destroyMock).toHaveBeenCalledWith({
      app: 'node integ.test-with-snapshot-assets-diff.js',
      pathMetadata: false,
      assetMetadata: false,
      context: expect.objectContaining({
        'vpc-provider:account=12345678:filter.isDefault=true:region=test-region:returnAsymmetricSubnets=true': expect.objectContaining({
          vpcId: 'vpc-60900905',
        }),
      }),
      versionReporting: false,
      force: true,
      stacks: ['test-stack'],
      output: 'cdk-integ.out.test-with-snapshot-assets-diff',
    });
  });

  test('no clean', () => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.integ-test1.js',
      directory: 'test/test-data',
    });
    integTest.generateSnapshot();
    integTest.runIntegTestCase({
      clean: false,
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(1);
    expect(destroyMock).toHaveBeenCalledTimes(0);
    expect(synthFastMock).toHaveBeenCalledTimes(1);
  });

  test('dryrun', () => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.integ-test1.js',
      directory: 'test/test-data',
    });
    integTest.generateSnapshot();
    integTest.runIntegTestCase({
      dryRun: true,
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(0);
    expect(destroyMock).toHaveBeenCalledTimes(0);
    expect(synthFastMock).toHaveBeenCalledTimes(2);
  });

  test('determine test stack via pragma', () => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.integ-test1.js',
      directory: 'test',
    });
    integTest.generateSnapshot();

    // THEN
    expect(integTest.tests).toEqual(expect.objectContaining({
      'test-data/integ.integ-test1': {
        diffAssets: false,
        stackUpdateWorkflow: true,
        stacks: ['stack1'],
      },
    }));
    expect(listMock).toHaveBeenCalledTimes(0);
  });

  test('generate snapshot', () => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.integ-test1.js',
      directory: 'test/test-data',
    });
    integTest.generateSnapshot();

    // THEN
    expect(synthFastMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledWith({
      execCmd: ['node', 'integ.integ-test1.js'],
      output: 'cdk-integ.out.integ-test1',
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
      }),
    });
  });
  test('get stacks from list, no pragma', async () => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.integ-test2.js',
      directory: 'test',
    });
    integTest.generateSnapshot();

    // THEN
    expect(integTest.tests).toEqual(expect.objectContaining({
      'test-data/integ.integ-test2': {
        diffAssets: false,
        stackUpdateWorkflow: true,
        stacks: ['stackabc'],
      },
    }));
    expect(synthFastMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledWith({
      execCmd: ['node', 'integ.integ-test2.js'],
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
      }),
      output: 'cdk-integ.out.integ-test2',
    });
  });

  test('with profile', () => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.integ-test1.js',
      profile: 'test-profile',
      directory: 'test/test-data',
    });
    integTest.generateSnapshot();
    integTest.runIntegTestCase({
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(1);
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledTimes(1);
    expect(deployMock).toHaveBeenCalledWith({
      app: 'node integ.integ-test1.js',
      requireApproval: 'never',
      pathMetadata: false,
      assetMetadata: false,
      versionReporting: false,
      context: expect.any(Object),
      profile: 'test-profile',
      lookups: false,
      stacks: ['stack1'],
      output: 'cdk-integ.out.integ-test1',
    });
    expect(destroyMock).toHaveBeenCalledWith({
      app: 'node integ.integ-test1.js',
      pathMetadata: false,
      assetMetadata: false,
      versionReporting: false,
      context: expect.any(Object),
      profile: 'test-profile',
      force: true,
      stacks: ['stack1'],
      output: 'cdk-integ.out.integ-test1',
    });
  });

  test('with hooks', () => {
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.test-with-snapshot.js',
      directory: 'test/test-data',
    });
    integTest.runIntegTestCase({
      testCase: {
        hooks: {
          preDeploy: ['echo "preDeploy"'],
          postDeploy: ['echo "postDeploy"'],
          preDestroy: ['echo "preDestroy"'],
          postDestroy: ['echo "postDestroy"'],
        },
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(spawnSyncMock.mock.calls).toEqual(expect.arrayContaining([
      expect.arrayContaining([
        'echo "preDeploy"',
      ]),
      expect.arrayContaining([
        'echo "postDeploy"',
      ]),
      expect.arrayContaining([
        'echo "preDestroy"',
      ]),
      expect.arrayContaining([
        'echo "postDestroy"',
      ]),
    ]));
  });

  test('git is used to checkout latest snapshot', () => {
    // GIVEN
    spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValueOnce({
      status: 0,
      stderr: Buffer.from('HEAD branch: main'),
      stdout: Buffer.from('HEAD branch: main'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    }).mockReturnValueOnce({
      status: 0,
      stderr: Buffer.from('abc'),
      stdout: Buffer.from('abc'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.test-with-snapshot.js',
      directory: 'test/test-data',
    });
    integTest.runIntegTestCase({
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(spawnSyncMock.mock.calls).toEqual(expect.arrayContaining([
      expect.arrayContaining([
        'git', ['remote', 'show', 'origin'],
      ]),
      expect.arrayContaining([
        'git', ['merge-base', 'HEAD', 'main'],
      ]),
      expect.arrayContaining([
        'git', ['checkout', 'abc', '--', 'test-with-snapshot.integ.snapshot'],
      ]),
    ]));
  });

  test('git is used and cannot determine origin', () => {
    // GIVEN
    spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValueOnce({
      status: 1,
      stderr: Buffer.from('HEAD branch: main'),
      stdout: Buffer.from('HEAD branch: main'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });
    const stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });

    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.test-with-snapshot.js',
      directory: 'test/test-data',
    });
    integTest.runIntegTestCase({
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(stderrMock.mock.calls).toEqual(expect.arrayContaining([
      expect.arrayContaining([
        expect.stringMatching(/Could not determine git origin branch/),
      ]),
    ]));
  });

  test('git is used and cannot checkout snapshot', () => {
    // GIVEN
    spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValueOnce({
      status: 0,
      stderr: Buffer.from('HEAD branch: main'),
      stdout: Buffer.from('HEAD branch: main'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    }).mockReturnValueOnce({
      status: 1,
      stderr: Buffer.from('HEAD branch: main'),
      stdout: Buffer.from('HEAD branch: main'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });
    const stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });

    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.test-with-snapshot.js',
      directory: 'test/test-data',
    });
    integTest.runIntegTestCase({
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(stderrMock.mock.calls).toEqual(expect.arrayContaining([
      expect.arrayContaining([
        expect.stringMatching(/Could not checkout snapshot directory/),
      ]),
    ]));
  });

  test('with assets manifest, assets are removed if stackUpdateWorkflow is disabled', () => {
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.test-with-snapshot-assets.js',
      directory: 'test/test-data',
    });
    integTest.runIntegTestCase({
      testCase: {
        stackUpdateWorkflow: false,
        stacks: ['test-stack'],
      },
    });

    expect(removeSyncMock.mock.calls).toEqual([[
      'test/test-data/test-with-snapshot-assets.integ.snapshot/asset.be270bbdebe0851c887569796e3997437cca54ce86893ed94788500448e92824',
    ]]);
  });

  test('with assembly manifest, assets are removed if stackUpdateWorkflow is disabled', () => {
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.test-with-snapshot-assets-diff.js',
      directory: 'test/test-data',
    });
    integTest.runIntegTestCase({
      testCase: {
        stackUpdateWorkflow: false,
        stacks: ['test-stack'],
      },
    });

    expect(removeSyncMock.mock.calls).toEqual([[
      'test/test-data/test-with-snapshot-assets-diff.integ.snapshot/asset.fec1c56a3f23d9d27f58815e0c34c810cc02f431ac63a078f9b5d2aa44cc3509',
    ]]);
  });
});
