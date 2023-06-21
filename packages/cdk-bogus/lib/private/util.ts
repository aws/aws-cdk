/**
 * Creates a critical section, ensuring that at most one function can
 * enter the critical section at a time.
 */
export function createCriticalSection() {
  let lock = Promise.resolve();
  return async (criticalFunction: () => Promise<void>) => {
    const res = lock.then(() => criticalFunction());
    lock = res.catch(e => e);
    return res;
  };
};