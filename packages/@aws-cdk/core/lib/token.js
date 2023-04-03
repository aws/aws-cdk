"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withResolved = exports.isResolvableObject = exports.JsonNull = exports.Tokenization = exports.Token = exports.TokenComparison = void 0;
const lazy_1 = require("./lazy");
const encoding_1 = require("./private/encoding");
const intrinsic_1 = require("./private/intrinsic");
const resolve_1 = require("./private/resolve");
const token_map_1 = require("./private/token-map");
/**
 * An enum-like class that represents the result of comparing two Tokens.
 * The return type of `Token.compareStrings`.
 */
class TokenComparison {
    constructor() {
    }
}
exports.TokenComparison = TokenComparison;
/**
 * This means we're certain the two components are NOT
 * Tokens, and identical.
 */
TokenComparison.SAME = new TokenComparison();
/**
 * This means we're certain the two components are NOT
 * Tokens, and different.
 */
TokenComparison.DIFFERENT = new TokenComparison();
/** This means exactly one of the components is a Token. */
TokenComparison.ONE_UNRESOLVED = new TokenComparison();
/** This means both components are Tokens. */
TokenComparison.BOTH_UNRESOLVED = new TokenComparison();
/**
 * Represents a special or lazily-evaluated value.
 *
 * Can be used to delay evaluation of a certain value in case, for example,
 * that it requires some context or late-bound data. Can also be used to
 * mark values that need special processing at document rendering time.
 *
 * Tokens can be embedded into strings while retaining their original
 * semantics.
 */
class Token {
    /**
     * Returns true if obj represents an unresolved value
     *
     * One of these must be true:
     *
     * - `obj` is an IResolvable
     * - `obj` is a string containing at least one encoded `IResolvable`
     * - `obj` is either an encoded number or list
     *
     * This does NOT recurse into lists or objects to see if they
     * contain resolvables.
     *
     * @param obj The object to test.
     */
    static isUnresolved(obj) {
        return (0, encoding_1.unresolved)(obj);
    }
    /**
     * Return a reversible string representation of this token
     *
     * If the Token is initialized with a literal, the stringified value of the
     * literal is returned. Otherwise, a special quoted string representation
     * of the Token is returned that can be embedded into other strings.
     *
     * Strings with quoted Tokens in them can be restored back into
     * complex values with the Tokens restored by calling `resolve()`
     * on the string.
     */
    static asString(value, options = {}) {
        if (typeof value === 'string') {
            return value;
        }
        return token_map_1.TokenMap.instance().registerString(Token.asAny(value), options.displayHint);
    }
    /**
     * Return a reversible number representation of this token
     */
    static asNumber(value) {
        if (typeof value === 'number') {
            return value;
        }
        return token_map_1.TokenMap.instance().registerNumber(Token.asAny(value));
    }
    /**
     * Return a reversible list representation of this token
     */
    static asList(value, options = {}) {
        if (Array.isArray(value) && value.every(x => typeof x === 'string')) {
            return value;
        }
        return token_map_1.TokenMap.instance().registerList(Token.asAny(value), options.displayHint);
    }
    /**
     * Return a resolvable representation of the given value
     */
    static asAny(value) {
        // First, reverse any encoding that was already done (so we end up with an IResolvable
        // if it was a token).
        value = Tokenization.reverse(value) ?? value;
        // Then,  either return the IResolvable we resolved to, or wrap in an Intrinsic
        return isResolvableObject(value) ? value : new intrinsic_1.Intrinsic(value);
    }
    /** Compare two strings that might contain Tokens with each other. */
    static compareStrings(possibleToken1, possibleToken2) {
        const firstIsUnresolved = Token.isUnresolved(possibleToken1);
        const secondIsUnresolved = Token.isUnresolved(possibleToken2);
        if (firstIsUnresolved && secondIsUnresolved) {
            return TokenComparison.BOTH_UNRESOLVED;
        }
        if (firstIsUnresolved || secondIsUnresolved) {
            return TokenComparison.ONE_UNRESOLVED;
        }
        return possibleToken1 === possibleToken2 ? TokenComparison.SAME : TokenComparison.DIFFERENT;
    }
    constructor() {
    }
}
exports.Token = Token;
/**
 * Less oft-needed functions to manipulate Tokens
 */
