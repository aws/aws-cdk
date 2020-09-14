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
export class ResourcePool<A> {
  private readonly resources: A[];
  private readonly waiters: Array<(x: A) => void> = [];

  constructor(resources: A[]) {
    if (resources.length === 0) {
      throw new Error('Must have at least one resource in the pool');
    }
    this.resources = [...resources];
  }

  /**
   * Take one value from the resource pool
   *
   * If no such value is currently available, wait until it is.
   */
  public take(): Promise<ILease<A>> {
    const next = this.resources.shift();
    if (next !== undefined) {
      return Promise.resolve(this.makeLease(next));
    } else {
      return new Promise(ok => {
        this.waiters.push((resource) => ok(this.makeLease(resource)));
      });
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
      lease.dispose();
    }
  }

  private makeLease(value: A): ILease<A> {
    let disposed = false;
    return {
      value,
      dispose: () => {
        if (disposed) {
          throw new Error('Calling dispose() on an already-disposed lease.');
        }
        disposed = true;
        this.returnValue(value);
      },
    };
  }

  /**
   * When a value is returned:
   *
   * - If someone's waiting for it, give it to them
   * - Otherwise put it back into the pool
   */
  private returnValue(value: A) {
    const nextWaiter = this.waiters.shift();
    if (nextWaiter !== undefined) {
      // Execute in the next tick, otherwise the call stack is going to get very
      // confusing.
      setImmediate(() => nextWaiter(value));
    } else {
      this.resources.unshift(value);
    }
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
  dispose(): void;
}