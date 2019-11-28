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

/**
 * @returns the list of stacks that lead from the top-level stack (non-nested) all the way to a nested stack.
 */
export function pathToTopLevelStack(s: Stack): Stack[] {
  if (s.parentStack) {
    return [ ...pathToTopLevelStack(s.parentStack), s ];
  } else {
    return [ s ];
  }
}

/**
 * @returns true if this stack is a direct or indirect parent of the nested
 * stack `nested`. If `nested` is a top-level stack, returns false.
 */
export function isParentOfNestedStack(parent: Stack, child: Stack): boolean {
  // if "nested" is not a nested stack, then by definition we cannot be its parent
  if (!child.parentStack) {
    return false;
  }

  // if this is the direct parent, then we found it
  if (parent === child.parentStack) {
    return true;
  }

  // traverse up
  return isParentOfNestedStack(parent, child.parentStack);
}

/**
 * Given two arrays, returns the last common element or `undefined` if there
 * isn't (arrays are foriegn).
 */
export function findLastCommonElement<T>(path1: T[], path2: T[]): T | undefined {
  let i = 0;
  while (i < path1.length && i < path2.length) {
    if (path1[i] !== path2[i]) {
      break;
    }

    i++;
  }

  return path1[i - 1];
}