import * as workerpool from 'workerpool';
import { IntegTestInfo } from '../../lib/runner';
import { IntegTestBatchRequest } from '../../lib/workers/integ-test-worker';


function integTestWorker(request: IntegTestBatchRequest): IntegTestInfo[] {
  return request.tests;
}

workerpool.worker({
  integTestWorker,
});

