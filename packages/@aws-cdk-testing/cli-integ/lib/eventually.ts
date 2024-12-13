/**
 * @param maxAttempts the maximum number of attempts
 * @param interval interval in milliseconds to observe between attempts
 */
export type EventuallyOptions = {
  maxAttempts?: number;
  interval?: number;
};

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const DEFAULT_INTERVAL = 1000;
const DEFAULT_MAX_ATTEMPTS = 10;

/**
 * Runs a function on an interval until the maximum number of attempts has
 * been reached.
 *
 * Default interval = 1000 milliseconds
 * Default maxAttempts = 10
 *
 * @param fn function to run
 * @param options EventuallyOptions
 */
const eventually = async <T>(call: () => Promise<T>, options?: EventuallyOptions): Promise<T> => {
  const opts = {
    interval: options?.interval ? options.interval : DEFAULT_INTERVAL,
    maxAttempts: options?.maxAttempts ? options.maxAttempts : DEFAULT_MAX_ATTEMPTS,
  };

  while (opts.maxAttempts-- >= 0) {
    try {
      return await call();
    } catch (err) {
      if (opts.maxAttempts <= 0) throw err;
    }
    await wait(opts.interval);
  }

  throw new Error('An unexpected error has occurred.');
};

export default eventually;
