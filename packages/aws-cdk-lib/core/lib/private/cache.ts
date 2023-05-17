/**
 * A simple cache class.
 *
 * Must be declared at the top of the file because we're going to use it statically in the
 * AssetStaging class.
 */
export class Cache<A> {
  private cache = new Map<string, A>();

  /**
   * Clears the cache
   */
  public clear() {
    this.cache.clear();
  }

  /**
   * Get a value from the cache or calculate it
   */
  public obtain(cacheKey: string, calcFn: () => A): A {
    let value = this.cache.get(cacheKey);
    if (value) { return value; }

    value = calcFn();
    this.cache.set(cacheKey, value);
    return value;
  }
}

