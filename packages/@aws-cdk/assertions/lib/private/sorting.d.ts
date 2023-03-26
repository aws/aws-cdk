/**
 * Make a sorting comparator that will sort by a given sort key
 */
export declare function sortKeyComparator<A>(keyFn: (x: A) => Array<string | number>): (a: A, b: A) => number;
