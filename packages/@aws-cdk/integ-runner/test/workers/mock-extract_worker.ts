import * as workerpool from 'workerpool';
import { IntegTestConfig } from '../../lib/runner';
import { IntegTestBatchRequest } from '../../lib/workers/integ-test-worker';


function integTestWorker(request: IntegTestBatchRequest): IntegTestConfig[] {
  return request.tests;
}

workerpool.worker({
  integTestWorker,
});

