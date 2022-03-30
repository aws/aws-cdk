import * as workerpool from 'workerpool';
import { IntegBatchResponse } from '../../lib/workers/common';
import { IntegTestBatchRequest } from '../../lib/workers/integ-test-worker';


function integTestBatch(request: IntegTestBatchRequest): IntegBatchResponse {
  return {
    failedTests: request.tests,
  };
}

workerpool.worker({
  integTestBatch,
});

