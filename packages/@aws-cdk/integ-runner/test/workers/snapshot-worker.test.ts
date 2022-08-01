import * as child_process from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import { snapshotTestWorker } from '../../lib/workers/extract';

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

const directory = path.join(__dirname, '../test-data');
describe('Snapshot tests', () => {
  test('no snapshot', () => {
    // WHEN
    const test = {
      fileName: path.join(directory, 'xxxxx.integ-test1.js'),
      discoveryRoot: directory,
    };
    const result = snapshotTestWorker(test);

    // THEN
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(test);
  });

  test('has snapshot', () => {
    // WHEN
    jest.spyOn(child_process, 'spawnSync').mockResolvedValue;
    const test = {
      fileName: path.join(directory, 'xxxxx.test-with-snapshot.js'),
      discoveryRoot: directory,
    };
    const result = snapshotTestWorker(test);

    // THEN
    expect(result.length).toEqual(1);
  });

  test('failed snapshot', () => {
    // WHEN
    jest.spyOn(child_process, 'spawnSync').mockRejectedValue;
    const test = {
      fileName: path.join(directory, 'xxxxx.test-with-snapshot-assets.js'),
      discoveryRoot: directory,
      destructiveChanges: [],
    };
    const result = snapshotTestWorker(test);

    // THEN
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(test);
  });
});

