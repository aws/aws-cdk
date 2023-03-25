import { CfnUtils } from './cfn-utils-provider';
import { INTRINSIC_KEY_PREFIX, resolvedTypeHint } from './resolve';
import { Lazy } from '../lazy';
import { DefaultTokenResolver, IFragmentConcatenator, IResolveContext } from '../resolvable';
import { Stack } from '../stack';
import { Token } from '../token';
import { ResolutionTypeHint } from '../type-hints';

/**
 * Routines that know how to do operations at the CloudFormation document language level
 */
export class CloudFormationLang {
  /**
   * Turn an arbitrary structure potentially containing Tokens into a JSON string.
   *
   * Returns a Token which will evaluate to CloudFormation expression that
   * will be evaluated by CloudFormation to the JSON representation of the
   * input structure.
   *
   * All Tokens substituted in this way must return strings, or the evaluation
   * in CloudFormation will fail.
   *
   * @param obj The object to stringify
   * @param space Indentation to use (default: no pretty-printing)
   */
  public static toJSON(obj: any, space?: number): string {
    return Lazy.uncachedString({
      // We used to do this by hooking into `JSON.stringify()` by adding in objects
      // with custom `toJSON()` functions, but it's ultimately simpler just to
      // reimplement the `stringify()` function from scratch.
      produce: (ctx) => tokenAwareStringify(obj, space ?? 0, ctx),
    });
  }

  /**
   * Produce a CloudFormation expression to concat two arbitrary expressions when resolving
   */
  public static concat(left: any | undefined, right: any | undefined): any {
    if (left === undefined && right === undefined) { return ''; }

    const parts = new Array<any>();
    if (left !== undefined) { parts.push(left); }
    if (right !== undefined) { parts.push(right); }

    // Some case analysis to produce minimal expressions
    if (parts.length === 1) { return parts[0]; }
    if (parts.length === 2 && isConcatable(parts[0]) && isConcatable(parts[1])) {
      return `${parts[0]}${parts[1]}`;
    }

    // Otherwise return a Join intrinsic (already in the target document language to avoid taking
    // circular dependencies on FnJoin & friends)
    return fnJoinConcat(parts);
  }
}

/**
 * Return a CFN intrinsic mass concatting any number of CloudFormation expressions
 */
function fnJoinConcat(parts: any[]) {
  return { 'Fn::Join': ['', minimalCloudFormationJoin('', parts)] };
}

