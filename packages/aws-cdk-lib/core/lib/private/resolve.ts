import type { IConstruct } from 'constructs';
import { TokenString, unresolved, BEGIN_LIST_TOKEN_MARKER, ANY_TOKEN_MARKER } from './encoding';
import { TokenMap } from './token-map';
import { UnscopedValidationError } from '../errors';
import type {
  IFragmentConcatenator,
  IPostProcessor,
  IResolvable,
  IResolveContext,
  ITokenResolver,
  ResolveChangeContextOptions,
} from '../resolvable';
import {
  DefaultTokenResolver,
  StringConcat,
} from '../resolvable';
import type { TokenizedStringFragments } from '../string-fragments';
import { ResolutionTypeHint } from '../type-hints';
import { lit } from './literal-string';
import { Box } from '../helpers-internal/box';

// This file should not be exported to consumers, resolving should happen through Construct.resolve()
const tokenMap = TokenMap.instance();
const lookupToken = tokenMap.lookupToken.bind(tokenMap);

/**
 * Minimum length a string must have to possibly contain a stringified number token.
 * Pattern: -1.\d{10,16}e+289 → minimum 16 chars
 */
const MIN_NUMBER_TOKEN_LENGTH = 16;

/**
 * Fast check: could this string contain any kind of token?
 * Both string tokens (${Token[...) and list tokens (#{Token[...) contain 'Token['.
 * Stringified number tokens contain 'e+289'.
 * One check for 'Token[' covers both marker types; a length-gated check covers numbers.
 */
function couldContainToken(s: string): boolean {
  return s.includes(ANY_TOKEN_MARKER) || (s.length >= MIN_NUMBER_TOKEN_LENGTH && s.includes('e+289'));
}

/**
 * Fast check specifically for list token marker.
 */
function hasListTokenMarker(s: string): boolean {
  return s.includes(BEGIN_LIST_TOKEN_MARKER);
}

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
  const leaveEmpty = options.removeEmpty === false;

  return _resolve(obj, options, prefix, leaveEmpty);
}

/**
 * Internal resolve implementation.
 *
 * Separated from the public function to allow recursion without re-parsing options.
 * Uses a mutable prefix array (push/pop) to avoid allocating new arrays per recursion.
 */
function _resolve(obj: any, options: IResolveOptions, prefix: string[], leaveEmpty: boolean): any {
  // Fast exit for the most common leaf types — check before anything else.
  // Ordered by frequency in typical CDK templates: string > undefined > number > boolean
  const t = typeof obj;

  if (t === 'string') {
    // Fast path: check for the common 'Token[' substring that appears in both
    // string tokens (${Token[...) and list tokens (#{Token[...).
    // If absent, also check for stringified number tokens (e+289) in longer strings.
    const hasTokenBracket = obj.includes('Token[');
    if (!hasTokenBracket && !(obj.length >= MIN_NUMBER_TOKEN_LENGTH && obj.includes('e+289'))) {
      return obj;
    }

    // Could be a list token — check and throw if found in scalar context
    if (hasTokenBracket && obj.includes(BEGIN_LIST_TOKEN_MARKER)) {
      if (TokenString.forListToken(obj).test()) {
        throw new UnscopedValidationError(lit`EncodedListTokenInScalarContext`, 'Found an encoded list token string in a scalar string context. Use \'Fn.select(0, list)\' (not \'list[0]\') to extract elements from token lists.');
      }
    }

    // Check for string token or stringified number
    const str = TokenString.forString(obj);
    if (str.test()) {
      const fragments = str.split(lookupToken);
      return tagResolvedValue(options.resolver.resolveString(fragments, makeContext(options, prefix)), ResolutionTypeHint.STRING);
    }

    return obj;
  }

  if (obj === undefined) {
    return undefined;
  }

  if (obj === null) {
    return null;
  }

  if (t === 'number') {
    // Fast path: token-encoded numbers have magnitude ~1e289.
    // Normal template numbers (ports, counts, timeouts) are nowhere near that.
    if (obj > -1e287 && obj < 1e287) {
      return obj;
    }
    return tagResolvedValue(resolveNumberToken(obj, makeContext(options, prefix)), ResolutionTypeHint.NUMBER);
  }

  if (t === 'boolean') {
    return obj;
  }

  if (t === 'function') {
    throw new UnscopedValidationError(lit`TryingToResolveNonDataObject`, `Trying to resolve a non-data object. Only token are supported for lazy evaluation. Path: /${prefix.join('/')}. Object: ${obj}`);
  }

  // At this point, obj must be an object (or Date)
  if (obj instanceof Date) {
    return obj;
  }

  // protect against cyclic references by limiting depth.
  if (prefix.length > 200) {
    throw new UnscopedValidationError(lit`CircularReferenceDetected`, 'Unable to resolve object tree with circular reference. Path: /' + prefix.join('/'));
  }

  //
  // arrays
  //
  if (Array.isArray(obj)) {
    return resolveArray(obj, options, prefix, leaveEmpty);
  }

  //
  // tokens - invoke 'resolve' and continue to resolve recursively
  // Inline the isResolvableObject check to avoid function call overhead.
  //
  if (t === 'object' && obj.resolve !== undefined && typeof obj.resolve === 'function') {
    const context = makeContext(options, prefix);
    const postProcessor = makePostProcessor(context);
    return tagResolvedValue(options.resolver.resolveToken(obj, context, postProcessor), ResolutionTypeHint.STRING);
  }

  //
  // objects - deep-resolve all values
  //
  if (obj._children !== undefined && obj._metadata !== undefined) {
    throw new UnscopedValidationError(lit`TryingToResolveConstruct`, 'Trying to resolve() a Construct at /' + prefix.join('/'));
  }

  return resolveObject(obj, options, prefix, leaveEmpty);
}

