/**
 * Compares two objects for equality, deeply. The function handles arguments that are
 * +null+, +undefined+, arrays and objects. For objects, the function will not take the
 * object prototype into account for the purpose of the comparison, only the values of
 * properties reported by +Object.keys+.
 *
 * @param lvalue the left operand of the equality comparison.
 * @param rvalue the right operand of the equality comparison.
 *
 * @returns +true+ if both +lvalue+ and +rvalue+ are equivalent to each other.
 */
export function deepEqual(lvalue: any, rvalue: any): boolean {
  if (lvalue === rvalue) { return true; }
  if (typeof lvalue !== typeof rvalue) { return false; }
  if (Array.isArray(lvalue) !== Array.isArray(rvalue)) { return false; }
  if (Array.isArray(lvalue) /* && Array.isArray(rvalue) */) {
    if (lvalue.length !== rvalue.length) { return false; }
    for (let i = 0 ; i < lvalue.length ; i++) {
      if (!deepEqual(lvalue[i], rvalue[i])) { return false; }
    }
    return true;
  }
  if (typeof lvalue === 'object' /* && typeof rvalue === 'object' */) {
    if (lvalue === null || rvalue === null) {
      // If both were null, they'd have been ===
      return false;
    }
    const keys = Object.keys(lvalue);
    if (keys.length !== Object.keys(rvalue).length) { return false; }
    for (const key of keys) {
      if (!rvalue.hasOwnProperty(key)) { return false; }
      if (!deepEqual(lvalue[key], rvalue[key])) { return false; }
    }
    return true;
  }
  // Neither object, nor array: I deduce this is primitive type
  // Primitive type and not ===, so I deduce not deepEqual
  return false;
}

/**
 * Produce the differences between two maps, as a map, using a specified diff function.
 *
 * @param oldValue  the old map.
 * @param newValue  the new map.
 * @param elementDiff the diff function.
 *
 * @returns a map representing the differences between +oldValue+ and +newValue+.
 */
export function diffKeyedEntities<T>(oldValue: { [key: string]: any } | undefined,
                                     newValue: { [key: string]: any } | undefined,
                                     elementDiff: (oldElement: any, newElement: any, key: string) => T): { [name: string]: T } {
  const result: { [name: string]: T } = {};
  for (const logicalId of unionOf(Object.keys(oldValue || {}), Object.keys(newValue || {}))) {
    const oldElement = oldValue && oldValue[logicalId];
    const newElement = newValue && newValue[logicalId];
    if (deepEqual(oldElement, newElement)) { continue; }
    result[logicalId] = elementDiff(oldElement, newElement, logicalId);
  }
  return result;
}

/**
 * Computes the union of two sets of strings.
 *
 * @param lv the left set of strings.
 * @param rv the right set of strings.
 *
 * @returns a new array containing all elemebts from +lv+ and +rv+, with no duplicates.
 */
export function unionOf(lv: string[] | Set<string>, rv: string[] | Set<string>): string[] {
  const result = new Set(lv);
  for (const v of rv) {
    result.add(v);
  }
  return new Array(...result);
}
