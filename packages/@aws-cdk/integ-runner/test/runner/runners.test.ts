import * as path from 'path';
import * as fs from 'fs-extra';
import { IntegTestRunner, IntegSnapshotRunner } from '../../lib/runner/runners';
import { DiagnosticReason } from '../../lib/workers/common';

describe('IntegTest runSnapshotTests', () => {
  let synthMock: jest.SpyInstance;
  beforeEach(() => {
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
  test('with defaults no diff', () => {
    // WHEN
    const integTest = new IntegSnapshotRunner({
      fileName: 'test/test-data/integ.test-with-snapshot.js',
      integOutDir: 'test-with-snapshot.integ.snapshot',
    });
    synthMock = jest.spyOn(integTest.cdk, 'synthFast').mockImplementation();
    integTest.testSnapshot();

    // THEN
    expect(synthMock).toHaveBeenCalledTimes(1);
    expect(synthMock.mock.calls[0][0]).toEqual({
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
      fileName: path.join(__dirname, '../test-data/integ.test-with-snapshot.js'),
      integOutDir: 'test-with-snapshot-diff.integ.snapshot',
    });
    synthMock = jest.spyOn(integTest.cdk, 'synthFast').mockImplementation();
    const diagnostics = integTest.testSnapshot();

    // THEN
    expect(synthMock).toHaveBeenCalledTimes(1);
    expect(synthMock.mock.calls[0][0]).toEqual({
      execCmd: ['node', 'integ.test-with-snapshot.js'],
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
      }),
      output: 'test-with-snapshot-diff.integ.snapshot',
    });
    expect(diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({
      reason: DiagnosticReason.SNAPSHOT_FAILED,
      testName: integTest.testName,
      message: expect.stringContaining('foobar'),
    })]));
  });

  test('dont diff asset hashes', () => {
    // WHEN
    const integTest = new IntegSnapshotRunner({
      fileName: path.join(__dirname, '../test-data/integ.test-with-snapshot-assets-diff.js'),
      integOutDir: 'test-with-snapshot-assets.integ.snapshot',
    });
    synthMock = jest.spyOn(integTest.cdk, 'synthFast').mockImplementation();
    expect(() => {
      integTest.testSnapshot();
    }).not.toThrow();

    // THEN
    expect(synthMock).toHaveBeenCalledTimes(1);
    expect(synthMock.mock.calls[0][0]).toEqual({
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
      fileName: path.join(__dirname, '../test-data/integ.test-with-snapshot-assets.js'),
      integOutDir: 'test-with-snapshot-assets-diff.integ.snapshot',
    });
    synthMock = jest.spyOn(integTest.cdk, 'synthFast').mockImplementation();
    const diagnostics = integTest.testSnapshot();

    // THEN
    expect(synthMock).toHaveBeenCalledTimes(1);
    expect(synthMock.mock.calls[0][0]).toEqual({
      execCmd: ['node', 'integ.test-with-snapshot-assets.js'],
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
      }),
      output: 'test-with-snapshot-assets-diff.integ.snapshot',
    });
    expect(diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({
      reason: DiagnosticReason.SNAPSHOT_FAILED,
      testName: integTest.testName,
      message: expect.stringContaining('Parameters'),
    })]));
  });
});

