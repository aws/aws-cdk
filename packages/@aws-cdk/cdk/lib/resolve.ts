import { IConstruct } from './construct';
import { containsListTokenElement, NullConcat, TokenString, unresolved } from "./encoding";
import { IResolveContext, isResolvedValuePostProcessor, RESOLVE_METHOD, Token } from "./token";
import { TokenMap } from './token-map';

// This file should not be exported to consumers, resolving should happen through Construct.resolve()

const tokenMap = TokenMap.instance();

/**
 * Options to the resolve() operation
 *
 * NOT the same as the ResolveContext; ResolveContext is exposed to Token
 * implementors and resolution hooks, whereas this struct is just to bundle
 * a number of things that would otherwise be arguments to resolve() in a
 * readable way.
 */
export interface IResolveOptions {
  scope: IConstruct;
  resolver: ITokenResolver;
  prefix?: string[];
}

/**
 * Resolves an object by evaluating all tokens and removing any undefined or empty objects or arrays.
 * Values can only be primitives, arrays or tokens. Other objects (i.e. with methods) will be rejected.
 *
 * @param obj The object to resolve.
 * @param prefix Prefix key path components for diagnostics.
 */
export function resolve(obj: any, options: IResolveOptions): any {
  const prefix = options.prefix || [];
  const pathName = '/' + prefix.join('/');

  /**
   * Make a new resolution context
   */
  function makeContext(appendPath?: string): IResolveContext {
    const newPrefix = appendPath !== undefined ? prefix.concat([appendPath]) : options.prefix;
    return {
      scope: options.scope,
      resolve(x: any) { return resolve(x, { ...options, prefix: newPrefix }); }
    };
  }

  // protect against cyclic references by limiting depth.
  if (prefix.length > 200) {
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
    const str = TokenString.forStringToken(obj);
    if (str.test()) {
      return options.resolver.resolveString(str, makeContext());
    }
    return obj;
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
      return options.resolver.resolveList(obj, makeContext());
    }

    const arr = obj
      .map((x, i) => makeContext(`${i}`).resolve(x))
      .filter(x => typeof(x) !== 'undefined');

    return arr;
  }

  //
  // tokens - invoke 'resolve' and continue to resolve recursively
  //

  if (unresolved(obj)) {
    return options.resolver.resolveToken(obj, makeContext());
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
    const resolvedKey = makeContext().resolve(key);
    if (typeof(resolvedKey) !== 'string') {
      throw new Error(`The key "${key}" has been resolved to ${JSON.stringify(resolvedKey)} but must be resolvable to a string`);
    }

    const value = makeContext(key).resolve(obj[key]);

    // skip undefined
    if (typeof(value) === 'undefined') {
      continue;
    }

    result[resolvedKey] = value;
  }

  return result;
}

/**
 * How to resolve tokens
 */
export interface ITokenResolver {
  /**
   * Resolve a single token
   */
  resolveToken(t: Token, context: IResolveContext): any;

  /**
   * Resolve a string with at least one stringified token in it
   *
   * (May use concatenation)
   */
  resolveString(s: TokenString, context: IResolveContext): any;

  /**
   * Resolve a tokenized list
   */
  resolveList(l: string[], context: IResolveContext): any;
}

/**
 * Function used to concatenate symbols in the target document language
 *
 * Interface so it could potentially be exposed over jsii.
 */
export interface IFragmentConcatenator {
  /**
   * Join the fragment on the left and on the right
   */
  join(left: any | undefined, right: any | undefined): any;
}

/**
 * Default resolver implementation
 */
export class DefaultTokenResolver implements ITokenResolver {
  constructor(private readonly concat: IFragmentConcatenator) {
  }

  /**
   * Default Token resolution
   *
   * Resolve the Token, recurse into whatever it returns,
   * then finally post-process it.
   */
  public resolveToken(t: Token, context: IResolveContext) {
    let resolved = t[RESOLVE_METHOD](context);

    // The token might have returned more values that need resolving, recurse
    resolved = context.resolve(resolved);

    if (isResolvedValuePostProcessor(t)) {
      resolved = t.postProcess(resolved, context);
    }

    return resolved;
  }

  /**
   * Resolve string fragments to Tokens
   */
  public resolveString(s: TokenString, context: IResolveContext) {
    const fragments = s.split(tokenMap.lookupToken.bind(tokenMap));
    return fragments.mapTokens(context.resolve).join(this.concat);
  }

  public resolveList(xs: string[], context: IResolveContext) {
    // Must be a singleton list token, because concatenation is not allowed.
    if (xs.length !== 1) {
      throw new Error(`Cannot add elements to list token, got: ${xs}`);
    }

    const str = TokenString.forListToken(xs[0]);
    const fragments = str.split(tokenMap.lookupToken.bind(tokenMap));
    if (fragments.length !== 1) {
      throw new Error(`Cannot concatenate strings in a tokenized string array, got: ${xs[0]}`);
    }

    return fragments.mapTokens(context.resolve).firstValue;
  }

}

/**
 * Find all Tokens that are used in the given structure
 */
export function findTokens(scope: IConstruct, fn: () => any): Token[] {
  const resolver = new RememberingTokenResolver(new NullConcat());

  try {
    resolve(fn(), { scope, prefix: [], resolver });
  } finally {
    // Swallow potential errors that might occur because we might not have validate()d.
  }

  return resolver.tokens;
}

/**
 * Remember all Tokens encountered while resolving
 */
export class RememberingTokenResolver extends DefaultTokenResolver {
  private readonly tokensSeen = new Set<Token>();

  public resolveToken(t: Token, context: IResolveContext) {
    this.tokensSeen.add(t);
    return super.resolveToken(t, context);
  }

  public get tokens(): Token[] {
    return Array.from(this.tokensSeen);
  }
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