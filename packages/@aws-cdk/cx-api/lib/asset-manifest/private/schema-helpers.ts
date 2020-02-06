/**
 * Validate that a given key is of a given type in an object
 *
 * If not optional, the key is considered required.
 */
export function expectKey(obj: any, key: string, type: string, optional?: boolean) {
  if (typeof obj !== 'object' || obj === null || (!(key in obj) && !optional)) {
    throw new Error(`Expected key '${key}' missing: ${JSON.stringify(obj)}`);
  }
  if (key in obj && typeof obj[key] !== type) {
    throw new Error(`Expected type of key '${key}' to be '${type}': got '${typeof obj[key]}'`);
  }
}