import * as child_process from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import { singleThreadedSnapshotRunner, DiagnosticReason, singleThreadedTestRunner } from '../../lib/workers/workers';

const directory = path.join(__dirname, '../test-data');
describe('Snapshot tests', () => {
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
  test('no snapshot', () => {
    // WHEN
    const test = {
      fileName: path.join(directory, 'integ.integ-test1.js'),
      directory: directory,
    };
    const result = singleThreadedSnapshotRunner([test]);

    // THEN
    expect(result.diagnostics.length).toEqual(1);
    expect(result.failedTests.length).toEqual(1);
    expect(result.diagnostics[0]).toEqual({
      reason: DiagnosticReason.NO_SNAPSHOT,
      testName: 'integ-test1',
      message: 'No Snapshot',
    });
    expect(result.failedTests[0]).toEqual(test);
  });

  test('has snapshot', () => {
    // WHEN
    jest.spyOn(child_process, 'spawnSync').mockResolvedValue;
    const test = {
      fileName: path.join(directory, 'integ.test-with-snapshot.js'),
      directory: directory,
    };
    const result = singleThreadedSnapshotRunner([test]);

    // THEN
    expect(result.diagnostics.length).toEqual(1);
    expect(result.failedTests.length).toEqual(0);
    expect(result.diagnostics[0]).toEqual({
      reason: DiagnosticReason.SNAPSHOT_SUCCESS,
      testName: 'test-with-snapshot',
      message: 'Success',
    });
  });

  test('failed snapshot', () => {
    // WHEN
    jest.spyOn(child_process, 'spawnSync').mockRejectedValue;
    const test = {
      fileName: path.join(directory, 'integ.test-with-snapshot-assets.js'),
      directory: directory,
    };
    const result = singleThreadedSnapshotRunner([test]);

    // THEN
    expect(result.diagnostics.length).toEqual(1);
    expect(result.failedTests.length).toEqual(1);
    expect(result.diagnostics[0]).toEqual({
      reason: DiagnosticReason.SNAPSHOT_FAILED,
      testName: 'test-with-snapshot-assets',
      message: expect.stringContaining('Parameters'),
    });
    expect(result.failedTests[0]).toEqual(test);
  });
});

describe('test runner', () => {
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

  test('no snapshot', () => {
    // WHEN
    const test = {
      fileName: path.join(directory, 'integ.integ-test1.js'),
      directory: directory,
    };
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockImplementation();
    singleThreadedTestRunner({
      tests: [test],
      region: 'us-east-1',
    });

    expect(spawnSyncMock).toHaveBeenCalledWith(
      expect.stringMatching(/cdk/),
      ['synth', '--app', 'node integ.integ-test1.js', '--no-version-reporting', '--no-path-metadata', '--no-asset-metadata', '--output', 'cdk-integ.out.integ-test1', '--all'],
      expect.anything(),
    );
  });
});