/**
 * Perform a JSON.stringify()-like operation, except aware of Tokens and CloudFormation intrincics
 *
 * Tokens will be resolved and if any resolve to CloudFormation intrinsics, the intrinsics
 * will be lifted to the top of a giant `{ Fn::Join }` expression.
 *
 * If Tokens resolve to primitive types (for example, by using Lazies), we'll
 * use the primitive type to determine how to encode the value into the JSON.
 *
 * If Tokens resolve to CloudFormation intrinsics, we'll use the type of the encoded
 * value as a type hint to determine how to encode the value into the JSON. The difference
 * is that we add quotes (") around strings, and don't add anything around non-strings.
 *
 * The following structure:
 *
 *    { SomeAttr: resource.someAttr }
 *
 * Will JSONify to either:
 *
 *    '{ "SomeAttr": "' ++ { Fn::GetAtt: [Resource, SomeAttr] } ++ '" }'
 * or '{ "SomeAttr": ' ++ { Fn::GetAtt: [Resource, SomeAttr] } ++ ' }'
 *
 * Depending on whether `someAttr` is type-hinted to be a string or not.
 *
 * (Where ++ is the CloudFormation string-concat operation (`{ Fn::Join }`).
 *
 * -----------------------
 *
 * This work requires 2 features from the `resolve()` function:
 *
 * - INTRINSICS TYPE HINTS: intrinsics are represented by values like
 *   `{ Ref: 'XYZ' }`. These values can reference either a string or a list/number at
 *   deploy time, and from the value alone there's no way to know which. We need
 *   to know the type to know whether to JSONify this reference to:
 *
 *      '{ "referencedValue": "' ++ { Ref: XYZ } ++ '"}'
 *   or '{ "referencedValue": ' ++ { Ref: XYZ } ++ '}'
 *
 *   I.e., whether or not we need to enclose the reference in quotes or not.
 *
 *   We COULD have done this by resolving one token at a time, and looking at the
 *   type of the encoded token we were resolving to obtain a type hint. However,
 *   the `resolve()` and Token system resist a level-at-a-time resolve
 *   operation: because of the existence of post-processors, we must have done a
 *   complete recursive resolution of a token before we can look at its result
 *   (after which any type information about the sources of nested resolved
 *   values is lost).
 *
 *   To fix this, "type hints" have been added to the `resolve()` function,
 *   giving an idea of the type of the source value for compplex result values.
 *   This only works for objects (not strings and numbers) but fortunately
 *   we only care about the types of intrinsics, which are always complex values.
 *
 *   Type hinting could have been added to the `IResolvable` protocol as well,
 *   but for now we just use the type of an encoded value as a type hint. That way
 *   we don't need to annotate anything more at the L1 level--we will use the type
 *   encodings added by construct authors at the L2 levels. L1 users can escape the
 *   default decision of "string" by using `Token.asList()`.
 *
 * - COMPLEX KEYS: since tokens can be string-encoded, we can use string-encoded tokens
 *   as the keys in JavaScript objects. However, after resolution, those string-encoded
 *   tokens could resolve to intrinsics (`{ Ref: ... }`), which CANNOT be stored in
 *   JavaScript objects anymore.
 *
 *   We therefore need a protocol to store the resolved values somewhere in the JavaScript
 *   type model,  which can be returned by `resolve()`, and interpreted by `tokenAwareStringify()`
 *   to produce the correct JSON.
 *
 *   And example will quickly show the point:
 *
 *    User writes:
 *       { [resource.resourceName]: 'SomeValue' }
 *    ------ string actually looks like ------>
 *       { '${Token[1234]}': 'SomeValue' }
 *    ------ resolve ------->
 *       { '$IntrinsicKey$0': [ {Ref: Resource}, 'SomeValue' ] }
 *    ------ tokenAwareStringify ------->
 *       '{ "' ++ { Ref: Resource } ++ '": "SomeValue" }'
 */
