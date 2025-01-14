/**
 * Type of a map mapping strings to some arbitrary type
 *
 * Name is not ideal, but:
 *
 * - Cannot call it Object, that already means something.
 * - Cannot call it Dict or Dictionary, since in other languages
 *   those also allow specifying the key type.
 */
export type Obj<T> = {[key: string]: T};

/**
 * Return whether the given value is an object
 *
 * Even though arrays technically are objects, we usually want to treat them differently,
 * so we return false in those cases.
 */
export function isObject(x: any): x is Obj<any> {
  return x !== null && typeof x === 'object' && !isArray(x);
}

/**
 * Return whether the given value is an array
 */
export const isArray = Array.isArray;

/**
 * Return the value of the first argument if it's not undefined, otherwise the default
 */
export function ifDefined<T>(x: T | undefined, def: T): T {
  return typeof x !== 'undefined' ? x : def;
}
