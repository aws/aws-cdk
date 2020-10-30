import { Lazy } from '../lazy';
import { DefaultTokenResolver, IFragmentConcatenator, IResolveContext } from '../resolvable';
import { isResolvableObject, Token } from '../token';
import { TokenMap } from './token-map';

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
    return Lazy.stringValue({
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
    if (parts.length === 2 && typeof parts[0] === 'string' && typeof parts[1] === 'string') {
      return parts[0] + parts[1];
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
 * Tokens will be resolved and if they resolve to CloudFormation intrinsics, the intrinsics
 * will be lifted to the top of a giant `{ Fn::Join}` expression.
 *
 * We are looking to do the following transforms:
 *
 * (a) Token in a string context
 *
 *     { "field": "a${TOKEN}b" } -> "{ \"field\": \"a" ++ resolve(TOKEN) ++ "b\" }"
 *     { "a${TOKEN}b": "value" } -> "{ \"a" ++ resolve(TOKEN) ++ "b\": \"value\" }"
 *
 * (b) Standalone token
 *
 *     { "field": TOKEN } ->
 *
 *         if TOKEN resolves to a string (or is a non-encoded or string-encoded intrinsic) ->
 *             "{ \"field\": \"" ++ resolve(TOKEN) ++ "\" }"
 *         if TOKEN resolves to a non-string (or is a non-string-encoded intrinsic)  ->
 *             "{ \"field\": " ++ resolve(TOKEN) ++ " }"
 *
 * (Where ++ is the CloudFormation string-concat operation (`{ Fn::Join }`).
 *
 * -------------------
 *
 * Here come complex type interpretation rules, which we are unable to simplify because
 * some clients our there are already taking dependencies on the unintended side effects
 * of the old implementation.
 *
 * 1. If TOKEN is embedded in a string with a prefix or postfix, we'll render the token
 *    as a string regardless of whether it returns an intrinsic or a literal.
 *
 * 2. If TOKEN resolves to an intrinsic:
 *     - We'll treat it as a string if the TOKEN itself was not encoded or string-encoded
 *       (this covers the 99% case of what CloudFormation intrinsics resolve to).
 *     - We'll treat it as a non-string otherwise; the intrinsic MUST resolve to a number;
 *        * if resolves to a list { Fn::Join } will fail
 *        * if it resolves to a string after all the JSON will be malformed at API call time.
 *
 * 3. Otherwise, the type of the value it resolves to (string, number, complex object, ...)
 *    determines how the value is rendered.
 */
function tokenAwareStringify(root: any, space: number, ctx: IResolveContext) {
  let indent = 0;

  const ret = new Array<Segment>();
  recurse(root);
  switch (ret.length) {
    case 0: return '';
    case 1: return renderSegment(ret[0]);
    default:
      return fnJoinConcat(ret.map(renderSegment));
  }

  /**
   * Stringify a JSON element
   */
  function recurse(obj: any): void {
    if (Token.isUnresolved(obj)) {
      return handleToken(obj);
    }
    if (Array.isArray(obj)) {
      return renderCollection('[', ']', obj, recurse);
    }
    if (typeof obj === 'object' && obj != null && !(obj instanceof Date)) {
      return renderCollection('{', '}', definedEntries(obj), ([key, value]) => {
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

  /**
   * Handle a Token.
   *
   * Can be any of:
   *
   * - Straight up IResolvable
   * - Encoded string, number or list
   */
  function handleToken(token: any) {
    if (typeof token === 'string') {
      // Encoded string, treat like a string if it has a token and at least one other
      // component, otherwise treat like a regular token and base the output quoting on the
      // type of the result.
      const fragments = TokenMap.instance().splitString(token);
      if (fragments.length > 1) {
        pushLiteral('"');
        fragments.visit({
          visitLiteral: pushLiteral,
          visitToken: (tok) => {
            const resolved = ctx.resolve(tok);
            if (isIntrinsic(resolved)) {
              pushIntrinsic(quoteInsideIntrinsic(resolved));
            } else {
              // We're already in a string context, so stringify and escape
              pushLiteral(quoteString(`${resolved}`));
            }
          },
          // This potential case is the result of poor modeling in the tokenized string, it should not happen
          visitIntrinsic: () => { throw new Error('Intrinsic not expected in a freshly-split string'); },
        });
        pushLiteral('"');
        return;
      }
    }

    const resolved = ctx.resolve(token);
    if (isIntrinsic(resolved)) {
      if (isResolvableObject(token) || typeof token === 'string') {
        // If the input was an unencoded IResolvable or a string-encoded value,
        // treat it like it was a string (for the 99% case)
        pushLiteral('"');
        pushIntrinsic(quoteInsideIntrinsic(resolved));
        pushLiteral('"');
      } else {
        pushIntrinsic(resolved);
      }
      return;
    }

    // Otherwise we got an arbitrary JSON structure from the token, recurse
    recurse(resolved);
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
    } else if (i > 0 && isPlainString(values[i - 1]) && isPlainString(values[i])) {
      values[i - 1] += delimiter + values[i];
      values.splice(i, 1);
    } else {
      i += 1;
    }
  }

  return values;

  function isPlainString(obj: any): boolean {
    return typeof obj === 'string' && !Token.isUnresolved(obj);
  }

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
 */
function quoteInsideIntrinsic(x: any): any {
  if (typeof x === 'object' && x != null && Object.keys(x).length === 1) {
    const key = Object.keys(x)[0];
    const params = x[key];
    switch (key) {
      case 'Fn::If':
        return { 'Fn::If': [params[0], quoteInsideIntrinsic(params[1]), quoteInsideIntrinsic(params[2])] };
      case 'Fn::Join':
        return { 'Fn::Join': [quoteInsideIntrinsic(params[0]), params[1].map(quoteInsideIntrinsic)] };
      case 'Fn::Sub':
        if (Array.isArray(params)) {
          return { 'Fn::Sub': [quoteInsideIntrinsic(params[0]), params[1]] };
        } else {
          return { 'Fn::Sub': quoteInsideIntrinsic(params[0]) };
        }
    }
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