/**
 * Validate that a given key is of a given type in an object
 *
 * If not optional, the key is considered required.
 *
 * Uses predicate validators that return a 'witness', so we can use the return type of
 * the validator function to infer the actual type of the value and enrich the type information
 * of the given input field.
 *
 * In effect, validators should be written like this:
 *
 *   if (!valid(input)) { throw; }
 *   return input;
 */
export function expectKey<K extends string, A extends object, R, P extends (x: unknown) => R>(obj: A, key: K, validate: P, optional?: boolean):
  asserts obj is A & {[k in K]: ReturnType<P>}  {
  if (typeof obj !== 'object' || obj === null || (!(key in obj) && !optional)) {
    throw new Error(`Expected key '${key}' missing: ${JSON.stringify(obj)}`);
  }

  if (key in obj) {
    try {
      validate((obj as any)[key]);
    } catch (e) {
      throw new Error(`${key}: ${e.message}`);
    }
  }
}

export function isString(x: unknown): string {
  if (typeof x !== 'string') { throw new Error(`Expected a string, got '${x}'`); }
  return x;
}

export function isMapOf<T>(pred: (e: unknown) => T): (x: unknown) => Record<string, T> {
  return x => {
    assertIsObject(x);

    Object.values(x).forEach(pred);

    return x as Record<string, T>;
  };
}

export function isObjectAnd<A>(p: (x: object) => A): (x: unknown) => A {
  return x => {
    assertIsObject(x);
    return p(x);
  };
}

export function assertIsObject(x: unknown): asserts x is object {
  if (typeof x !== 'object' || x === null) { throw new Error(`Expected a map, got '${x}'`); }
}