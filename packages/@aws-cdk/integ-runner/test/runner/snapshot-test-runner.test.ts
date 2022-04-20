import * as child_process from 'child_process';
import * as path from 'path';
import { SynthFastOptions, DestroyOptions, ListOptions, SynthOptions, DeployOptions } from 'cdk-cli-wrapper';
import * as fs from 'fs-extra';
import { IntegSnapshotRunner } from '../../lib/runner';
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
  jest.spyOn(fs, 'rmdirSync').mockImplementation(() => { return true; });
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
      directory: 'test/test-data',
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
      directory: 'test/test-data',
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
      directory: 'test/test-data',
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
      directory: 'test/test-data',
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
