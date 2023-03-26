"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringContainsNumberTokens = exports.extractTokenDouble = exports.createTokenDouble = exports.unresolved = exports.containsListTokenElement = exports.NullConcat = exports.regexQuote = exports.TokenString = exports.STRINGIFIED_NUMBER_PATTERN = exports.VALID_KEY_CHARS = exports.END_TOKEN_MARKER = exports.BEGIN_LIST_TOKEN_MARKER = exports.BEGIN_STRING_TOKEN_MARKER = void 0;
const string_fragments_1 = require("../string-fragments");
const token_1 = require("../token");
// Details for encoding and decoding Tokens into native types; should not be exported
exports.BEGIN_STRING_TOKEN_MARKER = '${Token[';
exports.BEGIN_LIST_TOKEN_MARKER = '#{Token[';
exports.END_TOKEN_MARKER = ']}';
exports.VALID_KEY_CHARS = 'a-zA-Z0-9:._-';
const QUOTED_BEGIN_STRING_TOKEN_MARKER = regexQuote(exports.BEGIN_STRING_TOKEN_MARKER);
const QUOTED_BEGIN_LIST_TOKEN_MARKER = regexQuote(exports.BEGIN_LIST_TOKEN_MARKER);
const QUOTED_END_TOKEN_MARKER = regexQuote(exports.END_TOKEN_MARKER);
// Sometimes the number of digits is different
exports.STRINGIFIED_NUMBER_PATTERN = '-1\\.\\d{10,16}e\\+289';
const STRING_TOKEN_REGEX = new RegExp(`${QUOTED_BEGIN_STRING_TOKEN_MARKER}([${exports.VALID_KEY_CHARS}]+)${QUOTED_END_TOKEN_MARKER}|(${exports.STRINGIFIED_NUMBER_PATTERN})`, 'g');
const LIST_TOKEN_REGEX = new RegExp(`${QUOTED_BEGIN_LIST_TOKEN_MARKER}([${exports.VALID_KEY_CHARS}]+)${QUOTED_END_TOKEN_MARKER}`, 'g');
/**
 * A string with markers in it that can be resolved to external values
 */
