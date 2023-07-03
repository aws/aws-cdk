import { IFragmentConcatenator, IResolvable } from '../resolvable';
import { TokenizedStringFragments } from '../string-fragments';
import { isResolvableObject } from '../token';

// Details for encoding and decoding Tokens into native types; should not be exported

export const BEGIN_STRING_TOKEN_MARKER = '${Token[';
export const BEGIN_LIST_TOKEN_MARKER = '#{Token[';
export const END_TOKEN_MARKER = ']}';

export const VALID_KEY_CHARS = 'a-zA-Z0-9:._-';

const QUOTED_BEGIN_STRING_TOKEN_MARKER = regexQuote(BEGIN_STRING_TOKEN_MARKER);
const QUOTED_BEGIN_LIST_TOKEN_MARKER = regexQuote(BEGIN_LIST_TOKEN_MARKER);
const QUOTED_END_TOKEN_MARKER = regexQuote(END_TOKEN_MARKER);

// Sometimes the number of digits is different
export const STRINGIFIED_NUMBER_PATTERN = '-1\\.\\d{10,16}e\\+289';

const STRING_TOKEN_REGEX = new RegExp(`${QUOTED_BEGIN_STRING_TOKEN_MARKER}([${VALID_KEY_CHARS}]+)${QUOTED_END_TOKEN_MARKER}|(${STRINGIFIED_NUMBER_PATTERN})`, 'g');
const LIST_TOKEN_REGEX = new RegExp(`${QUOTED_BEGIN_LIST_TOKEN_MARKER}([${VALID_KEY_CHARS}]+)${QUOTED_END_TOKEN_MARKER}`, 'g');

/**
 * A string with markers in it that can be resolved to external values
 */
export class TokenString {
  /**
   * Returns a `TokenString` for this string.
   */
  public static forString(s: string) {
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
  public split(lookup: (id: string) => IResolvable): TokenizedStringFragments {
    const ret = new TokenizedStringFragments();

    let rest = 0;
    this.re.lastIndex = 0; // Reset
    let m = this.re.exec(this.str);
    while (m) {
      if (m.index > rest) {
        ret.addLiteral(this.str.substring(rest, m.index));
      }

      ret.addToken(lookup(m[1] ?? m[2]));

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
export function regexQuote(s: string) {
  return s.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
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
 */
export function unresolved(obj: any): boolean {
  if (typeof(obj) === 'string') {
    return TokenString.forString(obj).test();
  } else if (typeof obj === 'number') {
    return extractTokenDouble(obj) !== undefined;
  } else if (Array.isArray(obj) && obj.length === 1) {
    return typeof(obj[0]) === 'string' && TokenString.forListToken(obj[0]).test();
  } else {
    return isResolvableObject(obj);
  }
}

/**
 * Bit pattern in the top 16 bits of a double to indicate a Token
 *
 * An IEEE double in LE memory order looks like this (grouped
 * into octets, then grouped into 32-bit words):
 *
 * mmmmmmmm.mmmmmmmm.mmmmmmmm.mmmmmmmm | mmmmmmmm.mmmmmmmm.EEEEmmmm.sEEEEEEE
 *
 * - m: mantissa (52 bits)
 * - E: exponent (11 bits)
 * - s: sign (1 bit)
 *
 * We put the following marker into the top 16 bits (exponent and sign), and
 * use the mantissa part to encode the token index. To save some bit twiddling
 * we use all top 16 bits for the tag. That loses us 4 mantissa bits to store
 * information in but we still have 48, which is going to be plenty for any
 * number of tokens to be created during the lifetime of any CDK application.
 *
 * Can't have all bits set because that makes a NaN, so unset the least
 * significant exponent bit.
 *
 * Currently not supporting BE architectures.
 */
// eslint-disable-next-line no-bitwise
const DOUBLE_TOKEN_MARKER_BITS = 0xFBFF << 16;

/**
 * Highest encodable number
 */
const MAX_ENCODABLE_INTEGER = Math.pow(2, 48) - 1;

/**
 * Get 2^32 as a number, so we can do multiplication and div instead of bit shifting
 *
 * Necessary because in JavaScript, bit operations implicitly convert
 * to int32 and we need them to work on "int64"s.
 *
 * So instead of x >> 32, we do Math.floor(x / 2^32), and vice versa.
 */
const BITS32 = Math.pow(2, 32);

/**
 * Return a special Double value that encodes the given nonnegative integer
 *
 * We use this to encode Token ordinals.
 */
export function createTokenDouble(x: number) {
  if (Math.floor(x) !== x || x < 0) {
    throw new Error('Can only encode positive integers');
  }
  if (x > MAX_ENCODABLE_INTEGER) {
    throw new Error(`Got an index too large to encode: ${x}`);
  }

  const buf = new ArrayBuffer(8);
  const ints = new Uint32Array(buf);

  /* eslint-disable no-bitwise */
  ints[0] = x & 0x0000FFFFFFFF; // Bottom 32 bits of number

  // This needs an "x >> 32" but that will make it a 32-bit number instead
  // of a 64-bit number.
  ints[1] = (shr32(x) & 0xFFFF) | DOUBLE_TOKEN_MARKER_BITS; // Top 16 bits of number and the mask
  /* eslint-enable no-bitwise */

  return (new Float64Array(buf))[0];
}

/**
 * Shift a 64-bit int right 32 bits
 */
function shr32(x: number) {
  return Math.floor(x / BITS32);
}

/**
 * Shift a 64-bit left 32 bits
 */
function shl32(x: number) {
  return x * BITS32;
}

/**
 * Extract the encoded integer out of the special Double value
 *
 * Returns undefined if the float is a not an encoded token.
 */
export function extractTokenDouble(encoded: number): number | undefined {
  const buf = new ArrayBuffer(8);
  (new Float64Array(buf))[0] = encoded;

  const ints = new Uint32Array(buf);

  /* eslint-disable no-bitwise */
  if ((ints[1] & 0xFFFF0000) !== DOUBLE_TOKEN_MARKER_BITS) {
    return undefined;
  }

  // Must use + instead of | here (bitwise operations
  // will force 32-bits integer arithmetic, + will not).
  return ints[0] + shl32(ints[1] & 0xFFFF);
  /* eslint-enable no-bitwise */
}

const STRINGIFIED_NUMBER_REGEX = new RegExp(STRINGIFIED_NUMBER_PATTERN);

/**
 * Return whether the given string contains accidentally stringified number tokens
 */
export function stringContainsNumberTokens(x: string) {
  return !!x.match(STRINGIFIED_NUMBER_REGEX);
}
