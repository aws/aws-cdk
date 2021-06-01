/**
 * Given an array of arrays, returns the first of the nested arrays
 * that is defined and non-empty. If no such array exists, returns
 * an empty array.
 *
 * @param arrays An array of arrays
 */
export function firstNonEmpty<A>(...arrays: Array<Array<A> | undefined>): Array<A> {
  return arrays.find(array => array != null && array.length > 0) ?? [];
}