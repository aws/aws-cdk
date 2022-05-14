import * as workerpool from 'workerpool';
import * as logger from '../logger';
import { IntegTestConfig } from '../runner/integration-tests';
import { flatten } from '../utils';
import { printSummary, printResults, IntegTestWorkerConfig } from './common';

/**
 * Run Snapshot tests
 * First batch up the tests. By default there will be 3 tests per batch.
 * Use a workerpool to run the batches in parallel.
 */
export async function runSnapshotTests(pool: workerpool.WorkerPool, tests: IntegTestConfig[]): Promise<IntegTestWorkerConfig[]> {
  logger.highlight('\nVerifying integration test snapshots...\n');

  const failedTests: IntegTestWorkerConfig[][] = await Promise.all(
    tests.map((test) => pool.exec('snapshotTestWorker', [test], {
      on: printResults,
    })),
  );
  const testsToRun = flatten(failedTests);

  logger.highlight('\nSnapshot Results: \n');
  printSummary(tests.length, testsToRun.length);
  return testsToRun;
}
