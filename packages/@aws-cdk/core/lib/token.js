"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.withResolved = exports.isResolvableObject = exports.JsonNull = exports.Tokenization = exports.Token = exports.TokenComparison = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
_a = JSII_RTTI_SYMBOL_1;
TokenComparison[_a] = { fqn: "@aws-cdk/core.TokenComparison", version: "0.0.0" };
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
exports.TokenComparison = TokenComparison;
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
     * containing resolvables.
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
        try {
            jsiiDeprecationWarnings._aws_cdk_core_EncodingOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.asString);
            }
            throw error;
        }
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
        try {
            jsiiDeprecationWarnings._aws_cdk_core_EncodingOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.asList);
            }
            throw error;
        }
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
_b = JSII_RTTI_SYMBOL_1;
Token[_b] = { fqn: "@aws-cdk/core.Token", version: "0.0.0" };
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
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ReverseOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.reverse);
            }
            throw error;
        }
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
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ResolveOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.resolve);
            }
            throw error;
        }
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
_c = JSII_RTTI_SYMBOL_1;
Tokenization[_c] = { fqn: "@aws-cdk/core.Tokenization", version: "0.0.0" };
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
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IResolveContext(_ctx);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.resolve);
            }
            throw error;
        }
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
_d = JSII_RTTI_SYMBOL_1;
JsonNull[_d] = { fqn: "@aws-cdk/core.JsonNull", version: "0.0.0" };
/** The canonical instance of `JsonNull`. */
JsonNull.INSTANCE = new JsonNull();
exports.JsonNull = JsonNull;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0b2tlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxpQ0FBOEI7QUFDOUIsaURBQWdEO0FBQ2hELG1EQUFnRDtBQUNoRCwrQ0FBNEM7QUFDNUMsbURBQStDO0FBSS9DOzs7R0FHRztBQUNILE1BQWEsZUFBZTtJQW1CMUI7S0FDQzs7OztBQW5CRDs7O0dBR0c7QUFDb0Isb0JBQUksR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO0FBRXBEOzs7R0FHRztBQUNvQix5QkFBUyxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7QUFFekQsMkRBQTJEO0FBQ3BDLDhCQUFjLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztBQUU5RCw2Q0FBNkM7QUFDdEIsK0JBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO0FBakJwRCwwQ0FBZTtBQXVCNUI7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxLQUFLO0lBQ2hCOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQVE7UUFDakMsT0FBTyxJQUFBLHFCQUFVLEVBQUMsR0FBRyxDQUFDLENBQUM7S0FDeEI7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFVLEVBQUUsVUFBMkIsRUFBRTs7Ozs7Ozs7OztRQUM5RCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUFFLE9BQU8sS0FBSyxDQUFDO1NBQUU7UUFDaEQsT0FBTyxvQkFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNwRjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFVO1FBQy9CLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUM7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LGdEQUVDO0FBV0QsU0FBZ0IsWUFBWSxDQUFDLEdBQUcsSUFBVztJQUN6QyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQUUsT0FBTztLQUFFO0lBQ2hDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEQsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRTtRQUFFLE9BQU87S0FBRTtJQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFMRCxvQ0FLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IExhenkgfSBmcm9tICcuL2xhenknO1xuaW1wb3J0IHsgdW5yZXNvbHZlZCB9IGZyb20gJy4vcHJpdmF0ZS9lbmNvZGluZyc7XG5pbXBvcnQgeyBJbnRyaW5zaWMgfSBmcm9tICcuL3ByaXZhdGUvaW50cmluc2ljJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICcuL3ByaXZhdGUvcmVzb2x2ZSc7XG5pbXBvcnQgeyBUb2tlbk1hcCB9IGZyb20gJy4vcHJpdmF0ZS90b2tlbi1tYXAnO1xuaW1wb3J0IHsgSVJlc29sdmFibGUsIElUb2tlblJlc29sdmVyLCBJUmVzb2x2ZUNvbnRleHQgfSBmcm9tICcuL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgVG9rZW5pemVkU3RyaW5nRnJhZ21lbnRzIH0gZnJvbSAnLi9zdHJpbmctZnJhZ21lbnRzJztcblxuLyoqXG4gKiBBbiBlbnVtLWxpa2UgY2xhc3MgdGhhdCByZXByZXNlbnRzIHRoZSByZXN1bHQgb2YgY29tcGFyaW5nIHR3byBUb2tlbnMuXG4gKiBUaGUgcmV0dXJuIHR5cGUgb2YgYFRva2VuLmNvbXBhcmVTdHJpbmdzYC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRva2VuQ29tcGFyaXNvbiB7XG4gIC8qKlxuICAgKiBUaGlzIG1lYW5zIHdlJ3JlIGNlcnRhaW4gdGhlIHR3byBjb21wb25lbnRzIGFyZSBOT1RcbiAgICogVG9rZW5zLCBhbmQgaWRlbnRpY2FsLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBTQU1FID0gbmV3IFRva2VuQ29tcGFyaXNvbigpO1xuXG4gIC8qKlxuICAgKiBUaGlzIG1lYW5zIHdlJ3JlIGNlcnRhaW4gdGhlIHR3byBjb21wb25lbnRzIGFyZSBOT1RcbiAgICogVG9rZW5zLCBhbmQgZGlmZmVyZW50LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBESUZGRVJFTlQgPSBuZXcgVG9rZW5Db21wYXJpc29uKCk7XG5cbiAgLyoqIFRoaXMgbWVhbnMgZXhhY3RseSBvbmUgb2YgdGhlIGNvbXBvbmVudHMgaXMgYSBUb2tlbi4gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBPTkVfVU5SRVNPTFZFRCA9IG5ldyBUb2tlbkNvbXBhcmlzb24oKTtcblxuICAvKiogVGhpcyBtZWFucyBib3RoIGNvbXBvbmVudHMgYXJlIFRva2Vucy4gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBCT1RIX1VOUkVTT0xWRUQgPSBuZXcgVG9rZW5Db21wYXJpc29uKCk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgfVxufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBzcGVjaWFsIG9yIGxhemlseS1ldmFsdWF0ZWQgdmFsdWUuXG4gKlxuICogQ2FuIGJlIHVzZWQgdG8gZGVsYXkgZXZhbHVhdGlvbiBvZiBhIGNlcnRhaW4gdmFsdWUgaW4gY2FzZSwgZm9yIGV4YW1wbGUsXG4gKiB0aGF0IGl0IHJlcXVpcmVzIHNvbWUgY29udGV4dCBvciBsYXRlLWJvdW5kIGRhdGEuIENhbiBhbHNvIGJlIHVzZWQgdG9cbiAqIG1hcmsgdmFsdWVzIHRoYXQgbmVlZCBzcGVjaWFsIHByb2Nlc3NpbmcgYXQgZG9jdW1lbnQgcmVuZGVyaW5nIHRpbWUuXG4gKlxuICogVG9rZW5zIGNhbiBiZSBlbWJlZGRlZCBpbnRvIHN0cmluZ3Mgd2hpbGUgcmV0YWluaW5nIHRoZWlyIG9yaWdpbmFsXG4gKiBzZW1hbnRpY3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb2tlbiB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgb2JqIHJlcHJlc2VudHMgYW4gdW5yZXNvbHZlZCB2YWx1ZVxuICAgKlxuICAgKiBPbmUgb2YgdGhlc2UgbXVzdCBiZSB0cnVlOlxuICAgKlxuICAgKiAtIGBvYmpgIGlzIGFuIElSZXNvbHZhYmxlXG4gICAqIC0gYG9iamAgaXMgYSBzdHJpbmcgY29udGFpbmluZyBhdCBsZWFzdCBvbmUgZW5jb2RlZCBgSVJlc29sdmFibGVgXG4gICAqIC0gYG9iamAgaXMgZWl0aGVyIGFuIGVuY29kZWQgbnVtYmVyIG9yIGxpc3RcbiAgICpcbiAgICogVGhpcyBkb2VzIE5PVCByZWN1cnNlIGludG8gbGlzdHMgb3Igb2JqZWN0cyB0byBzZWUgaWYgdGhleVxuICAgKiBjb250YWluaW5nIHJlc29sdmFibGVzLlxuICAgKlxuICAgKiBAcGFyYW0gb2JqIFRoZSBvYmplY3QgdG8gdGVzdC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNVbnJlc29sdmVkKG9iajogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHVucmVzb2x2ZWQob2JqKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSByZXZlcnNpYmxlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHRva2VuXG4gICAqXG4gICAqIElmIHRoZSBUb2tlbiBpcyBpbml0aWFsaXplZCB3aXRoIGEgbGl0ZXJhbCwgdGhlIHN0cmluZ2lmaWVkIHZhbHVlIG9mIHRoZVxuICAgKiBsaXRlcmFsIGlzIHJldHVybmVkLiBPdGhlcndpc2UsIGEgc3BlY2lhbCBxdW90ZWQgc3RyaW5nIHJlcHJlc2VudGF0aW9uXG4gICAqIG9mIHRoZSBUb2tlbiBpcyByZXR1cm5lZCB0aGF0IGNhbiBiZSBlbWJlZGRlZCBpbnRvIG90aGVyIHN0cmluZ3MuXG4gICAqXG4gICAqIFN0cmluZ3Mgd2l0aCBxdW90ZWQgVG9rZW5zIGluIHRoZW0gY2FuIGJlIHJlc3RvcmVkIGJhY2sgaW50b1xuICAgKiBjb21wbGV4IHZhbHVlcyB3aXRoIHRoZSBUb2tlbnMgcmVzdG9yZWQgYnkgY2FsbGluZyBgcmVzb2x2ZSgpYFxuICAgKiBvbiB0aGUgc3RyaW5nLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhc1N0cmluZyh2YWx1ZTogYW55LCBvcHRpb25zOiBFbmNvZGluZ09wdGlvbnMgPSB7fSk6IHN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHsgcmV0dXJuIHZhbHVlOyB9XG4gICAgcmV0dXJuIFRva2VuTWFwLmluc3RhbmNlKCkucmVnaXN0ZXJTdHJpbmcoVG9rZW4uYXNBbnkodmFsdWUpLCBvcHRpb25zLmRpc3BsYXlIaW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSByZXZlcnNpYmxlIG51bWJlciByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHRva2VuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFzTnVtYmVyKHZhbHVlOiBhbnkpOiBudW1iZXIge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7IHJldHVybiB2YWx1ZTsgfVxuICAgIHJldHVybiBUb2tlbk1hcC5pbnN0YW5jZSgpLnJlZ2lzdGVyTnVtYmVyKFRva2VuLmFzQW55KHZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgcmV2ZXJzaWJsZSBsaXN0IHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgdG9rZW5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXNMaXN0KHZhbHVlOiBhbnksIG9wdGlvbnM6IEVuY29kaW5nT3B0aW9ucyA9IHt9KTogc3RyaW5nW10ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5ldmVyeSh4ID0+IHR5cGVvZiB4ID09PSAnc3RyaW5nJykpIHsgcmV0dXJuIHZhbHVlOyB9XG4gICAgcmV0dXJuIFRva2VuTWFwLmluc3RhbmNlKCkucmVnaXN0ZXJMaXN0KFRva2VuLmFzQW55KHZhbHVlKSwgb3B0aW9ucy5kaXNwbGF5SGludCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgcmVzb2x2YWJsZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gdmFsdWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXNBbnkodmFsdWU6IGFueSk6IElSZXNvbHZhYmxlIHtcbiAgICAvLyBGaXJzdCwgcmV2ZXJzZSBhbnkgZW5jb2RpbmcgdGhhdCB3YXMgYWxyZWFkeSBkb25lIChzbyB3ZSBlbmQgdXAgd2l0aCBhbiBJUmVzb2x2YWJsZVxuICAgIC8vIGlmIGl0IHdhcyBhIHRva2VuKS5cbiAgICB2YWx1ZSA9IFRva2VuaXphdGlvbi5yZXZlcnNlKHZhbHVlKSA/PyB2YWx1ZTtcbiAgICAvLyBUaGVuLCAgZWl0aGVyIHJldHVybiB0aGUgSVJlc29sdmFibGUgd2UgcmVzb2x2ZWQgdG8sIG9yIHdyYXAgaW4gYW4gSW50cmluc2ljXG4gICAgcmV0dXJuIGlzUmVzb2x2YWJsZU9iamVjdCh2YWx1ZSkgPyB2YWx1ZSA6IG5ldyBJbnRyaW5zaWModmFsdWUpO1xuICB9XG5cbiAgLyoqIENvbXBhcmUgdHdvIHN0cmluZ3MgdGhhdCBtaWdodCBjb250YWluIFRva2VucyB3aXRoIGVhY2ggb3RoZXIuICovXG4gIHB1YmxpYyBzdGF0aWMgY29tcGFyZVN0cmluZ3MocG9zc2libGVUb2tlbjE6IHN0cmluZywgcG9zc2libGVUb2tlbjI6IHN0cmluZyk6IFRva2VuQ29tcGFyaXNvbiB7XG4gICAgY29uc3QgZmlyc3RJc1VucmVzb2x2ZWQgPSBUb2tlbi5pc1VucmVzb2x2ZWQocG9zc2libGVUb2tlbjEpO1xuICAgIGNvbnN0IHNlY29uZElzVW5yZXNvbHZlZCA9IFRva2VuLmlzVW5yZXNvbHZlZChwb3NzaWJsZVRva2VuMik7XG5cbiAgICBpZiAoZmlyc3RJc1VucmVzb2x2ZWQgJiYgc2Vjb25kSXNVbnJlc29sdmVkKSB7XG4gICAgICByZXR1cm4gVG9rZW5Db21wYXJpc29uLkJPVEhfVU5SRVNPTFZFRDtcbiAgICB9XG4gICAgaWYgKGZpcnN0SXNVbnJlc29sdmVkIHx8IHNlY29uZElzVW5yZXNvbHZlZCkge1xuICAgICAgcmV0dXJuIFRva2VuQ29tcGFyaXNvbi5PTkVfVU5SRVNPTFZFRDtcbiAgICB9XG5cbiAgICByZXR1cm4gcG9zc2libGVUb2tlbjEgPT09IHBvc3NpYmxlVG9rZW4yID8gVG9rZW5Db21wYXJpc29uLlNBTUUgOiBUb2tlbkNvbXBhcmlzb24uRElGRkVSRU5UO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgfVxufVxuXG4vKipcbiAqIExlc3Mgb2Z0LW5lZWRlZCBmdW5jdGlvbnMgdG8gbWFuaXB1bGF0ZSBUb2tlbnNcbiAqL1xuZXhwb3J0IGNsYXNzIFRva2VuaXphdGlvbiB7XG4gIC8qKlxuICAgKiBVbi1lbmNvZGUgYSBzdHJpbmcgcG90ZW50aWFsbHkgY29udGFpbmluZyBlbmNvZGVkIHRva2Vuc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZXZlcnNlU3RyaW5nKHM6IHN0cmluZyk6IFRva2VuaXplZFN0cmluZ0ZyYWdtZW50cyB7XG4gICAgcmV0dXJuIFRva2VuTWFwLmluc3RhbmNlKCkuc3BsaXRTdHJpbmcocyk7XG4gIH1cblxuICAvKipcbiAgICogVW4tZW5jb2RlIGEgc3RyaW5nIHdoaWNoIGlzIGVpdGhlciBhIGNvbXBsZXRlIGVuY29kZWQgdG9rZW4sIG9yIGRvZXNuJ3QgY29udGFpbiB0b2tlbnMgYXQgYWxsXG4gICAqXG4gICAqIEl0J3MgaWxsZWdhbCBmb3IgdGhlIHN0cmluZyB0byBiZSBhIGNvbmNhdGVuYXRpb24gb2YgYW4gZW5jb2RlZCB0b2tlbiBhbmQgc29tZXRoaW5nIGVsc2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJldmVyc2VDb21wbGV0ZVN0cmluZyhzOiBzdHJpbmcpOiBJUmVzb2x2YWJsZSB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgZnJhZ21lbnRzID0gVG9rZW5pemF0aW9uLnJldmVyc2VTdHJpbmcocyk7XG4gICAgaWYgKGZyYWdtZW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVG9rZW56YXRpb24ucmV2ZXJzZUNvbXBsZXRlU3RyaW5nOiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIGNvbmNhdGVudGF0aW9uLCBnb3QgJyR7c30nYCk7XG4gICAgfVxuICAgIHJldHVybiBmcmFnbWVudHMuZmlyc3RUb2tlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbi1lbmNvZGUgYSBUb2tlbml6ZWQgdmFsdWUgZnJvbSBhIG51bWJlclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZXZlcnNlTnVtYmVyKG46IG51bWJlcik6IElSZXNvbHZhYmxlIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gVG9rZW5NYXAuaW5zdGFuY2UoKS5sb29rdXBOdW1iZXJUb2tlbihuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbi1lbmNvZGUgYSBUb2tlbml6ZWQgdmFsdWUgZnJvbSBhIGxpc3RcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmV2ZXJzZUxpc3QobDogc3RyaW5nW10pOiBJUmVzb2x2YWJsZSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIFRva2VuTWFwLmluc3RhbmNlKCkubG9va3VwTGlzdChsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXZlcnNlIGFueSB2YWx1ZSBpbnRvIGEgUmVzb2x2YWJsZSwgaWYgcG9zc2libGVcbiAgICpcbiAgICogSW4gY2FzZSBvZiBhIHN0cmluZywgdGhlIHN0cmluZyBtdXN0IG5vdCBiZSBhIGNvbmNhdGVuYXRpb24uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJldmVyc2UoeDogYW55LCBvcHRpb25zOiBSZXZlcnNlT3B0aW9ucyA9IHt9KTogSVJlc29sdmFibGUgfCB1bmRlZmluZWQge1xuICAgIGlmIChUb2tlbml6YXRpb24uaXNSZXNvbHZhYmxlKHgpKSB7IHJldHVybiB4OyB9XG4gICAgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKG9wdGlvbnMuZmFpbENvbmNhdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgLy8gSGFuZGxlIHRoaXMgc3BlY2lhbGx5IGJlY2F1c2UgcmV2ZXJzZUNvbXBsZXRlU3RyaW5nIG1pZ2h0IGZhaWxcbiAgICAgICAgY29uc3QgZnJhZ21lbnRzID0gVG9rZW5pemF0aW9uLnJldmVyc2VTdHJpbmcoeCk7XG4gICAgICAgIHJldHVybiBmcmFnbWVudHMubGVuZ3RoID09PSAxID8gZnJhZ21lbnRzLmZpcnN0VG9rZW4gOiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gVG9rZW5pemF0aW9uLnJldmVyc2VDb21wbGV0ZVN0cmluZyh4KTtcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoeCkpIHsgcmV0dXJuIFRva2VuaXphdGlvbi5yZXZlcnNlTGlzdCh4KTsgfVxuICAgIGlmICh0eXBlb2YgeCA9PT0gJ251bWJlcicpIHsgcmV0dXJuIFRva2VuaXphdGlvbi5yZXZlcnNlTnVtYmVyKHgpOyB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlcyBhbiBvYmplY3QgYnkgZXZhbHVhdGluZyBhbGwgdG9rZW5zIGFuZCByZW1vdmluZyBhbnkgdW5kZWZpbmVkIG9yIGVtcHR5IG9iamVjdHMgb3IgYXJyYXlzLlxuICAgKiBWYWx1ZXMgY2FuIG9ubHkgYmUgcHJpbWl0aXZlcywgYXJyYXlzIG9yIHRva2Vucy4gT3RoZXIgb2JqZWN0cyAoaS5lLiB3aXRoIG1ldGhvZHMpIHdpbGwgYmUgcmVqZWN0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCB0byByZXNvbHZlLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBQcmVmaXgga2V5IHBhdGggY29tcG9uZW50cyBmb3IgZGlhZ25vc3RpY3MuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlc29sdmUob2JqOiBhbnksIG9wdGlvbnM6IFJlc29sdmVPcHRpb25zKTogYW55IHtcbiAgICByZXR1cm4gcmVzb2x2ZShvYmosIHtcbiAgICAgIHNjb3BlOiBvcHRpb25zLnNjb3BlLFxuICAgICAgcmVzb2x2ZXI6IG9wdGlvbnMucmVzb2x2ZXIsXG4gICAgICBwcmVwYXJpbmc6IChvcHRpb25zLnByZXBhcmluZyA/PyBmYWxzZSksXG4gICAgICByZW1vdmVFbXB0eTogb3B0aW9ucy5yZW1vdmVFbXB0eSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gd2hldGhlciB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIElSZXNvbHZhYmxlIG9iamVjdFxuICAgKlxuICAgKiBUaGlzIGlzIGRpZmZlcmVudCBmcm9tIFRva2VuLmlzVW5yZXNvbHZlZCgpIHdoaWNoIHdpbGwgYWxzbyBjaGVjayBmb3JcbiAgICogZW5jb2RlZCBUb2tlbnMsIHdoZXJlYXMgdGhpcyBtZXRob2Qgd2lsbCBvbmx5IGRvIGEgdHlwZSBjaGVjayBvbiB0aGUgZ2l2ZW5cbiAgICogb2JqZWN0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc1Jlc29sdmFibGUob2JqOiBhbnkpOiBvYmogaXMgSVJlc29sdmFibGUge1xuICAgIHJldHVybiBpc1Jlc29sdmFibGVPYmplY3Qob2JqKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdHJpbmdpZnkgYSBudW1iZXIgZGlyZWN0bHkgb3IgbGF6aWx5IGlmIGl0J3MgYSBUb2tlbi4gSWYgaXQgaXMgYW4gb2JqZWN0IChpLmUuLCB7IFJlZjogJ1NvbWVMb2dpY2FsSWQnIH0pLCByZXR1cm4gaXQgYXMtaXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHN0cmluZ2lmeU51bWJlcih4OiBudW1iZXIpIHtcbiAgICAvLyBvbmx5IGNvbnZlcnQgbnVtYmVycyB0byBzdHJpbmdzIHNvIHRoYXQgUmVmcywgY29uZGl0aW9ucywgYW5kIG90aGVyIHRoaW5ncyBkb24ndCBlbmQgdXAgc3ludGhlc2l6aW5nIGFzIFtvYmplY3Qgb2JqZWN0XVxuXG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZCh4KSkge1xuICAgICAgcmV0dXJuIExhenkudW5jYWNoZWRTdHJpbmcoe1xuICAgICAgICBwcm9kdWNlOiBjb250ZXh0ID0+IHtcbiAgICAgICAgICBjb25zdCByZXNvbHZlZCA9IGNvbnRleHQucmVzb2x2ZSh4KTtcbiAgICAgICAgICByZXR1cm4gdHlwZW9mIHJlc29sdmVkICE9PSAnbnVtYmVyJyA/IHJlc29sdmVkIDogYCR7cmVzb2x2ZWR9YDtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHggIT09ICdudW1iZXInID8geCA6IGAke3h9YDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICB9XG59XG5cbi8qKlxuICogQW4gb2JqZWN0IHdoaWNoIHNlcmlhbGl6ZXMgdG8gdGhlIEpTT04gYG51bGxgIGxpdGVyYWwsIGFuZCB3aGljaCBjYW4gc2FmZWx5XG4gKiBiZSBwYXNzZWQgYWNyb3NzIGxhbmd1YWdlcyB3aGVyZSBgdW5kZWZpbmVkYCBhbmQgYG51bGxgIGFyZSBub3QgZGlmZmVyZW50LlxuICovXG5leHBvcnQgY2xhc3MgSnNvbk51bGwgaW1wbGVtZW50cyBJUmVzb2x2YWJsZSB7XG4gIC8qKiBUaGUgY2Fub25pY2FsIGluc3RhbmNlIG9mIGBKc29uTnVsbGAuICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgSU5TVEFOQ0UgPSBuZXcgSnNvbk51bGwoKTtcblxuICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRpb25TdGFjazogc3RyaW5nW10gPSBbXTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgcHVibGljIHJlc29sdmUoX2N0eDogSVJlc29sdmVDb250ZXh0KTogYW55IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBPYnRhaW5zIHRoZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgb2JqZWN0IChgbnVsbGApICovXG4gIHB1YmxpYyB0b0pTT04oKTogYW55IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBPYnRhaW5zIHRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBvYmplY3QgKGAnbnVsbCdgKSAqL1xuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgdGhlICdyZXZlcnNlKCknIG9wZXJhdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJldmVyc2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIEZhaWwgaWYgdGhlIGdpdmVuIHN0cmluZyBpcyBhIGNvbmNhdGVuYXRpb25cbiAgICpcbiAgICogSWYgYGZhbHNlYCwganVzdCByZXR1cm4gYHVuZGVmaW5lZGAuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGZhaWxDb25jYXQ/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgdG8gdGhlIHJlc29sdmUoKSBvcGVyYXRpb25cbiAqXG4gKiBOT1QgdGhlIHNhbWUgYXMgdGhlIFJlc29sdmVDb250ZXh0OyBSZXNvbHZlQ29udGV4dCBpcyBleHBvc2VkIHRvIFRva2VuXG4gKiBpbXBsZW1lbnRvcnMgYW5kIHJlc29sdXRpb24gaG9va3MsIHdoZXJlYXMgdGhpcyBzdHJ1Y3QgaXMganVzdCB0byBidW5kbGVcbiAqIGEgbnVtYmVyIG9mIHRoaW5ncyB0aGF0IHdvdWxkIG90aGVyd2lzZSBiZSBhcmd1bWVudHMgdG8gcmVzb2x2ZSgpIGluIGFcbiAqIHJlYWRhYmxlIHdheS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXNvbHZlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgc2NvcGUgZnJvbSB3aGljaCByZXNvbHV0aW9uIGlzIHBlcmZvcm1lZFxuICAgKi9cbiAgcmVhZG9ubHkgc2NvcGU6IElDb25zdHJ1Y3Q7XG5cbiAgLyoqXG4gICAqIFRoZSByZXNvbHZlciB0byBhcHBseSB0byBhbnkgcmVzb2x2YWJsZSB0b2tlbnMgZm91bmRcbiAgICovXG4gIHJlYWRvbmx5IHJlc29sdmVyOiBJVG9rZW5SZXNvbHZlcjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgcmVzb2x1dGlvbiBpcyBiZWluZyBleGVjdXRlZCBkdXJpbmcgdGhlIHByZXBhcmUgcGhhc2Ugb3Igbm90LlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJlcGFyaW5nPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byByZW1vdmUgdW5kZWZpbmVkIGVsZW1lbnRzIGZyb20gYXJyYXlzIGFuZCBvYmplY3RzIHdoZW4gcmVzb2x2aW5nLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSByZW1vdmVFbXB0eT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUHJvcGVydGllcyB0byBzdHJpbmcgZW5jb2RpbmdzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW5jb2RpbmdPcHRpb25zIHtcbiAgLyoqXG4gICAqIEEgaGludCBmb3IgdGhlIFRva2VuJ3MgcHVycG9zZSB3aGVuIHN0cmluZ2lmeWluZyBpdFxuICAgKi9cbiAgcmVhZG9ubHkgZGlzcGxheUhpbnQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Jlc29sdmFibGVPYmplY3QoeDogYW55KTogeCBpcyBJUmVzb2x2YWJsZSB7XG4gIHJldHVybiB0eXBlb2YoeCkgPT09ICdvYmplY3QnICYmIHggIT09IG51bGwgJiYgdHlwZW9mIHgucmVzb2x2ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuLyoqXG4gKiBDYWxsIHRoZSBnaXZlbiBmdW5jdGlvbiBvbmx5IGlmIGFsbCBnaXZlbiB2YWx1ZXMgYXJlIHJlc29sdmVkXG4gKlxuICogRXhwb3J0ZWQgYXMgYSBmdW5jdGlvbiBzaW5jZSBpdCB3aWxsIGJlIHVzZWQgYnkgVHlwZVNjcmlwdCBtb2R1bGVzLCBidXRcbiAqIGNhbid0IGJlIGV4cG9zZWQgdmlhIEpTSUkgYmVjYXVzZSBvZiB0aGUgZ2VuZXJpY3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aXRoUmVzb2x2ZWQ8QT4oYTogQSwgZm46IChhOiBBKSA9PiB2b2lkKTogdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoUmVzb2x2ZWQ8QSwgQj4oYTogQSwgYjogQiwgZm46IChhOiBBLCBiOiBCKSA9PiB2b2lkKTogdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoUmVzb2x2ZWQ8QSwgQiwgQz4oYTogQSwgYjogQiwgYzogQywgZm46IChhOiBBLCBiOiBCLCBjOiBDKSA9PiB2b2lkKTogdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoUmVzb2x2ZWQoLi4uYXJnczogYW55W10pIHtcbiAgaWYgKGFyZ3MubGVuZ3RoIDwgMikgeyByZXR1cm47IH1cbiAgY29uc3QgYXJnQXJyYXkgPSBhcmdzLnNsaWNlKDAsIGFyZ3MubGVuZ3RoIC0gMSk7XG4gIGlmIChhcmdBcnJheS5zb21lKFRva2VuLmlzVW5yZXNvbHZlZCkpIHsgcmV0dXJuOyB9XG4gIGFyZ3NbYXJncy5sZW5ndGggLSAxXS5hcHBseShhcmd1bWVudHMsIGFyZ0FycmF5KTtcbn1cbiJdfQ==