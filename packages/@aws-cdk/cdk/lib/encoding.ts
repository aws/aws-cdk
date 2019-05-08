import { RESOLVE_METHOD, Token } from "./token";

// Details for encoding and decoding Tokens into native types; should not be exported

export const BEGIN_STRING_TOKEN_MARKER = '${Token[';
export const BEGIN_LIST_TOKEN_MARKER = '#{Token[';
export const END_TOKEN_MARKER = ']}';

export const VALID_KEY_CHARS = 'a-zA-Z0-9:._-';

const QUOTED_BEGIN_STRING_TOKEN_MARKER = regexQuote(BEGIN_STRING_TOKEN_MARKER);
const QUOTED_BEGIN_LIST_TOKEN_MARKER = regexQuote(BEGIN_LIST_TOKEN_MARKER);
const QUOTED_END_TOKEN_MARKER = regexQuote(END_TOKEN_MARKER);

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
export class TokenString {
  /**
   * Returns a `TokenString` for this string.
   */
  public static forStringToken(s: string) {
    return new TokenString(s, QUOTED_BEGIN_STRING_TOKEN_MARKER, `[${VALID_KEY_CHARS}]+`, QUOTED_END_TOKEN_MARKER);
  }

  /**
   * Returns a `TokenString` for this string (must be the first string element of the list)
   */
  public static forListToken(s: string) {
    return new TokenString(s, QUOTED_BEGIN_LIST_TOKEN_MARKER, `[${VALID_KEY_CHARS}]+`, QUOTED_END_TOKEN_MARKER);
  }

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

export function containsListTokenElement(xs: any[]) {
  return xs.some(x => typeof(x) === 'string' && TokenString.forListToken(x).test());
}

/**
 * Returns true if obj is a token (i.e. has the resolve() method or is a string
 * that includes token markers), or it's a listifictaion of a Token string.
 *
 * @param obj The object to test.
 * @deprecated use `Token.unresolved`
 */
export function unresolved(obj: any): boolean {
  if (typeof(obj) === 'string') {
    return TokenString.forStringToken(obj).test();
  } else if (Array.isArray(obj) && obj.length === 1) {
    return typeof(obj[0]) === 'string' && TokenString.forListToken(obj[0]).test();
  } else {
    return obj && typeof(obj[RESOLVE_METHOD]) === 'function';
  }
}