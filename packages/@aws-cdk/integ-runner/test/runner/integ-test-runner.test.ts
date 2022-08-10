import * as child_process from 'child_process';
import { Manifest } from '@aws-cdk/cloud-assembly-schema';
import { AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY } from '@aws-cdk/cx-api';
import { SynthFastOptions, DestroyOptions, ListOptions, SynthOptions, DeployOptions } from 'cdk-cli-wrapper';
import * as fs from 'fs-extra';
import { IntegTestRunner, IntegTest } from '../../lib/runner';
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
  jest.spyOn(Manifest, 'saveIntegManifest').mockImplementation();
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
  jest.spyOn(fs, 'moveSync').mockImplementation(() => { return true; });
  removeSyncMock = jest.spyOn(fs, 'removeSync').mockImplementation(() => { return true; });
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
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.test-with-snapshot.js',
        discoveryRoot: 'test/test-data',
      }),
    });
    integTest.runIntegTestCase({
      testCaseName: 'xxxxx.test-with-snapshot',
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(2);
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledTimes(1);
    expect(deployMock).toHaveBeenCalledWith({
      app: 'test-with-snapshot.integ.snapshot',
      requireApproval: 'never',
      pathMetadata: false,
      assetMetadata: false,
      context: expect.any(Object),
      profile: undefined,
      versionReporting: false,
      lookups: false,
      stacks: ['test-stack'],
    });
    expect(deployMock).toHaveBeenCalledWith({
      app: 'node xxxxx.test-with-snapshot.js',
      requireApproval: 'never',
      pathMetadata: false,
      assetMetadata: false,
      output: 'cdk-integ.out.test-with-snapshot',
      profile: undefined,
      context: expect.any(Object),
      versionReporting: false,
      lookups: false,
      rollback: false,
      stacks: ['test-stack', 'new-test-stack'],
    });
    expect(destroyMock).toHaveBeenCalledWith({
      app: 'node xxxxx.test-with-snapshot.js',
      pathMetadata: false,
      assetMetadata: false,
      context: expect.any(Object),
      versionReporting: false,
      profile: undefined,
      force: true,
      all: true,
      output: 'cdk-integ.out.test-with-snapshot',
    });
  });

  test('no snapshot', () => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.integ-test1.js',
        discoveryRoot: 'test/test-data',
      }),
    });
    integTest.runIntegTestCase({
      testCaseName: 'xxxxx.integ-test1',
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(1);
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledTimes(1);
    expect(deployMock).toHaveBeenCalledWith({
      app: 'node xxxxx.integ-test1.js',
      requireApproval: 'never',
      pathMetadata: false,
      assetMetadata: false,
      versionReporting: false,
      profile: undefined,
      context: expect.not.objectContaining({
        [AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY]: ['test-region-1a', 'test-region-1b', 'test-region-1c'],
      }),
      rollback: false,
      lookups: false,
      stacks: ['stack1'],
      output: 'cdk-integ.out.integ-test1',
    });
    expect(destroyMock).toHaveBeenCalledWith({
      app: 'node xxxxx.integ-test1.js',
      pathMetadata: false,
      assetMetadata: false,
      versionReporting: false,
      context: expect.any(Object),
      force: true,
      all: true,
      output: 'cdk-integ.out.integ-test1',
    });
  });

  test('with lookups', () => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.test-with-snapshot-assets-diff.js',
        discoveryRoot: 'test/test-data',
      }),
    });
    integTest.runIntegTestCase({
      testCaseName: 'xxxxx.test-with-snapshot-assets-diff',
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(1);
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledTimes(2);
    expect(deployMock).toHaveBeenCalledWith({
      app: 'node xxxxx.test-with-snapshot-assets-diff.js',
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
      rollback: false,
      stacks: ['test-stack'],
      output: 'cdk-integ.out.test-with-snapshot-assets-diff',
      profile: undefined,
    });
    expect(synthFastMock).toHaveBeenCalledWith({
      execCmd: ['node', 'xxxxx.test-with-snapshot-assets-diff.js'],
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
        CDK_CONTEXT_JSON: expect.anything(),
      }),
      output: 'test-with-snapshot-assets-diff.integ.snapshot',
    });
    expect(destroyMock).toHaveBeenCalledWith({
      app: 'node xxxxx.test-with-snapshot-assets-diff.js',
      pathMetadata: false,
      assetMetadata: false,
      context: expect.objectContaining({
        'vpc-provider:account=12345678:filter.isDefault=true:region=test-region:returnAsymmetricSubnets=true': expect.objectContaining({
          vpcId: 'vpc-60900905',
        }),
      }),
      versionReporting: false,
      force: true,
      all: true,
      output: 'cdk-integ.out.test-with-snapshot-assets-diff',
    });
  });

  test('no clean', () => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.integ-test1.js',
        discoveryRoot: 'test/test-data',
      }),
    });
    integTest.runIntegTestCase({
      testCaseName: 'xxxxx.integ-test1',
      clean: false,
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
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.integ-test1.js',
        discoveryRoot: 'test/test-data',
      }),
    });
    integTest.runIntegTestCase({
      testCaseName: 'xxxxx.integ-test1',
      dryRun: true,
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(0);
    expect(destroyMock).toHaveBeenCalledTimes(0);
    expect(synthFastMock).toHaveBeenCalledTimes(2);
  });

  test('generate snapshot', () => {
    // WHEN
    new IntegTestRunner({
      cdk: cdkMock.cdk,
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.integ-test1.js',
        discoveryRoot: 'test/test-data',
      }),
    });

    // THEN
    expect(synthFastMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledWith({
      execCmd: ['node', 'xxxxx.integ-test1.js'],
      output: 'cdk-integ.out.integ-test1',
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
      }),
    });
  });

  test('with profile', () => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.integ-test1.js',
        discoveryRoot: 'test/test-data',
      }),
      profile: 'test-profile',
    });
    integTest.runIntegTestCase({
      testCaseName: 'xxxxx.integ-test1',
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(1);
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledTimes(1);
    expect(deployMock).toHaveBeenCalledWith({
      app: 'node xxxxx.integ-test1.js',
      requireApproval: 'never',
      pathMetadata: false,
      assetMetadata: false,
      versionReporting: false,
      context: expect.any(Object),
      profile: 'test-profile',
      rollback: false,
      lookups: false,
      stacks: ['stack1'],
      output: 'cdk-integ.out.integ-test1',
    });
    expect(destroyMock).toHaveBeenCalledWith({
      app: 'node xxxxx.integ-test1.js',
      pathMetadata: false,
      assetMetadata: false,
      versionReporting: false,
      context: expect.any(Object),
      profile: 'test-profile',
      force: true,
      all: true,
      output: 'cdk-integ.out.integ-test1',
    });
  });

  test('with hooks', () => {
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.test-with-snapshot-assets.js',
        discoveryRoot: 'test/test-data',
      }),
    });
    integTest.runIntegTestCase({
      testCaseName: 'xxxxx.test-with-snapshot-assets',
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
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.test-with-snapshot.js',
        discoveryRoot: 'test/test-data',
      }),
    });
    integTest.runIntegTestCase({
      testCaseName: 'xxxxx.test-with-snapshot',
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
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.test-with-snapshot.js',
        discoveryRoot: 'test/test-data',
      }),
    });
    integTest.runIntegTestCase({
      testCaseName: 'xxxxx.test-with-snapshot',
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
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.test-with-snapshot.js',
        discoveryRoot: 'test/test-data',
      }),
    });
    integTest.runIntegTestCase({
      testCaseName: 'xxxxx.test-with-snapshot',
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
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.test-with-snapshot-assets.js',
        discoveryRoot: 'test/test-data',
      }),
    });
    integTest.runIntegTestCase({
      testCaseName: 'xxxxx.test-with-snapshot-assets',
    });

    expect(removeSyncMock.mock.calls).toEqual([
      ['test/test-data/test-with-snapshot-assets.integ.snapshot'],
      [
        'test/test-data/test-with-snapshot-assets.integ.snapshot/asset.be270bbdebe0851c887569796e3997437cca54ce86893ed94788500448e92824',
      ],
      ['test/test-data/cdk-integ.out.test-with-snapshot-assets'],
    ]);
  });

  test('with assembly manifest, assets are removed if stackUpdateWorkflow is disabled', () => {
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.test-with-snapshot-assets-diff.js',
        discoveryRoot: 'test/test-data',
      }),
    });
    integTest.runIntegTestCase({
      testCaseName: 'xxxxx.test-with-snapshot-assets-diff',
    });

    expect(removeSyncMock.mock.calls).toEqual([
      ['test/test-data/test-with-snapshot-assets-diff.integ.snapshot'],
      [
        'test/test-data/test-with-snapshot-assets-diff.integ.snapshot/asset.fec1c56a3f23d9d27f58815e0c34c810cc02f431ac63a078f9b5d2aa44cc3509',
      ],
    ]);
  });


  test.each`
    verbosity | verbose      | debug
    ${0}      | ${undefined} | ${undefined}
    ${1}      | ${undefined} | ${undefined}
    ${2}      | ${undefined} | ${undefined}
    ${3}      | ${true}      | ${undefined}
    ${4}      | ${true}      | ${true}
`('with verbosity set to $verbosity', ({ verbosity, verbose, debug }) => {
    // WHEN
    const integTest = new IntegTestRunner({
      cdk: cdkMock.cdk,
      test: new IntegTest({
        fileName: 'test/test-data/xxxxx.test-with-snapshot.js',
        discoveryRoot: 'test/test-data',
      }),
    });
    integTest.runIntegTestCase({
      testCaseName: 'xxxxx.test-with-snapshot',
      verbosity: verbosity,
    });

    // THEN
    expect(deployMock).toHaveBeenCalledWith(expect.objectContaining({
      verbose,
      debug,
    }));
    expect(deployMock).toHaveBeenCalledWith(expect.objectContaining({
      verbose,
      debug,
    }));
    expect(destroyMock).toHaveBeenCalledWith(expect.objectContaining({
      verbose,
      debug,
    }));
  });
});
