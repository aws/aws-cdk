/**
 * Creates a critical section, ensuring that at most one function can
 * enter the critical section at a time.
 */
export declare function createCriticalSection(): (criticalFunction: () => Promise<void>) => Promise<void>;
