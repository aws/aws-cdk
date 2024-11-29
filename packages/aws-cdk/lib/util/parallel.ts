/**
 * Run a number of promise generators with max parallelism
 *
 * Order is not maintained between the input and output.
 */
export async function parallelPromises<A>(n: number, promises: Array<() => Promise<A>>): Promise<Array<A>> {
  const ret = new Array<A>();
  let count = 0;
  let error: Error | undefined;
  const queue = [...promises];

  return new Promise((ok, ko) => {
    tick();

    function tick() {
      if (count === 0 && error) {
        ko(error);
        return;
      }
      if (count === 0 && queue.length === 0) {
        ok(ret);
        return;
      }

      while (count < n && queue.length > 0 && !error) {
        const next = queue.shift();
        if (next !== undefined) {
          start(next);
        }
      }
    }

    function start(fn: () => Promise<A>) {
      count += 1;
      fn()
        .then((result) => { ret.push(result); })
        .catch((e) => { error = e; })
        .finally(() => {
          count -= 1;
          tick();
        });
    }
  });
}
