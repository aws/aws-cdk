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
    constructor(str, re) {
        this.str = str;
        this.re = re;
    }
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
        return token_1.isResolvableObject(obj);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbmNvZGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwwREFBK0Q7QUFDL0Qsb0NBQThDO0FBRTlDLHFGQUFxRjtBQUV4RSxRQUFBLHlCQUF5QixHQUFHLFVBQVUsQ0FBQztBQUN2QyxRQUFBLHVCQUF1QixHQUFHLFVBQVUsQ0FBQztBQUNyQyxRQUFBLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUV4QixRQUFBLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFFL0MsTUFBTSxnQ0FBZ0MsR0FBRyxVQUFVLENBQUMsaUNBQXlCLENBQUMsQ0FBQztBQUMvRSxNQUFNLDhCQUE4QixHQUFHLFVBQVUsQ0FBQywrQkFBdUIsQ0FBQyxDQUFDO0FBQzNFLE1BQU0sdUJBQXVCLEdBQUcsVUFBVSxDQUFDLHdCQUFnQixDQUFDLENBQUM7QUFFN0QsOENBQThDO0FBQ2pDLFFBQUEsMEJBQTBCLEdBQUcsd0JBQXdCLENBQUM7QUFFbkUsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLGdDQUFnQyxLQUFLLHVCQUFlLE1BQU0sdUJBQXVCLEtBQUssa0NBQTBCLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuSyxNQUFNLGdCQUFnQixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsOEJBQThCLEtBQUssdUJBQWUsTUFBTSx1QkFBdUIsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRS9IOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lBZXRCLFlBQTZCLEdBQVcsRUFBbUIsRUFBVTtRQUF4QyxRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQW1CLE9BQUUsR0FBRixFQUFFLENBQVE7S0FDcEU7SUFmRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBUztRQUMvQixPQUFPLElBQUksV0FBVyxDQUFDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0tBQy9DO0lBRUQ7O09BRUc7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Q0gsU0FBZ0IsMEJBQTBCLENBQUMsQ0FBUztJQUNsRCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUZELGdFQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUZyYWdtZW50Q29uY2F0ZW5hdG9yLCBJUmVzb2x2YWJsZSB9IGZyb20gJy4uL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgVG9rZW5pemVkU3RyaW5nRnJhZ21lbnRzIH0gZnJvbSAnLi4vc3RyaW5nLWZyYWdtZW50cyc7XG5pbXBvcnQgeyBpc1Jlc29sdmFibGVPYmplY3QgfSBmcm9tICcuLi90b2tlbic7XG5cbi8vIERldGFpbHMgZm9yIGVuY29kaW5nIGFuZCBkZWNvZGluZyBUb2tlbnMgaW50byBuYXRpdmUgdHlwZXM7IHNob3VsZCBub3QgYmUgZXhwb3J0ZWRcblxuZXhwb3J0IGNvbnN0IEJFR0lOX1NUUklOR19UT0tFTl9NQVJLRVIgPSAnJHtUb2tlblsnO1xuZXhwb3J0IGNvbnN0IEJFR0lOX0xJU1RfVE9LRU5fTUFSS0VSID0gJyN7VG9rZW5bJztcbmV4cG9ydCBjb25zdCBFTkRfVE9LRU5fTUFSS0VSID0gJ119JztcblxuZXhwb3J0IGNvbnN0IFZBTElEX0tFWV9DSEFSUyA9ICdhLXpBLVowLTk6Ll8tJztcblxuY29uc3QgUVVPVEVEX0JFR0lOX1NUUklOR19UT0tFTl9NQVJLRVIgPSByZWdleFF1b3RlKEJFR0lOX1NUUklOR19UT0tFTl9NQVJLRVIpO1xuY29uc3QgUVVPVEVEX0JFR0lOX0xJU1RfVE9LRU5fTUFSS0VSID0gcmVnZXhRdW90ZShCRUdJTl9MSVNUX1RPS0VOX01BUktFUik7XG5jb25zdCBRVU9URURfRU5EX1RPS0VOX01BUktFUiA9IHJlZ2V4UXVvdGUoRU5EX1RPS0VOX01BUktFUik7XG5cbi8vIFNvbWV0aW1lcyB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBpcyBkaWZmZXJlbnRcbmV4cG9ydCBjb25zdCBTVFJJTkdJRklFRF9OVU1CRVJfUEFUVEVSTiA9ICctMVxcXFwuXFxcXGR7MTAsMTZ9ZVxcXFwrMjg5JztcblxuY29uc3QgU1RSSU5HX1RPS0VOX1JFR0VYID0gbmV3IFJlZ0V4cChgJHtRVU9URURfQkVHSU5fU1RSSU5HX1RPS0VOX01BUktFUn0oWyR7VkFMSURfS0VZX0NIQVJTfV0rKSR7UVVPVEVEX0VORF9UT0tFTl9NQVJLRVJ9fCgke1NUUklOR0lGSUVEX05VTUJFUl9QQVRURVJOfSlgLCAnZycpO1xuY29uc3QgTElTVF9UT0tFTl9SRUdFWCA9IG5ldyBSZWdFeHAoYCR7UVVPVEVEX0JFR0lOX0xJU1RfVE9LRU5fTUFSS0VSfShbJHtWQUxJRF9LRVlfQ0hBUlN9XSspJHtRVU9URURfRU5EX1RPS0VOX01BUktFUn1gLCAnZycpO1xuXG4vKipcbiAqIEEgc3RyaW5nIHdpdGggbWFya2VycyBpbiBpdCB0aGF0IGNhbiBiZSByZXNvbHZlZCB0byBleHRlcm5hbCB2YWx1ZXNcbiAqL1xuZXhwb3J0IGNsYXNzIFRva2VuU3RyaW5nIHtcbiAgLyoqXG4gICAqIFJldHVybnMgYSBgVG9rZW5TdHJpbmdgIGZvciB0aGlzIHN0cmluZy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZm9yU3RyaW5nKHM6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgVG9rZW5TdHJpbmcocywgU1RSSU5HX1RPS0VOX1JFR0VYKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgYFRva2VuU3RyaW5nYCBmb3IgdGhpcyBzdHJpbmcgKG11c3QgYmUgdGhlIGZpcnN0IHN0cmluZyBlbGVtZW50IG9mIHRoZSBsaXN0KVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmb3JMaXN0VG9rZW4oczogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBUb2tlblN0cmluZyhzLCBMSVNUX1RPS0VOX1JFR0VYKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgc3RyOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgcmU6IFJlZ0V4cCkge1xuICB9XG5cbiAgLyoqXG4gICAqIFNwbGl0IHN0cmluZyBvbiBtYXJrZXJzLCBzdWJzdGl0dXRpbmcgbWFya2VycyB3aXRoIFRva2Vuc1xuICAgKi9cbiAgcHVibGljIHNwbGl0KGxvb2t1cDogKGlkOiBzdHJpbmcpID0+IElSZXNvbHZhYmxlKTogVG9rZW5pemVkU3RyaW5nRnJhZ21lbnRzIHtcbiAgICBjb25zdCByZXQgPSBuZXcgVG9rZW5pemVkU3RyaW5nRnJhZ21lbnRzKCk7XG5cbiAgICBsZXQgcmVzdCA9IDA7XG4gICAgdGhpcy5yZS5sYXN0SW5kZXggPSAwOyAvLyBSZXNldFxuICAgIGxldCBtID0gdGhpcy5yZS5leGVjKHRoaXMuc3RyKTtcbiAgICB3aGlsZSAobSkge1xuICAgICAgaWYgKG0uaW5kZXggPiByZXN0KSB7XG4gICAgICAgIHJldC5hZGRMaXRlcmFsKHRoaXMuc3RyLnN1YnN0cmluZyhyZXN0LCBtLmluZGV4KSk7XG4gICAgICB9XG5cbiAgICAgIHJldC5hZGRUb2tlbihsb29rdXAobVsxXSA/PyBtWzJdKSk7XG5cbiAgICAgIHJlc3QgPSB0aGlzLnJlLmxhc3RJbmRleDtcbiAgICAgIG0gPSB0aGlzLnJlLmV4ZWModGhpcy5zdHIpO1xuICAgIH1cblxuICAgIGlmIChyZXN0IDwgdGhpcy5zdHIubGVuZ3RoKSB7XG4gICAgICByZXQuYWRkTGl0ZXJhbCh0aGlzLnN0ci5zdWJzdHJpbmcocmVzdCkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoaXMgc3RyaW5nIGluY2x1ZGVzIHRva2Vucy5cbiAgICovXG4gIHB1YmxpYyB0ZXN0KCk6IGJvb2xlYW4ge1xuICAgIHRoaXMucmUubGFzdEluZGV4ID0gMDsgLy8gUmVzZXRcbiAgICByZXR1cm4gdGhpcy5yZS50ZXN0KHRoaXMuc3RyKTtcbiAgfVxufVxuXG4vKipcbiAqIFF1b3RlIGEgc3RyaW5nIGZvciB1c2UgaW4gYSByZWdleFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnZXhRdW90ZShzOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4/KiteJFtcXF1cXFxcKCl7fXwtXS9nLCAnXFxcXCQmJyk7XG59XG5cbi8qKlxuICogQ29uY2F0ZW5hdG9yIHRoYXQgZGlzcmVnYXJkcyB0aGUgaW5wdXRcbiAqXG4gKiBDYW4gYmUgdXNlZCB3aGVuIHRyYXZlcnNpbmcgdGhlIHRva2VucyBpcyBpbXBvcnRhbnQsIGJ1dCB0aGVcbiAqIHJlc3VsdCBpc24ndC5cbiAqL1xuZXhwb3J0IGNsYXNzIE51bGxDb25jYXQgaW1wbGVtZW50cyBJRnJhZ21lbnRDb25jYXRlbmF0b3Ige1xuICBwdWJsaWMgam9pbihfbGVmdDogYW55IHwgdW5kZWZpbmVkLCBfcmlnaHQ6IGFueSB8IHVuZGVmaW5lZCk6IGFueSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnNMaXN0VG9rZW5FbGVtZW50KHhzOiBhbnlbXSkge1xuICByZXR1cm4geHMuc29tZSh4ID0+IHR5cGVvZih4KSA9PT0gJ3N0cmluZycgJiYgVG9rZW5TdHJpbmcuZm9yTGlzdFRva2VuKHgpLnRlc3QoKSk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIG9iaiBpcyBhIHRva2VuIChpLmUuIGhhcyB0aGUgcmVzb2x2ZSgpIG1ldGhvZCBvciBpcyBhIHN0cmluZ1xuICogdGhhdCBpbmNsdWRlcyB0b2tlbiBtYXJrZXJzKSwgb3IgaXQncyBhIGxpc3RpZmljdGFpb24gb2YgYSBUb2tlbiBzdHJpbmcuXG4gKlxuICogQHBhcmFtIG9iaiBUaGUgb2JqZWN0IHRvIHRlc3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bnJlc29sdmVkKG9iajogYW55KTogYm9vbGVhbiB7XG4gIGlmICh0eXBlb2Yob2JqKSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gVG9rZW5TdHJpbmcuZm9yU3RyaW5nKG9iaikudGVzdCgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvYmogPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGV4dHJhY3RUb2tlbkRvdWJsZShvYmopICE9PSB1bmRlZmluZWQ7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmopICYmIG9iai5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gdHlwZW9mKG9ialswXSkgPT09ICdzdHJpbmcnICYmIFRva2VuU3RyaW5nLmZvckxpc3RUb2tlbihvYmpbMF0pLnRlc3QoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaXNSZXNvbHZhYmxlT2JqZWN0KG9iaik7XG4gIH1cbn1cblxuLyoqXG4gKiBCaXQgcGF0dGVybiBpbiB0aGUgdG9wIDE2IGJpdHMgb2YgYSBkb3VibGUgdG8gaW5kaWNhdGUgYSBUb2tlblxuICpcbiAqIEFuIElFRUUgZG91YmxlIGluIExFIG1lbW9yeSBvcmRlciBsb29rcyBsaWtlIHRoaXMgKGdyb3VwZWRcbiAqIGludG8gb2N0ZXRzLCB0aGVuIGdyb3VwZWQgaW50byAzMi1iaXQgd29yZHMpOlxuICpcbiAqIG1tbW1tbW1tLm1tbW1tbW1tLm1tbW1tbW1tLm1tbW1tbW1tIHwgbW1tbW1tbW0ubW1tbW1tbW0uRUVFRW1tbW0uc0VFRUVFRUVcbiAqXG4gKiAtIG06IG1hbnRpc3NhICg1MiBiaXRzKVxuICogLSBFOiBleHBvbmVudCAoMTEgYml0cylcbiAqIC0gczogc2lnbiAoMSBiaXQpXG4gKlxuICogV2UgcHV0IHRoZSBmb2xsb3dpbmcgbWFya2VyIGludG8gdGhlIHRvcCAxNiBiaXRzIChleHBvbmVudCBhbmQgc2lnbiksIGFuZFxuICogdXNlIHRoZSBtYW50aXNzYSBwYXJ0IHRvIGVuY29kZSB0aGUgdG9rZW4gaW5kZXguIFRvIHNhdmUgc29tZSBiaXQgdHdpZGRsaW5nXG4gKiB3ZSB1c2UgYWxsIHRvcCAxNiBiaXRzIGZvciB0aGUgdGFnLiBUaGF0IGxvc2VzIHVzIDQgbWFudGlzc2EgYml0cyB0byBzdG9yZVxuICogaW5mb3JtYXRpb24gaW4gYnV0IHdlIHN0aWxsIGhhdmUgNDgsIHdoaWNoIGlzIGdvaW5nIHRvIGJlIHBsZW50eSBmb3IgYW55XG4gKiBudW1iZXIgb2YgdG9rZW5zIHRvIGJlIGNyZWF0ZWQgZHVyaW5nIHRoZSBsaWZldGltZSBvZiBhbnkgQ0RLIGFwcGxpY2F0aW9uLlxuICpcbiAqIENhbid0IGhhdmUgYWxsIGJpdHMgc2V0IGJlY2F1c2UgdGhhdCBtYWtlcyBhIE5hTiwgc28gdW5zZXQgdGhlIGxlYXN0XG4gKiBzaWduaWZpY2FudCBleHBvbmVudCBiaXQuXG4gKlxuICogQ3VycmVudGx5IG5vdCBzdXBwb3J0aW5nIEJFIGFyY2hpdGVjdHVyZXMuXG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG5jb25zdCBET1VCTEVfVE9LRU5fTUFSS0VSX0JJVFMgPSAweEZCRkYgPDwgMTY7XG5cbi8qKlxuICogSGlnaGVzdCBlbmNvZGFibGUgbnVtYmVyXG4gKi9cbmNvbnN0IE1BWF9FTkNPREFCTEVfSU5URUdFUiA9IE1hdGgucG93KDIsIDQ4KSAtIDE7XG5cbi8qKlxuICogR2V0IDJeMzIgYXMgYSBudW1iZXIsIHNvIHdlIGNhbiBkbyBtdWx0aXBsaWNhdGlvbiBhbmQgZGl2IGluc3RlYWQgb2YgYml0IHNoaWZ0aW5nXG4gKlxuICogTmVjZXNzYXJ5IGJlY2F1c2UgaW4gSmF2YVNjcmlwdCwgYml0IG9wZXJhdGlvbnMgaW1wbGljaXRseSBjb252ZXJ0XG4gKiB0byBpbnQzMiBhbmQgd2UgbmVlZCB0aGVtIHRvIHdvcmsgb24gXCJpbnQ2NFwicy5cbiAqXG4gKiBTbyBpbnN0ZWFkIG9mIHggPj4gMzIsIHdlIGRvIE1hdGguZmxvb3IoeCAvIDJeMzIpLCBhbmQgdmljZSB2ZXJzYS5cbiAqL1xuY29uc3QgQklUUzMyID0gTWF0aC5wb3coMiwgMzIpO1xuXG4vKipcbiAqIFJldHVybiBhIHNwZWNpYWwgRG91YmxlIHZhbHVlIHRoYXQgZW5jb2RlcyB0aGUgZ2l2ZW4gbm9ubmVnYXRpdmUgaW50ZWdlclxuICpcbiAqIFdlIHVzZSB0aGlzIHRvIGVuY29kZSBUb2tlbiBvcmRpbmFscy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRva2VuRG91YmxlKHg6IG51bWJlcikge1xuICBpZiAoTWF0aC5mbG9vcih4KSAhPT0geCB8fCB4IDwgMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG9ubHkgZW5jb2RlIHBvc2l0aXZlIGludGVnZXJzJyk7XG4gIH1cbiAgaWYgKHggPiBNQVhfRU5DT0RBQkxFX0lOVEVHRVIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEdvdCBhbiBpbmRleCB0b28gbGFyZ2UgdG8gZW5jb2RlOiAke3h9YCk7XG4gIH1cblxuICBjb25zdCBidWYgPSBuZXcgQXJyYXlCdWZmZXIoOCk7XG4gIGNvbnN0IGludHMgPSBuZXcgVWludDMyQXJyYXkoYnVmKTtcblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1iaXR3aXNlICovXG4gIGludHNbMF0gPSB4ICYgMHgwMDAwRkZGRkZGRkY7IC8vIEJvdHRvbSAzMiBiaXRzIG9mIG51bWJlclxuXG4gIC8vIFRoaXMgbmVlZHMgYW4gXCJ4ID4+IDMyXCIgYnV0IHRoYXQgd2lsbCBtYWtlIGl0IGEgMzItYml0IG51bWJlciBpbnN0ZWFkXG4gIC8vIG9mIGEgNjQtYml0IG51bWJlci5cbiAgaW50c1sxXSA9IChzaHIzMih4KSAmIDB4RkZGRikgfCBET1VCTEVfVE9LRU5fTUFSS0VSX0JJVFM7IC8vIFRvcCAxNiBiaXRzIG9mIG51bWJlciBhbmQgdGhlIG1hc2tcbiAgLyogZXNsaW50LWVuYWJsZSBuby1iaXR3aXNlICovXG5cbiAgcmV0dXJuIChuZXcgRmxvYXQ2NEFycmF5KGJ1ZikpWzBdO1xufVxuXG4vKipcbiAqIFNoaWZ0IGEgNjQtYml0IGludCByaWdodCAzMiBiaXRzXG4gKi9cbmZ1bmN0aW9uIHNocjMyKHg6IG51bWJlcikge1xuICByZXR1cm4gTWF0aC5mbG9vcih4IC8gQklUUzMyKTtcbn1cblxuLyoqXG4gKiBTaGlmdCBhIDY0LWJpdCBsZWZ0IDMyIGJpdHNcbiAqL1xuZnVuY3Rpb24gc2hsMzIoeDogbnVtYmVyKSB7XG4gIHJldHVybiB4ICogQklUUzMyO1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdGhlIGVuY29kZWQgaW50ZWdlciBvdXQgb2YgdGhlIHNwZWNpYWwgRG91YmxlIHZhbHVlXG4gKlxuICogUmV0dXJucyB1bmRlZmluZWQgaWYgdGhlIGZsb2F0IGlzIGEgbm90IGFuIGVuY29kZWQgdG9rZW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0VG9rZW5Eb3VibGUoZW5jb2RlZDogbnVtYmVyKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgYnVmID0gbmV3IEFycmF5QnVmZmVyKDgpO1xuICAobmV3IEZsb2F0NjRBcnJheShidWYpKVswXSA9IGVuY29kZWQ7XG5cbiAgY29uc3QgaW50cyA9IG5ldyBVaW50MzJBcnJheShidWYpO1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLWJpdHdpc2UgKi9cbiAgaWYgKChpbnRzWzFdICYgMHhGRkZGMDAwMCkgIT09IERPVUJMRV9UT0tFTl9NQVJLRVJfQklUUykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBNdXN0IHVzZSArIGluc3RlYWQgb2YgfCBoZXJlIChiaXR3aXNlIG9wZXJhdGlvbnNcbiAgLy8gd2lsbCBmb3JjZSAzMi1iaXRzIGludGVnZXIgYXJpdGhtZXRpYywgKyB3aWxsIG5vdCkuXG4gIHJldHVybiBpbnRzWzBdICsgc2hsMzIoaW50c1sxXSAmIDB4RkZGRik7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tYml0d2lzZSAqL1xufVxuXG5jb25zdCBTVFJJTkdJRklFRF9OVU1CRVJfUkVHRVggPSBuZXcgUmVnRXhwKFNUUklOR0lGSUVEX05VTUJFUl9QQVRURVJOKTtcblxuLyoqXG4gKiBSZXR1cm4gd2hldGhlciB0aGUgZ2l2ZW4gc3RyaW5nIGNvbnRhaW5zIGFjY2lkZW50YWxseSBzdHJpbmdpZmllZCBudW1iZXIgdG9rZW5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdDb250YWluc051bWJlclRva2Vucyh4OiBzdHJpbmcpIHtcbiAgcmV0dXJuICEheC5tYXRjaChTVFJJTkdJRklFRF9OVU1CRVJfUkVHRVgpO1xufVxuIl19