class TokenString {
    /**
     * Returns a `TokenString` for this string.
     */
    static forString(s) {
        return new TokenString(s, STRING_TOKEN_REGEX);
    }
    /**
     * Returns a `TokenString` for this string (must be the first string element of the list)
     */
    static forListToken(s) {
        return new TokenString(s, LIST_TOKEN_REGEX);
    }
    constructor(str, re) {
        this.str = str;
        this.re = re;
    }
    /**
     * Split string on markers, substituting markers with Tokens
     */
    split(lookup) {
        const ret = new string_fragments_1.TokenizedStringFragments();
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
    test() {
        this.re.lastIndex = 0; // Reset
        return this.re.test(this.str);
    }
}
exports.TokenString = TokenString;
/**
 * Quote a string for use in a regex
 */
function regexQuote(s) {
    return s.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
}
exports.regexQuote = regexQuote;
/**
 * Concatenator that disregards the input
 *
 * Can be used when traversing the tokens is important, but the
 * result isn't.
 */
class NullConcat {
    join(_left, _right) {
        return undefined;
    }
}
exports.NullConcat = NullConcat;
function containsListTokenElement(xs) {
    return xs.some(x => typeof (x) === 'string' && TokenString.forListToken(x).test());
}
exports.containsListTokenElement = containsListTokenElement;
/**
 * Returns true if obj is a token (i.e. has the resolve() method or is a string
 * that includes token markers), or it's a listifictaion of a Token string.
 *
 * @param obj The object to test.
 */
function unresolved(obj) {
    if (typeof (obj) === 'string') {
        return TokenString.forString(obj).test();
    }
    else if (typeof obj === 'number') {
        return extractTokenDouble(obj) !== undefined;
    }
    else if (Array.isArray(obj) && obj.length === 1) {
        return typeof (obj[0]) === 'string' && TokenString.forListToken(obj[0]).test();
    }
    else {
        return (0, token_1.isResolvableObject)(obj);
    }
}
exports.unresolved = unresolved;
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
function createTokenDouble(x) {
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
exports.createTokenDouble = createTokenDouble;
/**
 * Shift a 64-bit int right 32 bits
 */
function shr32(x) {
    return Math.floor(x / BITS32);
}
/**
 * Shift a 64-bit left 32 bits
 */
function shl32(x) {
    return x * BITS32;
}
/**
 * Extract the encoded integer out of the special Double value
 *
 * Returns undefined if the float is a not an encoded token.
 */
function extractTokenDouble(encoded) {
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
exports.extractTokenDouble = extractTokenDouble;
const STRINGIFIED_NUMBER_REGEX = new RegExp(exports.STRINGIFIED_NUMBER_PATTERN);
/**
 * Return whether the given string contains accidentally stringified number tokens
 */
function stringContainsNumberTokens(x) {
    return !!x.match(STRINGIFIED_NUMBER_REGEX);
}
exports.stringContainsNumberTokens = stringContainsNumberTokens;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbmNvZGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwwREFBK0Q7QUFDL0Qsb0NBQThDO0FBRTlDLHFGQUFxRjtBQUV4RSxRQUFBLHlCQUF5QixHQUFHLFVBQVUsQ0FBQztBQUN2QyxRQUFBLHVCQUF1QixHQUFHLFVBQVUsQ0FBQztBQUNyQyxRQUFBLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUV4QixRQUFBLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFFL0MsTUFBTSxnQ0FBZ0MsR0FBRyxVQUFVLENBQUMsaUNBQXlCLENBQUMsQ0FBQztBQUMvRSxNQUFNLDhCQUE4QixHQUFHLFVBQVUsQ0FBQywrQkFBdUIsQ0FBQyxDQUFDO0FBQzNFLE1BQU0sdUJBQXVCLEdBQUcsVUFBVSxDQUFDLHdCQUFnQixDQUFDLENBQUM7QUFFN0QsOENBQThDO0FBQ2pDLFFBQUEsMEJBQTBCLEdBQUcsd0JBQXdCLENBQUM7QUFFbkUsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLGdDQUFnQyxLQUFLLHVCQUFlLE1BQU0sdUJBQXVCLEtBQUssa0NBQTBCLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuSyxNQUFNLGdCQUFnQixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsOEJBQThCLEtBQUssdUJBQWUsTUFBTSx1QkFBdUIsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRS9IOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lBQ3RCOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFTO1FBQy9CLE9BQU8sSUFBSSxXQUFXLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLENBQUM7S0FDL0M7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBUztRQUNsQyxPQUFPLElBQUksV0FBVyxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0tB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RUc7QUFDSCxTQUFnQiwwQkFBMEIsQ0FBQyxDQUFTO0lBQ2xELE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRkQsZ0VBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJRnJhZ21lbnRDb25jYXRlbmF0b3IsIElSZXNvbHZhYmxlIH0gZnJvbSAnLi4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBUb2tlbml6ZWRTdHJpbmdGcmFnbWVudHMgfSBmcm9tICcuLi9zdHJpbmctZnJhZ21lbnRzJztcbmltcG9ydCB7IGlzUmVzb2x2YWJsZU9iamVjdCB9IGZyb20gJy4uL3Rva2VuJztcblxuLy8gRGV0YWlscyBmb3IgZW5jb2RpbmcgYW5kIGRlY29kaW5nIFRva2VucyBpbnRvIG5hdGl2ZSB0eXBlczsgc2hvdWxkIG5vdCBiZSBleHBvcnRlZFxuXG5leHBvcnQgY29uc3QgQkVHSU5fU1RSSU5HX1RPS0VOX01BUktFUiA9ICcke1Rva2VuWyc7XG5leHBvcnQgY29uc3QgQkVHSU5fTElTVF9UT0tFTl9NQVJLRVIgPSAnI3tUb2tlblsnO1xuZXhwb3J0IGNvbnN0IEVORF9UT0tFTl9NQVJLRVIgPSAnXX0nO1xuXG5leHBvcnQgY29uc3QgVkFMSURfS0VZX0NIQVJTID0gJ2EtekEtWjAtOTouXy0nO1xuXG5jb25zdCBRVU9URURfQkVHSU5fU1RSSU5HX1RPS0VOX01BUktFUiA9IHJlZ2V4UXVvdGUoQkVHSU5fU1RSSU5HX1RPS0VOX01BUktFUik7XG5jb25zdCBRVU9URURfQkVHSU5fTElTVF9UT0tFTl9NQVJLRVIgPSByZWdleFF1b3RlKEJFR0lOX0xJU1RfVE9LRU5fTUFSS0VSKTtcbmNvbnN0IFFVT1RFRF9FTkRfVE9LRU5fTUFSS0VSID0gcmVnZXhRdW90ZShFTkRfVE9LRU5fTUFSS0VSKTtcblxuLy8gU29tZXRpbWVzIHRoZSBudW1iZXIgb2YgZGlnaXRzIGlzIGRpZmZlcmVudFxuZXhwb3J0IGNvbnN0IFNUUklOR0lGSUVEX05VTUJFUl9QQVRURVJOID0gJy0xXFxcXC5cXFxcZHsxMCwxNn1lXFxcXCsyODknO1xuXG5jb25zdCBTVFJJTkdfVE9LRU5fUkVHRVggPSBuZXcgUmVnRXhwKGAke1FVT1RFRF9CRUdJTl9TVFJJTkdfVE9LRU5fTUFSS0VSfShbJHtWQUxJRF9LRVlfQ0hBUlN9XSspJHtRVU9URURfRU5EX1RPS0VOX01BUktFUn18KCR7U1RSSU5HSUZJRURfTlVNQkVSX1BBVFRFUk59KWAsICdnJyk7XG5jb25zdCBMSVNUX1RPS0VOX1JFR0VYID0gbmV3IFJlZ0V4cChgJHtRVU9URURfQkVHSU5fTElTVF9UT0tFTl9NQVJLRVJ9KFske1ZBTElEX0tFWV9DSEFSU31dKykke1FVT1RFRF9FTkRfVE9LRU5fTUFSS0VSfWAsICdnJyk7XG5cbi8qKlxuICogQSBzdHJpbmcgd2l0aCBtYXJrZXJzIGluIGl0IHRoYXQgY2FuIGJlIHJlc29sdmVkIHRvIGV4dGVybmFsIHZhbHVlc1xuICovXG5leHBvcnQgY2xhc3MgVG9rZW5TdHJpbmcge1xuICAvKipcbiAgICogUmV0dXJucyBhIGBUb2tlblN0cmluZ2AgZm9yIHRoaXMgc3RyaW5nLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmb3JTdHJpbmcoczogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBUb2tlblN0cmluZyhzLCBTVFJJTkdfVE9LRU5fUkVHRVgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBgVG9rZW5TdHJpbmdgIGZvciB0aGlzIHN0cmluZyAobXVzdCBiZSB0aGUgZmlyc3Qgc3RyaW5nIGVsZW1lbnQgb2YgdGhlIGxpc3QpXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZvckxpc3RUb2tlbihzOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IFRva2VuU3RyaW5nKHMsIExJU1RfVE9LRU5fUkVHRVgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBzdHI6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSByZTogUmVnRXhwKSB7XG4gIH1cblxuICAvKipcbiAgICogU3BsaXQgc3RyaW5nIG9uIG1hcmtlcnMsIHN1YnN0aXR1dGluZyBtYXJrZXJzIHdpdGggVG9rZW5zXG4gICAqL1xuICBwdWJsaWMgc3BsaXQobG9va3VwOiAoaWQ6IHN0cmluZykgPT4gSVJlc29sdmFibGUpOiBUb2tlbml6ZWRTdHJpbmdGcmFnbWVudHMge1xuICAgIGNvbnN0IHJldCA9IG5ldyBUb2tlbml6ZWRTdHJpbmdGcmFnbWVudHMoKTtcblxuICAgIGxldCByZXN0ID0gMDtcbiAgICB0aGlzLnJlLmxhc3RJbmRleCA9IDA7IC8vIFJlc2V0XG4gICAgbGV0IG0gPSB0aGlzLnJlLmV4ZWModGhpcy5zdHIpO1xuICAgIHdoaWxlIChtKSB7XG4gICAgICBpZiAobS5pbmRleCA+IHJlc3QpIHtcbiAgICAgICAgcmV0LmFkZExpdGVyYWwodGhpcy5zdHIuc3Vic3RyaW5nKHJlc3QsIG0uaW5kZXgpKTtcbiAgICAgIH1cblxuICAgICAgcmV0LmFkZFRva2VuKGxvb2t1cChtWzFdID8/IG1bMl0pKTtcblxuICAgICAgcmVzdCA9IHRoaXMucmUubGFzdEluZGV4O1xuICAgICAgbSA9IHRoaXMucmUuZXhlYyh0aGlzLnN0cik7XG4gICAgfVxuXG4gICAgaWYgKHJlc3QgPCB0aGlzLnN0ci5sZW5ndGgpIHtcbiAgICAgIHJldC5hZGRMaXRlcmFsKHRoaXMuc3RyLnN1YnN0cmluZyhyZXN0KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgdGhpcyBzdHJpbmcgaW5jbHVkZXMgdG9rZW5zLlxuICAgKi9cbiAgcHVibGljIHRlc3QoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5yZS5sYXN0SW5kZXggPSAwOyAvLyBSZXNldFxuICAgIHJldHVybiB0aGlzLnJlLnRlc3QodGhpcy5zdHIpO1xuICB9XG59XG5cbi8qKlxuICogUXVvdGUgYSBzdHJpbmcgZm9yIHVzZSBpbiBhIHJlZ2V4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdleFF1b3RlKHM6IHN0cmluZykge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLj8qK14kW1xcXVxcXFwoKXt9fC1dL2csICdcXFxcJCYnKTtcbn1cblxuLyoqXG4gKiBDb25jYXRlbmF0b3IgdGhhdCBkaXNyZWdhcmRzIHRoZSBpbnB1dFxuICpcbiAqIENhbiBiZSB1c2VkIHdoZW4gdHJhdmVyc2luZyB0aGUgdG9rZW5zIGlzIGltcG9ydGFudCwgYnV0IHRoZVxuICogcmVzdWx0IGlzbid0LlxuICovXG5leHBvcnQgY2xhc3MgTnVsbENvbmNhdCBpbXBsZW1lbnRzIElGcmFnbWVudENvbmNhdGVuYXRvciB7XG4gIHB1YmxpYyBqb2luKF9sZWZ0OiBhbnkgfCB1bmRlZmluZWQsIF9yaWdodDogYW55IHwgdW5kZWZpbmVkKTogYW55IHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb250YWluc0xpc3RUb2tlbkVsZW1lbnQoeHM6IGFueVtdKSB7XG4gIHJldHVybiB4cy5zb21lKHggPT4gdHlwZW9mKHgpID09PSAnc3RyaW5nJyAmJiBUb2tlblN0cmluZy5mb3JMaXN0VG9rZW4oeCkudGVzdCgpKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgb2JqIGlzIGEgdG9rZW4gKGkuZS4gaGFzIHRoZSByZXNvbHZlKCkgbWV0aG9kIG9yIGlzIGEgc3RyaW5nXG4gKiB0aGF0IGluY2x1ZGVzIHRva2VuIG1hcmtlcnMpLCBvciBpdCdzIGEgbGlzdGlmaWN0YWlvbiBvZiBhIFRva2VuIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gb2JqIFRoZSBvYmplY3QgdG8gdGVzdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVucmVzb2x2ZWQob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgaWYgKHR5cGVvZihvYmopID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBUb2tlblN0cmluZy5mb3JTdHJpbmcob2JqKS50ZXN0KCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9iaiA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gZXh0cmFjdFRva2VuRG91YmxlKG9iaikgIT09IHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KG9iaikgJiYgb2JqLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiB0eXBlb2Yob2JqWzBdKSA9PT0gJ3N0cmluZycgJiYgVG9rZW5TdHJpbmcuZm9yTGlzdFRva2VuKG9ialswXSkudGVzdCgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBpc1Jlc29sdmFibGVPYmplY3Qob2JqKTtcbiAgfVxufVxuXG4vKipcbiAqIEJpdCBwYXR0ZXJuIGluIHRoZSB0b3AgMTYgYml0cyBvZiBhIGRvdWJsZSB0byBpbmRpY2F0ZSBhIFRva2VuXG4gKlxuICogQW4gSUVFRSBkb3VibGUgaW4gTEUgbWVtb3J5IG9yZGVyIGxvb2tzIGxpa2UgdGhpcyAoZ3JvdXBlZFxuICogaW50byBvY3RldHMsIHRoZW4gZ3JvdXBlZCBpbnRvIDMyLWJpdCB3b3Jkcyk6XG4gKlxuICogbW1tbW1tbW0ubW1tbW1tbW0ubW1tbW1tbW0ubW1tbW1tbW0gfCBtbW1tbW1tbS5tbW1tbW1tbS5FRUVFbW1tbS5zRUVFRUVFRVxuICpcbiAqIC0gbTogbWFudGlzc2EgKDUyIGJpdHMpXG4gKiAtIEU6IGV4cG9uZW50ICgxMSBiaXRzKVxuICogLSBzOiBzaWduICgxIGJpdClcbiAqXG4gKiBXZSBwdXQgdGhlIGZvbGxvd2luZyBtYXJrZXIgaW50byB0aGUgdG9wIDE2IGJpdHMgKGV4cG9uZW50IGFuZCBzaWduKSwgYW5kXG4gKiB1c2UgdGhlIG1hbnRpc3NhIHBhcnQgdG8gZW5jb2RlIHRoZSB0b2tlbiBpbmRleC4gVG8gc2F2ZSBzb21lIGJpdCB0d2lkZGxpbmdcbiAqIHdlIHVzZSBhbGwgdG9wIDE2IGJpdHMgZm9yIHRoZSB0YWcuIFRoYXQgbG9zZXMgdXMgNCBtYW50aXNzYSBiaXRzIHRvIHN0b3JlXG4gKiBpbmZvcm1hdGlvbiBpbiBidXQgd2Ugc3RpbGwgaGF2ZSA0OCwgd2hpY2ggaXMgZ29pbmcgdG8gYmUgcGxlbnR5IGZvciBhbnlcbiAqIG51bWJlciBvZiB0b2tlbnMgdG8gYmUgY3JlYXRlZCBkdXJpbmcgdGhlIGxpZmV0aW1lIG9mIGFueSBDREsgYXBwbGljYXRpb24uXG4gKlxuICogQ2FuJ3QgaGF2ZSBhbGwgYml0cyBzZXQgYmVjYXVzZSB0aGF0IG1ha2VzIGEgTmFOLCBzbyB1bnNldCB0aGUgbGVhc3RcbiAqIHNpZ25pZmljYW50IGV4cG9uZW50IGJpdC5cbiAqXG4gKiBDdXJyZW50bHkgbm90IHN1cHBvcnRpbmcgQkUgYXJjaGl0ZWN0dXJlcy5cbiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2VcbmNvbnN0IERPVUJMRV9UT0tFTl9NQVJLRVJfQklUUyA9IDB4RkJGRiA8PCAxNjtcblxuLyoqXG4gKiBIaWdoZXN0IGVuY29kYWJsZSBudW1iZXJcbiAqL1xuY29uc3QgTUFYX0VOQ09EQUJMRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNDgpIC0gMTtcblxuLyoqXG4gKiBHZXQgMl4zMiBhcyBhIG51bWJlciwgc28gd2UgY2FuIGRvIG11bHRpcGxpY2F0aW9uIGFuZCBkaXYgaW5zdGVhZCBvZiBiaXQgc2hpZnRpbmdcbiAqXG4gKiBOZWNlc3NhcnkgYmVjYXVzZSBpbiBKYXZhU2NyaXB0LCBiaXQgb3BlcmF0aW9ucyBpbXBsaWNpdGx5IGNvbnZlcnRcbiAqIHRvIGludDMyIGFuZCB3ZSBuZWVkIHRoZW0gdG8gd29yayBvbiBcImludDY0XCJzLlxuICpcbiAqIFNvIGluc3RlYWQgb2YgeCA+PiAzMiwgd2UgZG8gTWF0aC5mbG9vcih4IC8gMl4zMiksIGFuZCB2aWNlIHZlcnNhLlxuICovXG5jb25zdCBCSVRTMzIgPSBNYXRoLnBvdygyLCAzMik7XG5cbi8qKlxuICogUmV0dXJuIGEgc3BlY2lhbCBEb3VibGUgdmFsdWUgdGhhdCBlbmNvZGVzIHRoZSBnaXZlbiBub25uZWdhdGl2ZSBpbnRlZ2VyXG4gKlxuICogV2UgdXNlIHRoaXMgdG8gZW5jb2RlIFRva2VuIG9yZGluYWxzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVG9rZW5Eb3VibGUoeDogbnVtYmVyKSB7XG4gIGlmIChNYXRoLmZsb29yKHgpICE9PSB4IHx8IHggPCAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gb25seSBlbmNvZGUgcG9zaXRpdmUgaW50ZWdlcnMnKTtcbiAgfVxuICBpZiAoeCA+IE1BWF9FTkNPREFCTEVfSU5URUdFUikge1xuICAgIHRocm93IG5ldyBFcnJvcihgR290IGFuIGluZGV4IHRvbyBsYXJnZSB0byBlbmNvZGU6ICR7eH1gKTtcbiAgfVxuXG4gIGNvbnN0IGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcig4KTtcbiAgY29uc3QgaW50cyA9IG5ldyBVaW50MzJBcnJheShidWYpO1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLWJpdHdpc2UgKi9cbiAgaW50c1swXSA9IHggJiAweDAwMDBGRkZGRkZGRjsgLy8gQm90dG9tIDMyIGJpdHMgb2YgbnVtYmVyXG5cbiAgLy8gVGhpcyBuZWVkcyBhbiBcInggPj4gMzJcIiBidXQgdGhhdCB3aWxsIG1ha2UgaXQgYSAzMi1iaXQgbnVtYmVyIGluc3RlYWRcbiAgLy8gb2YgYSA2NC1iaXQgbnVtYmVyLlxuICBpbnRzWzFdID0gKHNocjMyKHgpICYgMHhGRkZGKSB8IERPVUJMRV9UT0tFTl9NQVJLRVJfQklUUzsgLy8gVG9wIDE2IGJpdHMgb2YgbnVtYmVyIGFuZCB0aGUgbWFza1xuICAvKiBlc2xpbnQtZW5hYmxlIG5vLWJpdHdpc2UgKi9cblxuICByZXR1cm4gKG5ldyBGbG9hdDY0QXJyYXkoYnVmKSlbMF07XG59XG5cbi8qKlxuICogU2hpZnQgYSA2NC1iaXQgaW50IHJpZ2h0IDMyIGJpdHNcbiAqL1xuZnVuY3Rpb24gc2hyMzIoeDogbnVtYmVyKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKHggLyBCSVRTMzIpO1xufVxuXG4vKipcbiAqIFNoaWZ0IGEgNjQtYml0IGxlZnQgMzIgYml0c1xuICovXG5mdW5jdGlvbiBzaGwzMih4OiBudW1iZXIpIHtcbiAgcmV0dXJuIHggKiBCSVRTMzI7XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgZW5jb2RlZCBpbnRlZ2VyIG91dCBvZiB0aGUgc3BlY2lhbCBEb3VibGUgdmFsdWVcbiAqXG4gKiBSZXR1cm5zIHVuZGVmaW5lZCBpZiB0aGUgZmxvYXQgaXMgYSBub3QgYW4gZW5jb2RlZCB0b2tlbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RUb2tlbkRvdWJsZShlbmNvZGVkOiBudW1iZXIpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICBjb25zdCBidWYgPSBuZXcgQXJyYXlCdWZmZXIoOCk7XG4gIChuZXcgRmxvYXQ2NEFycmF5KGJ1ZikpWzBdID0gZW5jb2RlZDtcblxuICBjb25zdCBpbnRzID0gbmV3IFVpbnQzMkFycmF5KGJ1Zik7XG5cbiAgLyogZXNsaW50LWRpc2FibGUgbm8tYml0d2lzZSAqL1xuICBpZiAoKGludHNbMV0gJiAweEZGRkYwMDAwKSAhPT0gRE9VQkxFX1RPS0VOX01BUktFUl9CSVRTKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIE11c3QgdXNlICsgaW5zdGVhZCBvZiB8IGhlcmUgKGJpdHdpc2Ugb3BlcmF0aW9uc1xuICAvLyB3aWxsIGZvcmNlIDMyLWJpdHMgaW50ZWdlciBhcml0aG1ldGljLCArIHdpbGwgbm90KS5cbiAgcmV0dXJuIGludHNbMF0gKyBzaGwzMihpbnRzWzFdICYgMHhGRkZGKTtcbiAgLyogZXNsaW50LWVuYWJsZSBuby1iaXR3aXNlICovXG59XG5cbmNvbnN0IFNUUklOR0lGSUVEX05VTUJFUl9SRUdFWCA9IG5ldyBSZWdFeHAoU1RSSU5HSUZJRURfTlVNQkVSX1BBVFRFUk4pO1xuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIHRoZSBnaXZlbiBzdHJpbmcgY29udGFpbnMgYWNjaWRlbnRhbGx5IHN0cmluZ2lmaWVkIG51bWJlciB0b2tlbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0NvbnRhaW5zTnVtYmVyVG9rZW5zKHg6IHN0cmluZykge1xuICByZXR1cm4gISF4Lm1hdGNoKFNUUklOR0lGSUVEX05VTUJFUl9SRUdFWCk7XG59XG4iXX0=