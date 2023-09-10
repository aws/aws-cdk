import { UINT8ARRAY_PARAMETERS } from './parameter-types';

type ApiParameters = { [param: string]: any };

/**
 * Given a minimal AWS SDKv3 call definition (service, action, parameters),
 * coerces nested parameter values into a Uint8Array if that's what the SDKv3 expects.
 */
export function coerceApiParametersToUint8Array(service: string, action: string, parameters: ApiParameters = {}): ApiParameters {
  const pathsToCoerce = UINT8ARRAY_PARAMETERS?.[service.toLowerCase()]?.[action.toLowerCase()] ?? [];
  for (const path of pathsToCoerce) {
    coerceToUint8Array(parameters, path.split('.'));
  }
  return parameters;
}

/**
 * Given an object and a path, traverse to the leaf and coerce the value into a Uint8Array.
 *
 * @example
 *    const obj = { a: { b: { c: '1' } } }
 *    coerceToUint8Array(obj, ['a', 'b', 'c'])
 *    assert(obj == {a: {b: {c: new Uint8Array([49]} } })
 *
 * @returns Parameters with coerced values
 */
export function coerceToUint8Array(obj: any, path: string[]): any {
  if (path.length === 0) {
    return coerceValueToUint8Array(obj);
  }

  if (path[0] === '*') {
    if (Array.isArray(obj)) {
      return obj.map((e) => coerceToUint8Array(e, path.slice(1)));
    }
    if (obj && typeof obj === 'object') {
      return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, coerceToUint8Array(value, path.slice(1))]));
    }
    // The value should have been an array or dict here, but let's be safe and return the original value anyway
    return obj;
  }

  if (obj && typeof obj === 'object') {
    if (path[0] in obj) {
      obj[path[0]] = coerceToUint8Array(obj[path[0]], path.slice(1));
    }
    return obj;
  }
  return obj;
}

function coerceValueToUint8Array(x: unknown): Uint8Array | any {
  if (x instanceof Uint8Array) {
    return x;
  }

  if (typeof x === 'string' || typeof x === 'number') {
    return new TextEncoder().encode(x.toString());
  }

  return x;
}

