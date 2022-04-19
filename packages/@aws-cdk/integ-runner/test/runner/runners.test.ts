import * as child_process from 'child_process';
import * as path from 'path';
import { FUTURE_FLAGS } from '@aws-cdk/cx-api';
import { SynthFastOptions, DestroyOptions, ListOptions, SynthOptions, DeployOptions } from 'cdk-cli-wrapper';
import * as fs from 'fs-extra';
import { IntegTestRunner, IntegSnapshotRunner } from '../../lib/runner/runners';
import { DiagnosticReason } from '../../lib/workers/common';
import { MockCdkProvider } from '../helpers';

let cdkMock: MockCdkProvider;
let synthMock: (options: SynthOptions) => void;
let synthFastMock: (options: SynthFastOptions) => void;
let deployMock: (options: DeployOptions) => void;
let listMock: (options: ListOptions) => string;
let destroyMock: (options: DestroyOptions) => void;
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
  jest.spyOn(child_process, 'spawnSync').mockImplementation();
  jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });
  jest.spyOn(process.stdout, 'write').mockImplementation(() => { return true; });
  jest.spyOn(fs, 'moveSync').mockImplementation(() => { return true; });
  jest.spyOn(fs, 'removeSync').mockImplementation(() => { return true; });
  jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { return true; });
});

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe('IntegTest runSnapshotTests', () => {
  test('with defaults no diff', () => {
    // WHEN
    const integTest = new IntegSnapshotRunner({
      cdk: cdkMock.cdk,
      fileName: 'test/test-data/integ.test-with-snapshot.js',
      integOutDir: 'test-with-snapshot.integ.snapshot',
    });
    integTest.testSnapshot();

    // THEN
    expect(synthFastMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledWith({
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
      }),
      execCmd: ['node', 'integ.test-with-snapshot.js'],
      output: 'test-with-snapshot.integ.snapshot',
    });
  });

  test('with defaults and diff', () => {
    // WHEN
    const integTest = new IntegSnapshotRunner({
      cdk: cdkMock.cdk,
      fileName: path.join(__dirname, '../test-data/integ.test-with-snapshot.js'),
      integOutDir: 'test-with-snapshot-diff.integ.snapshot',
    });
    const results = integTest.testSnapshot();

    // THEN
    expect(synthFastMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledWith({
      execCmd: ['node', 'integ.test-with-snapshot.js'],
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
      }),
      output: 'test-with-snapshot-diff.integ.snapshot',
    });
    expect(results.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({
      reason: DiagnosticReason.SNAPSHOT_FAILED,
      testName: integTest.testName,
      message: expect.stringContaining('foobar'),
    })]));
    expect(results.destructiveChanges).not.toEqual([{
      impact: 'WILL_DESTROY',
      logicalId: 'MyFunction1ServiceRole9852B06B',
      stackName: 'test-stack',
    }]);
    expect(results.destructiveChanges).toEqual([{
      impact: 'WILL_DESTROY',
      logicalId: 'MyLambdaFuncServiceRoleDefaultPolicyBEB0E748',
      stackName: 'test-stack',
    }]);
  });

  test('dont diff asset hashes', () => {
    // WHEN
    const integTest = new IntegSnapshotRunner({
      cdk: cdkMock.cdk,
      fileName: path.join(__dirname, '../test-data/integ.test-with-snapshot-assets-diff.js'),
      integOutDir: 'test-with-snapshot-assets.integ.snapshot',
    });
    expect(() => {
      integTest.testSnapshot();
    }).not.toThrow();

    // THEN
    expect(synthFastMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledWith({
      execCmd: ['node', 'integ.test-with-snapshot-assets-diff.js'],
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
      }),
      output: 'test-with-snapshot-assets.integ.snapshot',
    });
  });

  test('diff asset hashes', () => {
    // WHEN
    const integTest = new IntegSnapshotRunner({
      cdk: cdkMock.cdk,
      fileName: path.join(__dirname, '../test-data/integ.test-with-snapshot-assets.js'),
      integOutDir: 'test-with-snapshot-assets-diff.integ.snapshot',
    });
    const results = integTest.testSnapshot();

    // THEN
    expect(synthFastMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledWith({
      execCmd: ['node', 'integ.test-with-snapshot-assets.js'],
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
      }),
      output: 'test-with-snapshot-assets-diff.integ.snapshot',
    });
    expect(results.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({
      reason: DiagnosticReason.SNAPSHOT_FAILED,
      testName: integTest.testName,
      message: expect.stringContaining('Parameters'),
    })]));
  });
});