class Tokenization {
    /**
     * Un-encode a string potentially containing encoded tokens
     */
    static reverseString(s) {
        return token_map_1.TokenMap.instance().splitString(s);
    }
    /**
     * Un-encode a string which is either a complete encoded token, or doesn't contain tokens at all
     *
     * It's illegal for the string to be a concatenation of an encoded token and something else.
     */
    static reverseCompleteString(s) {
        const fragments = Tokenization.reverseString(s);
        if (fragments.length !== 1) {
            throw new Error(`Tokenzation.reverseCompleteString: argument must not be a concatentation, got '${s}'`);
        }
        return fragments.firstToken;
    }
    /**
     * Un-encode a Tokenized value from a number
     */
    static reverseNumber(n) {
        return token_map_1.TokenMap.instance().lookupNumberToken(n);
    }
    /**
     * Un-encode a Tokenized value from a list
     */
    static reverseList(l) {
        return token_map_1.TokenMap.instance().lookupList(l);
    }
    /**
     * Reverse any value into a Resolvable, if possible
     *
     * In case of a string, the string must not be a concatenation.
     */
    static reverse(x, options = {}) {
        if (Tokenization.isResolvable(x)) {
            return x;
        }
        if (typeof x === 'string') {
            if (options.failConcat === false) {
                // Handle this specially because reverseCompleteString might fail
                const fragments = Tokenization.reverseString(x);
                return fragments.length === 1 ? fragments.firstToken : undefined;
            }
            return Tokenization.reverseCompleteString(x);
        }
        if (Array.isArray(x)) {
            return Tokenization.reverseList(x);
        }
        if (typeof x === 'number') {
            return Tokenization.reverseNumber(x);
        }
        return undefined;
    }
    /**
     * Resolves an object by evaluating all tokens and removing any undefined or empty objects or arrays.
     * Values can only be primitives, arrays or tokens. Other objects (i.e. with methods) will be rejected.
     *
     * @param obj The object to resolve.
     * @param options Prefix key path components for diagnostics.
     */
    static resolve(obj, options) {
        return (0, resolve_1.resolve)(obj, {
            scope: options.scope,
            resolver: options.resolver,
            preparing: (options.preparing ?? false),
            removeEmpty: options.removeEmpty,
        });
    }
    /**
     * Return whether the given object is an IResolvable object
     *
     * This is different from Token.isUnresolved() which will also check for
     * encoded Tokens, whereas this method will only do a type check on the given
     * object.
     */
    static isResolvable(obj) {
        return isResolvableObject(obj);
    }
    /**
     * Stringify a number directly or lazily if it's a Token. If it is an object (i.e., { Ref: 'SomeLogicalId' }), return it as-is.
     */
    static stringifyNumber(x) {
        // only convert numbers to strings so that Refs, conditions, and other things don't end up synthesizing as [object object]
        if (Token.isUnresolved(x)) {
            return lazy_1.Lazy.uncachedString({
                produce: context => {
                    const resolved = context.resolve(x);
                    return typeof resolved !== 'number' ? resolved : `${resolved}`;
                },
            });
        }
        else {
            return typeof x !== 'number' ? x : `${x}`;
        }
    }
    constructor() {
    }
}
exports.Tokenization = Tokenization;
/**
 * An object which serializes to the JSON `null` literal, and which can safely
 * be passed across languages where `undefined` and `null` are not different.
 */
