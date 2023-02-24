import PQueue from 'p-queue';
import { sleep } from '../aws';
import { MemoryStream } from '../corking';


export type ErrorResponse = 'fail' | 'skip' | 'retry';

/**
 * Run a function in parallel with cached output
 */
export async function parallelShell<A>(
  inputs: A[],
  block: (x: A, output: NodeJS.WritableStream) => Promise<void>,
  swallowError?: (x: A, output: string) => ErrorResponse,
) {
  // Limit to 10 for now, too many instances of Maven exhaust the CodeBuild instance memory
  const q = new PQueue({ concurrency: Number(process.env.CONCURRENCY) || 10 });
  await q.addAll(inputs.map(input => async () => {
    let attempts = 10;
    let sleepMs = 500;
    while (true) {
      const output = new MemoryStream();
      try {
        await block(input, output);
        return;
      } catch (e) {
        switch (swallowError?.(input, output.toString())) {
          case 'skip':
            return;

          case 'retry':
            if (--attempts > 0) {
              await sleep(Math.floor(Math.random() * sleepMs));
              sleepMs *= 2;
              continue;
            }
            break;

          case 'fail':
          case undefined:
            break;
        }

        // eslint-disable-next-line no-console
        console.error(output.toString());
        throw e;
      }
    }
  }));

  await q.onEmpty();
}