describe('IntegTest runIntegTests', () => {
  let integTest: IntegTestRunner;
  let deployMock: jest.SpyInstance;
  let destroyMock: jest.SpyInstance;
  let synthMock: jest.SpyInstance;
  let listMock: jest.SpyInstance;
  // let stderrMock: jest.SpyInstance;
  beforeEach(() => {
    integTest = new IntegTestRunner({ fileName: 'test/test-data/integ.integ-test1.js' });
    deployMock = jest.spyOn(integTest.cdk, 'deploy').mockImplementation();
    destroyMock = jest.spyOn(integTest.cdk, 'destroy').mockImplementation();
    synthMock = jest.spyOn(integTest.cdk, 'synthFast').mockImplementation();
    listMock = jest.spyOn(integTest.cdk, 'list').mockImplementation();
    jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });
    jest.spyOn(fs, 'moveSync').mockImplementation(() => { return true; });
    jest.spyOn(fs, 'removeSync').mockImplementation(() => { return true; });
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { return true; });
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  test('with defaults', () => {
    // WHEN
    integTest.runIntegTestCase({
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(1);
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(synthMock).toHaveBeenCalledTimes(0);
    expect(deployMock.mock.calls[0][0]).toEqual({
      app: 'node integ.integ-test1.js',
      requireApproval: 'never',
      pathMetadata: false,
      assetMetadata: false,
      versionReporting: false,
      lookups: false,
      stacks: ['stack1'],
      output: 'cdk-integ.out.integ-test1',
    });
    expect(destroyMock.mock.calls[0][0]).toEqual({
      app: 'node integ.integ-test1.js',
      pathMetadata: false,
      assetMetadata: false,
      versionReporting: false,
      force: true,
      stacks: ['stack1'],
      output: 'cdk-integ.out.integ-test1',
    });
  });

  test('with lookups', () => {
    // WHEN
    integTest = new IntegTestRunner({ fileName: path.join(__dirname, '../test-data/integ.test-with-snapshot-assets-diff.js') });
    deployMock = jest.spyOn(integTest.cdk, 'deploy').mockImplementation();
    destroyMock = jest.spyOn(integTest.cdk, 'destroy').mockImplementation();
    synthMock = jest.spyOn(integTest.cdk, 'synthFast').mockImplementation();
    listMock = jest.spyOn(integTest.cdk, 'list').mockImplementation();
    integTest.runIntegTestCase({
      testCase: {
        stacks: ['test-stack'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(1);
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(synthMock).toHaveBeenCalledTimes(1);
    expect(deployMock.mock.calls[0][0]).toEqual({
      app: 'node integ.test-with-snapshot-assets-diff.js',
      requireApproval: 'never',
      pathMetadata: false,
      assetMetadata: false,
      versionReporting: false,
      lookups: true,
      stacks: ['test-stack'],
      output: 'cdk-integ.out.test-with-snapshot-assets-diff',
    });
    expect(synthMock.mock.calls[0][0]).toEqual({
      execCmd: ['node', 'integ.test-with-snapshot-assets-diff.js'],
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
        CDK_CONTEXT_JSON: expect.anything(),
      }),
      output: 'test-with-snapshot-assets-diff.integ.snapshot',
    });
    expect(destroyMock.mock.calls[0][0]).toEqual({
      app: 'node integ.test-with-snapshot-assets-diff.js',
      pathMetadata: false,
      assetMetadata: false,
      versionReporting: false,
      force: true,
      stacks: ['test-stack'],
      output: 'cdk-integ.out.test-with-snapshot-assets-diff',
    });
  });

  test('no clean', () => {
    // WHEN
    integTest.runIntegTestCase({
      clean: false,
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(1);
    expect(destroyMock).toHaveBeenCalledTimes(0);
    expect(synthMock).toHaveBeenCalledTimes(0);
  });

  test('dryrun', () => {
    // WHEN
    integTest.runIntegTestCase({
      dryRun: true,
      testCase: {
        stacks: ['stack1'],
      },
    });

    // THEN
    expect(deployMock).toHaveBeenCalledTimes(0);
    expect(destroyMock).toHaveBeenCalledTimes(0);
    expect(synthMock).toHaveBeenCalledTimes(1);
  });

  test('determine test stack via pragma', () => {
    // WHEN
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
    integTest.generateSnapshot();

    // THEN
    expect(synthMock).toHaveBeenCalledTimes(1);
    expect(synthMock.mock.calls[0][0]).toEqual({
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
  let integTest: IntegTestRunner;
  let synthMock: jest.SpyInstance;
  beforeEach(() => {
    integTest = new IntegTestRunner({ fileName: 'test/test-data/integ.integ-test2.js' });
    jest.spyOn(integTest.cdk, 'deploy').mockImplementation();
    jest.spyOn(integTest.cdk, 'destroy').mockImplementation();
    synthMock = jest.spyOn(integTest.cdk, 'synthFast').mockImplementation();
    jest.spyOn(integTest.cdk, 'list').mockImplementation(() => {
      return 'stackabc';
    });
    jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });
    jest.spyOn(fs, 'moveSync').mockImplementation(() => { return true; });
    jest.spyOn(fs, 'removeSync').mockImplementation(() => { return true; });
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { return true; });
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  test('get stacks from list', async () => {
    // WHEN
    integTest.generateSnapshot();

    // THEN
    expect(integTest.tests).toEqual(expect.objectContaining({
      'test/test-data/integ.integ-test2': {
        stacks: ['stackabc'],
      },
    }));
    expect(synthMock).toHaveBeenCalledTimes(1);
    expect(synthMock.mock.calls[0][0]).toEqual({
      execCmd: ['node', 'integ.integ-test2.js'],
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
      }),
      output: 'cdk-integ.out.integ-test2',
    });
  });
});
