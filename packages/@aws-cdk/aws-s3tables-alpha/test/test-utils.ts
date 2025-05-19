
/**
 * If the given array is 1-length, return the element in it.
 * Useful for IAM policies/actions
 */
export const singletonOrArr = (array: string[]) => array.length === 1 ? array[0] : array;