/**
 * Resolve an array. Uses a for-loop instead of .map().filter() to avoid
 * intermediate array and closure allocations.
 */
function resolveArray(obj: any[], options: IResolveOptions, prefix: string[], leaveEmpty: boolean): any {
  // Check for list tokens with fast pre-check
  for (let i = 0; i < obj.length; i++) {
    const x = obj[i];
    if (typeof x === 'string' && hasListTokenMarker(x) && TokenString.forListToken(x).test()) {
      return tagResolvedValue(options.resolver.resolveList(obj, makeContext(options, prefix)), ResolutionTypeHint.STRING_LIST);
    }
  }

  const len = obj.length;
  const arr: any[] = [];
  for (let i = 0; i < len; i++) {
    prefix.push(String(i));
    const value = _resolve(obj[i], options, prefix, leaveEmpty);
    prefix.pop();

    if (value === undefined && !leaveEmpty) {
      continue;
    }
    arr.push(value);
  }

  return arr;
}

/**
 * Resolve an object's values. Uses push/pop on prefix to avoid array allocation per key.
 */
function resolveObject(obj: any, options: IResolveOptions, prefix: string[], leaveEmpty: boolean): any {
  const keys = Object.keys(obj);
  const result: any = {};
  let intrinsicKeyCtr = 0;

  for (let ki = 0; ki < keys.length; ki++) {
    const key = keys[ki];
    const raw = obj[key];

    // Fast path for leaf primitives: resolve them inline without prefix overhead.
    // Strings, numbers, booleans, null, undefined are the vast majority of values.
    let value: any;
    const rawType = typeof raw;
    if (rawType === 'string') {
      value = couldContainToken(raw) ? _resolveWithPrefix(raw, options, prefix, leaveEmpty, key) : raw;
    } else if (raw === undefined) {
      value = undefined;
    } else if (raw === null) {
      value = null;
    } else if (rawType === 'number') {
      value = (raw > -1e287 && raw < 1e287) ? raw : _resolveWithPrefix(raw, options, prefix, leaveEmpty, key);
    } else if (rawType === 'boolean') {
      value = raw;
    } else {
      // Complex value (object/array) — needs full resolution with prefix
      value = _resolveWithPrefix(raw, options, prefix, leaveEmpty, key);
    }

    // skip undefined
    if (value === undefined) {
      if (leaveEmpty) {
        result[key] = undefined;
      }
      continue;
    }

    // Fast path: keys shorter than 5 chars can't possibly be tokens.
    if (key.length < 5 || !couldContainToken(key)) {
      result[key] = value;
      continue;
    }

    // Slow path: key might be a token
    if (!unresolved(key)) {
      result[key] = value;
      continue;
    }

    const resolvedKey = makeContext(options, prefix).resolve(key);
    if (typeof(resolvedKey) === 'string') {
      result[resolvedKey] = value;
    } else {
      if (!options.allowIntrinsicKeys) {
        throw new UnscopedValidationError(lit`KeyMustResolveToString`, `"${String(key)}" is used as the key in a map so must resolve to a string, but it resolves to: ${JSON.stringify(resolvedKey)}. Consider using "CfnJson" to delay resolution to deployment-time`);
      }
      result[`${INTRINSIC_KEY_PREFIX}${intrinsicKeyCtr++}`] = [resolvedKey, value];
    }
  }

  // Retain type hints from previously resolved values
  const previousTypeHint = resolvedTypeHint(obj);
  return previousTypeHint ? tagResolvedValue(result, previousTypeHint) : result;
}

