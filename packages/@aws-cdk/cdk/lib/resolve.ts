import { IConstruct } from './construct';
import { containsListTokenElement, TokenString, unresolved } from "./encoding";
import { RESOLVE_OPTIONS } from "./options";
import { isResolvedValuePostProcessor, RESOLVE_METHOD, ResolveContext, Token } from "./token";
import { TokenMap } from './token-map';

// This file should not be exported to consumers, resolving should happen through Construct.resolve()

const tokenMap = TokenMap.instance();

/**
 * Resolves an object by evaluating all tokens and removing any undefined or empty objects or arrays.
 * Values can only be primitives, arrays or tokens. Other objects (i.e. with methods) will be rejected.
 *
 * @param obj The object to resolve.
 * @param prefix Prefix key path components for diagnostics.
 */
export function resolve(obj: any, context: ResolveContext): any {
  const pathName = '/' + context.prefix.join('/');

  // protect against cyclic references by limiting depth.
  if (context.prefix.length > 200) {
    throw new Error('Unable to resolve object tree with circular reference. Path: ' + pathName);
  }

  //
  // undefined
  //

  if (typeof(obj) === 'undefined') {
    return undefined;
  }

  //
  // null
  //

  if (obj === null) {
    return null;
  }

  //
  // functions - not supported (only tokens are supported)
  //

  if (typeof(obj) === 'function') {
    throw new Error(`Trying to resolve a non-data object. Only token are supported for lazy evaluation. Path: ${pathName}. Object: ${obj}`);
  }

  //
  // string - potentially replace all stringified Tokens
  //
  if (typeof(obj) === 'string') {
    return resolveStringTokens(obj, context);
  }

  //
  // number - potentially decode Tokenized number
  //
  if (typeof(obj) === 'number') {
    return resolveNumberToken(obj, context);
  }

  //
  // primitives - as-is
  //

  if (typeof(obj) !== 'object' || obj instanceof Date) {
    return obj;
  }

  //
  // arrays - resolve all values, remove undefined and remove empty arrays
  //

  if (Array.isArray(obj)) {
    if (containsListTokenElement(obj)) {
      return resolveListTokens(obj, context);
    }

    const arr = obj
      .map((x, i) => resolve(x, { ...context, prefix: context.prefix.concat(i.toString()) }))
      .filter(x => typeof(x) !== 'undefined');

    return arr;
  }

  //
  // tokens - invoke 'resolve' and continue to resolve recursively
  //

  if (unresolved(obj)) {
    const collect = RESOLVE_OPTIONS.collect;
    if (collect) { collect(obj); }

    const resolved = obj[RESOLVE_METHOD](context);

    let deepResolved = resolve(resolved, context);

    if (isResolvedValuePostProcessor(obj)) {
      deepResolved = obj.postProcess(deepResolved, context);
    }

    return deepResolved;
  }

  //
  // objects - deep-resolve all values
  //

  // Must not be a Construct at this point, otherwise you probably made a typo
  // mistake somewhere and resolve will get into an infinite loop recursing into
  // child.parent <---> parent.children
  if (isConstruct(obj)) {
    throw new Error('Trying to resolve() a Construct at ' + pathName);
  }

  const result: any = { };
  for (const key of Object.keys(obj)) {
    const resolvedKey = resolve(key, context);
    if (typeof(resolvedKey) !== 'string') {
      throw new Error(`The key "${key}" has been resolved to ${JSON.stringify(resolvedKey)} but must be resolvable to a string`);
    }

    const value = resolve(obj[key], {...context, prefix: context.prefix.concat(key) });

    // skip undefined
    if (typeof(value) === 'undefined') {
      continue;
    }

    result[resolvedKey] = value;
  }

  return result;
}

/**
 * Find all Tokens that are used in the given structure
 */
export function findTokens(scope: IConstruct, fn: () => any): Token[] {
  const ret = new Array<Token>();

  const options = RESOLVE_OPTIONS.push({ collect: ret.push.bind(ret) });
  try {
    resolve(fn(), {
      scope,
      prefix: []
    });
  } finally {
    options.pop();
  }

  return ret;
}

/**
 * Determine whether an object is a Construct
 *
 * Not in 'construct.ts' because that would lead to a dependency cycle via 'uniqueid.ts',
 * and this is a best-effort protection against a common programming mistake anyway.
 */
function isConstruct(x: any): boolean {
  return x._children !== undefined && x._metadata !== undefined;
}

/**
 * Replace any Token markers in this string with their resolved values
 */
function resolveStringTokens(s: string, context: ResolveContext): any {
  const str = TokenString.forStringToken(s);
  const fragments = str.split(tokenMap.lookupToken.bind(tokenMap));
  // require() here to break cyclic dependencies
  const ret = fragments.mapUnresolved(x => resolve(x, context)).join(require('./cfn-concat').cloudFormationConcat);
  if (unresolved(ret)) {
    return resolve(ret, context);
  }
  return ret;
}

function resolveListTokens(xs: string[], context: ResolveContext): any {
  // Must be a singleton list token, because concatenation is not allowed.
  if (xs.length !== 1) {
    throw new Error(`Cannot add elements to list token, got: ${xs}`);
  }

  const str = TokenString.forListToken(xs[0]);
  const fragments = str.split(tokenMap.lookupToken.bind(tokenMap));
  if (fragments.length !== 1) {
    throw new Error(`Cannot concatenate strings in a tokenized string array, got: ${xs[0]}`);
  }
  return fragments.mapUnresolved(x => resolve(x, context)).values[0];
}

function resolveNumberToken(x: number, context: ResolveContext): any {
  const token = TokenMap.instance().lookupNumberToken(x);
  if (token === undefined) { return x; }
  return resolve(token, context);
}