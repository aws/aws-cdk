import * as workerpool from 'workerpool';
import * as logger from '../logger';
import { IntegTestConfig } from '../runner/integ-tests';
import { printSummary, Diagnostic, printResults, flatten } from './common';

/**
 * Options for running snapshot tests
 */
export interface SnapshotBatchRequest {
  /**
   * List of tests to run
   */
  readonly tests: IntegTestConfig[];
}

/**
 * Snapshot test results
 */
export interface SnapshotBatchResponse {
  /**
   * Test diagnostics
   */
  diagnostics: Diagnostic[];

  /**
   * List of failed tests
   */
  failedTests: IntegTestConfig[];
}

/**
 * Run Snapshot tests
 * First batch up the tests. By default there will be 3 tests per batch.
 * Use a workerpool to run the batches in parallel.
 */
export async function runSnapshotTests(pool: workerpool.WorkerPool, tests: IntegTestConfig[]): Promise<IntegTestConfig[]> {
  logger.highlight('\nVerifying integration test snapshots...\n');

  const failedTests: IntegTestConfig[][] = await Promise.all(
    tests.map((test) => pool.exec('snapshotTestWorker', [test], {
      on: printResults,
    })),
  );
  const testsToRun = flatten(failedTests);

  logger.highlight('\nSnapshot Results: \n');
  printSummary(tests.length, testsToRun.length);
  return testsToRun;
}
