import { resolve } from "./resolve";
import { ResolveContext, Token } from "./token";
import { unresolved } from "./unresolved";

// Encoding Tokens into native types; should not be exported

/**
 * Central place where we keep a mapping from Tokens to their String representation
 *
 * The string representation is used to embed token into strings,
 * and stored to be able to
 *
 * All instances of TokenStringMap share the same storage, so that this process
 * works even when different copies of the library are loaded.
 */
export class TokenMap {
  private readonly tokenMap = new Map<string, Token>();

  /**
   * Generate a unique string for this Token, returning a key
   *
   * Every call for the same Token will produce a new unique string, no
   * attempt is made to deduplicate. Token objects should cache the
   * value themselves, if required.
   *
   * The token can choose (part of) its own representation string with a
   * hint. This may be used to produce aesthetically pleasing and
   * recognizable token representations for humans.
   */
  public registerString(token: Token, representationHint?: string): string {
    const key = this.register(token, representationHint);
    return `${BEGIN_STRING_TOKEN_MARKER}${key}${END_TOKEN_MARKER}`;
  }

  /**
   * Generate a unique string for this Token, returning a key
   */
  public registerList(token: Token, representationHint?: string): string[] {
    const key = this.register(token, representationHint);
    return [`${BEGIN_LIST_TOKEN_MARKER}${key}${END_TOKEN_MARKER}`];
  }

  /**
   * Returns a `TokenString` for this string.
   */
  public createStringTokenString(s: string) {
    return new TokenString(s, QUOTED_BEGIN_STRING_TOKEN_MARKER, `[${VALID_KEY_CHARS}]+`, QUOTED_END_TOKEN_MARKER);
  }

  /**
   * Returns a `TokenString` for this string.
   */
  public createListTokenString(s: string) {
    return new TokenString(s, QUOTED_BEGIN_LIST_TOKEN_MARKER, `[${VALID_KEY_CHARS}]+`, QUOTED_END_TOKEN_MARKER);
  }

  /**
   * Replace any Token markers in this string with their resolved values
   */
  public resolveStringTokens(s: string, context: ResolveContext): any {
    const str = this.createStringTokenString(s);
    const fragments = str.split(this.lookupToken.bind(this));
    // require() here to break cyclic dependencies
    const ret = fragments.mapUnresolved(x => resolve(x, context)).join(require('./cfn-concat').cloudFormationConcat);
    if (unresolved(ret)) {
      return resolve(ret, context);
    }
    return ret;
  }

  public resolveListTokens(xs: string[], context: ResolveContext): any {
    // Must be a singleton list token, because concatenation is not allowed.
    if (xs.length !== 1) {
      throw new Error(`Cannot add elements to list token, got: ${xs}`);
    }

    const str = this.createListTokenString(xs[0]);
    const fragments = str.split(this.lookupToken.bind(this));
    if (fragments.length !== 1) {
      throw new Error(`Cannot concatenate strings in a tokenized string array, got: ${xs[0]}`);
    }
    return fragments.mapUnresolved(x => resolve(x, context)).values[0];
  }

  /**
   * Find a Token by key
   */
  public lookupToken(key: string): Token {
    const token = this.tokenMap.get(key);
    if (!token) {
      throw new Error(`Unrecognized token key: ${key}`);
    }
    return token;
  }

  private register(token: Token, representationHint?: string): string {
    const counter = this.tokenMap.size;
    const representation = (representationHint || `TOKEN`).replace(new RegExp(`[^${VALID_KEY_CHARS}]`, 'g'), '.');
    const key = `${representation}.${counter}`;
    this.tokenMap.set(key, token);
    return key;
  }
}

const BEGIN_STRING_TOKEN_MARKER = '${Token[';
const BEGIN_LIST_TOKEN_MARKER = '#{Token[';
const END_TOKEN_MARKER = ']}';

const QUOTED_BEGIN_STRING_TOKEN_MARKER = regexQuote(BEGIN_STRING_TOKEN_MARKER);
const QUOTED_BEGIN_LIST_TOKEN_MARKER = regexQuote(BEGIN_LIST_TOKEN_MARKER);
const QUOTED_END_TOKEN_MARKER = regexQuote(END_TOKEN_MARKER);

