import { ILock, XpMutex, XpMutexPool } from './xpmutex';

/**
 * A class that holds a pool of resources and gives them out and returns them on-demand
 *
 * The resources will be given out front to back, when they are returned
 * the most recently returned version will be given out again (for best
 * cache coherency).
 *
 * If there are multiple consumers waiting for a resource, consumers are serviced
 * in FIFO order for most fairness.
 */
export class ResourcePool<A extends string=string> {
  public static withResources<A extends string>(name: string, resources: A[]) {
    const pool = XpMutexPool.fromName(name);
    return new ResourcePool(pool, resources);
  }

  private readonly resources: ReadonlyArray<A>;
  private readonly mutexes: Record<string, XpMutex> = {};
  private readonly locks: Record<string, ILock | undefined> = {};

  private constructor(private readonly pool: XpMutexPool, resources: A[]) {
    if (resources.length === 0) {
      throw new Error('Must have at least one resource in the pool');
    }

    // Shuffle to reduce contention
    resources = [...resources];
    fisherYatesShuffle(resources);
    this.resources = resources;

    for (const res of resources) {
      this.mutexes[res] = this.pool.mutex(res);
    }
  }

  /**
   * Take one value from the resource pool
   *
   * If no such value is currently available, wait until it is.
   */
  public async take(): Promise<ILease<A>> {
    while (true) {
      // Start a wait on the unlock now -- if the unlock signal comes after
      // we try to acquire but before we start the wait, we might miss it.
      //
      // (The timeout is in case the unlock signal doesn't come for whatever reason).
      const wait = this.pool.awaitUnlock(10_000);

      // Try all mutexes, we might need to reacquire an expired lock
      for (const res of this.resources) {
        const lease = await this.tryObtainLease(res);
        if (lease) {
          // Ignore the wait (count as handled)
          wait.then(() => {}, () => {});
          return lease;
        }
      }

      // None available, wait until one gets unlocked then try again
      await wait;
    }
  }

  /**
   * Execute a block using a single resource from the pool
   */
  public async using<B>(block: (x: A) => B | Promise<B>): Promise<B> {
    const lease = await this.take();
    try {
      return await block(lease.value);
    } finally {
      await lease.dispose();
    }
  }

  private async tryObtainLease(value: A) {
    const lock = await this.mutexes[value].tryAcquire();
    if (!lock) {
      return undefined;
    }

    this.locks[value] = lock;
    return this.makeLease(value);
  }

  private makeLease(value: A): ILease<A> {
    let disposed = false;
    return {
      value,
      dispose: async () => {
        if (disposed) {
          throw new Error('Calling dispose() on an already-disposed lease.');
        }
        disposed = true;
        return this.returnValue(value);
      },
    };
  }

  /**
   * When a value is returned:
   *
   * - If someone's waiting for it, give it to them
   * - Otherwise put it back into the pool
   */
  private async returnValue(value: string) {
    const lock = this.locks[value];
    delete this.locks[value];
    await lock?.release();
  }
}

/**
 * A single value taken from the pool
 */
export interface ILease<A> {
  /**
   * The value obtained by the lease
   */
  readonly value: A;

  /**
   * Return the leased value to the pool
   */
  dispose(): Promise<void>;
}

/**
 * Shuffle an array in-place
 */
function fisherYatesShuffle<A>(xs: A[]) {
  for (let i = xs.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * i);
    const h = xs[j];
    xs[j] = xs[i];
    xs[i] = h;
  }
}
