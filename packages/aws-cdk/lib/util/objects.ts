import { isArray, isObject, Obj } from './types';

/**
 * Return a new object by adding missing keys into another object
 */
export function applyDefaults(hash: any, defaults: any) {
  const result: any = { };

  Object.keys(hash).forEach(k => result[k] = hash[k]);

  Object.keys(defaults)
    .filter(k => !(k in result))
    .forEach(k => result[k] = defaults[k]);

  return result;
}

/**
 * Return whether the given parameter is an empty object or empty list.
 */
export function isEmpty(x: any) {
  if (x == null) { return false; }
  if (isArray(x)) { return x.length === 0; }
  return Object.keys(x).length === 0;
}

/**
 * Deep clone a tree of objects, lists or scalars
 *
 * Does not support cycles.
 */
export function deepClone(x: any): any {
  if (typeof x === 'undefined') { return undefined; }
  if (x === null) { return null; }
  if (isArray(x)) { return x.map(deepClone); }
  if (isObject(x)) { return makeObject(mapObject(x, (k, v) => [k, deepClone(v)] as [string, any])); }
  return x;
}

/**
 * Map over an object, treating it as a dictionary
 */
export function mapObject<T, U>(x: Obj<T>, fn: (key: string, value: T) => U): U[] {
  const ret: U[] = [];
  Object.keys(x).forEach(key => {
    ret.push(fn(key, x[key]));
  });
  return ret;
}

/**
 * Construct an object from a list of (k, v) pairs
 */
export function makeObject<T>(pairs: Array<[string, T]>): Obj<T> {
  const ret: Obj<T> = {};
  for (const pair of pairs) {
    ret[pair[0]] = pair[1];
  }
  return ret;
}

/**
 * Deep get a value from a tree of nested objects
 *
 * Returns undefined if any part of the path was unset or
 * not an object.
 */
export function deepGet(x: any, path: string[]): any {
  path = path.slice();

  while (path.length > 0 && isObject(x)) {
    const key = path.shift()!;
    x = x[key];
  }
  return path.length === 0 ? x : undefined;
}

/**
 * Deep set a value in a tree of nested objects
 *
 * Throws an error if any part of the path is not an object.
 */
export function deepSet(x: any, path: string[], value: any) {
  path = path.slice();

  if (path.length === 0) {
    throw new Error('Path may not be empty');
  }

  while (path.length > 1 && isObject(x)) {
    const key = path.shift()!;
    if (!(key in x)) { x[key] = {}; }
    x = x[key];
  }

  if (!isObject(x)) {
    throw new Error(`Expected an object, got '${x}'`);
  }

  x[path[0]] = value;
}

/**
 * Recursively merge objects together
 *
 * The leftmost object is mutated and returned. Arrays are not merged
 * but overwritten just like scalars.
 *
 * If an object is merged into a non-object, the non-object is lost.
 */
export function deepMerge(...objects: Array<Obj<any> | undefined>) {
  function mergeOne(target: Obj<any>, source: Obj<any>) {
    for (const key of Object.keys(source)) {
      const value = source[key];

      if (isObject(value)) {
        if (!isObject(target[key])) { target[key] = {}; } // Overwrite on purpose
        mergeOne(target[key], value);
      } else if (typeof value !== 'undefined') {
        target[key] = value;
      }
    }
  }

  const others = objects.filter(x => x != null) as Array<Obj<any>>;

  if (others.length === 0) { return {}; }
  const into = others.splice(0, 1)[0];

  others.forEach(other => mergeOne(into, other));
  return into;
}
