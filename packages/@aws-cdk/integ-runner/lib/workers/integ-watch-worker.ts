import * as workerpool from 'workerpool';
import { printResults } from './common';
import { IntegTestInfo } from '../runner';

export interface IntegWatchOptions extends IntegTestInfo {
  readonly region: string;
  readonly profile?: string;
  readonly verbosity?: number;
}
export async function watchIntegrationTest(pool: workerpool.WorkerPool, options: IntegWatchOptions): Promise<void> {
  await pool.exec('watchTestWorker', [options], {
    on: printResults,
  });
}
