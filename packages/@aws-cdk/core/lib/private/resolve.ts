import { IConstruct } from 'constructs';
import { DefaultTokenResolver, IPostProcessor, IResolvable, IResolveContext, ITokenResolver, StringConcat } from '../resolvable';
import { TokenizedStringFragments } from '../string-fragments';
import { containsListTokenElement, TokenString, unresolved } from './encoding';
import { TokenMap } from './token-map';

// v2 - leave this as a separate section so it reduces merge conflicts when compat is removed
// eslint-disable-next-line import/order
import { IConstruct as ICoreConstruct } from '../construct-compat';

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
  preparing: boolean;
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
  function makeContext(appendPath?: string): [IResolveContext, IPostProcessor] {
    const newPrefix = appendPath !== undefined ? prefix.concat([appendPath]) : options.prefix;

    let postProcessor: IPostProcessor | undefined;

    const context: IResolveContext = {
      preparing: options.preparing,
      scope: options.scope as ICoreConstruct,
      registerPostProcessor(pp) { postProcessor = pp; },
      resolve(x: any) { return resolve(x, { ...options, prefix: newPrefix }); },
    };

    return [context, { postProcess(x) { return postProcessor ? postProcessor.postProcess(x, context) : x; } }];
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
    // If this is a "list element" Token, it should never occur by itself in string context
    if (TokenString.forListToken(obj).test()) {
      throw new Error('Found an encoded list token string in a scalar string context. Use \'Fn.select(0, list)\' (not \'list[0]\') to extract elements from token lists.');
    }

    // Otherwise look for a stringified Token in this object
    const str = TokenString.forString(obj);
    if (str.test()) {
      const fragments = str.split(tokenMap.lookupToken.bind(tokenMap));
      return options.resolver.resolveString(fragments, makeContext()[0]);
    }
    return obj;
  }

  //
  // number - potentially decode Tokenized number
  //
  if (typeof(obj) === 'number') {
    return resolveNumberToken(obj, makeContext()[0]);
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
      return options.resolver.resolveList(obj, makeContext()[0]);
    }

    const arr = obj
      .map((x, i) => makeContext(`${i}`)[0].resolve(x))
      .filter(x => typeof(x) !== 'undefined');

    return arr;
  }

  //
  // tokens - invoke 'resolve' and continue to resolve recursively
  //

  if (unresolved(obj)) {
    const [context, postProcessor] = makeContext();
    return options.resolver.resolveToken(obj, context, postProcessor);
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
    const resolvedKey = makeContext()[0].resolve(key);
    if (typeof(resolvedKey) !== 'string') {
      // eslint-disable-next-line max-len
      throw new Error(`"${key}" is used as the key in a map so must resolve to a string, but it resolves to: ${JSON.stringify(resolvedKey)}. Consider using "CfnJson" to delay resolution to deployment-time`);
    }

    const value = makeContext(key)[0].resolve(obj[key]);

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
export function findTokens(scope: IConstruct, fn: () => any): IResolvable[] {
  const resolver = new RememberingTokenResolver(new StringConcat());

  resolve(fn(), { scope, prefix: [], resolver, preparing: true });

  return resolver.tokens;
}

/**
 * Remember all Tokens encountered while resolving
 */
export class RememberingTokenResolver extends DefaultTokenResolver {
  private readonly tokensSeen = new Set<IResolvable>();

  public resolveToken(t: IResolvable, context: IResolveContext, postProcessor: IPostProcessor) {
    this.tokensSeen.add(t);
    return super.resolveToken(t, context, postProcessor);
  }

  public resolveString(s: TokenizedStringFragments, context: IResolveContext) {
    const ret = super.resolveString(s, context);
    return ret;
  }

  public get tokens(): IResolvable[] {
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

function resolveNumberToken(x: number, context: IResolveContext): any {
  const token = TokenMap.instance().lookupNumberToken(x);
  if (token === undefined) { return x; }
  return context.resolve(token);
}
