import { IConstruct } from 'constructs';
import { containsListTokenElement, TokenString, unresolved } from './encoding';
import { TokenMap } from './token-map';
import { DefaultTokenResolver, IPostProcessor, IResolvable, IResolveContext, ITokenResolver, ResolveChangeContextOptions, StringConcat } from '../resolvable';
import { TokenizedStringFragments } from '../string-fragments';
import { ResolutionTypeHint } from '../type-hints';

// This file should not be exported to consumers, resolving should happen through Construct.resolve()
const tokenMap = TokenMap.instance();

/**
 * Resolved complex values will have a type hint applied.
 *
 * The type hint will be based on the type of the input value that was resolved.
 *
 * If the value was encoded, the type hint will be the type of the encoded value. In case
 * of a plain `IResolvable`, a type hint of 'string' will be assumed.
 */
const RESOLUTION_TYPEHINT_SYM = Symbol.for('@aws-cdk/core.resolvedTypeHint');

/**
 * Prefix used for intrinsic keys
 *
 * If a key with this prefix is found in an object, the actual value of the
 * key doesn't matter. The value of this key will be an `[ actualKey, actualValue ]`
 * tuple, and the `actualKey` will be a value which otherwise couldn't be represented
 * in the types of `string | number | symbol`, which are the only possible JavaScript
 * object keys.
 */
export const INTRINSIC_KEY_PREFIX = '$IntrinsicKey$';

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

  /**
   * Whether or not to allow intrinsics in keys of an object
   *
   * Because keys of an object must be strings, a (resolved) intrinsic, which
   * is an object, cannot be stored in that position. By default, we reject these
   * intrinsics if we encounter them.
   *
   * If this is set to `true`, in order to store the complex value in a map,
   * keys that happen to evaluate to intrinsics will be added with a unique key
   * identified by an uncomming prefix, mapped to a tuple that represents the
   * actual key/value-pair. The map will look like this:
   *
   * {
   *    '$IntrinsicKey$0': [ { Ref: ... }, 'value1' ],
   *    '$IntrinsicKey$1': [ { Ref: ... }, 'value2' ],
   *    'regularKey': 'value3',
   *    ...
   * }
   *
   * Callers should only set this option to `true` if they are prepared to deal with
   * the object in this weird shape, and massage it back into a correct object afterwards.
   *
   * (A regular but uncommon string was chosen over something like symbols or
   * other ways of tagging the extra values in order to simplify the implementation which
   * maintains the desired behavior `resolve(resolve(x)) == resolve(x)`).
   *
   * @default false
   */
  allowIntrinsicKeys?: boolean;

  /**
   * Whether to remove undefined elements from arrays and objects when resolving.
   *
   * @default true
   */
  removeEmpty?: boolean;
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
      scope: options.scope as IConstruct,
      documentPath: newPrefix ?? [],
      registerPostProcessor(pp) { postProcessor = pp; },
      resolve(x: any, changeOptions?: ResolveChangeContextOptions) { return resolve(x, { ...options, ...changeOptions, prefix: newPrefix }); },
    };

    return [context, { postProcess(x) { return postProcessor ? postProcessor.postProcess(x, context) : x; } }];
  }

  // protect against cyclic references by limiting depth.
  if (prefix.length > 200) {
    throw new Error('Unable to resolve object tree with circular reference. Path: ' + pathName);
  }

  // whether to leave the empty elements when resolving - false by default
  const leaveEmpty = options.removeEmpty === false;

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
      return tagResolvedValue(options.resolver.resolveString(fragments, makeContext()[0]), ResolutionTypeHint.STRING);
    }
    return obj;
  }

  //
  // number - potentially decode Tokenized number
  //
  if (typeof(obj) === 'number') {
    return tagResolvedValue(resolveNumberToken(obj, makeContext()[0]), ResolutionTypeHint.NUMBER);
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
      return tagResolvedValue(options.resolver.resolveList(obj, makeContext()[0]), ResolutionTypeHint.STRING_LIST);
    }

    const arr = obj
      .map((x, i) => makeContext(`${i}`)[0].resolve(x))
      .filter(x => leaveEmpty || typeof(x) !== 'undefined');

    return arr;
  }

  //
  // literal null -- from JsonNull resolution, preserved as-is (semantically meaningful)
  //

  if (obj === null) {
    return obj;
  }

  //
  // tokens - invoke 'resolve' and continue to resolve recursively
  //

  if (unresolved(obj)) {
    const [context, postProcessor] = makeContext();
    const ret = tagResolvedValue(options.resolver.resolveToken(obj, context, postProcessor), ResolutionTypeHint.STRING);
    return ret;
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
  let intrinsicKeyCtr = 0;
  for (const key of Object.keys(obj)) {
    const value = makeContext(String(key))[0].resolve(obj[key]);

    // skip undefined
    if (typeof(value) === 'undefined') {
      if (leaveEmpty) {
        result[key] = undefined;
      }
      continue;
    }

    // Simple case -- not an unresolved key
    if (!unresolved(key)) {
      result[key] = value;
      continue;
    }

    const resolvedKey = makeContext()[0].resolve(key);
    if (typeof(resolvedKey) === 'string') {
      result[resolvedKey] = value;
    } else {
      if (!options.allowIntrinsicKeys) {
        // eslint-disable-next-line max-len
        throw new Error(`"${String(key)}" is used as the key in a map so must resolve to a string, but it resolves to: ${JSON.stringify(resolvedKey)}. Consider using "CfnJson" to delay resolution to deployment-time`);
      }

      // Can't represent this object in a JavaScript key position, but we can store it
      // in value position. Use a unique symbol as the key.
      result[`${INTRINSIC_KEY_PREFIX}${intrinsicKeyCtr++}`] = [resolvedKey, value];
    }
  }

  // Because we may be called to recurse on already resolved values (that already have type hints applied)
  // and we just copied those values into a fresh object, be sure to retain any type hints.
  const previousTypeHint = resolvedTypeHint(obj);
  return previousTypeHint ? tagResolvedValue(result, previousTypeHint) : result;
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

/**
 * Apply a type hint to a resolved value
 *
 * The type hint will only be applied to objects.
 *
 * These type hints are used for correct JSON-ification of intrinsic values.
 */
function tagResolvedValue(value: any, typeHint: ResolutionTypeHint): any {
  if (typeof value !== 'object' || value == null) { return value; }
  Object.defineProperty(value, RESOLUTION_TYPEHINT_SYM, {
    value: typeHint,
    configurable: true,
  });
  return value;
}

/**
 * Return the type hint from the given value
 *
 * If the value is not a resolved value (i.e, the result of resolving a token),
 * `undefined` will be returned.
 *
 * These type hints are used for correct JSON-ification of intrinsic values.
 */
export function resolvedTypeHint(value: any): ResolutionTypeHint | undefined {
  if (typeof value !== 'object' || value == null) { return undefined; }
  return value[RESOLUTION_TYPEHINT_SYM];
}
