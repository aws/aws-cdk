import * as workerpool from 'workerpool';
import { IntegTestConfig } from '../../runner/integ-tests';
import { Diagnostic, IntegBatchResponse } from '../common';
import { singleThreadedSnapshotRunner } from '../integ-snapshot-worker';
import { singleThreadedTestRunner, IntegTestBatchRequest } from '../integ-test-worker';

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

function integTestBatch(request: IntegTestBatchRequest): IntegBatchResponse {
  const result = singleThreadedTestRunner(request);
  return result;
}

function snapshotTestBatch(request: SnapshotBatchRequest): IntegBatchResponse {
  const result = singleThreadedSnapshotRunner(request.tests);
  return result;
}

workerpool.worker({
  snapshotTestBatch,
  integTestBatch,
});
