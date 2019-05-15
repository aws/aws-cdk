import { IFragmentConcatenator } from "./resolve";
import { TokenizedStringFragments } from "./string-fragments";
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
 * Quote a string for use in a regex
 */
function regexQuote(s: string) {
  return s.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
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
