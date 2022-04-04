import * as child_process from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as workerpool from 'workerpool';
import { singleThreadedSnapshotRunner } from '../../lib/workers';
import { singleThreadedTestRunner, runIntegrationTestsInParallel, runIntegrationTests } from '../../lib/workers/integ-test-worker';

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
    expect(result.failedTests.length).toEqual(1);
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
    expect(result.failedTests.length).toEqual(0);
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
    expect(result.failedTests.length).toEqual(1);
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

describe('parallel worker', () => {
  let pool: workerpool.WorkerPool;
  let stderrMock: jest.SpyInstance;
  beforeEach(() => {
    pool = workerpool.pool(path.join(__dirname, './mock-extract_worker.js'));
    jest.spyOn(child_process, 'spawnSync').mockImplementation();
    stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });
    jest.spyOn(process.stdout, 'write').mockImplementation(() => { return true; });
    jest.spyOn(fs, 'moveSync').mockImplementation(() => { return true; });
    jest.spyOn(fs, 'removeSync').mockImplementation(() => { return true; });
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { return true; });
  });
  afterEach(async () => {
    await pool.terminate();
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  test('run all integration tests', async () => {
    const tests = [
      {
        fileName: 'integ.test-with-snapshot.js',
        directory,
      },
      {
        fileName: 'integ.another-test-with-snapshot.js',
        directory,
      },
    ];
    await runIntegrationTests({
      tests,
      pool,
      regions: ['us-east-1', 'us-east-2'],
    });

    expect(stderrMock.mock.calls[0][0]).toContain(
      'Running integration tests for failed tests...',
    );
    expect(stderrMock.mock.calls[1][0]).toContain(
      'Running in parallel across: us-east-1, us-east-2',
    );
    expect(stderrMock.mock.calls[3][0]).toContain(
      'Running test integ.test-with-snapshot.js in us-east-2',
    );
    expect(stderrMock.mock.calls[2][0]).toContain(
      'Running test integ.another-test-with-snapshot.js in us-east-1',
    );

  });
  test('run tests', async () => {
    const tests = [{
      fileName: 'integ.test-with-snapshot.js',
      directory,
    }];
    const results = await runIntegrationTestsInParallel({
      pool,
      tests,
      regions: ['us-east-1'],
    });

    expect(stderrMock.mock.calls[0][0]).toContain(
      'Running test integ.test-with-snapshot.js in us-east-1',
    );
    expect(results).toEqual([
      {
        failedTests: [{
          fileName: 'integ.test-with-snapshot.js',
          directory,
        }],
      },
    ]);
  });

  test('run multiple tests', async () => {
    const tests = [
      {
        fileName: 'integ.test-with-snapshot.js',
        directory,
      },
      {
        fileName: 'integ.another-test-with-snapshot.js',
        directory,
      },
    ];
    const results = await runIntegrationTestsInParallel({
      tests,
      pool,
      regions: ['us-east-1', 'us-east-2'],
    });

    expect(stderrMock.mock.calls[1][0]).toContain(
      'Running test integ.test-with-snapshot.js in us-east-2',
    );
    expect(stderrMock.mock.calls[0][0]).toContain(
      'Running test integ.another-test-with-snapshot.js in us-east-1',
    );
    expect(results).toEqual(expect.arrayContaining([
      {
        failedTests: [
          {
            fileName: 'integ.test-with-snapshot.js',
            directory,
          },
        ],
      },
      {
        failedTests: [
          {
            fileName: 'integ.another-test-with-snapshot.js',
            directory,
          },
        ],
      },
    ]));
  });

  test('more tests than regions', async () => {
    const tests = [
      {
        fileName: 'integ.test-with-snapshot.js',
        directory,
      },
      {
        fileName: 'integ.another-test-with-snapshot.js',
        directory,
      },
    ];
    const results = await runIntegrationTestsInParallel({
      tests,
      pool,
      regions: ['us-east-1'],
    });

    expect(stderrMock.mock.calls[1][0]).toContain(
      'Running test integ.test-with-snapshot.js in us-east-1',
    );
    expect(stderrMock.mock.calls[0][0]).toContain(
      'Running test integ.another-test-with-snapshot.js in us-east-1',
    );
    expect(results).toEqual([
      {
        failedTests: [
          {
            fileName: 'integ.another-test-with-snapshot.js',
            directory,
          },
        ],
      },
      {
        failedTests: [
          {
            fileName: 'integ.test-with-snapshot.js',
            directory,
          },
        ],
      },
    ]);
  });

  test('more regions than tests', async () => {
    const tests = [
      {
        fileName: 'integ.test-with-snapshot.js',
        directory,
      },
      {
        fileName: 'integ.another-test-with-snapshot.js',
        directory,
      },
    ];
    const results = await runIntegrationTestsInParallel({
      tests,
      pool,
      regions: ['us-east-1', 'us-east-2', 'us-west-2'],
    });

    expect(stderrMock.mock.calls[1][0]).toContain(
      'Running test integ.test-with-snapshot.js in us-east-2',
    );
    expect(stderrMock.mock.calls[0][0]).toContain(
      'Running test integ.another-test-with-snapshot.js in us-east-1',
    );
    expect(results).toEqual(expect.arrayContaining([
      {
        failedTests: [
          {
            fileName: 'integ.another-test-with-snapshot.js',
            directory,
          },
        ],
      },
      {
        failedTests: [
          {
            fileName: 'integ.test-with-snapshot.js',
            directory,
          },
        ],
      },
    ]));
  });
});
