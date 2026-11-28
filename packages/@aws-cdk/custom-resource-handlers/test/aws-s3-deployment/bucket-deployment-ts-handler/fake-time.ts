/**
 * For use with `jest.useFakeTimers()`. Run timers until the promise resolves.
 */
export async function advanceTimeUntil<A>(x: Promise<A>): Promise<A> {
  let settled = false;
  let error: unknown;
  let value: A;
  x.then(
    (v) => {
      value = v; settled = true;
    },
    (e) => {
      error = e; settled = true;
    },
  );
  while (!settled) {
    await jest.advanceTimersByTimeAsync(100);
  }
  if (error) {
    throw error;
  }
  return value!;
}