const VALID_KEY_CHARS = 'a-zA-Z0-9:._-';

/**
 * Interface that Token joiners implement
 */
export interface ITokenJoiner {
  /**
   * The name of the joiner.
   *
   * Must be unique per joiner: this value will be used to assert that there
   * is exactly only type of joiner in a join operation.
   */
  id: string;

  /**
   * Return the language intrinsic that will combine the strings in the given engine
   */
  join(fragments: any[]): any;
}

/**
 * A string with markers in it that can be resolved to external values
 */
class TokenString {
  private pattern: string;

  constructor(
    private readonly str: string,
    quotedBeginMarker: string,
    idPattern: string,
    quotedEndMarker: string) {
    this.pattern = `${quotedBeginMarker}(${idPattern})${quotedEndMarker}`;
  }

  /**
   * Split string on markers, substituting markers with Tokens
   */
  public split(lookup: (id: string) => Token): TokenizedStringFragments {
    const re = new RegExp(this.pattern, 'g');
    const ret = new TokenizedStringFragments();

    let rest = 0;
    let m = re.exec(this.str);
    while (m) {
      if (m.index > rest) {
        ret.addLiteral(this.str.substring(rest, m.index));
      }

      ret.addUnresolved(lookup(m[1]));

      rest = re.lastIndex;
      m = re.exec(this.str);
    }

    if (rest < this.str.length) {
      ret.addLiteral(this.str.substring(rest));
    }

    return ret;
  }

  /**
   * Indicates if this string includes tokens.
   */
  public test(): boolean {
    const re = new RegExp(this.pattern, 'g');
    return re.test(this.str);
  }
}

/**
 * Result of the split of a string with Tokens
 *
 * Either a literal part of the string, or an unresolved Token.
 */
type LiteralFragment = { type: 'literal'; lit: any; };
type UnresolvedFragment = { type: 'unresolved'; token: any; };
type Fragment =  LiteralFragment | UnresolvedFragment;

/**
 * Fragments of a string with markers
 */
class TokenizedStringFragments {
  private readonly fragments = new Array<Fragment>();

  public get length() {
    return this.fragments.length;
  }

  public get values(): any[] {
    return this.fragments.map(f => f.type === 'unresolved' ? f.token : f.lit);
  }

  public addLiteral(lit: any) {
    this.fragments.push({ type: 'literal', lit });
  }

  public addUnresolved(token: Token) {
    this.fragments.push({ type: 'unresolved', token });
  }

  public mapUnresolved(fn: (t: any) => any): TokenizedStringFragments {
    const ret = new TokenizedStringFragments();

    for (const f of this.fragments) {
      switch (f.type) {
        case 'literal':
          ret.addLiteral(f.lit);
          break;
        case 'unresolved':
          const mappedToken = fn(f.token);

          if (unresolved(mappedToken)) {
            ret.addUnresolved(mappedToken);
          } else {
            ret.addLiteral(mappedToken);
          }
          break;
      }
    }

    return ret;
  }

  /**
   * Combine the resolved string fragments using the Tokens to join.
   *
   * Resolves the result.
   */
  public join(concat: ConcatFunc): any {
    if (this.fragments.length === 0) { return concat(undefined, undefined); }

    const values = this.fragments.map(fragmentValue);

    while (values.length > 1) {
      const prefix = values.splice(0, 2);
      values.splice(0, 0, concat(prefix[0], prefix[1]));
    }

    return values[0];
  }
}

/**
 * Resolve the value from a single fragment
 */
function fragmentValue(fragment: Fragment): any {
  return fragment.type === 'literal' ? fragment.lit : fragment.token;
}

/**
 * Quote a string for use in a regex
 */
function regexQuote(s: string) {
  return s.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}

/**
 * Function used to concatenate symbols in the target document language
 */
export type ConcatFunc = (left: any | undefined, right: any | undefined) => any;

const glob = global as any;

/**
 * Singleton instance of the token string map
 */
export const TOKEN_MAP: TokenMap = glob.__cdkTokenMap = glob.__cdkTokenMap || new TokenMap();

export function isListToken(x: any) {
    return typeof(x) === 'string' && TOKEN_MAP.createListTokenString(x).test();
}

export function containsListToken(xs: any[]) {
  return xs.some(isListToken);
}