function tokenAwareStringify(root: any, space: number, ctx: IResolveContext) {
  let indent = 0;

  const ret = new Array<Segment>();

  // First completely resolve the tree, then encode to JSON while respecting the type
  // hints we got for the resolved intrinsics.
  recurse(ctx.resolve(root, { allowIntrinsicKeys: true }));

  switch (ret.length) {
    case 0: return undefined;
    case 1: return renderSegment(ret[0]);
    default:
      return fnJoinConcat(ret.map(renderSegment));
  }

  /**
   * Stringify a JSON element
   */
  function recurse(obj: any): void {
    if (obj === undefined) { return; }

    if (Token.isUnresolved(obj)) {
      throw new Error('This shouldnt happen anymore');
    }
    if (Array.isArray(obj)) {
      return renderCollection('[', ']', obj, recurse);
    }
    if (typeof obj === 'object' && obj != null && !(obj instanceof Date)) {
      // Treat as an intrinsic if this LOOKS like a CFN intrinsic (`{ Ref: ... }`)
      // AND it's the result of a token resolution. Otherwise, we just treat this
      // value as a regular old JSON object (that happens to look a lot like an intrinsic).
      if (isIntrinsic(obj) && resolvedTypeHint(obj)) {
        renderIntrinsic(obj);
        return;
      }

      return renderCollection('{', '}', definedEntries(obj), ([key, value]) => {
        if (key.startsWith(INTRINSIC_KEY_PREFIX)) {
          [key, value] = value;
        }

        recurse(key);
        pushLiteral(prettyPunctuation(':'));
        recurse(value);
      });
    }
    // Otherwise we have a scalar, defer to JSON.stringify()s serialization
    pushLiteral(JSON.stringify(obj));
  }

  /**
   * Render an object or list
   */
  function renderCollection<A>(pre: string, post: string, xs: Iterable<A>, each: (x: A) => void) {
    pushLiteral(pre);
    indent += space;
    let atLeastOne = false;
    for (const [comma, item] of sepIter(xs)) {
      if (comma) { pushLiteral(','); }
      pushLineBreak();
      each(item);
      atLeastOne = true;
    }
    indent -= space;
    if (atLeastOne) { pushLineBreak(); }
    pushLiteral(post);
  }

  function renderIntrinsic(intrinsic: any) {
    switch (resolvedTypeHint(intrinsic)) {
      case ResolutionTypeHint.STRING:
        pushLiteral('"');
        pushIntrinsic(deepQuoteStringLiterals(intrinsic));
        pushLiteral('"');
        return;

      case ResolutionTypeHint.STRING_LIST:
        // We need this to look like:
        //
        //    '{"listValue":' ++ STRINGIFY(CFN_EVAL({ Ref: MyList })) ++ '}'
        //
        // However, STRINGIFY would need to execute at CloudFormation deployment time, and that doesn't exist.
        //
        // We could *ALMOST* use:
        //
        //   '{"listValue":["' ++ JOIN('","', { Ref: MyList }) ++ '"]}'
        //
        // But that has the unfortunate side effect that if `CFN_EVAL({ Ref: MyList }) == []`, then it would
        // evaluate to `[""]`, which is a different value. Since CloudFormation does not have arbitrary
        // conditionals there's no way to deal with this case properly.
        //
        // Therefore, if we encounter lists we need to defer to a custom resource to handle
        // them properly at deploy time.
        const stack = Stack.of(ctx.scope);

        // Because this will be called twice (once during `prepare`, once during `resolve`),
        // we need to make sure to be idempotent, so use a cache.
        const stringifyResponse = stringifyCache.obtain(stack, JSON.stringify(intrinsic), () =>
          CfnUtils.stringify(stack, `CdkJsonStringify${stringifyCounter++}`, intrinsic),
        );

        pushIntrinsic(stringifyResponse);
        return;

      case ResolutionTypeHint.NUMBER:
        pushIntrinsic(intrinsic);
        return;
    }

    throw new Error(`Unexpected type hint: ${resolvedTypeHint(intrinsic)}`);
  }

  /**
   * Push a literal onto the current segment if it's also a literal, otherwise open a new Segment
   */
  function pushLiteral(lit: string) {
    let last = ret[ret.length - 1];
    if (last?.type !== 'literal') {
      last = { type: 'literal', parts: [] };
      ret.push(last);
    }
    last.parts.push(lit);
  }

  /**
   * Add a new intrinsic segment
   */
  function pushIntrinsic(intrinsic: any) {
    ret.push({ type: 'intrinsic', intrinsic });
  }

  /**
   * Push a line break if we are pretty-printing, otherwise don't
   */
  function pushLineBreak() {
    if (space > 0) {
      pushLiteral(`\n${' '.repeat(indent)}`);
    }
  }

  /**
   * Add a space after the punctuation if we are pretty-printing, no space if not
   */
  function prettyPunctuation(punc: string) {
    return space > 0 ? `${punc} ` : punc;
  }
}

/**
 * A Segment is either a literal string or a CloudFormation intrinsic
 */
type Segment = { type: 'literal'; parts: string[] } | { type: 'intrinsic'; intrinsic: any };

/**
 * Render a segment
 */
function renderSegment(s: Segment): NonNullable<any> {
  switch (s.type) {
    case 'literal': return s.parts.join('');
    case 'intrinsic': return s.intrinsic;
  }
}

const CLOUDFORMATION_CONCAT: IFragmentConcatenator = {
  join(left: any, right: any) {
    return CloudFormationLang.concat(left, right);
  },
};

/**
 * Default Token resolver for CloudFormation templates
 */
export const CLOUDFORMATION_TOKEN_RESOLVER = new DefaultTokenResolver(CLOUDFORMATION_CONCAT);

/**
 * Do an intelligent CloudFormation join on the given values, producing a minimal expression
 */
