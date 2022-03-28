import * as workerpool from 'workerpool';
import { IntegTestConfig } from '../runner/integ-tests';
import { singleThreadedTestRunner, singleThreadedSnapshotRunner, IntegTestBatchRequest, Diagnostic } from './workers';

/**
 * Options for running snapshot tests
 */
export interface SnapshotBatchRequest {
  readonly tests: IntegTestConfig[];
  readonly region: string;
}

/**
 * Snapshot test results
 */
export interface SnapshotBatchResponse {
  diagnostics: Diagnostic[];
  failedTests: IntegTestConfig[];
}

/**
 * Integration test results
 */
export interface IntegBatchResponse {
  diagnostics: Diagnostic[];
}

function integTestBatch(request: IntegTestBatchRequest): IntegBatchResponse {
  const result = singleThreadedTestRunner(request);
  return {
    diagnostics: result,
  };
}

function snapshotTestBatch(request: SnapshotBatchRequest): SnapshotBatchResponse {
  const result = singleThreadedSnapshotRunner(request.tests);
  return {
    diagnostics: result.diagnostics,
    failedTests: result.failedTests,
  };
}

workerpool.worker({
  snapshotTestBatch,
  integTestBatch,
});