describe('IntegTest runIntegTests', () => {
  test('with defaults', () => {
    // WHEN
    const integTest = new IntegTestRunner({ cdk: cdkMock.cdk, fileName: 'test/test-data/integ.test-with-snapshot.js' });
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
      context: expect.objectContaining({
        ...FUTURE_FLAGS,
      }),
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
      context: expect.objectContaining({
        ...FUTURE_FLAGS,
      }),
      versionReporting: false,
      lookups: false,
      stacks: ['stack1'],
      output: 'cdk-integ.out.test-with-snapshot',
    });
    expect(destroyMock).toHaveBeenCalledWith({
      app: 'node integ.test-with-snapshot.js',
      pathMetadata: false,
      assetMetadata: false,
      context: expect.objectContaining({
        ...FUTURE_FLAGS,
      }),
      versionReporting: false,
      force: true,
      stacks: ['stack1'],
      output: 'cdk-integ.out.test-with-snapshot',
    });
  });

  test('with profile', () => {
    // WHEN
    const integTest = new IntegTestRunner({ cdk: cdkMock.cdk, fileName: 'test/test-data/integ.integ-test1.js' });
    integTest.runIntegTestCase({
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(1);
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledTimes(0);
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
      context: expect.objectContaining({
        ...FUTURE_FLAGS,
      }),
      force: true,
      stacks: ['stack1'],
      output: 'cdk-integ.out.integ-test1',
    });
  });

  test('with lookups', () => {
    // WHEN
    const integTest = new IntegTestRunner({ cdk: cdkMock.cdk, fileName: 'test/test-data/integ.test-with-snapshot-assets-diff.js' });
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
    const integTest = new IntegTestRunner({ cdk: cdkMock.cdk, fileName: 'test/test-data/integ.integ-test1.js' });
    integTest.runIntegTestCase({
      clean: false,
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(1);
    expect(destroyMock).toHaveBeenCalledTimes(0);
    expect(synthFastMock).toHaveBeenCalledTimes(0);
  });

  test('dryrun', () => {
    // WHEN
    const integTest = new IntegTestRunner({ cdk: cdkMock.cdk, fileName: 'test/test-data/integ.integ-test1.js' });
    integTest.runIntegTestCase({
      dryRun: true,
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(0);
    expect(destroyMock).toHaveBeenCalledTimes(0);
    expect(synthFastMock).toHaveBeenCalledTimes(1);
  });

  test('determine test stack via pragma', () => {
    // WHEN
    const integTest = new IntegTestRunner({ cdk: cdkMock.cdk, fileName: 'test/test-data/integ.integ-test1.js' });
    integTest.generateSnapshot();

    // THEN
    expect(integTest.tests).toEqual(expect.objectContaining({
      'test/test-data/integ.integ-test1': {
        stacks: ['stack1'],
      },
    }));
    expect(listMock).toHaveBeenCalledTimes(0);
  });

  test('generate snapshot', () => {
    // WHEN
    const integTest = new IntegTestRunner({ cdk: cdkMock.cdk, fileName: 'test/test-data/integ.integ-test1.js' });
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
});

describe('IntegTest no pragma', () => {
  test('get stacks from list', async () => {
    // WHEN
    const integTest = new IntegTestRunner({ cdk: cdkMock.cdk, fileName: 'test/test-data/integ.integ-test2.js' });
    integTest.generateSnapshot();

    // THEN
    expect(integTest.tests).toEqual(expect.objectContaining({
      'test/test-data/integ.integ-test2': {
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
});

describe('IntegTest runIntegTests with profile', () => {
  test('with defaults', () => {
    // WHEN
    const integTest = new IntegTestRunner({ cdk: cdkMock.cdk, fileName: 'test/test-data/integ.integ-test1.js', profile: 'test-profile' });
    integTest.runIntegTestCase({
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(1);
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(synthFastMock).toHaveBeenCalledTimes(0);
    expect(deployMock).toHaveBeenCalledWith({
      app: 'node integ.integ-test1.js',
      requireApproval: 'never',
      pathMetadata: false,
      assetMetadata: false,
      versionReporting: false,
      context: expect.objectContaining({
        ...FUTURE_FLAGS,
      }),
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
      context: expect.objectContaining({
        ...FUTURE_FLAGS,
      }),
      profile: 'test-profile',
      force: true,
      stacks: ['stack1'],
      output: 'cdk-integ.out.integ-test1',
    });
  });
});
