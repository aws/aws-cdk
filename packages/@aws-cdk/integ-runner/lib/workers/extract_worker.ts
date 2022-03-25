import * as workerpool from 'workerpool';
import { IntegTestConfig } from '../runner/integ-tests';
import { singleThreadedTestRunner, singleThreadedSnapshotRunner, IntegTestBatchRequest, Diagnostic } from './workers';


export interface SnapshotBatchRequest {
  readonly tests: IntegTestConfig[];
  readonly region: string;
}


function integTestBatch(request: IntegTestBatchRequest): IntegBatchResponse {
  const result = singleThreadedTestRunner(request);
  return {
    diagnostics: result,
  };
}


export interface SnapshotBatchResponse {
  diagnostics: Diagnostic[];
  failedTests: IntegTestConfig[];
}

export interface IntegBatchResponse {
  diagnostics: Diagnostic[];
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
