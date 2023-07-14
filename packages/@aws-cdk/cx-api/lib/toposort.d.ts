export type KeyFunc<T> = (x: T) => string;
export type DepFunc<T> = (x: T) => string[];
/**
 * Return a topological sort of all elements of xs, according to the given dependency functions
 *
 * Dependencies outside the referenced set are ignored.
 *
 * Not a stable sort, but in order to keep the order as stable as possible, we'll sort by key
 * among elements of equal precedence.
 */
export declare function topologicalSort<T>(xs: Iterable<T>, keyFn: KeyFunc<T>, depFn: DepFunc<T>): T[];
