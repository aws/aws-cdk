"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenMap = void 0;
const encoding_1 = require("./encoding");
const token_1 = require("../token");
const glob = global;
const STRING_SYMBOL = Symbol.for('@aws-cdk/core.TokenMap.STRING');
const LIST_SYMBOL = Symbol.for('@aws-cdk/core.TokenMap.LIST');
const NUMBER_SYMBOL = Symbol.for('@aws-cdk/core.TokenMap.NUMBER');
/**
 * Central place where we keep a mapping from Tokens to their String representation
 *
 * The string representation is used to embed token into strings,
 * and stored to be able to reverse that mapping.
 *
 * All instances of TokenStringMap share the same storage, so that this process
 * works even when different copies of the library are loaded.
 */
class TokenMap {
    constructor() {
        this.stringTokenMap = new Map();
        this.numberTokenMap = new Map();
        /**
         * Counter to assign unique IDs to tokens
         *
         * Start at a random number to prevent people from accidentally taking
         * dependencies on token values between runs.
         *
         * This is most prominent in tests, where people will write:
         *
         * ```ts
         * sha256(JSON.stringify({ ...some structure that can contain tokens ... }))
         * ```
         *
         * This should have been:
         *
         * ```ts
         * sha256(JSON.stringify(stack.resolve({ ...some structure that can contain tokens ... })))
         * ```
         *
         * The hash value is hard to inspect for correctness. It will LOOK consistent
         * during testing, but will break as soon as someone stringifies another
         * token before the run.
         *
         * By changing the starting number for tokens, we ensure that the hash is almost
         * guaranteed to be different during a few test runs, so the hashing of unresolved
         * tokens can be detected.
         */
        this.tokenCounter = Math.floor(Math.random() * 10);
    }
    /**
     * Singleton instance of the token string map
     */
    static instance() {
        if (!glob.__cdkTokenMap) {
            glob.__cdkTokenMap = new TokenMap();
        }
        return glob.__cdkTokenMap;
    }
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
    registerString(token, displayHint) {
        return cachedValue(token, STRING_SYMBOL, () => {
            const key = this.registerStringKey(token, displayHint);
            return `${encoding_1.BEGIN_STRING_TOKEN_MARKER}${key}${encoding_1.END_TOKEN_MARKER}`;
        });
    }
    /**
     * Generate a unique string for this Token, returning a key
     */
    registerList(token, displayHint) {
        return cachedValue(token, LIST_SYMBOL, () => {
            const key = this.registerStringKey(token, displayHint);
            return [`${encoding_1.BEGIN_LIST_TOKEN_MARKER}${key}${encoding_1.END_TOKEN_MARKER}`];
        });
    }
    /**
     * Create a unique number representation for this Token and return it
     */
    registerNumber(token) {
        return cachedValue(token, NUMBER_SYMBOL, () => {
            return this.registerNumberKey(token);
        });
    }
    /**
     * Lookup a token from an encoded value
     */
    tokenFromEncoding(x) {
        if ((0, token_1.isResolvableObject)(x)) {
            return x;
        }
        if (typeof x === 'string') {
            return this.lookupString(x);
        }
        if (Array.isArray(x)) {
            return this.lookupList(x);
        }
        if (token_1.Token.isUnresolved(x)) {
            return x;
        }
        return undefined;
    }
    /**
     * Reverse a string representation into a Token object
     */
    lookupString(s) {
        const fragments = this.splitString(s);
        if (fragments.tokens.length > 0 && fragments.length === 1) {
            return fragments.firstToken;
        }
        return undefined;
    }
    /**
     * Reverse a string representation into a Token object
     */
    lookupList(xs) {
        if (xs.length !== 1) {
            return undefined;
        }
        const str = encoding_1.TokenString.forListToken(xs[0]);
        const fragments = str.split(this.lookupToken.bind(this));
        if (fragments.length === 1) {
            return fragments.firstToken;
        }
        return undefined;
    }
    /**
     * Split a string into literals and Tokens
     */
    splitString(s) {
        const str = encoding_1.TokenString.forString(s);
        return str.split(this.lookupToken.bind(this));
    }
    /**
     * Reverse a number encoding into a Token, or undefined if the number wasn't a Token
     */
    lookupNumberToken(x) {
        const tokenIndex = (0, encoding_1.extractTokenDouble)(x);
        if (tokenIndex === undefined) {
            return undefined;
        }
        const t = this.numberTokenMap.get(tokenIndex);
        if (t === undefined) {
            throw new Error('Encoded representation of unknown number Token found');
        }
        return t;
    }
    /**
     * Find a Token by key.
     *
     * This excludes the token markers.
     */
    lookupToken(key) {
        const token = this.stringTokenMap.get(key);
        if (!token) {
            throw new Error(`Unrecognized token key: ${key}`);
        }
        return token;
    }
    registerStringKey(token, displayHint) {
        const counter = this.tokenCounter++;
        const representation = (displayHint || 'TOKEN').replace(new RegExp(`[^${encoding_1.VALID_KEY_CHARS}]`, 'g'), '.');
        const key = `${representation}.${counter}`;
        this.stringTokenMap.set(key, token);
        return key;
    }
    registerNumberKey(token) {
        const counter = this.tokenCounter++;
        const dbl = (0, encoding_1.createTokenDouble)(counter);
        // Register in the number map, as well as a string representation of that token
        // in the string map.
        this.numberTokenMap.set(counter, token);
        this.stringTokenMap.set(`${dbl}`, token);
        return dbl;
    }
}
exports.TokenMap = TokenMap;
/**
 * Get a cached value for an object, storing it on the object in a symbol
 */
