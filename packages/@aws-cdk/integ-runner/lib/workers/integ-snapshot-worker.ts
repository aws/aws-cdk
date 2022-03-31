import * as workerpool from 'workerpool';
import { IntegTestConfig } from '../runner/integ-tests';
import { IntegSnapshotRunner } from '../runner/runners';
import { DiagnosticReason, IntegBatchResponse } from './common';

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
          snapshotDiagnostics.forEach(diagnostic => workerpool.workerEmit(diagnostic));
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

