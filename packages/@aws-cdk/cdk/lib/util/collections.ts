/**
 * Return the fist value that is not undefined
 */
export function firstDefined<T>(...xs: Array<T | undefined>): T | undefined {
  for (const x of xs) {
    if (x !== undefined) {
      return x;
    }
  }
  return undefined;
}