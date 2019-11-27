import { CfnResource } from "./cfn-resource";
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
 * Given two stacks, returns a parent stack (in terms of nested stacks, not
 * construct tree) that is the deepest common stack between the two.
 *
 * Implementation (classic LCA): calculates the path between each stack and the
 * root and returns the last stack before the arrays differ.
 */
export function findCommonStack(s1: Stack, s2: Stack) {
  const path1 = pathToTopLevelStack(s1);
  const path2 = pathToTopLevelStack(s2);

  let i = 0;
  while (i < path1.length && i < path2.length) {
    if (path1[i] !== path2[i]) {
      break;
    }

    i++;
  }

  // no common elements
  if (i === 0) {
    return undefined;
  }

  // return the last before diff
  return path1[i - 1];
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
 * @returns the top-level stack
 */
export function findTopLevelStack(stack: Stack): Stack {
  if (stack.parentStack) {
    return findTopLevelStack(stack.parentStack);
  } else {
    return stack;
  }
}

/**
 * @returns the CfnResource which represents `resource` within `commonStack`,
 * which can either be the stack where the resource is defined (in which case we
 * just return `resource`) or a parent stack, in which case we will return its
 * nested stack resource.
 */
export function findCommonCfnResource(resource: CfnResource, commonStack: Stack): CfnResource {
  const resourceStack = Stack.of(resource);

  // if the resource is defined in the same stack, then just return that resource
  if (commonStack === resourceStack) {
    return resource;
  }

  // otherwise, try the resource that represents this nested stack
  if (!resourceStack.nestedStackResource) {
    // tslint:disable:max-line-length
    throw new Error(`Unexpected: could not find a resource to represent '${resource.node.path}' in the context of the stack '${commonStack.node.path}`);
  }

  return findCommonCfnResource(resourceStack.nestedStackResource, commonStack);
}