function cachedValue(x, sym, prod) {
    let cached = x[sym];
    if (cached === undefined) {
        cached = prod();
        Object.defineProperty(x, sym, { value: cached });
    }
    return cached;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tbWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidG9rZW4tbWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQUdvQjtBQUdwQixvQ0FBcUQ7QUFFckQsTUFBTSxJQUFJLEdBQUcsTUFBYSxDQUFDO0FBRTNCLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUNsRSxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDOUQsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBRWxFOzs7Ozs7OztHQVFHO0FBQ0gsTUFBYSxRQUFRO0lBQXJCO1FBV21CLG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQXVCLENBQUM7UUFDaEQsbUJBQWMsR0FBRyxJQUFJLEdBQUcsRUFBdUIsQ0FBQztRQUVqRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQXlCRztRQUNLLGlCQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUEySHhELENBQUM7SUFsS0M7O09BRUc7SUFDSSxNQUFNLENBQUMsUUFBUTtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7U0FDckM7UUFDRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7S0FDM0I7SUFpQ0Q7Ozs7Ozs7Ozs7T0FVRztJQUNJLGNBQWMsQ0FBQyxLQUFrQixFQUFFLFdBQW9CO1FBQzVELE9BQU8sV0FBVyxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFO1lBQzVDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7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LEtBQUssQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsT0FBTyxHQUFHLENBQUM7S0FDWjtDQUNGO0FBbktELDRCQW1LQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxXQUFXLENBQXNCLENBQUksRUFBRSxHQUFXLEVBQUUsSUFBYTtJQUN4RSxJQUFJLE1BQU0sR0FBSSxDQUFTLENBQUMsR0FBVSxDQUFDLENBQUM7SUFDcEMsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO1FBQ3hCLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQztRQUNoQixNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztLQUNsRDtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBCRUdJTl9MSVNUX1RPS0VOX01BUktFUiwgQkVHSU5fU1RSSU5HX1RPS0VOX01BUktFUiwgY3JlYXRlVG9rZW5Eb3VibGUsXG4gIEVORF9UT0tFTl9NQVJLRVIsIGV4dHJhY3RUb2tlbkRvdWJsZSwgVG9rZW5TdHJpbmcsIFZBTElEX0tFWV9DSEFSUyxcbn0gZnJvbSAnLi9lbmNvZGluZyc7XG5pbXBvcnQgeyBJUmVzb2x2YWJsZSB9IGZyb20gJy4uL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgVG9rZW5pemVkU3RyaW5nRnJhZ21lbnRzIH0gZnJvbSAnLi4vc3RyaW5nLWZyYWdtZW50cyc7XG5pbXBvcnQgeyBpc1Jlc29sdmFibGVPYmplY3QsIFRva2VuIH0gZnJvbSAnLi4vdG9rZW4nO1xuXG5jb25zdCBnbG9iID0gZ2xvYmFsIGFzIGFueTtcblxuY29uc3QgU1RSSU5HX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2NvcmUuVG9rZW5NYXAuU1RSSU5HJyk7XG5jb25zdCBMSVNUX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2NvcmUuVG9rZW5NYXAuTElTVCcpO1xuY29uc3QgTlVNQkVSX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2NvcmUuVG9rZW5NYXAuTlVNQkVSJyk7XG5cbi8qKlxuICogQ2VudHJhbCBwbGFjZSB3aGVyZSB3ZSBrZWVwIGEgbWFwcGluZyBmcm9tIFRva2VucyB0byB0aGVpciBTdHJpbmcgcmVwcmVzZW50YXRpb25cbiAqXG4gKiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGlzIHVzZWQgdG8gZW1iZWQgdG9rZW4gaW50byBzdHJpbmdzLFxuICogYW5kIHN0b3JlZCB0byBiZSBhYmxlIHRvIHJldmVyc2UgdGhhdCBtYXBwaW5nLlxuICpcbiAqIEFsbCBpbnN0YW5jZXMgb2YgVG9rZW5TdHJpbmdNYXAgc2hhcmUgdGhlIHNhbWUgc3RvcmFnZSwgc28gdGhhdCB0aGlzIHByb2Nlc3NcbiAqIHdvcmtzIGV2ZW4gd2hlbiBkaWZmZXJlbnQgY29waWVzIG9mIHRoZSBsaWJyYXJ5IGFyZSBsb2FkZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb2tlbk1hcCB7XG4gIC8qKlxuICAgKiBTaW5nbGV0b24gaW5zdGFuY2Ugb2YgdGhlIHRva2VuIHN0cmluZyBtYXBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2UoKTogVG9rZW5NYXAge1xuICAgIGlmICghZ2xvYi5fX2Nka1Rva2VuTWFwKSB7XG4gICAgICBnbG9iLl9fY2RrVG9rZW5NYXAgPSBuZXcgVG9rZW5NYXAoKTtcbiAgICB9XG4gICAgcmV0dXJuIGdsb2IuX19jZGtUb2tlbk1hcDtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgc3RyaW5nVG9rZW5NYXAgPSBuZXcgTWFwPHN0cmluZywgSVJlc29sdmFibGU+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgbnVtYmVyVG9rZW5NYXAgPSBuZXcgTWFwPG51bWJlciwgSVJlc29sdmFibGU+KCk7XG5cbiAgLyoqXG4gICAqIENvdW50ZXIgdG8gYXNzaWduIHVuaXF1ZSBJRHMgdG8gdG9rZW5zXG4gICAqXG4gICAqIFN0YXJ0IGF0IGEgcmFuZG9tIG51bWJlciB0byBwcmV2ZW50IHBlb3BsZSBmcm9tIGFjY2lkZW50YWxseSB0YWtpbmdcbiAgICogZGVwZW5kZW5jaWVzIG9uIHRva2VuIHZhbHVlcyBiZXR3ZWVuIHJ1bnMuXG4gICAqXG4gICAqIFRoaXMgaXMgbW9zdCBwcm9taW5lbnQgaW4gdGVzdHMsIHdoZXJlIHBlb3BsZSB3aWxsIHdyaXRlOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBzaGEyNTYoSlNPTi5zdHJpbmdpZnkoeyAuLi5zb21lIHN0cnVjdHVyZSB0aGF0IGNhbiBjb250YWluIHRva2VucyAuLi4gfSkpXG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGlzIHNob3VsZCBoYXZlIGJlZW46XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIHNoYTI1NihKU09OLnN0cmluZ2lmeShzdGFjay5yZXNvbHZlKHsgLi4uc29tZSBzdHJ1Y3R1cmUgdGhhdCBjYW4gY29udGFpbiB0b2tlbnMgLi4uIH0pKSlcbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBoYXNoIHZhbHVlIGlzIGhhcmQgdG8gaW5zcGVjdCBmb3IgY29ycmVjdG5lc3MuIEl0IHdpbGwgTE9PSyBjb25zaXN0ZW50XG4gICAqIGR1cmluZyB0ZXN0aW5nLCBidXQgd2lsbCBicmVhayBhcyBzb29uIGFzIHNvbWVvbmUgc3RyaW5naWZpZXMgYW5vdGhlclxuICAgKiB0b2tlbiBiZWZvcmUgdGhlIHJ1bi5cbiAgICpcbiAgICogQnkgY2hhbmdpbmcgdGhlIHN0YXJ0aW5nIG51bWJlciBmb3IgdG9rZW5zLCB3ZSBlbnN1cmUgdGhhdCB0aGUgaGFzaCBpcyBhbG1vc3RcbiAgICogZ3VhcmFudGVlZCB0byBiZSBkaWZmZXJlbnQgZHVyaW5nIGEgZmV3IHRlc3QgcnVucywgc28gdGhlIGhhc2hpbmcgb2YgdW5yZXNvbHZlZFxuICAgKiB0b2tlbnMgY2FuIGJlIGRldGVjdGVkLlxuICAgKi9cbiAgcHJpdmF0ZSB0b2tlbkNvdW50ZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIGEgdW5pcXVlIHN0cmluZyBmb3IgdGhpcyBUb2tlbiwgcmV0dXJuaW5nIGEga2V5XG4gICAqXG4gICAqIEV2ZXJ5IGNhbGwgZm9yIHRoZSBzYW1lIFRva2VuIHdpbGwgcHJvZHVjZSBhIG5ldyB1bmlxdWUgc3RyaW5nLCBub1xuICAgKiBhdHRlbXB0IGlzIG1hZGUgdG8gZGVkdXBsaWNhdGUuIFRva2VuIG9iamVjdHMgc2hvdWxkIGNhY2hlIHRoZVxuICAgKiB2YWx1ZSB0aGVtc2VsdmVzLCBpZiByZXF1aXJlZC5cbiAgICpcbiAgICogVGhlIHRva2VuIGNhbiBjaG9vc2UgKHBhcnQgb2YpIGl0cyBvd24gcmVwcmVzZW50YXRpb24gc3RyaW5nIHdpdGggYVxuICAgKiBoaW50LiBUaGlzIG1heSBiZSB1c2VkIHRvIHByb2R1Y2UgYWVzdGhldGljYWxseSBwbGVhc2luZyBhbmRcbiAgICogcmVjb2duaXphYmxlIHRva2VuIHJlcHJlc2VudGF0aW9ucyBmb3IgaHVtYW5zLlxuICAgKi9cbiAgcHVibGljIHJlZ2lzdGVyU3RyaW5nKHRva2VuOiBJUmVzb2x2YWJsZSwgZGlzcGxheUhpbnQ/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBjYWNoZWRWYWx1ZSh0b2tlbiwgU1RSSU5HX1NZTUJPTCwgKCkgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gdGhpcy5yZWdpc3RlclN0cmluZ0tleSh0b2tlbiwgZGlzcGxheUhpbnQpO1xuICAgICAgcmV0dXJuIGAke0JFR0lOX1NUUklOR19UT0tFTl9NQVJLRVJ9JHtrZXl9JHtFTkRfVE9LRU5fTUFSS0VSfWA7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgYSB1bmlxdWUgc3RyaW5nIGZvciB0aGlzIFRva2VuLCByZXR1cm5pbmcgYSBrZXlcbiAgICovXG4gIHB1YmxpYyByZWdpc3Rlckxpc3QodG9rZW46IElSZXNvbHZhYmxlLCBkaXNwbGF5SGludD86IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gY2FjaGVkVmFsdWUodG9rZW4sIExJU1RfU1lNQk9MLCAoKSA9PiB7XG4gICAgICBjb25zdCBrZXkgPSB0aGlzLnJlZ2lzdGVyU3RyaW5nS2V5KHRva2VuLCBkaXNwbGF5SGludCk7XG4gICAgICByZXR1cm4gW2Ake0JFR0lOX0xJU1RfVE9LRU5fTUFSS0VSfSR7a2V5fSR7RU5EX1RPS0VOX01BUktFUn1gXTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSB1bmlxdWUgbnVtYmVyIHJlcHJlc2VudGF0aW9uIGZvciB0aGlzIFRva2VuIGFuZCByZXR1cm4gaXRcbiAgICovXG4gIHB1YmxpYyByZWdpc3Rlck51bWJlcih0b2tlbjogSVJlc29sdmFibGUpOiBudW1iZXIge1xuICAgIHJldHVybiBjYWNoZWRWYWx1ZSh0b2tlbiwgTlVNQkVSX1NZTUJPTCwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucmVnaXN0ZXJOdW1iZXJLZXkodG9rZW4pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvb2t1cCBhIHRva2VuIGZyb20gYW4gZW5jb2RlZCB2YWx1ZVxuICAgKi9cbiAgcHVibGljIHRva2VuRnJvbUVuY29kaW5nKHg6IGFueSk6IElSZXNvbHZhYmxlIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoaXNSZXNvbHZhYmxlT2JqZWN0KHgpKSB7IHJldHVybiB4OyB9XG4gICAgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykgeyByZXR1cm4gdGhpcy5sb29rdXBTdHJpbmcoeCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh4KSkgeyByZXR1cm4gdGhpcy5sb29rdXBMaXN0KHgpOyB9XG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZCh4KSkgeyByZXR1cm4geDsgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV2ZXJzZSBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRvIGEgVG9rZW4gb2JqZWN0XG4gICAqL1xuICBwdWJsaWMgbG9va3VwU3RyaW5nKHM6IHN0cmluZyk6IElSZXNvbHZhYmxlIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBmcmFnbWVudHMgPSB0aGlzLnNwbGl0U3RyaW5nKHMpO1xuICAgIGlmIChmcmFnbWVudHMudG9rZW5zLmxlbmd0aCA+IDAgJiYgZnJhZ21lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIGZyYWdtZW50cy5maXJzdFRva2VuO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldmVyc2UgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50byBhIFRva2VuIG9iamVjdFxuICAgKi9cbiAgcHVibGljIGxvb2t1cExpc3QoeHM6IHN0cmluZ1tdKTogSVJlc29sdmFibGUgfCB1bmRlZmluZWQge1xuICAgIGlmICh4cy5sZW5ndGggIT09IDEpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIGNvbnN0IHN0ciA9IFRva2VuU3RyaW5nLmZvckxpc3RUb2tlbih4c1swXSk7XG4gICAgY29uc3QgZnJhZ21lbnRzID0gc3RyLnNwbGl0KHRoaXMubG9va3VwVG9rZW4uYmluZCh0aGlzKSk7XG4gICAgaWYgKGZyYWdtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBmcmFnbWVudHMuZmlyc3RUb2tlbjtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTcGxpdCBhIHN0cmluZyBpbnRvIGxpdGVyYWxzIGFuZCBUb2tlbnNcbiAgICovXG4gIHB1YmxpYyBzcGxpdFN0cmluZyhzOiBzdHJpbmcpOiBUb2tlbml6ZWRTdHJpbmdGcmFnbWVudHMge1xuICAgIGNvbnN0IHN0ciA9IFRva2VuU3RyaW5nLmZvclN0cmluZyhzKTtcbiAgICByZXR1cm4gc3RyLnNwbGl0KHRoaXMubG9va3VwVG9rZW4uYmluZCh0aGlzKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV2ZXJzZSBhIG51bWJlciBlbmNvZGluZyBpbnRvIGEgVG9rZW4sIG9yIHVuZGVmaW5lZCBpZiB0aGUgbnVtYmVyIHdhc24ndCBhIFRva2VuXG4gICAqL1xuICBwdWJsaWMgbG9va3VwTnVtYmVyVG9rZW4oeDogbnVtYmVyKTogSVJlc29sdmFibGUgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHRva2VuSW5kZXggPSBleHRyYWN0VG9rZW5Eb3VibGUoeCk7XG4gICAgaWYgKHRva2VuSW5kZXggPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgY29uc3QgdCA9IHRoaXMubnVtYmVyVG9rZW5NYXAuZ2V0KHRva2VuSW5kZXgpO1xuICAgIGlmICh0ID09PSB1bmRlZmluZWQpIHsgdGhyb3cgbmV3IEVycm9yKCdFbmNvZGVkIHJlcHJlc2VudGF0aW9uIG9mIHVua25vd24gbnVtYmVyIFRva2VuIGZvdW5kJyk7IH1cbiAgICByZXR1cm4gdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIGEgVG9rZW4gYnkga2V5LlxuICAgKlxuICAgKiBUaGlzIGV4Y2x1ZGVzIHRoZSB0b2tlbiBtYXJrZXJzLlxuICAgKi9cbiAgcHVibGljIGxvb2t1cFRva2VuKGtleTogc3RyaW5nKTogSVJlc29sdmFibGUge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5zdHJpbmdUb2tlbk1hcC5nZXQoa2V5KTtcbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjb2duaXplZCB0b2tlbiBrZXk6ICR7a2V5fWApO1xuICAgIH1cbiAgICByZXR1cm4gdG9rZW47XG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyU3RyaW5nS2V5KHRva2VuOiBJUmVzb2x2YWJsZSwgZGlzcGxheUhpbnQ/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNvdW50ZXIgPSB0aGlzLnRva2VuQ291bnRlcisrO1xuICAgIGNvbnN0IHJlcHJlc2VudGF0aW9uID0gKGRpc3BsYXlIaW50IHx8ICdUT0tFTicpLnJlcGxhY2UobmV3IFJlZ0V4cChgW14ke1ZBTElEX0tFWV9DSEFSU31dYCwgJ2cnKSwgJy4nKTtcbiAgICBjb25zdCBrZXkgPSBgJHtyZXByZXNlbnRhdGlvbn0uJHtjb3VudGVyfWA7XG4gICAgdGhpcy5zdHJpbmdUb2tlbk1hcC5zZXQoa2V5LCB0b2tlbik7XG4gICAgcmV0dXJuIGtleTtcbiAgfVxuXG4gIHByaXZhdGUgcmVnaXN0ZXJOdW1iZXJLZXkodG9rZW46IElSZXNvbHZhYmxlKTogbnVtYmVyIHtcbiAgICBjb25zdCBjb3VudGVyID0gdGhpcy50b2tlbkNvdW50ZXIrKztcbiAgICBjb25zdCBkYmwgPSBjcmVhdGVUb2tlbkRvdWJsZShjb3VudGVyKTtcbiAgICAvLyBSZWdpc3RlciBpbiB0aGUgbnVtYmVyIG1hcCwgYXMgd2VsbCBhcyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGF0IHRva2VuXG4gICAgLy8gaW4gdGhlIHN0cmluZyBtYXAuXG4gICAgdGhpcy5udW1iZXJUb2tlbk1hcC5zZXQoY291bnRlciwgdG9rZW4pO1xuICAgIHRoaXMuc3RyaW5nVG9rZW5NYXAuc2V0KGAke2RibH1gLCB0b2tlbik7XG4gICAgcmV0dXJuIGRibDtcbiAgfVxufVxuXG4vKipcbiAqIEdldCBhIGNhY2hlZCB2YWx1ZSBmb3IgYW4gb2JqZWN0LCBzdG9yaW5nIGl0IG9uIHRoZSBvYmplY3QgaW4gYSBzeW1ib2xcbiAqL1xuZnVuY3Rpb24gY2FjaGVkVmFsdWU8QSBleHRlbmRzIG9iamVjdCwgQj4oeDogQSwgc3ltOiBzeW1ib2wsIHByb2Q6ICgpID0+IEIpIHtcbiAgbGV0IGNhY2hlZCA9ICh4IGFzIGFueSlbc3ltIGFzIGFueV07XG4gIGlmIChjYWNoZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIGNhY2hlZCA9IHByb2QoKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoeCwgc3ltLCB7IHZhbHVlOiBjYWNoZWQgfSk7XG4gIH1cbiAgcmV0dXJuIGNhY2hlZDtcbn1cbiJdfQ==