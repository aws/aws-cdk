import { parallelPromises } from '../../lib/util/parallel';
import { sleep } from '../util';

test('parallelPromises', async () => {
  const N = 4;
  const J = 100;

  let jobsDone = 0;
  let concurrent = 0;
  let maxConcurrent = 0;

  const jobs = range(J).map(() => async () => {
    concurrent += 1;
    maxConcurrent = Math.max(concurrent, maxConcurrent);
    await sleep(Math.round(Math.random() * 100));
    concurrent -= 1;
    jobsDone += 1;
  });

  await parallelPromises(N, jobs);

  expect(maxConcurrent).toBeLessThanOrEqual(N);
  expect(maxConcurrent).toBeGreaterThan(1);
  expect(jobsDone).toEqual(J);
});

function range(n: number) {
  const ret = new Array<number>();
  for (let i = 0; i < n; i++) {
    ret.push(i);
  }
  return ret;
}
