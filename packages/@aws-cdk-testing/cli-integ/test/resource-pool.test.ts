import { sleep } from '../lib';
import { ResourcePool } from '../lib/resource-pool';

const POOL_NAME = 'resource-pool.test';

test('take and dispose', async () => {
  const pool = ResourcePool.withResources(POOL_NAME, ['a']);
  const take1 = pool.take();
  const take2 = pool.take();

  let released = false;

  const lease1 = await take1;
  // awaiting 'take2' would now block but we add an async
  // handler to it to flip a boolean to see when it gets activated.
  void(take2.then(() => released = true));

  expect(lease1.value).toEqual('a');
  await waitTick();
  expect(released).toEqual(false);

  await lease1.dispose();
  await waitTick(); // This works because setImmediate is scheduled in LIFO order

  const lease2 = await take2;
  await lease2.dispose();
  expect(released).toEqual(true);
});

test('double dispose throws', async () => {
  const pool = ResourcePool.withResources(POOL_NAME, ['a']);
  const lease = await pool.take();

  await lease.dispose();
  await expect(() => lease.dispose()).rejects.toThrow();
});

test('somewhat balance', async () => {
  const counters = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
  };
  const N = 100;
  let maxConcurrency = 0;
  let concurrency = 0;

  const keys = Object.keys(counters) as Array<keyof typeof counters> ;
  const pool = ResourcePool.withResources(POOL_NAME, keys);
  await Promise.all(Array.from(range(N)).map(() =>
    pool.using(async (x) => {
      counters[x] += 1;
      concurrency += 1;
      maxConcurrency = Math.max(maxConcurrency, concurrency);
      try {
        await sleep(10);
      } finally {
        concurrency -= 1;
      }
    }),
  ));

  // Regardless of which resource(s) we used, the total count should add up to N
  const sum = Object.values(counters).reduce((a, b) => a + b, 0);
  expect(sum).toEqual(N);
  // There was concurrency
  expect(maxConcurrency).toBeGreaterThan(2);
  // All counters are used
  for (const count of Object.values(counters)) {
    expect(count).toBeGreaterThan(0);
  }
});

function waitTick() {
  return new Promise(setImmediate);
}

function* range(n: number) {
  for (let i = 0; i < n; i++) {
    yield i;
  }
}