/** Helper: resolve with prefix push/pop */
function _resolveWithPrefix(raw: any, options: IResolveOptions, prefix: string[], leaveEmpty: boolean, key: string): any {
  prefix.push(key);
  const value = _resolve(raw, options, prefix, leaveEmpty);
  prefix.pop();
  return value;
}

/**
 * Create a resolution context. Only called when actually needed (token resolution).
 */
function makeContext(options: IResolveOptions, prefix: string[]): IResolveContext {
  // Snapshot the prefix since it's mutable
  const documentPath = prefix.slice();

  const context: IResolveContext = {
    preparing: options.preparing,
    scope: options.scope as IConstruct,
    documentPath,
    registerPostProcessor(pp) { (context as any)._postProcessor = pp; },
    resolve(x: any, changeOptions?: ResolveChangeContextOptions) {
      const newOptions = changeOptions ? { ...options, ...changeOptions, prefix: documentPath } : { ...options, prefix: documentPath };
      return resolve(x, newOptions);
    },
  };

  return context;
}

/**
 * Create a post-processor wrapper from a context.
 */
function makePostProcessor(context: IResolveContext): IPostProcessor {
  return {
    postProcess(x) {
      const pp = (context as any)._postProcessor;
      return pp ? pp.postProcess(x, context) : x;
    },
  };
}

/**
 * Find all Tokens that are used in the given structure
 */
export function findTokens(scope: IConstruct, fn: () => any): IResolvable[] {
  const resolver = new RememberingTokenResolver(new StringConcat());

  resolve(fn(), { scope, prefix: [], resolver, preparing: true });

  return resolver.tokens;
}

export function writePropertyAssignmentMetadataForConstruct(scope: IConstruct, fn: () => any, lookupTable: IPropertyNameLookupTable): void {
  const resolver = new PropertyAssignmentMetadataWriter(new StringConcat(), lookupTable);

  resolve(fn(), { scope, prefix: [], resolver, preparing: true });
}

export interface IPropertyNameLookupTable {
  cfnPropertyName(cdkPropertyName: string): string | undefined;
}

export class PropertyAssignmentMetadataWriter extends DefaultTokenResolver {
  private readonly lookupTable: IPropertyNameLookupTable;
  private readonly seenDocumentPaths = new Set<string>();

  constructor(concat: IFragmentConcatenator, lookupTable: IPropertyNameLookupTable) {
    super(concat);
    this.lookupTable = lookupTable;
  }

  public resolveToken(t: IResolvable, context: IResolveContext, postProcessor: IPostProcessor) {
    const result = super.resolveToken(t, context, postProcessor);
    const lookupTable = this.lookupTable;

    function propertyNameFromContext(ctx: IResolveContext): string | undefined {
      const documentPath = ctx.documentPath;
      // Expected pattern:
      //  ["Resources", "${Token[...]}", "Properties", "assumeRolePolicyDocument"]
      if (documentPath.length < 4 || documentPath[0] !== 'Resources' || documentPath[2] !== 'Properties') {
        return undefined;
      }
      return lookupTable.cfnPropertyName(documentPath[3]);
    }

    const propertyName = propertyNameFromContext(context);
    const documentPathKey = context.documentPath.join('/');
    if (Box.isBox(t) && propertyName && !this.seenDocumentPaths.has(documentPathKey)) {
      for (let stackTrace of t.getStackTraces()) {
        context.scope.node.addMetadata('aws:cdk:propertyAssignment', {
          propertyName,
          stackTrace,
        });
        this.seenDocumentPaths.add(documentPathKey);
      }
    }

    return result;
  }
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

function resolveNumberToken(x: number, context: IResolveContext): any {
  const token = tokenMap.lookupNumberToken(x);
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
