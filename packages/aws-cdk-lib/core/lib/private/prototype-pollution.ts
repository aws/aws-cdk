import { AssumptionError } from '../errors';

/**
 * Make sure that the given string is not '__proto__'
 *
 * This should only be used in functions that do simple assignment:
 *
 * ```ts
 * object[userControlledKey] = value;
 * ```
 *
 * If the function proceeds to recurse into `value`, you must use `assertNoProtoRec`.
 *
 * If you fully control the destination object, you can create it using `Object.create(null)`,
 * in which case you also don't have to use this function.
 */
export function assertNoProto(x: string) {
  if (x === '__proto__') {
    throw new AssumptionError('PrototypePollution', '__proto__ leads to prototype pollution and is not allowed');
  }
}

/**
 * Assert that the given key does not lead to prototype pollution, if the function is a recursive object merge
 */
export function assertNoProtoRec(x: string) {
  if (['__proto__', 'constructor', 'prototype'].includes(x)) {
    throw new AssumptionError('PrototypePollution', `${x} leads to prototype pollution and is not allowed here`);
  }
}
