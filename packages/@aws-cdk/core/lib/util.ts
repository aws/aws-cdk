import { IConstruct } from "./construct";
import { Intrinsic } from "./private/intrinsic";
import { IPostProcessor, IResolveContext } from "./resolvable";
import { Stack } from "./stack";

/**
 * Given an object, converts all keys to PascalCase given they are currently in camel case.
 * @param obj The object.
 */
export function capitalizePropertyNames(construct: IConstruct, obj: any): any {
  const stack = Stack.of(construct);
  obj = stack.resolve(obj);

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
 * Returns a copy of `obj` without `undefined` (or `null`) values in maps or arrays.
 */
export function filterUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.filter(x => x != null).map(x => filterUndefined(x));
  }

  if (typeof(obj) === 'object') {
    const ret: any = { };
    for (const [key, value] of Object.entries(obj)) {
      if (value == null) {
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
export class PostResolveToken extends Intrinsic implements IPostProcessor {
  constructor(value: any, private readonly processor: (x: any) => any) {
    super(value);
  }

  public resolve(context: IResolveContext) {
    context.registerPostProcessor(this);
    return super.resolve(context);
  }

  public postProcess(o: any, _context: IResolveContext): any {
    return this.processor(o);
  }
}
