/**
 * Map a function over an array and concatenate the results
 */
export function flatMap<T, U>(xs: T[], fn: ((x: T, i: number) => U[])): U[] {
  return flatten(xs.map(fn));
}

/**
 * Flatten a list of lists into a list of elements
 */
export function flatten<T>(xs: T[][]): T[] {
  return Array.prototype.concat.apply([], xs);
}

/**
 * Partition a collection by removing and returning all elements that match a predicate
 *
 * Note: the input collection is modified in-place!
 */
export function partition<T>(collection: T[], pred: (x: T) => boolean): T[] {
  const ret: T[] = [];
  let i = 0;
  while (i < collection.length) {
    if (pred(collection[i])) {
      ret.push(collection.splice(i, 1)[0]);
    } else {
      i++;
    }
  }
  return ret;
}
