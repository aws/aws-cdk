import { XpMutexPool } from '../lib/xpmutex';

const POOL = XpMutexPool.fromName('test-pool');

test('acquire waits', async () => {
  const mux = POOL.mutex('testA');
  let secondLockAcquired = false;

  // Current "process" acquires lock
  const lock = await mux.acquire();

  // Start a second "process" that tries to acquire the lock
  const secondProcess = (async () => {
    const secondLock = await mux.acquire();
    try {
      secondLockAcquired = true;
    } finally {
      await secondLock.release();
    }
  })();

  // Once we release the lock the second process is free to take it
  expect(secondLockAcquired).toBe(false);
  await lock.release();

  // We expect the variable to become true
  await waitFor(() => secondLockAcquired);
  expect(secondLockAcquired).toBe(true);

  await secondProcess;
});


/**
 * Poll for some condition every 10ms
 */
function waitFor(pred: () => boolean): Promise<void> {
  return new Promise((ok) => {
    const timerHandle = setInterval(() => {
      if (pred()) {
        clearInterval(timerHandle);
        ok();
      }
    }, 5);
  });
}