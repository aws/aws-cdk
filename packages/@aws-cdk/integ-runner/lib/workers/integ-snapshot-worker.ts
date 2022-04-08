import * as workerpool from 'workerpool';
import * as logger from '../logger';
import { IntegTestConfig } from '../runner/integ-tests';
import { IntegSnapshotRunner } from '../runner/runners';
import { IntegBatchResponse, printSummary, Diagnostic, DiagnosticReason, printResults } from './common';

/**
 * Options for running snapshot tests
 */
export interface SnapshotBatchRequest {
  readonly tests: IntegTestConfig[];
}

/**
 * Snapshot test results
 */
export interface SnapshotBatchResponse {
  diagnostics: Diagnostic[];
  failedTests: IntegTestConfig[];
}

/**
 * Split a list of snapshot tests into batches that can be run using a workerpool.
 */
function batchTests(tests: IntegTestConfig[]): SnapshotBatchRequest[] {
  let batchSize = 3;
  const ret: SnapshotBatchRequest[] = [];
  for (let i = 0; i < tests.length; i += batchSize) {
    ret.push({
      tests: tests.slice(i, i + batchSize),
    });
  }
  return ret;
}

/**
 * Run Snapshot tests
 * First batch up the tests. By default there will be 3 tests per batch.
 * Use a workerpool to run the batches in parallel.
 */
export async function runSnapshotTests(pool: workerpool.WorkerPool, tests: IntegTestConfig[]): Promise<IntegTestConfig[]> {
  const testsToRun: IntegTestConfig[] = [];
  const requests = batchTests(tests);
  logger.highlight('\nVerifying integration test snapshots...\n');

  const responses: IntegBatchResponse[] = await Promise.all(
    requests.map((request) => pool.exec('snapshotTestBatch', [request], {
      on: printResults,
    })),
  );
  for (const response of responses) {
    testsToRun.push(...response.failedTests);
  }

  logger.highlight('\nSnapshot Results: \n');
  printSummary(tests.length, testsToRun.length);
  return testsToRun;
}

/**
 * Runs a single snapshot test batch request.
 * For each integration test this will check to see
 * if there is an existing snapshot, and if there is will
 * check if there are any changes
 */
export function singleThreadedSnapshotRunner(tests: IntegTestConfig[]): IntegBatchResponse {
  const failedTests = new Array<IntegTestConfig>();
  for (const test of tests) {
    const runner = new IntegSnapshotRunner({ fileName: test.fileName });
    try {
      if (!runner.hasSnapshot()) {
        workerpool.workerEmit({
          reason: DiagnosticReason.NO_SNAPSHOT,
          testName: runner.testName,
          message: 'No Snapshot',
        });
        failedTests.push(test);
      } else {
        const snapshotDiagnostics = runner.testSnapshot();
        if (snapshotDiagnostics.length > 0) {
          snapshotDiagnostics.forEach(diagnostic => printResults(diagnostic));
          failedTests.push(test);
        } else {
          workerpool.workerEmit({
            reason: DiagnosticReason.SNAPSHOT_SUCCESS,
            testName: runner.testName,
            message: 'Success',
          });
        }
      }
    } catch (e) {
      failedTests.push(test);
      workerpool.workerEmit({
        message: e.message,
        testName: runner.testName,
        reason: DiagnosticReason.SNAPSHOT_FAILED,
      });
    }
  }

  return {
    failedTests,
  };
}