class JsonNull {
    constructor() {
        this.creationStack = [];
    }
    resolve(_ctx) {
        return null;
    }
    /** Obtains the JSON representation of this object (`null`) */
    toJSON() {
        return null;
    }
    /** Obtains the string representation of this object (`'null'`) */
    toString() {
        return 'null';
    }
}
exports.JsonNull = JsonNull;
/** The canonical instance of `JsonNull`. */
JsonNull.INSTANCE = new JsonNull();
function isResolvableObject(x) {
    return typeof (x) === 'object' && x !== null && typeof x.resolve === 'function';
}
exports.isResolvableObject = isResolvableObject;
function withResolved(...args) {
    if (args.length < 2) {
        return;
    }
    const argArray = args.slice(0, args.length - 1);
    if (argArray.some(Token.isUnresolved)) {
        return;
    }
    args[args.length - 1].apply(arguments, argArray);
}
exports.withResolved = withResolved;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0b2tlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBOEI7QUFDOUIsaURBQWdEO0FBQ2hELG1EQUFnRDtBQUNoRCwrQ0FBNEM7QUFDNUMsbURBQStDO0FBSS9DOzs7R0FHRztBQUNILE1BQWEsZUFBZTtJQW1CMUI7SUFDQSxDQUFDOztBQXBCSCwwQ0FxQkM7QUFwQkM7OztHQUdHO0FBQ29CLG9CQUFJLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztBQUVwRDs7O0dBR0c7QUFDb0IseUJBQVMsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO0FBRXpELDJEQUEyRDtBQUNwQyw4QkFBYyxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7QUFFOUQsNkNBQTZDO0FBQ3RCLCtCQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztBQU1qRTs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFhLEtBQUs7SUFDaEI7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBUTtRQUNqQyxPQUFPLElBQUEscUJBQVUsRUFBQyxHQUFHLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBVSxFQUFFLFVBQTJCLEVBQUU7UUFDOUQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQztTQUFFO1FBQ2hELE9BQU8sb0JBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFVO1FBQy9CLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUM7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QUFPLENBQUMsQ0FBQyxPQUFPLEtBQUssVUFBVSxDQUFDO0FBQ2pGLENBQUM7QUFGRCxnREFFQztBQVdELFNBQWdCLFlBQVksQ0FBQyxHQUFHLElBQVc7SUFDekMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUFFLE9BQU87S0FBRTtJQUNoQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2hELElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFBRSxPQUFPO0tBQUU7SUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBTEQsb0NBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBMYXp5IH0gZnJvbSAnLi9sYXp5JztcbmltcG9ydCB7IHVucmVzb2x2ZWQgfSBmcm9tICcuL3ByaXZhdGUvZW5jb2RpbmcnO1xuaW1wb3J0IHsgSW50cmluc2ljIH0gZnJvbSAnLi9wcml2YXRlL2ludHJpbnNpYyc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnLi9wcml2YXRlL3Jlc29sdmUnO1xuaW1wb3J0IHsgVG9rZW5NYXAgfSBmcm9tICcuL3ByaXZhdGUvdG9rZW4tbWFwJztcbmltcG9ydCB7IElSZXNvbHZhYmxlLCBJVG9rZW5SZXNvbHZlciwgSVJlc29sdmVDb250ZXh0IH0gZnJvbSAnLi9yZXNvbHZhYmxlJztcbmltcG9ydCB7IFRva2VuaXplZFN0cmluZ0ZyYWdtZW50cyB9IGZyb20gJy4vc3RyaW5nLWZyYWdtZW50cyc7XG5cbi8qKlxuICogQW4gZW51bS1saWtlIGNsYXNzIHRoYXQgcmVwcmVzZW50cyB0aGUgcmVzdWx0IG9mIGNvbXBhcmluZyB0d28gVG9rZW5zLlxuICogVGhlIHJldHVybiB0eXBlIG9mIGBUb2tlbi5jb21wYXJlU3RyaW5nc2AuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb2tlbkNvbXBhcmlzb24ge1xuICAvKipcbiAgICogVGhpcyBtZWFucyB3ZSdyZSBjZXJ0YWluIHRoZSB0d28gY29tcG9uZW50cyBhcmUgTk9UXG4gICAqIFRva2VucywgYW5kIGlkZW50aWNhbC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU0FNRSA9IG5ldyBUb2tlbkNvbXBhcmlzb24oKTtcblxuICAvKipcbiAgICogVGhpcyBtZWFucyB3ZSdyZSBjZXJ0YWluIHRoZSB0d28gY29tcG9uZW50cyBhcmUgTk9UXG4gICAqIFRva2VucywgYW5kIGRpZmZlcmVudC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgRElGRkVSRU5UID0gbmV3IFRva2VuQ29tcGFyaXNvbigpO1xuXG4gIC8qKiBUaGlzIG1lYW5zIGV4YWN0bHkgb25lIG9mIHRoZSBjb21wb25lbnRzIGlzIGEgVG9rZW4uICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgT05FX1VOUkVTT0xWRUQgPSBuZXcgVG9rZW5Db21wYXJpc29uKCk7XG5cbiAgLyoqIFRoaXMgbWVhbnMgYm90aCBjb21wb25lbnRzIGFyZSBUb2tlbnMuICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQk9USF9VTlJFU09MVkVEID0gbmV3IFRva2VuQ29tcGFyaXNvbigpO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgc3BlY2lhbCBvciBsYXppbHktZXZhbHVhdGVkIHZhbHVlLlxuICpcbiAqIENhbiBiZSB1c2VkIHRvIGRlbGF5IGV2YWx1YXRpb24gb2YgYSBjZXJ0YWluIHZhbHVlIGluIGNhc2UsIGZvciBleGFtcGxlLFxuICogdGhhdCBpdCByZXF1aXJlcyBzb21lIGNvbnRleHQgb3IgbGF0ZS1ib3VuZCBkYXRhLiBDYW4gYWxzbyBiZSB1c2VkIHRvXG4gKiBtYXJrIHZhbHVlcyB0aGF0IG5lZWQgc3BlY2lhbCBwcm9jZXNzaW5nIGF0IGRvY3VtZW50IHJlbmRlcmluZyB0aW1lLlxuICpcbiAqIFRva2VucyBjYW4gYmUgZW1iZWRkZWQgaW50byBzdHJpbmdzIHdoaWxlIHJldGFpbmluZyB0aGVpciBvcmlnaW5hbFxuICogc2VtYW50aWNzLlxuICovXG5leHBvcnQgY2xhc3MgVG9rZW4ge1xuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIG9iaiByZXByZXNlbnRzIGFuIHVucmVzb2x2ZWQgdmFsdWVcbiAgICpcbiAgICogT25lIG9mIHRoZXNlIG11c3QgYmUgdHJ1ZTpcbiAgICpcbiAgICogLSBgb2JqYCBpcyBhbiBJUmVzb2x2YWJsZVxuICAgKiAtIGBvYmpgIGlzIGEgc3RyaW5nIGNvbnRhaW5pbmcgYXQgbGVhc3Qgb25lIGVuY29kZWQgYElSZXNvbHZhYmxlYFxuICAgKiAtIGBvYmpgIGlzIGVpdGhlciBhbiBlbmNvZGVkIG51bWJlciBvciBsaXN0XG4gICAqXG4gICAqIFRoaXMgZG9lcyBOT1QgcmVjdXJzZSBpbnRvIGxpc3RzIG9yIG9iamVjdHMgdG8gc2VlIGlmIHRoZXlcbiAgICogY29udGFpbiByZXNvbHZhYmxlcy5cbiAgICpcbiAgICogQHBhcmFtIG9iaiBUaGUgb2JqZWN0IHRvIHRlc3QuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzVW5yZXNvbHZlZChvYmo6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB1bnJlc29sdmVkKG9iaik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgcmV2ZXJzaWJsZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyB0b2tlblxuICAgKlxuICAgKiBJZiB0aGUgVG9rZW4gaXMgaW5pdGlhbGl6ZWQgd2l0aCBhIGxpdGVyYWwsIHRoZSBzdHJpbmdpZmllZCB2YWx1ZSBvZiB0aGVcbiAgICogbGl0ZXJhbCBpcyByZXR1cm5lZC4gT3RoZXJ3aXNlLCBhIHNwZWNpYWwgcXVvdGVkIHN0cmluZyByZXByZXNlbnRhdGlvblxuICAgKiBvZiB0aGUgVG9rZW4gaXMgcmV0dXJuZWQgdGhhdCBjYW4gYmUgZW1iZWRkZWQgaW50byBvdGhlciBzdHJpbmdzLlxuICAgKlxuICAgKiBTdHJpbmdzIHdpdGggcXVvdGVkIFRva2VucyBpbiB0aGVtIGNhbiBiZSByZXN0b3JlZCBiYWNrIGludG9cbiAgICogY29tcGxleCB2YWx1ZXMgd2l0aCB0aGUgVG9rZW5zIHJlc3RvcmVkIGJ5IGNhbGxpbmcgYHJlc29sdmUoKWBcbiAgICogb24gdGhlIHN0cmluZy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXNTdHJpbmcodmFsdWU6IGFueSwgb3B0aW9uczogRW5jb2RpbmdPcHRpb25zID0ge30pOiBzdHJpbmcge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7IHJldHVybiB2YWx1ZTsgfVxuICAgIHJldHVybiBUb2tlbk1hcC5pbnN0YW5jZSgpLnJlZ2lzdGVyU3RyaW5nKFRva2VuLmFzQW55KHZhbHVlKSwgb3B0aW9ucy5kaXNwbGF5SGludCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgcmV2ZXJzaWJsZSBudW1iZXIgcmVwcmVzZW50YXRpb24gb2YgdGhpcyB0b2tlblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhc051bWJlcih2YWx1ZTogYW55KTogbnVtYmVyIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgeyByZXR1cm4gdmFsdWU7IH1cbiAgICByZXR1cm4gVG9rZW5NYXAuaW5zdGFuY2UoKS5yZWdpc3Rlck51bWJlcihUb2tlbi5hc0FueSh2YWx1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIHJldmVyc2libGUgbGlzdCByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHRva2VuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFzTGlzdCh2YWx1ZTogYW55LCBvcHRpb25zOiBFbmNvZGluZ09wdGlvbnMgPSB7fSk6IHN0cmluZ1tdIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUuZXZlcnkoeCA9PiB0eXBlb2YgeCA9PT0gJ3N0cmluZycpKSB7IHJldHVybiB2YWx1ZTsgfVxuICAgIHJldHVybiBUb2tlbk1hcC5pbnN0YW5jZSgpLnJlZ2lzdGVyTGlzdChUb2tlbi5hc0FueSh2YWx1ZSksIG9wdGlvbnMuZGlzcGxheUhpbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIHJlc29sdmFibGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIHZhbHVlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFzQW55KHZhbHVlOiBhbnkpOiBJUmVzb2x2YWJsZSB7XG4gICAgLy8gRmlyc3QsIHJldmVyc2UgYW55IGVuY29kaW5nIHRoYXQgd2FzIGFscmVhZHkgZG9uZSAoc28gd2UgZW5kIHVwIHdpdGggYW4gSVJlc29sdmFibGVcbiAgICAvLyBpZiBpdCB3YXMgYSB0b2tlbikuXG4gICAgdmFsdWUgPSBUb2tlbml6YXRpb24ucmV2ZXJzZSh2YWx1ZSkgPz8gdmFsdWU7XG4gICAgLy8gVGhlbiwgIGVpdGhlciByZXR1cm4gdGhlIElSZXNvbHZhYmxlIHdlIHJlc29sdmVkIHRvLCBvciB3cmFwIGluIGFuIEludHJpbnNpY1xuICAgIHJldHVybiBpc1Jlc29sdmFibGVPYmplY3QodmFsdWUpID8gdmFsdWUgOiBuZXcgSW50cmluc2ljKHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBDb21wYXJlIHR3byBzdHJpbmdzIHRoYXQgbWlnaHQgY29udGFpbiBUb2tlbnMgd2l0aCBlYWNoIG90aGVyLiAqL1xuICBwdWJsaWMgc3RhdGljIGNvbXBhcmVTdHJpbmdzKHBvc3NpYmxlVG9rZW4xOiBzdHJpbmcsIHBvc3NpYmxlVG9rZW4yOiBzdHJpbmcpOiBUb2tlbkNvbXBhcmlzb24ge1xuICAgIGNvbnN0IGZpcnN0SXNVbnJlc29sdmVkID0gVG9rZW4uaXNVbnJlc29sdmVkKHBvc3NpYmxlVG9rZW4xKTtcbiAgICBjb25zdCBzZWNvbmRJc1VucmVzb2x2ZWQgPSBUb2tlbi5pc1VucmVzb2x2ZWQocG9zc2libGVUb2tlbjIpO1xuXG4gICAgaWYgKGZpcnN0SXNVbnJlc29sdmVkICYmIHNlY29uZElzVW5yZXNvbHZlZCkge1xuICAgICAgcmV0dXJuIFRva2VuQ29tcGFyaXNvbi5CT1RIX1VOUkVTT0xWRUQ7XG4gICAgfVxuICAgIGlmIChmaXJzdElzVW5yZXNvbHZlZCB8fCBzZWNvbmRJc1VucmVzb2x2ZWQpIHtcbiAgICAgIHJldHVybiBUb2tlbkNvbXBhcmlzb24uT05FX1VOUkVTT0xWRUQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvc3NpYmxlVG9rZW4xID09PSBwb3NzaWJsZVRva2VuMiA/IFRva2VuQ29tcGFyaXNvbi5TQU1FIDogVG9rZW5Db21wYXJpc29uLkRJRkZFUkVOVDtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gIH1cbn1cblxuLyoqXG4gKiBMZXNzIG9mdC1uZWVkZWQgZnVuY3Rpb25zIHRvIG1hbmlwdWxhdGUgVG9rZW5zXG4gKi9cbmV4cG9ydCBjbGFzcyBUb2tlbml6YXRpb24ge1xuICAvKipcbiAgICogVW4tZW5jb2RlIGEgc3RyaW5nIHBvdGVudGlhbGx5IGNvbnRhaW5pbmcgZW5jb2RlZCB0b2tlbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmV2ZXJzZVN0cmluZyhzOiBzdHJpbmcpOiBUb2tlbml6ZWRTdHJpbmdGcmFnbWVudHMge1xuICAgIHJldHVybiBUb2tlbk1hcC5pbnN0YW5jZSgpLnNwbGl0U3RyaW5nKHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuLWVuY29kZSBhIHN0cmluZyB3aGljaCBpcyBlaXRoZXIgYSBjb21wbGV0ZSBlbmNvZGVkIHRva2VuLCBvciBkb2Vzbid0IGNvbnRhaW4gdG9rZW5zIGF0IGFsbFxuICAgKlxuICAgKiBJdCdzIGlsbGVnYWwgZm9yIHRoZSBzdHJpbmcgdG8gYmUgYSBjb25jYXRlbmF0aW9uIG9mIGFuIGVuY29kZWQgdG9rZW4gYW5kIHNvbWV0aGluZyBlbHNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZXZlcnNlQ29tcGxldGVTdHJpbmcoczogc3RyaW5nKTogSVJlc29sdmFibGUgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGZyYWdtZW50cyA9IFRva2VuaXphdGlvbi5yZXZlcnNlU3RyaW5nKHMpO1xuICAgIGlmIChmcmFnbWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRva2VuemF0aW9uLnJldmVyc2VDb21wbGV0ZVN0cmluZzogYXJndW1lbnQgbXVzdCBub3QgYmUgYSBjb25jYXRlbnRhdGlvbiwgZ290ICcke3N9J2ApO1xuICAgIH1cbiAgICByZXR1cm4gZnJhZ21lbnRzLmZpcnN0VG9rZW47XG4gIH1cblxuICAvKipcbiAgICogVW4tZW5jb2RlIGEgVG9rZW5pemVkIHZhbHVlIGZyb20gYSBudW1iZXJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmV2ZXJzZU51bWJlcihuOiBudW1iZXIpOiBJUmVzb2x2YWJsZSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIFRva2VuTWFwLmluc3RhbmNlKCkubG9va3VwTnVtYmVyVG9rZW4obik7XG4gIH1cblxuICAvKipcbiAgICogVW4tZW5jb2RlIGEgVG9rZW5pemVkIHZhbHVlIGZyb20gYSBsaXN0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJldmVyc2VMaXN0KGw6IHN0cmluZ1tdKTogSVJlc29sdmFibGUgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBUb2tlbk1hcC5pbnN0YW5jZSgpLmxvb2t1cExpc3QobCk7XG4gIH1cblxuICAvKipcbiAgICogUmV2ZXJzZSBhbnkgdmFsdWUgaW50byBhIFJlc29sdmFibGUsIGlmIHBvc3NpYmxlXG4gICAqXG4gICAqIEluIGNhc2Ugb2YgYSBzdHJpbmcsIHRoZSBzdHJpbmcgbXVzdCBub3QgYmUgYSBjb25jYXRlbmF0aW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZXZlcnNlKHg6IGFueSwgb3B0aW9uczogUmV2ZXJzZU9wdGlvbnMgPSB7fSk6IElSZXNvbHZhYmxlIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoVG9rZW5pemF0aW9uLmlzUmVzb2x2YWJsZSh4KSkgeyByZXR1cm4geDsgfVxuICAgIGlmICh0eXBlb2YgeCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChvcHRpb25zLmZhaWxDb25jYXQgPT09IGZhbHNlKSB7XG4gICAgICAgIC8vIEhhbmRsZSB0aGlzIHNwZWNpYWxseSBiZWNhdXNlIHJldmVyc2VDb21wbGV0ZVN0cmluZyBtaWdodCBmYWlsXG4gICAgICAgIGNvbnN0IGZyYWdtZW50cyA9IFRva2VuaXphdGlvbi5yZXZlcnNlU3RyaW5nKHgpO1xuICAgICAgICByZXR1cm4gZnJhZ21lbnRzLmxlbmd0aCA9PT0gMSA/IGZyYWdtZW50cy5maXJzdFRva2VuIDogdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFRva2VuaXphdGlvbi5yZXZlcnNlQ29tcGxldGVTdHJpbmcoeCk7XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KHgpKSB7IHJldHVybiBUb2tlbml6YXRpb24ucmV2ZXJzZUxpc3QoeCk7IH1cbiAgICBpZiAodHlwZW9mIHggPT09ICdudW1iZXInKSB7IHJldHVybiBUb2tlbml6YXRpb24ucmV2ZXJzZU51bWJlcih4KTsgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZXMgYW4gb2JqZWN0IGJ5IGV2YWx1YXRpbmcgYWxsIHRva2VucyBhbmQgcmVtb3ZpbmcgYW55IHVuZGVmaW5lZCBvciBlbXB0eSBvYmplY3RzIG9yIGFycmF5cy5cbiAgICogVmFsdWVzIGNhbiBvbmx5IGJlIHByaW1pdGl2ZXMsIGFycmF5cyBvciB0b2tlbnMuIE90aGVyIG9iamVjdHMgKGkuZS4gd2l0aCBtZXRob2RzKSB3aWxsIGJlIHJlamVjdGVkLlxuICAgKlxuICAgKiBAcGFyYW0gb2JqIFRoZSBvYmplY3QgdG8gcmVzb2x2ZS5cbiAgICogQHBhcmFtIG9wdGlvbnMgUHJlZml4IGtleSBwYXRoIGNvbXBvbmVudHMgZm9yIGRpYWdub3N0aWNzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZXNvbHZlKG9iajogYW55LCBvcHRpb25zOiBSZXNvbHZlT3B0aW9ucyk6IGFueSB7XG4gICAgcmV0dXJuIHJlc29sdmUob2JqLCB7XG4gICAgICBzY29wZTogb3B0aW9ucy5zY29wZSxcbiAgICAgIHJlc29sdmVyOiBvcHRpb25zLnJlc29sdmVyLFxuICAgICAgcHJlcGFyaW5nOiAob3B0aW9ucy5wcmVwYXJpbmcgPz8gZmFsc2UpLFxuICAgICAgcmVtb3ZlRW1wdHk6IG9wdGlvbnMucmVtb3ZlRW1wdHksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHdoZXRoZXIgdGhlIGdpdmVuIG9iamVjdCBpcyBhbiBJUmVzb2x2YWJsZSBvYmplY3RcbiAgICpcbiAgICogVGhpcyBpcyBkaWZmZXJlbnQgZnJvbSBUb2tlbi5pc1VucmVzb2x2ZWQoKSB3aGljaCB3aWxsIGFsc28gY2hlY2sgZm9yXG4gICAqIGVuY29kZWQgVG9rZW5zLCB3aGVyZWFzIHRoaXMgbWV0aG9kIHdpbGwgb25seSBkbyBhIHR5cGUgY2hlY2sgb24gdGhlIGdpdmVuXG4gICAqIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNSZXNvbHZhYmxlKG9iajogYW55KTogb2JqIGlzIElSZXNvbHZhYmxlIHtcbiAgICByZXR1cm4gaXNSZXNvbHZhYmxlT2JqZWN0KG9iaik7XG4gIH1cblxuICAvKipcbiAgICogU3RyaW5naWZ5IGEgbnVtYmVyIGRpcmVjdGx5IG9yIGxhemlseSBpZiBpdCdzIGEgVG9rZW4uIElmIGl0IGlzIGFuIG9iamVjdCAoaS5lLiwgeyBSZWY6ICdTb21lTG9naWNhbElkJyB9KSwgcmV0dXJuIGl0IGFzLWlzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdHJpbmdpZnlOdW1iZXIoeDogbnVtYmVyKSB7XG4gICAgLy8gb25seSBjb252ZXJ0IG51bWJlcnMgdG8gc3RyaW5ncyBzbyB0aGF0IFJlZnMsIGNvbmRpdGlvbnMsIGFuZCBvdGhlciB0aGluZ3MgZG9uJ3QgZW5kIHVwIHN5bnRoZXNpemluZyBhcyBbb2JqZWN0IG9iamVjdF1cblxuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQoeCkpIHtcbiAgICAgIHJldHVybiBMYXp5LnVuY2FjaGVkU3RyaW5nKHtcbiAgICAgICAgcHJvZHVjZTogY29udGV4dCA9PiB7XG4gICAgICAgICAgY29uc3QgcmVzb2x2ZWQgPSBjb250ZXh0LnJlc29sdmUoeCk7XG4gICAgICAgICAgcmV0dXJuIHR5cGVvZiByZXNvbHZlZCAhPT0gJ251bWJlcicgPyByZXNvbHZlZCA6IGAke3Jlc29sdmVkfWA7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ICE9PSAnbnVtYmVyJyA/IHggOiBgJHt4fWA7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgfVxufVxuXG4vKipcbiAqIEFuIG9iamVjdCB3aGljaCBzZXJpYWxpemVzIHRvIHRoZSBKU09OIGBudWxsYCBsaXRlcmFsLCBhbmQgd2hpY2ggY2FuIHNhZmVseVxuICogYmUgcGFzc2VkIGFjcm9zcyBsYW5ndWFnZXMgd2hlcmUgYHVuZGVmaW5lZGAgYW5kIGBudWxsYCBhcmUgbm90IGRpZmZlcmVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIEpzb25OdWxsIGltcGxlbWVudHMgSVJlc29sdmFibGUge1xuICAvKiogVGhlIGNhbm9uaWNhbCBpbnN0YW5jZSBvZiBgSnNvbk51bGxgLiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IElOU1RBTkNFID0gbmV3IEpzb25OdWxsKCk7XG5cbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdID0gW107XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIHB1YmxpYyByZXNvbHZlKF9jdHg6IElSZXNvbHZlQ29udGV4dCk6IGFueSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogT2J0YWlucyB0aGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGlzIG9iamVjdCAoYG51bGxgKSAqL1xuICBwdWJsaWMgdG9KU09OKCk6IGFueSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogT2J0YWlucyB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgb2JqZWN0IChgJ251bGwnYCkgKi9cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHRoZSAncmV2ZXJzZSgpJyBvcGVyYXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXZlcnNlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBGYWlsIGlmIHRoZSBnaXZlbiBzdHJpbmcgaXMgYSBjb25jYXRlbmF0aW9uXG4gICAqXG4gICAqIElmIGBmYWxzZWAsIGp1c3QgcmV0dXJuIGB1bmRlZmluZWRgLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBmYWlsQ29uY2F0PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBPcHRpb25zIHRvIHRoZSByZXNvbHZlKCkgb3BlcmF0aW9uXG4gKlxuICogTk9UIHRoZSBzYW1lIGFzIHRoZSBSZXNvbHZlQ29udGV4dDsgUmVzb2x2ZUNvbnRleHQgaXMgZXhwb3NlZCB0byBUb2tlblxuICogaW1wbGVtZW50b3JzIGFuZCByZXNvbHV0aW9uIGhvb2tzLCB3aGVyZWFzIHRoaXMgc3RydWN0IGlzIGp1c3QgdG8gYnVuZGxlXG4gKiBhIG51bWJlciBvZiB0aGluZ3MgdGhhdCB3b3VsZCBvdGhlcndpc2UgYmUgYXJndW1lbnRzIHRvIHJlc29sdmUoKSBpbiBhXG4gKiByZWFkYWJsZSB3YXkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVzb2x2ZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHNjb3BlIGZyb20gd2hpY2ggcmVzb2x1dGlvbiBpcyBwZXJmb3JtZWRcbiAgICovXG4gIHJlYWRvbmx5IHNjb3BlOiBJQ29uc3RydWN0O1xuXG4gIC8qKlxuICAgKiBUaGUgcmVzb2x2ZXIgdG8gYXBwbHkgdG8gYW55IHJlc29sdmFibGUgdG9rZW5zIGZvdW5kXG4gICAqL1xuICByZWFkb25seSByZXNvbHZlcjogSVRva2VuUmVzb2x2ZXI7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHJlc29sdXRpb24gaXMgYmVpbmcgZXhlY3V0ZWQgZHVyaW5nIHRoZSBwcmVwYXJlIHBoYXNlIG9yIG5vdC5cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHByZXBhcmluZz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcmVtb3ZlIHVuZGVmaW5lZCBlbGVtZW50cyBmcm9tIGFycmF5cyBhbmQgb2JqZWN0cyB3aGVuIHJlc29sdmluZy5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVtb3ZlRW1wdHk/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gc3RyaW5nIGVuY29kaW5nc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEVuY29kaW5nT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBIGhpbnQgZm9yIHRoZSBUb2tlbidzIHB1cnBvc2Ugd2hlbiBzdHJpbmdpZnlpbmcgaXRcbiAgICovXG4gIHJlYWRvbmx5IGRpc3BsYXlIaW50Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZXNvbHZhYmxlT2JqZWN0KHg6IGFueSk6IHggaXMgSVJlc29sdmFibGUge1xuICByZXR1cm4gdHlwZW9mKHgpID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsICYmIHR5cGVvZiB4LnJlc29sdmUgPT09ICdmdW5jdGlvbic7XG59XG5cbi8qKlxuICogQ2FsbCB0aGUgZ2l2ZW4gZnVuY3Rpb24gb25seSBpZiBhbGwgZ2l2ZW4gdmFsdWVzIGFyZSByZXNvbHZlZFxuICpcbiAqIEV4cG9ydGVkIGFzIGEgZnVuY3Rpb24gc2luY2UgaXQgd2lsbCBiZSB1c2VkIGJ5IFR5cGVTY3JpcHQgbW9kdWxlcywgYnV0XG4gKiBjYW4ndCBiZSBleHBvc2VkIHZpYSBKU0lJIGJlY2F1c2Ugb2YgdGhlIGdlbmVyaWNzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aFJlc29sdmVkPEE+KGE6IEEsIGZuOiAoYTogQSkgPT4gdm9pZCk6IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gd2l0aFJlc29sdmVkPEEsIEI+KGE6IEEsIGI6IEIsIGZuOiAoYTogQSwgYjogQikgPT4gdm9pZCk6IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gd2l0aFJlc29sdmVkPEEsIEIsIEM+KGE6IEEsIGI6IEIsIGM6IEMsIGZuOiAoYTogQSwgYjogQiwgYzogQykgPT4gdm9pZCk6IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gd2l0aFJlc29sdmVkKC4uLmFyZ3M6IGFueVtdKSB7XG4gIGlmIChhcmdzLmxlbmd0aCA8IDIpIHsgcmV0dXJuOyB9XG4gIGNvbnN0IGFyZ0FycmF5ID0gYXJncy5zbGljZSgwLCBhcmdzLmxlbmd0aCAtIDEpO1xuICBpZiAoYXJnQXJyYXkuc29tZShUb2tlbi5pc1VucmVzb2x2ZWQpKSB7IHJldHVybjsgfVxuICBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0uYXBwbHkoYXJndW1lbnRzLCBhcmdBcnJheSk7XG59XG4iXX0=