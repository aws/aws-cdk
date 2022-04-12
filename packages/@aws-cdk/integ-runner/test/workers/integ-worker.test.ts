import * as child_process from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as workerpool from 'workerpool';
import { integTestWorker } from '../../lib/workers/extract';
import { runIntegrationTestsInParallel, runIntegrationTests } from '../../lib/workers/integ-test-worker';

describe('test runner', () => {
  beforeEach(() => {
    jest.spyOn(fs, 'moveSync').mockImplementation(() => { return true; });
    jest.spyOn(fs, 'emptyDirSync').mockImplementation(() => { return true; });
    jest.spyOn(fs, 'unlinkSync').mockImplementation(() => { return true; });
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
      fileName: 'test/test-data/integ.integ-test1.js',
    };
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockImplementation();
    integTestWorker({
      tests: [test],
      region: 'us-east-1',
    });

    expect(spawnSyncMock).toHaveBeenCalledWith(
      expect.stringMatching(/node/),
      ['integ.integ-test1.js'],
      expect.objectContaining({
        env: expect.objectContaining({
          CDK_INTEG_ACCOUNT: '12345678',
          CDK_INTEG_REGION: 'test-region',
        }),
      }),
    );
  });

  test('no tests', () => {
    // WHEN
    const test = {
      fileName: 'test/test-data/integ.integ-test2.js',
    };
    jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      status: 0,
      stderr: Buffer.from(''),
      stdout: Buffer.from(''),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });
    const results = integTestWorker({
      tests: [test],
      region: 'us-east-1',
    });

    expect(results[0]).toEqual({ fileName: expect.stringMatching(/integ.integ-test2.js$/) });
  });

  test('has snapshot', () => {
    // WHEN
    const test = {
      fileName: 'test/test-data/integ.test-with-snapshot.js',
    };
    jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      status: 0,
      stderr: Buffer.from('stack1'),
      stdout: Buffer.from('stack1'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });
    const results = integTestWorker({
      tests: [test],
      region: 'us-east-1',
    });

    expect(results.length).toEqual(0);
  });

  test('deploy failed', () => {
    // WHEN
    const test = {
      fileName: 'test/test-data/integ.test-with-snapshot.js',
    };
    jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      status: 1,
      stderr: Buffer.from('stack1'),
      stdout: Buffer.from('stack1'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });
    const results = integTestWorker({
      tests: [test],
      region: 'us-east-1',
    });

    expect(results[0]).toEqual({ fileName: 'test/test-data/integ.test-with-snapshot.js' });
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
      },
      {
        fileName: 'integ.another-test-with-snapshot.js',
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
      'Running in parallel across regions: us-east-1, us-east-2',
    );
    expect(stderrMock.mock.calls[2][0]).toContain(
      'Running test integ.another-test-with-snapshot.js in us-east-1',
    );
    expect(stderrMock.mock.calls[3][0]).toContain(
      'Running test integ.test-with-snapshot.js in us-east-2',
    );
  });

  test('run tests', async () => {
    const tests = [{
      fileName: 'integ.test-with-snapshot.js',
    }];
    const results = await runIntegrationTestsInParallel({
      pool,
      tests,
      regions: ['us-east-1'],
    });

    expect(stderrMock.mock.calls[0][0]).toContain(
      'Running test integ.test-with-snapshot.js in us-east-1',
    );
    expect(results).toEqual({
      failedTests: expect.arrayContaining([
        {
          fileName: 'integ.test-with-snapshot.js',
        },
      ]),
      metrics: expect.arrayContaining([
        {
          duration: expect.anything(),
          region: 'us-east-1',
          tests: {
            'integ.test-with-snapshot.js': expect.anything(),
          },
        },
      ]),
    });
  });

  test('run multiple tests with profiles', async () => {
    const tests = [
      {
        fileName: 'integ.test-with-snapshot.js',
      },
      {
        fileName: 'integ.another-test-with-snapshot.js',
      },
      {
        fileName: 'integ.another-test-with-snapshot2.js',
      },
      {
        fileName: 'integ.another-test-with-snapshot3.js',
      },
    ];
    const results = await runIntegrationTestsInParallel({
      tests,
      pool,
      profiles: ['profile1', 'profile2'],
      regions: ['us-east-1', 'us-east-2'],
    });

    expect(stderrMock.mock.calls[0][0]).toContain(
      'Running test integ.another-test-with-snapshot3.js in profile1/us-east-1',
    );
    expect(stderrMock.mock.calls[1][0]).toContain(
      'Running test integ.another-test-with-snapshot2.js in profile1/us-east-2',
    );
    expect(stderrMock.mock.calls[2][0]).toContain(
      'Running test integ.another-test-with-snapshot.js in profile2/us-east-1',
    );
    expect(stderrMock.mock.calls[3][0]).toContain(
      'Running test integ.test-with-snapshot.js in profile2/us-east-2',
    );
    expect(results).toEqual({
      failedTests: expect.arrayContaining([
        {
          fileName: 'integ.test-with-snapshot.js',
        },
        {
          fileName: 'integ.another-test-with-snapshot.js',
        },
        {
          fileName: 'integ.another-test-with-snapshot2.js',
        },
        {
          fileName: 'integ.another-test-with-snapshot3.js',
        },
      ]),
      metrics: expect.arrayContaining([
        {
          duration: expect.any(Number),
          region: 'us-east-1',
          profile: 'profile1',
          tests: {
            'integ.another-test-with-snapshot3.js': expect.any(Number),
          },
        },
        {
          duration: expect.any(Number),
          region: 'us-east-2',
          profile: 'profile1',
          tests: {
            'integ.another-test-with-snapshot2.js': expect.any(Number),
          },
        },
        {
          duration: expect.any(Number),
          region: 'us-east-1',
          profile: 'profile2',
          tests: {
            'integ.another-test-with-snapshot.js': expect.any(Number),
          },
        },
        {
          duration: expect.any(Number),
          region: 'us-east-2',
          profile: 'profile2',
          tests: {
            'integ.test-with-snapshot.js': expect.any(Number),
          },
        },
      ]),
    });
  });

  test('run multiple tests', async () => {
    const tests = [
      {
        fileName: 'integ.test-with-snapshot.js',
      },
      {
        fileName: 'integ.another-test-with-snapshot.js',
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
    expect(results).toEqual({
      failedTests: expect.arrayContaining([
        {
          fileName: 'integ.test-with-snapshot.js',
        },
        {
          fileName: 'integ.another-test-with-snapshot.js',
        },
      ]),
      metrics: expect.arrayContaining([
        {
          duration: expect.anything(),
          region: 'us-east-2',
          tests: {
            'integ.test-with-snapshot.js': expect.anything(),
          },
        },
        {
          duration: expect.anything(),
          region: 'us-east-1',
          tests: {
            'integ.another-test-with-snapshot.js': expect.anything(),
          },
        },
      ]),
    });
  });

  test('more tests than regions', async () => {
    const tests = [
      {
        fileName: 'integ.test-with-snapshot.js',
      },
      {
        fileName: 'integ.another-test-with-snapshot.js',
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
    expect(results).toEqual({
      failedTests: expect.arrayContaining([
        {
          fileName: 'integ.another-test-with-snapshot.js',
        },
        {
          fileName: 'integ.test-with-snapshot.js',
        },
      ]),
      metrics: expect.arrayContaining([
        {
          duration: expect.anything(),
          region: 'us-east-1',
          tests: {
            'integ.test-with-snapshot.js': expect.anything(),
            'integ.another-test-with-snapshot.js': expect.anything(),
          },
        },
      ]),
    });
  });

  test('more regions than tests', async () => {
    const tests = [
      {
        fileName: 'integ.test-with-snapshot.js',
      },
      {
        fileName: 'integ.another-test-with-snapshot.js',
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
    expect(results).toEqual({
      failedTests: expect.arrayContaining([
        {
          fileName: 'integ.test-with-snapshot.js',
        },
        {
          fileName: 'integ.another-test-with-snapshot.js',
        },
      ]),
      metrics: expect.arrayContaining([
        {
          duration: expect.anything(),
          region: 'us-east-2',
          tests: {
            'integ.test-with-snapshot.js': expect.anything(),
          },
        },
        {
          duration: expect.anything(),
          region: 'us-east-1',
          tests: {
            'integ.another-test-with-snapshot.js': expect.anything(),
          },
        },
      ]),
    });
  });
});
