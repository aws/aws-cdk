import { IConstruct } from "./construct";
import { Intrinsic } from "./intrinsic";
import { IResolveContext, IResolvedValuePostProcessor } from "./token";

/**
 * Given an object, converts all keys to PascalCase given they are currently in camel case.
 * @param obj The object.
 */
export function capitalizePropertyNames(construct: IConstruct, obj: any): any {
  obj = construct.node.resolve(obj);

  if (typeof(obj) !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(x => capitalizePropertyNames(construct, x));
  }

  const newObj: any = { };
  for (const key of Object.keys(obj)) {
    const value = obj[key];

    const first = key.charAt(0).toUpperCase();
    const newKey = first + key.slice(1);
    newObj[newKey] = capitalizePropertyNames(construct, value);
  }

  return newObj;
}

/**
 * Turns empty arrays/objects to undefined (after evaluating tokens).
 */
export function ignoreEmpty(obj: any): any {
 return new PostResolveToken(obj, o => {
    // undefined/null
    if (o == null) {
      return o;
    }

    if (Array.isArray(o) && o.length === 0) {
      return undefined;
    }

    if (typeof(o) === 'object' && Object.keys(o).length === 0) {
      return undefined;
    }

    return o;
  });
}

/**
 * Returns a copy of `obj` without undefined values in maps or arrays.
 */
export function filterUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.filter(x => x !== undefined).map(x => filterUndefined(x));
  }

  if (typeof(obj) === 'object') {
    const ret: any = { };
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) {
        continue;
      }
      ret[key] = filterUndefined(value);
    }
    return ret;
  }

  return obj;
}

/**
 * A Token that applies a function AFTER resolve resolution
 */
export class PostResolveToken extends Intrinsic implements IResolvedValuePostProcessor {
  constructor(value: any, private readonly processor: (x: any) => any) {
    super(value);
  }

  public postProcess(o: any, _context: IResolveContext): any {
    return this.processor(o);
  }
}
