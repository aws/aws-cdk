/**
 * A simple cache class.
 *
 * Must be declared at the top of the file because we're going to use it statically in the
 * AssetStaging class.
 */
export declare class Cache<A> {
    private cache;
    /**
     * Clears the cache
     */
    clear(): void;
    /**
     * Get a value from the cache or calculate it
     */
    obtain(cacheKey: string, calcFn: () => A): A;
}
