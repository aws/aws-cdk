import { TypeCoercionGroup, TypeCoercionMap, typeCoercionMap } from './type-coercion-map';

type ApiParameters = { [param: string]: any };
type TargetType = 'Uint8Array' | 'number';

let coercionGroup: TypeCoercionGroup | undefined;

/**
 * Given a minimal AWS SDKv3 call definition (service, action, parameters),
 * coerces nested parameter values into a Uint8Array if that's what the SDKv3 expects.
 */
export async function coerceApiParameters(service: string, action: string, parameters: ApiParameters = {}): Promise<ApiParameters> {
  if (coercionGroup == null) {
    coercionGroup = await typeCoercionMap();
  }

  apply(coercionGroup.numberParameters, 'number');
  apply(coercionGroup.uint8ArrayParameters, 'Uint8Array');

  function apply(coercionMap: TypeCoercionMap, targetType: TargetType) {
    const pathsToCoerce = coercionMap?.[service.toLowerCase()]?.[action.toLowerCase()] ?? [];
    for (const path of pathsToCoerce) {
      coerce(parameters, path.split('.'), targetType);
    }
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
export function coerce(obj: any, path: string[], targetType: TargetType): any {
  if (path.length === 0) {
    return targetType === 'Uint8Array'
      ? coerceValueToUint8Array(obj)
      : coerceValueToNumber(obj);
  }

  if (path[0] === '*') {
    if (Array.isArray(obj)) {
      return obj.map((e) => coerce(e, path.slice(1), targetType));
    }
    if (obj && typeof obj === 'object') {
      return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, coerce(value, path.slice(1), targetType)]));
    }
    // The value should have been an array or dict here, but let's be safe and return the original value anyway
    return obj;
  }

  if (obj && typeof obj === 'object') {
    const memberName = Object.keys(obj).find(k => k.startsWith(path[0]));
    if (memberName != null) {
      obj[memberName] = coerce(obj[memberName], path.slice(1), targetType);
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

function coerceValueToNumber(x: unknown): number | any {
  if (typeof x === 'number') {
    return x;
  }

  if (typeof x === 'string') {
    const n = Number(x);
    return isNaN(n) ? x : n;
  }

  return x;
}