export function minimalCloudFormationJoin(delimiter: string, values: any[]): any[] {
  let i = 0;
  while (i < values.length) {
    const el = values[i];
    if (isSplicableFnJoinIntrinsic(el)) {
      values.splice(i, 1, ...el['Fn::Join'][1]);
    } else if (i > 0 && isConcatable(values[i - 1]) && isConcatable(values[i])) {
      values[i - 1] = `${values[i-1]}${delimiter}${values[i]}`;
      values.splice(i, 1);
    } else {
      i += 1;
    }
  }

  return values;

  function isSplicableFnJoinIntrinsic(obj: any): boolean {
    if (!isIntrinsic(obj)) { return false; }
    if (Object.keys(obj)[0] !== 'Fn::Join') { return false; }

    const [delim, list] = obj['Fn::Join'];
    if (delim !== delimiter) { return false; }

    if (Token.isUnresolved(list)) { return false; }
    if (!Array.isArray(list)) { return false; }

    return true;
  }
}

function isConcatable(obj: any): boolean {
  return ['string', 'number'].includes(typeof obj) && !Token.isUnresolved(obj);
}


/**
 * Return whether the given value represents a CloudFormation intrinsic
 */
function isIntrinsic(x: any) {
  if (Array.isArray(x) || x === null || typeof x !== 'object') { return false; }

  const keys = Object.keys(x);
  if (keys.length !== 1) { return false; }

  return keys[0] === 'Ref' || isNameOfCloudFormationIntrinsic(keys[0]);
}

export function isNameOfCloudFormationIntrinsic(name: string): boolean {
  if (!name.startsWith('Fn::')) {
    return false;
  }
  // these are 'fake' intrinsics, only usable inside the parameter overrides of a CFN CodePipeline Action
  return name !== 'Fn::GetArtifactAtt' && name !== 'Fn::GetParam';
}

/**
 * Separated iterator
 */
function* sepIter<A>(xs: Iterable<A>): IterableIterator<[boolean, A]> {
  let comma = false;
  for (const item of xs) {
    yield [comma, item];
    comma = true;
  }
}

/**
 * Object.entries() but skipping undefined values
 */
function* definedEntries<A extends object>(xs: A): IterableIterator<[string, any]> {
  for (const [key, value] of Object.entries(xs)) {
    if (value !== undefined) {
      yield [key, value];
    }
  }
}

/**
 * Quote string literals inside an intrinsic
 *
 * Formally, this should only match string literals that will be interpreted as
 * string literals. Fortunately, the strings that should NOT be quoted are
 * Logical IDs and attribute names, which cannot contain quotes anyway. Hence,
 * we can get away not caring about the distinction and just quoting everything.
 */
function deepQuoteStringLiterals(x: any): any {
  if (Array.isArray(x)) {
    return x.map(deepQuoteStringLiterals);
  }
  if (typeof x === 'object' && x != null) {
    const ret: any = {};
    for (const [key, value] of Object.entries(x)) {
      ret[deepQuoteStringLiterals(key)] = deepQuoteStringLiterals(value);
    }
    return ret;
  }
  if (typeof x === 'string') {
    return quoteString(x);
  }
  return x;
}

/**
 * Quote the characters inside a string, for use inside toJSON
 */
function quoteString(s: string) {
  s = JSON.stringify(s);
  return s.substring(1, s.length - 1);
}

let stringifyCounter = 1;

/**
 * A cache scoped to object instances, that's maintained externally to the object instances
 */
class ScopedCache<O extends object, K, V> {
  private cache = new WeakMap<O, Map<K, V>>();

  public obtain(object: O, key: K, init: () => V): V {
    let kvMap = this.cache.get(object);
    if (!kvMap) {
      kvMap = new Map();
      this.cache.set(object, kvMap);
    }

    let ret = kvMap.get(key);
    if (ret === undefined) {
      ret = init();
      kvMap.set(key, ret);
    }
    return ret;
  }
}

const stringifyCache = new ScopedCache<Stack, string, string>();
