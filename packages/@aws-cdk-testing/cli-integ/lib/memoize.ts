/**
 * Return a memoized version of an function with 0 arguments.
 *
 * Async-safe.
 */
export function memoize0<A>(fn: () => Promise<A>): () => Promise<A> {
  let promise: Promise<A> | undefined;
  return () => {
    if (!promise) {
      promise = fn();
    }
    return promise;
  };
}