import { RESOLVE_METHOD, Token } from "./token";

// Details for encoding and decoding Tokens into native types; should not be exported

export const BEGIN_STRING_TOKEN_MARKER = '${Token[';
export const BEGIN_LIST_TOKEN_MARKER = '#{Token[';
export const END_TOKEN_MARKER = ']}';

export const VALID_KEY_CHARS = 'a-zA-Z0-9:._-';

const QUOTED_BEGIN_STRING_TOKEN_MARKER = regexQuote(BEGIN_STRING_TOKEN_MARKER);
const QUOTED_BEGIN_LIST_TOKEN_MARKER = regexQuote(BEGIN_LIST_TOKEN_MARKER);
const QUOTED_END_TOKEN_MARKER = regexQuote(END_TOKEN_MARKER);

const STRING_TOKEN_REGEX = new RegExp(`${QUOTED_BEGIN_STRING_TOKEN_MARKER}([${VALID_KEY_CHARS}]+)${QUOTED_END_TOKEN_MARKER}`, 'g');
const LIST_TOKEN_REGEX = new RegExp(`${QUOTED_BEGIN_LIST_TOKEN_MARKER}([${VALID_KEY_CHARS}]+)${QUOTED_END_TOKEN_MARKER}`, 'g');

/**
 * A string with markers in it that can be resolved to external values
 */
export class TokenString {
  /**
   * Returns a `TokenString` for this string.
   */
  public static forStringToken(s: string) {
    return new TokenString(s, STRING_TOKEN_REGEX);
  }

  /**
   * Returns a `TokenString` for this string (must be the first string element of the list)
   */
  public static forListToken(s: string) {
    return new TokenString(s, LIST_TOKEN_REGEX);
  }

  constructor(private readonly str: string, private readonly re: RegExp) {
  }

  /**
   * Split string on markers, substituting markers with Tokens
   */
  public split(lookup: (id: string) => Token): TokenizedStringFragments {
    const ret = new TokenizedStringFragments();

    let rest = 0;
    this.re.lastIndex = 0; // Reset
    let m = this.re.exec(this.str);
    while (m) {
      if (m.index > rest) {
        ret.addLiteral(this.str.substring(rest, m.index));
      }

      ret.addToken(lookup(m[1]));

      rest = this.re.lastIndex;
      m = this.re.exec(this.str);
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
    this.re.lastIndex = 0; // Reset
    return this.re.test(this.str);
  }
}

/**
 * Result of the split of a string with Tokens
 *
 * Either a literal part of the string, or an unresolved Token.
 */
type LiteralFragment = { type: 'literal'; lit: any; };
type TokenFragment = { type: 'token'; token: Token; };
type IntrinsicFragment = { type: 'intrinsic'; value: any; };
type Fragment =  LiteralFragment | TokenFragment | IntrinsicFragment;

/**
 * Fragments of a string with markers
 */
class TokenizedStringFragments {
  public readonly fragments = new Array<Fragment>();

  public get firstFragment(): Fragment {
    return this.fragments[0];
  }

  public get firstValue(): any {
    return fragmentValue(this.fragments[0]);
  }

  public get length() {
    return this.fragments.length;
  }

  public addLiteral(lit: any) {
    this.fragments.push({ type: 'literal', lit });
  }

  public addToken(token: Token) {
    this.fragments.push({ type: 'token', token });
  }

  public addIntrinsic(value: any) {
    this.fragments.push({ type: 'intrinsic', value });
  }

  public mapTokens(fn: (t: any) => any): TokenizedStringFragments {
    const ret = new TokenizedStringFragments();

    for (const f of this.fragments) {
      switch (f.type) {
        case 'literal':
          ret.addLiteral(f.lit);
          break;
        case 'token':
          const mapped = fn(f.token);
          if (isTokenObject(mapped)) {
            ret.addToken(mapped);
          } else {
            ret.addIntrinsic(mapped);
          }
          break;
        case 'intrinsic':
          ret.addIntrinsic(f.value);
          break;
      }
    }

    return ret;
  }

  /**
   * Combine the string fragments using the given joiner.
   *
   * If there are any
   */
  public join(concat: IFragmentConcatenator): any {
    if (this.fragments.length === 0) { return concat.join(undefined, undefined); }
    if (this.fragments.length === 1) { return this.firstValue; }

    const values = this.fragments.map(fragmentValue);

    while (values.length > 1) {
      const prefix = values.splice(0, 2);
      values.splice(0, 0, concat.join(prefix[0], prefix[1]));
    }

    return values[0];
  }
}

/**
 * Resolve the value from a single fragment
 *
 * If the fragment is a Token, return the string encoding of the Token.
 */
function fragmentValue(fragment: Fragment): any {
  switch (fragment.type) {
    case 'literal': return fragment.lit;
    case 'token': return fragment.token.toString();
    case 'intrinsic': return fragment.value;
  }
}

/**
 * Quote a string for use in a regex
 */
function regexQuote(s: string) {
  return s.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
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
 * Concatenator that disregards the input
 *
 * Can be used when traversing the tokens is important, but the
 * result isn't.
 */
export class NullConcat implements IFragmentConcatenator {
  public join(_left: any | undefined, _right: any | undefined): any {
    return undefined;
  }
}

/**
 * Converts all fragments to strings and concats those
 *
 * Drops 'undefined's.
 */
export class StringConat implements IFragmentConcatenator {
  public join(left: any | undefined, right: any | undefined): any {
    if (left === undefined) { return right !== undefined ? `${right}` : undefined; }
    if (right === undefined) { return `${left}`; }
    return `${left}${right}`;
  }
}

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

/**
 * Whether x is literally a Token object
 *
 * Can't use Token.isToken() because that has been co-opted
 * to mean something else.
 */
function isTokenObject(x: any): x is Token {
  return typeof(x) === 'object' && x !== null && Token.isToken(x);
}