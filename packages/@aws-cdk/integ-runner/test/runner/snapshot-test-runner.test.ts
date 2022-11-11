import * as child_process from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import { IntegSnapshotRunner, IntegTest } from '../../lib/runner';
import { DiagnosticReason } from '../../lib/workers/common';
import { MockCdkProvider } from '../helpers';

let cdkMock: MockCdkProvider;

const currentCwd = process.cwd();
beforeAll(() => {
  process.chdir(path.join(__dirname, '../..'));
});
afterAll(() => {
  process.chdir(currentCwd);
});

beforeEach(() => {
  cdkMock = new MockCdkProvider({ directory: 'test/test-data' });
  cdkMock.mockAll().list.mockImplementation(() => 'stackabc');

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
    const results = cdkMock.snapshotTest('xxxxx.test-with-snapshot.js', 'xxxxx.test-with-snapshot.js.snapshot');

    // THEN
    expect(results.diagnostics).toEqual([]);
  });

  test('new stack in actual', () => {
    // WHEN
    const results = cdkMock.snapshotTest('xxxxx.test-with-snapshot.js');

    // THEN
    expect(results.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({
      reason: DiagnosticReason.SNAPSHOT_FAILED,
      testName: 'xxxxx.test-with-snapshot',
      message: 'new-test-stack does not exist in snapshot, but does in actual',
    })]));
  });

  test('with defaults and diff', () => {
    // WHEN
    const results = cdkMock.snapshotTest('xxxxx.test-with-snapshot.js', 'xxxxx.test-with-snapshot-diff.js.snapshot');

    // THEN
    expect(results.diagnostics).toEqual(expect.arrayContaining([
      expect.objectContaining({
        reason: DiagnosticReason.SNAPSHOT_FAILED,
        testName: 'xxxxx.test-with-snapshot',
        message: expect.stringContaining('foobar'),
      }),
    ]));
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

  test('dont diff new asset hashes', () => {
    // WHEN
    const results = cdkMock.snapshotTest('xxxxx.test-with-new-assets-diff.js', 'cdk-integ.out.xxxxx.test-with-new-assets.js.snapshot');

    // THEN
    expect(results.diagnostics).toEqual([]);
  });

  test('diff new asset hashes', () => {
    // WHEN
    const results = cdkMock.snapshotTest('xxxxx.test-with-new-assets.js', 'cdk-integ.out.xxxxx.test-with-new-assets-diff.js.snapshot');

    // THEN
    expect(results.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({
      reason: DiagnosticReason.SNAPSHOT_FAILED,
      testName: 'xxxxx.test-with-new-assets',
      message: expect.stringContaining('S3Key'),
    })]));
  });

  describe('Nested Stacks', () => {
    test('it will compare snapshots for nested stacks', () => {
      // WHEN
      const results = cdkMock.snapshotTest('xxxxx.test-with-nested-stack.js', 'xxxxx.test-with-nested-stack-changed.js.snapshot');

      // THEN
      expect(results.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({
        reason: DiagnosticReason.SNAPSHOT_FAILED,
        testName: 'xxxxx.test-with-nested-stack',
        stackName: expect.stringContaining('teststacknested'),
        message: expect.stringContaining('AWS::SNS::Topic'),
      })]));
    });
  });

  describe('Legacy parameter based assets ', () => {
    test('diff asset hashes', () => {
      // WHEN
      const results = cdkMock.snapshotTest('xxxxx.test-with-snapshot-assets.js', 'xxxxx.test-with-snapshot-assets-diff.js.snapshot');

      // THEN
      expect(results.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({
        reason: DiagnosticReason.SNAPSHOT_FAILED,
        testName: 'xxxxx.test-with-snapshot-assets',
        message: expect.stringContaining('Parameters'),
      })]));
    });

    test('dont diff asset hashes', () => {
      // WHEN
      const results = cdkMock.snapshotTest('xxxxx.test-with-snapshot-assets-diff.js', 'xxxxx.test-with-snapshot-assets.js.snapshot');

      // THEN
      expect(results.diagnostics).toEqual([]);
    });
  });

  describe('Legacy Integ Tests', () => {
    test('determine test stack via pragma', () => {
      // WHEN
      const integTest = new IntegSnapshotRunner({
        cdk: cdkMock.cdk,
        test: new IntegTest({
          fileName: 'test/test-data/xxxxx.integ-test1.js',
          discoveryRoot: 'test',
        }),
        integOutDir: 'does/not/exist',
      });

      // THEN
      expect(integTest.actualTests()).toEqual(expect.objectContaining({
        'xxxxx.integ-test1': {
          diffAssets: false,
          stackUpdateWorkflow: true,
          stacks: ['stack1'],
        },
      }));
      expect(cdkMock.mocks.list).toHaveBeenCalledTimes(0);
    });

    test('get stacks from list, no pragma', async () => {
      // WHEN
      const integTest = new IntegSnapshotRunner({
        cdk: cdkMock.cdk,
        test: new IntegTest({
          fileName: 'test/test-data/xxxxx.integ-test2.js',
          discoveryRoot: 'test',
        }),
        integOutDir: 'does/not/exist',
      });

      // THEN
      expect(integTest.actualTests()).toEqual(expect.objectContaining({
        'xxxxx.integ-test2': {
          diffAssets: false,
          stackUpdateWorkflow: true,
          stacks: ['stackabc'],
        },
      }));
      expect(cdkMock.mocks.synthFast).toHaveBeenCalledTimes(1);
      expect(cdkMock.mocks.synthFast).toHaveBeenCalledWith({
        execCmd: ['node', 'xxxxx.integ-test2.js'],
        env: expect.objectContaining({
          CDK_INTEG_ACCOUNT: '12345678',
          CDK_INTEG_REGION: 'test-region',
        }),
        output: '../../does/not/exist',
      });
    });

  });
});
