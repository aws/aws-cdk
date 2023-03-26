"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvedTypeHint = exports.RememberingTokenResolver = exports.findTokens = exports.resolve = exports.INTRINSIC_KEY_PREFIX = void 0;
const encoding_1 = require("./encoding");
const token_map_1 = require("./token-map");
const resolvable_1 = require("../resolvable");
const type_hints_1 = require("../type-hints");
// This file should not be exported to consumers, resolving should happen through Construct.resolve()
const tokenMap = token_map_1.TokenMap.instance();
/**
 * Resolved complex values will have a type hint applied.
 *
 * The type hint will be based on the type of the input value that was resolved.
 *
 * If the value was encoded, the type hint will be the type of the encoded value. In case
 * of a plain `IResolvable`, a type hint of 'string' will be assumed.
 */
const RESOLUTION_TYPEHINT_SYM = Symbol.for('@aws-cdk/core.resolvedTypeHint');
/**
 * Prefix used for intrinsic keys
 *
 * If a key with this prefix is found in an object, the actual value of the
 * key doesn't matter. The value of this key will be an `[ actualKey, actualValue ]`
 * tuple, and the `actualKey` will be a value which otherwise couldn't be represented
 * in the types of `string | number | symbol`, which are the only possible JavaScript
 * object keys.
 */
exports.INTRINSIC_KEY_PREFIX = '$IntrinsicKey$';
/**
 * Resolves an object by evaluating all tokens and removing any undefined or empty objects or arrays.
 * Values can only be primitives, arrays or tokens. Other objects (i.e. with methods) will be rejected.
 *
 * @param obj The object to resolve.
 * @param prefix Prefix key path components for diagnostics.
 */
function resolve(obj, options) {
    const prefix = options.prefix || [];
    const pathName = '/' + prefix.join('/');
    /**
     * Make a new resolution context
     */
    function makeContext(appendPath) {
        const newPrefix = appendPath !== undefined ? prefix.concat([appendPath]) : options.prefix;
        let postProcessor;
        const context = {
            preparing: options.preparing,
            scope: options.scope,
            documentPath: newPrefix ?? [],
            registerPostProcessor(pp) { postProcessor = pp; },
            resolve(x, changeOptions) { return resolve(x, { ...options, ...changeOptions, prefix: newPrefix }); },
        };
        return [context, { postProcess(x) { return postProcessor ? postProcessor.postProcess(x, context) : x; } }];
    }
    // protect against cyclic references by limiting depth.
    if (prefix.length > 200) {
        throw new Error('Unable to resolve object tree with circular reference. Path: ' + pathName);
    }
    // whether to leave the empty elements when resolving - false by default
    const leaveEmpty = options.removeEmpty === false;
    //
    // undefined
    //
    if (typeof (obj) === 'undefined') {
        return undefined;
    }
    //
    // null
    //
    if (obj === null) {
        return null;
    }
    //
    // functions - not supported (only tokens are supported)
    //
    if (typeof (obj) === 'function') {
        throw new Error(`Trying to resolve a non-data object. Only token are supported for lazy evaluation. Path: ${pathName}. Object: ${obj}`);
    }
    //
    // string - potentially replace all stringified Tokens
    //
    if (typeof (obj) === 'string') {
        // If this is a "list element" Token, it should never occur by itself in string context
        if (encoding_1.TokenString.forListToken(obj).test()) {
            throw new Error('Found an encoded list token string in a scalar string context. Use \'Fn.select(0, list)\' (not \'list[0]\') to extract elements from token lists.');
        }
        // Otherwise look for a stringified Token in this object
        const str = encoding_1.TokenString.forString(obj);
        if (str.test()) {
            const fragments = str.split(tokenMap.lookupToken.bind(tokenMap));
            return tagResolvedValue(options.resolver.resolveString(fragments, makeContext()[0]), type_hints_1.ResolutionTypeHint.STRING);
        }
        return obj;
    }
    //
    // number - potentially decode Tokenized number
    //
    if (typeof (obj) === 'number') {
        return tagResolvedValue(resolveNumberToken(obj, makeContext()[0]), type_hints_1.ResolutionTypeHint.NUMBER);
    }
    //
    // primitives - as-is
    //
    if (typeof (obj) !== 'object' || obj instanceof Date) {
        return obj;
    }
    //
    // arrays - resolve all values, remove undefined and remove empty arrays
    //
    if (Array.isArray(obj)) {
        if ((0, encoding_1.containsListTokenElement)(obj)) {
            return tagResolvedValue(options.resolver.resolveList(obj, makeContext()[0]), type_hints_1.ResolutionTypeHint.STRING_LIST);
        }
        const arr = obj
            .map((x, i) => makeContext(`${i}`)[0].resolve(x))
            .filter(x => leaveEmpty || typeof (x) !== 'undefined');
        return arr;
    }
    //
    // literal null -- from JsonNull resolution, preserved as-is (semantically meaningful)
    //
    if (obj === null) {
        return obj;
    }
    //
    // tokens - invoke 'resolve' and continue to resolve recursively
    //
    if ((0, encoding_1.unresolved)(obj)) {
        const [context, postProcessor] = makeContext();
        const ret = tagResolvedValue(options.resolver.resolveToken(obj, context, postProcessor), type_hints_1.ResolutionTypeHint.STRING);
        return ret;
    }
    //
    // objects - deep-resolve all values
    //
    // Must not be a Construct at this point, otherwise you probably made a typo
    // mistake somewhere and resolve will get into an infinite loop recursing into
    // child.parent <---> parent.children
    if (isConstruct(obj)) {
        throw new Error('Trying to resolve() a Construct at ' + pathName);
    }
    const result = {};
    let intrinsicKeyCtr = 0;
    for (const key of Object.keys(obj)) {
        const value = makeContext(String(key))[0].resolve(obj[key]);
        // skip undefined
        if (typeof (value) === 'undefined') {
            if (leaveEmpty) {
                result[key] = undefined;
            }
            continue;
        }
        // Simple case -- not an unresolved key
        if (!(0, encoding_1.unresolved)(key)) {
            result[key] = value;
            continue;
        }
        const resolvedKey = makeContext()[0].resolve(key);
        if (typeof (resolvedKey) === 'string') {
            result[resolvedKey] = value;
        }
        else {
            if (!options.allowIntrinsicKeys) {
                // eslint-disable-next-line max-len
                throw new Error(`"${String(key)}" is used as the key in a map so must resolve to a string, but it resolves to: ${JSON.stringify(resolvedKey)}. Consider using "CfnJson" to delay resolution to deployment-time`);
            }
            // Can't represent this object in a JavaScript key position, but we can store it
            // in value position. Use a unique symbol as the key.
            result[`${exports.INTRINSIC_KEY_PREFIX}${intrinsicKeyCtr++}`] = [resolvedKey, value];
        }
    }
    // Because we may be called to recurse on already resolved values (that already have type hints applied)
    // and we just copied those values into a fresh object, be sure to retain any type hints.
    const previousTypeHint = resolvedTypeHint(obj);
    return previousTypeHint ? tagResolvedValue(result, previousTypeHint) : result;
}
exports.resolve = resolve;
/**
 * Find all Tokens that are used in the given structure
 */
function findTokens(scope, fn) {
    const resolver = new RememberingTokenResolver(new resolvable_1.StringConcat());
    resolve(fn(), { scope, prefix: [], resolver, preparing: true });
    return resolver.tokens;
}
exports.findTokens = findTokens;
/**
 * Remember all Tokens encountered while resolving
 */
class RememberingTokenResolver extends resolvable_1.DefaultTokenResolver {
    constructor() {
        super(...arguments);
        this.tokensSeen = new Set();
    }
    resolveToken(t, context, postProcessor) {
        this.tokensSeen.add(t);
        return super.resolveToken(t, context, postProcessor);
    }
    resolveString(s, context) {
        const ret = super.resolveString(s, context);
        return ret;
    }
    get tokens() {
        return Array.from(this.tokensSeen);
    }
}
exports.RememberingTokenResolver = RememberingTokenResolver;
/**
 * Determine whether an object is a Construct
 *
 * Not in 'construct.ts' because that would lead to a dependency cycle via 'uniqueid.ts',
 * and this is a best-effort protection against a common programming mistake anyway.
 */
function isConstruct(x) {
    return x._children !== undefined && x._metadata !== undefined;
}
function resolveNumberToken(x, context) {
    const token = token_map_1.TokenMap.instance().lookupNumberToken(x);
    if (token === undefined) {
        return x;
    }
    return context.resolve(token);
}
/**
 * Apply a type hint to a resolved value
 *
 * The type hint will only be applied to objects.
 *
 * These type hints are used for correct JSON-ification of intrinsic values.
 */
function tagResolvedValue(value, typeHint) {
    if (typeof value !== 'object' || value == null) {
        return value;
    }
    Object.defineProperty(value, RESOLUTION_TYPEHINT_SYM, {
        value: typeHint,
        configurable: true,
    });
    return value;
}
/**
 * Return the type hint from the given value
 *
 * If the value is not a resolved value (i.e, the result of resolving a token),
 * `undefined` will be returned.
 *
 * These type hints are used for correct JSON-ification of intrinsic values.
 */
function resolvedTypeHint(value) {
    if (typeof value !== 'object' || value == null) {
        return undefined;
    }
    return value[RESOLUTION_TYPEHINT_SYM];
}
exports.resolvedTypeHint = resolvedTypeHint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlc29sdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EseUNBQStFO0FBQy9FLDJDQUF1QztBQUN2Qyw4Q0FBOEo7QUFFOUosOENBQW1EO0FBRW5ELHFHQUFxRztBQUNyRyxNQUFNLFFBQVEsR0FBRyxvQkFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBRXJDOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUU3RTs7Ozs7Ozs7R0FRRztBQUNVLFFBQUEsb0JBQW9CLEdBQUcsZ0JBQWdCLENBQUM7QUFzRHJEOzs7Ozs7R0FNRztBQUNILFNBQWdCLE9BQU8sQ0FBQyxHQUFRLEVBQUUsT0FBd0I7SUFDeEQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDcEMsTUFBTSxRQUFRLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFeEM7O09BRUc7SUFDSCxTQUFTLFdBQVcsQ0FBQyxVQUFtQjtRQUN0QyxNQUFNLFNBQVMsR0FBRyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUUxRixJQUFJLGFBQXlDLENBQUM7UUFFOUMsTUFBTSxPQUFPLEdBQW9CO1lBQy9CLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztZQUM1QixLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQW1CO1lBQ2xDLFlBQVksRUFBRSxTQUFTLElBQUksRUFBRTtZQUM3QixxQkFBcUIsQ0FBQyxFQUFFLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQyxFQUFFO1lBQ2pELE9BQU8sQ0FBQyxDQUFNLEVBQUUsYUFBMkMsSUFB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R0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBjb250YWluc0xpc3RUb2tlbkVsZW1lbnQsIFRva2VuU3RyaW5nLCB1bnJlc29sdmVkIH0gZnJvbSAnLi9lbmNvZGluZyc7XG5pbXBvcnQgeyBUb2tlbk1hcCB9IGZyb20gJy4vdG9rZW4tbWFwJztcbmltcG9ydCB7IERlZmF1bHRUb2tlblJlc29sdmVyLCBJUG9zdFByb2Nlc3NvciwgSVJlc29sdmFibGUsIElSZXNvbHZlQ29udGV4dCwgSVRva2VuUmVzb2x2ZXIsIFJlc29sdmVDaGFuZ2VDb250ZXh0T3B0aW9ucywgU3RyaW5nQ29uY2F0IH0gZnJvbSAnLi4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBUb2tlbml6ZWRTdHJpbmdGcmFnbWVudHMgfSBmcm9tICcuLi9zdHJpbmctZnJhZ21lbnRzJztcbmltcG9ydCB7IFJlc29sdXRpb25UeXBlSGludCB9IGZyb20gJy4uL3R5cGUtaGludHMnO1xuXG4vLyBUaGlzIGZpbGUgc2hvdWxkIG5vdCBiZSBleHBvcnRlZCB0byBjb25zdW1lcnMsIHJlc29sdmluZyBzaG91bGQgaGFwcGVuIHRocm91Z2ggQ29uc3RydWN0LnJlc29sdmUoKVxuY29uc3QgdG9rZW5NYXAgPSBUb2tlbk1hcC5pbnN0YW5jZSgpO1xuXG4vKipcbiAqIFJlc29sdmVkIGNvbXBsZXggdmFsdWVzIHdpbGwgaGF2ZSBhIHR5cGUgaGludCBhcHBsaWVkLlxuICpcbiAqIFRoZSB0eXBlIGhpbnQgd2lsbCBiZSBiYXNlZCBvbiB0aGUgdHlwZSBvZiB0aGUgaW5wdXQgdmFsdWUgdGhhdCB3YXMgcmVzb2x2ZWQuXG4gKlxuICogSWYgdGhlIHZhbHVlIHdhcyBlbmNvZGVkLCB0aGUgdHlwZSBoaW50IHdpbGwgYmUgdGhlIHR5cGUgb2YgdGhlIGVuY29kZWQgdmFsdWUuIEluIGNhc2VcbiAqIG9mIGEgcGxhaW4gYElSZXNvbHZhYmxlYCwgYSB0eXBlIGhpbnQgb2YgJ3N0cmluZycgd2lsbCBiZSBhc3N1bWVkLlxuICovXG5jb25zdCBSRVNPTFVUSU9OX1RZUEVISU5UX1NZTSA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2NvcmUucmVzb2x2ZWRUeXBlSGludCcpO1xuXG4vKipcbiAqIFByZWZpeCB1c2VkIGZvciBpbnRyaW5zaWMga2V5c1xuICpcbiAqIElmIGEga2V5IHdpdGggdGhpcyBwcmVmaXggaXMgZm91bmQgaW4gYW4gb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIG9mIHRoZVxuICoga2V5IGRvZXNuJ3QgbWF0dGVyLiBUaGUgdmFsdWUgb2YgdGhpcyBrZXkgd2lsbCBiZSBhbiBgWyBhY3R1YWxLZXksIGFjdHVhbFZhbHVlIF1gXG4gKiB0dXBsZSwgYW5kIHRoZSBgYWN0dWFsS2V5YCB3aWxsIGJlIGEgdmFsdWUgd2hpY2ggb3RoZXJ3aXNlIGNvdWxkbid0IGJlIHJlcHJlc2VudGVkXG4gKiBpbiB0aGUgdHlwZXMgb2YgYHN0cmluZyB8IG51bWJlciB8IHN5bWJvbGAsIHdoaWNoIGFyZSB0aGUgb25seSBwb3NzaWJsZSBKYXZhU2NyaXB0XG4gKiBvYmplY3Qga2V5cy5cbiAqL1xuZXhwb3J0IGNvbnN0IElOVFJJTlNJQ19LRVlfUFJFRklYID0gJyRJbnRyaW5zaWNLZXkkJztcblxuLyoqXG4gKiBPcHRpb25zIHRvIHRoZSByZXNvbHZlKCkgb3BlcmF0aW9uXG4gKlxuICogTk9UIHRoZSBzYW1lIGFzIHRoZSBSZXNvbHZlQ29udGV4dDsgUmVzb2x2ZUNvbnRleHQgaXMgZXhwb3NlZCB0byBUb2tlblxuICogaW1wbGVtZW50b3JzIGFuZCByZXNvbHV0aW9uIGhvb2tzLCB3aGVyZWFzIHRoaXMgc3RydWN0IGlzIGp1c3QgdG8gYnVuZGxlXG4gKiBhIG51bWJlciBvZiB0aGluZ3MgdGhhdCB3b3VsZCBvdGhlcndpc2UgYmUgYXJndW1lbnRzIHRvIHJlc29sdmUoKSBpbiBhXG4gKiByZWFkYWJsZSB3YXkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVJlc29sdmVPcHRpb25zIHtcbiAgc2NvcGU6IElDb25zdHJ1Y3Q7XG4gIHByZXBhcmluZzogYm9vbGVhbjtcbiAgcmVzb2x2ZXI6IElUb2tlblJlc29sdmVyO1xuICBwcmVmaXg/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdG8gYWxsb3cgaW50cmluc2ljcyBpbiBrZXlzIG9mIGFuIG9iamVjdFxuICAgKlxuICAgKiBCZWNhdXNlIGtleXMgb2YgYW4gb2JqZWN0IG11c3QgYmUgc3RyaW5ncywgYSAocmVzb2x2ZWQpIGludHJpbnNpYywgd2hpY2hcbiAgICogaXMgYW4gb2JqZWN0LCBjYW5ub3QgYmUgc3RvcmVkIGluIHRoYXQgcG9zaXRpb24uIEJ5IGRlZmF1bHQsIHdlIHJlamVjdCB0aGVzZVxuICAgKiBpbnRyaW5zaWNzIGlmIHdlIGVuY291bnRlciB0aGVtLlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIHNldCB0byBgdHJ1ZWAsIGluIG9yZGVyIHRvIHN0b3JlIHRoZSBjb21wbGV4IHZhbHVlIGluIGEgbWFwLFxuICAgKiBrZXlzIHRoYXQgaGFwcGVuIHRvIGV2YWx1YXRlIHRvIGludHJpbnNpY3Mgd2lsbCBiZSBhZGRlZCB3aXRoIGEgdW5pcXVlIGtleVxuICAgKiBpZGVudGlmaWVkIGJ5IGFuIHVuY29tbWluZyBwcmVmaXgsIG1hcHBlZCB0byBhIHR1cGxlIHRoYXQgcmVwcmVzZW50cyB0aGVcbiAgICogYWN0dWFsIGtleS92YWx1ZS1wYWlyLiBUaGUgbWFwIHdpbGwgbG9vayBsaWtlIHRoaXM6XG4gICAqXG4gICAqIHtcbiAgICogICAgJyRJbnRyaW5zaWNLZXkkMCc6IFsgeyBSZWY6IC4uLiB9LCAndmFsdWUxJyBdLFxuICAgKiAgICAnJEludHJpbnNpY0tleSQxJzogWyB7IFJlZjogLi4uIH0sICd2YWx1ZTInIF0sXG4gICAqICAgICdyZWd1bGFyS2V5JzogJ3ZhbHVlMycsXG4gICAqICAgIC4uLlxuICAgKiB9XG4gICAqXG4gICAqIENhbGxlcnMgc2hvdWxkIG9ubHkgc2V0IHRoaXMgb3B0aW9uIHRvIGB0cnVlYCBpZiB0aGV5IGFyZSBwcmVwYXJlZCB0byBkZWFsIHdpdGhcbiAgICogdGhlIG9iamVjdCBpbiB0aGlzIHdlaXJkIHNoYXBlLCBhbmQgbWFzc2FnZSBpdCBiYWNrIGludG8gYSBjb3JyZWN0IG9iamVjdCBhZnRlcndhcmRzLlxuICAgKlxuICAgKiAoQSByZWd1bGFyIGJ1dCB1bmNvbW1vbiBzdHJpbmcgd2FzIGNob3NlbiBvdmVyIHNvbWV0aGluZyBsaWtlIHN5bWJvbHMgb3JcbiAgICogb3RoZXIgd2F5cyBvZiB0YWdnaW5nIHRoZSBleHRyYSB2YWx1ZXMgaW4gb3JkZXIgdG8gc2ltcGxpZnkgdGhlIGltcGxlbWVudGF0aW9uIHdoaWNoXG4gICAqIG1haW50YWlucyB0aGUgZGVzaXJlZCBiZWhhdmlvciBgcmVzb2x2ZShyZXNvbHZlKHgpKSA9PSByZXNvbHZlKHgpYCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBhbGxvd0ludHJpbnNpY0tleXM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHJlbW92ZSB1bmRlZmluZWQgZWxlbWVudHMgZnJvbSBhcnJheXMgYW5kIG9iamVjdHMgd2hlbiByZXNvbHZpbmcuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlbW92ZUVtcHR5PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBSZXNvbHZlcyBhbiBvYmplY3QgYnkgZXZhbHVhdGluZyBhbGwgdG9rZW5zIGFuZCByZW1vdmluZyBhbnkgdW5kZWZpbmVkIG9yIGVtcHR5IG9iamVjdHMgb3IgYXJyYXlzLlxuICogVmFsdWVzIGNhbiBvbmx5IGJlIHByaW1pdGl2ZXMsIGFycmF5cyBvciB0b2tlbnMuIE90aGVyIG9iamVjdHMgKGkuZS4gd2l0aCBtZXRob2RzKSB3aWxsIGJlIHJlamVjdGVkLlxuICpcbiAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCB0byByZXNvbHZlLlxuICogQHBhcmFtIHByZWZpeCBQcmVmaXgga2V5IHBhdGggY29tcG9uZW50cyBmb3IgZGlhZ25vc3RpY3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlKG9iajogYW55LCBvcHRpb25zOiBJUmVzb2x2ZU9wdGlvbnMpOiBhbnkge1xuICBjb25zdCBwcmVmaXggPSBvcHRpb25zLnByZWZpeCB8fCBbXTtcbiAgY29uc3QgcGF0aE5hbWUgPSAnLycgKyBwcmVmaXguam9pbignLycpO1xuXG4gIC8qKlxuICAgKiBNYWtlIGEgbmV3IHJlc29sdXRpb24gY29udGV4dFxuICAgKi9cbiAgZnVuY3Rpb24gbWFrZUNvbnRleHQoYXBwZW5kUGF0aD86IHN0cmluZyk6IFtJUmVzb2x2ZUNvbnRleHQsIElQb3N0UHJvY2Vzc29yXSB7XG4gICAgY29uc3QgbmV3UHJlZml4ID0gYXBwZW5kUGF0aCAhPT0gdW5kZWZpbmVkID8gcHJlZml4LmNvbmNhdChbYXBwZW5kUGF0aF0pIDogb3B0aW9ucy5wcmVmaXg7XG5cbiAgICBsZXQgcG9zdFByb2Nlc3NvcjogSVBvc3RQcm9jZXNzb3IgfCB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQgPSB7XG4gICAgICBwcmVwYXJpbmc6IG9wdGlvbnMucHJlcGFyaW5nLFxuICAgICAgc2NvcGU6IG9wdGlvbnMuc2NvcGUgYXMgSUNvbnN0cnVjdCxcbiAgICAgIGRvY3VtZW50UGF0aDogbmV3UHJlZml4ID8/IFtdLFxuICAgICAgcmVnaXN0ZXJQb3N0UHJvY2Vzc29yKHBwKSB7IHBvc3RQcm9jZXNzb3IgPSBwcDsgfSxcbiAgICAgIHJlc29sdmUoeDogYW55LCBjaGFuZ2VPcHRpb25zPzogUmVzb2x2ZUNoYW5nZUNvbnRleHRPcHRpb25zKSB7IHJldHVybiByZXNvbHZlKHgsIHsgLi4ub3B0aW9ucywgLi4uY2hhbmdlT3B0aW9ucywgcHJlZml4OiBuZXdQcmVmaXggfSk7IH0sXG4gICAgfTtcblxuICAgIHJldHVybiBbY29udGV4dCwgeyBwb3N0UHJvY2Vzcyh4KSB7IHJldHVybiBwb3N0UHJvY2Vzc29yID8gcG9zdFByb2Nlc3Nvci5wb3N0UHJvY2Vzcyh4LCBjb250ZXh0KSA6IHg7IH0gfV07XG4gIH1cblxuICAvLyBwcm90ZWN0IGFnYWluc3QgY3ljbGljIHJlZmVyZW5jZXMgYnkgbGltaXRpbmcgZGVwdGguXG4gIGlmIChwcmVmaXgubGVuZ3RoID4gMjAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gcmVzb2x2ZSBvYmplY3QgdHJlZSB3aXRoIGNpcmN1bGFyIHJlZmVyZW5jZS4gUGF0aDogJyArIHBhdGhOYW1lKTtcbiAgfVxuXG4gIC8vIHdoZXRoZXIgdG8gbGVhdmUgdGhlIGVtcHR5IGVsZW1lbnRzIHdoZW4gcmVzb2x2aW5nIC0gZmFsc2UgYnkgZGVmYXVsdFxuICBjb25zdCBsZWF2ZUVtcHR5ID0gb3B0aW9ucy5yZW1vdmVFbXB0eSA9PT0gZmFsc2U7XG5cbiAgLy9cbiAgLy8gdW5kZWZpbmVkXG4gIC8vXG5cbiAgaWYgKHR5cGVvZihvYmopID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvL1xuICAvLyBudWxsXG4gIC8vXG5cbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy9cbiAgLy8gZnVuY3Rpb25zIC0gbm90IHN1cHBvcnRlZCAob25seSB0b2tlbnMgYXJlIHN1cHBvcnRlZClcbiAgLy9cblxuICBpZiAodHlwZW9mKG9iaikgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRyeWluZyB0byByZXNvbHZlIGEgbm9uLWRhdGEgb2JqZWN0LiBPbmx5IHRva2VuIGFyZSBzdXBwb3J0ZWQgZm9yIGxhenkgZXZhbHVhdGlvbi4gUGF0aDogJHtwYXRoTmFtZX0uIE9iamVjdDogJHtvYmp9YCk7XG4gIH1cblxuICAvL1xuICAvLyBzdHJpbmcgLSBwb3RlbnRpYWxseSByZXBsYWNlIGFsbCBzdHJpbmdpZmllZCBUb2tlbnNcbiAgLy9cbiAgaWYgKHR5cGVvZihvYmopID09PSAnc3RyaW5nJykge1xuICAgIC8vIElmIHRoaXMgaXMgYSBcImxpc3QgZWxlbWVudFwiIFRva2VuLCBpdCBzaG91bGQgbmV2ZXIgb2NjdXIgYnkgaXRzZWxmIGluIHN0cmluZyBjb250ZXh0XG4gICAgaWYgKFRva2VuU3RyaW5nLmZvckxpc3RUb2tlbihvYmopLnRlc3QoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCBhbiBlbmNvZGVkIGxpc3QgdG9rZW4gc3RyaW5nIGluIGEgc2NhbGFyIHN0cmluZyBjb250ZXh0LiBVc2UgXFwnRm4uc2VsZWN0KDAsIGxpc3QpXFwnIChub3QgXFwnbGlzdFswXVxcJykgdG8gZXh0cmFjdCBlbGVtZW50cyBmcm9tIHRva2VuIGxpc3RzLicpO1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSBsb29rIGZvciBhIHN0cmluZ2lmaWVkIFRva2VuIGluIHRoaXMgb2JqZWN0XG4gICAgY29uc3Qgc3RyID0gVG9rZW5TdHJpbmcuZm9yU3RyaW5nKG9iaik7XG4gICAgaWYgKHN0ci50ZXN0KCkpIHtcbiAgICAgIGNvbnN0IGZyYWdtZW50cyA9IHN0ci5zcGxpdCh0b2tlbk1hcC5sb29rdXBUb2tlbi5iaW5kKHRva2VuTWFwKSk7XG4gICAgICByZXR1cm4gdGFnUmVzb2x2ZWRWYWx1ZShvcHRpb25zLnJlc29sdmVyLnJlc29sdmVTdHJpbmcoZnJhZ21lbnRzLCBtYWtlQ29udGV4dCgpWzBdKSwgUmVzb2x1dGlvblR5cGVIaW50LlNUUklORyk7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICAvL1xuICAvLyBudW1iZXIgLSBwb3RlbnRpYWxseSBkZWNvZGUgVG9rZW5pemVkIG51bWJlclxuICAvL1xuICBpZiAodHlwZW9mKG9iaikgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHRhZ1Jlc29sdmVkVmFsdWUocmVzb2x2ZU51bWJlclRva2VuKG9iaiwgbWFrZUNvbnRleHQoKVswXSksIFJlc29sdXRpb25UeXBlSGludC5OVU1CRVIpO1xuICB9XG5cbiAgLy9cbiAgLy8gcHJpbWl0aXZlcyAtIGFzLWlzXG4gIC8vXG5cbiAgaWYgKHR5cGVvZihvYmopICE9PSAnb2JqZWN0JyB8fCBvYmogaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIC8vXG4gIC8vIGFycmF5cyAtIHJlc29sdmUgYWxsIHZhbHVlcywgcmVtb3ZlIHVuZGVmaW5lZCBhbmQgcmVtb3ZlIGVtcHR5IGFycmF5c1xuICAvL1xuXG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICBpZiAoY29udGFpbnNMaXN0VG9rZW5FbGVtZW50KG9iaikpIHtcbiAgICAgIHJldHVybiB0YWdSZXNvbHZlZFZhbHVlKG9wdGlvbnMucmVzb2x2ZXIucmVzb2x2ZUxpc3Qob2JqLCBtYWtlQ29udGV4dCgpWzBdKSwgUmVzb2x1dGlvblR5cGVIaW50LlNUUklOR19MSVNUKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnIgPSBvYmpcbiAgICAgIC5tYXAoKHgsIGkpID0+IG1ha2VDb250ZXh0KGAke2l9YClbMF0ucmVzb2x2ZSh4KSlcbiAgICAgIC5maWx0ZXIoeCA9PiBsZWF2ZUVtcHR5IHx8IHR5cGVvZih4KSAhPT0gJ3VuZGVmaW5lZCcpO1xuXG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIC8vXG4gIC8vIGxpdGVyYWwgbnVsbCAtLSBmcm9tIEpzb25OdWxsIHJlc29sdXRpb24sIHByZXNlcnZlZCBhcy1pcyAoc2VtYW50aWNhbGx5IG1lYW5pbmdmdWwpXG4gIC8vXG5cbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICAvL1xuICAvLyB0b2tlbnMgLSBpbnZva2UgJ3Jlc29sdmUnIGFuZCBjb250aW51ZSB0byByZXNvbHZlIHJlY3Vyc2l2ZWx5XG4gIC8vXG5cbiAgaWYgKHVucmVzb2x2ZWQob2JqKSkge1xuICAgIGNvbnN0IFtjb250ZXh0LCBwb3N0UHJvY2Vzc29yXSA9IG1ha2VDb250ZXh0KCk7XG4gICAgY29uc3QgcmV0ID0gdGFnUmVzb2x2ZWRWYWx1ZShvcHRpb25zLnJlc29sdmVyLnJlc29sdmVUb2tlbihvYmosIGNvbnRleHQsIHBvc3RQcm9jZXNzb3IpLCBSZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy9cbiAgLy8gb2JqZWN0cyAtIGRlZXAtcmVzb2x2ZSBhbGwgdmFsdWVzXG4gIC8vXG5cbiAgLy8gTXVzdCBub3QgYmUgYSBDb25zdHJ1Y3QgYXQgdGhpcyBwb2ludCwgb3RoZXJ3aXNlIHlvdSBwcm9iYWJseSBtYWRlIGEgdHlwb1xuICAvLyBtaXN0YWtlIHNvbWV3aGVyZSBhbmQgcmVzb2x2ZSB3aWxsIGdldCBpbnRvIGFuIGluZmluaXRlIGxvb3AgcmVjdXJzaW5nIGludG9cbiAgLy8gY2hpbGQucGFyZW50IDwtLS0+IHBhcmVudC5jaGlsZHJlblxuICBpZiAoaXNDb25zdHJ1Y3Qob2JqKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHJlc29sdmUoKSBhIENvbnN0cnVjdCBhdCAnICsgcGF0aE5hbWUpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0OiBhbnkgPSB7IH07XG4gIGxldCBpbnRyaW5zaWNLZXlDdHIgPSAwO1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG4gICAgY29uc3QgdmFsdWUgPSBtYWtlQ29udGV4dChTdHJpbmcoa2V5KSlbMF0ucmVzb2x2ZShvYmpba2V5XSk7XG5cbiAgICAvLyBza2lwIHVuZGVmaW5lZFxuICAgIGlmICh0eXBlb2YodmFsdWUpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKGxlYXZlRW1wdHkpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBTaW1wbGUgY2FzZSAtLSBub3QgYW4gdW5yZXNvbHZlZCBrZXlcbiAgICBpZiAoIXVucmVzb2x2ZWQoa2V5KSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc29sdmVkS2V5ID0gbWFrZUNvbnRleHQoKVswXS5yZXNvbHZlKGtleSk7XG4gICAgaWYgKHR5cGVvZihyZXNvbHZlZEtleSkgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXN1bHRbcmVzb2x2ZWRLZXldID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghb3B0aW9ucy5hbGxvd0ludHJpbnNpY0tleXMpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIiR7U3RyaW5nKGtleSl9XCIgaXMgdXNlZCBhcyB0aGUga2V5IGluIGEgbWFwIHNvIG11c3QgcmVzb2x2ZSB0byBhIHN0cmluZywgYnV0IGl0IHJlc29sdmVzIHRvOiAke0pTT04uc3RyaW5naWZ5KHJlc29sdmVkS2V5KX0uIENvbnNpZGVyIHVzaW5nIFwiQ2ZuSnNvblwiIHRvIGRlbGF5IHJlc29sdXRpb24gdG8gZGVwbG95bWVudC10aW1lYCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENhbid0IHJlcHJlc2VudCB0aGlzIG9iamVjdCBpbiBhIEphdmFTY3JpcHQga2V5IHBvc2l0aW9uLCBidXQgd2UgY2FuIHN0b3JlIGl0XG4gICAgICAvLyBpbiB2YWx1ZSBwb3NpdGlvbi4gVXNlIGEgdW5pcXVlIHN5bWJvbCBhcyB0aGUga2V5LlxuICAgICAgcmVzdWx0W2Ake0lOVFJJTlNJQ19LRVlfUFJFRklYfSR7aW50cmluc2ljS2V5Q3RyKyt9YF0gPSBbcmVzb2x2ZWRLZXksIHZhbHVlXTtcbiAgICB9XG4gIH1cblxuICAvLyBCZWNhdXNlIHdlIG1heSBiZSBjYWxsZWQgdG8gcmVjdXJzZSBvbiBhbHJlYWR5IHJlc29sdmVkIHZhbHVlcyAodGhhdCBhbHJlYWR5IGhhdmUgdHlwZSBoaW50cyBhcHBsaWVkKVxuICAvLyBhbmQgd2UganVzdCBjb3BpZWQgdGhvc2UgdmFsdWVzIGludG8gYSBmcmVzaCBvYmplY3QsIGJlIHN1cmUgdG8gcmV0YWluIGFueSB0eXBlIGhpbnRzLlxuICBjb25zdCBwcmV2aW91c1R5cGVIaW50ID0gcmVzb2x2ZWRUeXBlSGludChvYmopO1xuICByZXR1cm4gcHJldmlvdXNUeXBlSGludCA/IHRhZ1Jlc29sdmVkVmFsdWUocmVzdWx0LCBwcmV2aW91c1R5cGVIaW50KSA6IHJlc3VsdDtcbn1cblxuLyoqXG4gKiBGaW5kIGFsbCBUb2tlbnMgdGhhdCBhcmUgdXNlZCBpbiB0aGUgZ2l2ZW4gc3RydWN0dXJlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kVG9rZW5zKHNjb3BlOiBJQ29uc3RydWN0LCBmbjogKCkgPT4gYW55KTogSVJlc29sdmFibGVbXSB7XG4gIGNvbnN0IHJlc29sdmVyID0gbmV3IFJlbWVtYmVyaW5nVG9rZW5SZXNvbHZlcihuZXcgU3RyaW5nQ29uY2F0KCkpO1xuXG4gIHJlc29sdmUoZm4oKSwgeyBzY29wZSwgcHJlZml4OiBbXSwgcmVzb2x2ZXIsIHByZXBhcmluZzogdHJ1ZSB9KTtcblxuICByZXR1cm4gcmVzb2x2ZXIudG9rZW5zO1xufVxuXG4vKipcbiAqIFJlbWVtYmVyIGFsbCBUb2tlbnMgZW5jb3VudGVyZWQgd2hpbGUgcmVzb2x2aW5nXG4gKi9cbmV4cG9ydCBjbGFzcyBSZW1lbWJlcmluZ1Rva2VuUmVzb2x2ZXIgZXh0ZW5kcyBEZWZhdWx0VG9rZW5SZXNvbHZlciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgdG9rZW5zU2VlbiA9IG5ldyBTZXQ8SVJlc29sdmFibGU+KCk7XG5cbiAgcHVibGljIHJlc29sdmVUb2tlbih0OiBJUmVzb2x2YWJsZSwgY29udGV4dDogSVJlc29sdmVDb250ZXh0LCBwb3N0UHJvY2Vzc29yOiBJUG9zdFByb2Nlc3Nvcikge1xuICAgIHRoaXMudG9rZW5zU2Vlbi5hZGQodCk7XG4gICAgcmV0dXJuIHN1cGVyLnJlc29sdmVUb2tlbih0LCBjb250ZXh0LCBwb3N0UHJvY2Vzc29yKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlU3RyaW5nKHM6IFRva2VuaXplZFN0cmluZ0ZyYWdtZW50cywgY29udGV4dDogSVJlc29sdmVDb250ZXh0KSB7XG4gICAgY29uc3QgcmV0ID0gc3VwZXIucmVzb2x2ZVN0cmluZyhzLCBjb250ZXh0KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgcHVibGljIGdldCB0b2tlbnMoKTogSVJlc29sdmFibGVbXSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy50b2tlbnNTZWVuKTtcbiAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIENvbnN0cnVjdFxuICpcbiAqIE5vdCBpbiAnY29uc3RydWN0LnRzJyBiZWNhdXNlIHRoYXQgd291bGQgbGVhZCB0byBhIGRlcGVuZGVuY3kgY3ljbGUgdmlhICd1bmlxdWVpZC50cycsXG4gKiBhbmQgdGhpcyBpcyBhIGJlc3QtZWZmb3J0IHByb3RlY3Rpb24gYWdhaW5zdCBhIGNvbW1vbiBwcm9ncmFtbWluZyBtaXN0YWtlIGFueXdheS5cbiAqL1xuZnVuY3Rpb24gaXNDb25zdHJ1Y3QoeDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB4Ll9jaGlsZHJlbiAhPT0gdW5kZWZpbmVkICYmIHguX21ldGFkYXRhICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVOdW1iZXJUb2tlbih4OiBudW1iZXIsIGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCk6IGFueSB7XG4gIGNvbnN0IHRva2VuID0gVG9rZW5NYXAuaW5zdGFuY2UoKS5sb29rdXBOdW1iZXJUb2tlbih4KTtcbiAgaWYgKHRva2VuID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHg7IH1cbiAgcmV0dXJuIGNvbnRleHQucmVzb2x2ZSh0b2tlbik7XG59XG5cbi8qKlxuICogQXBwbHkgYSB0eXBlIGhpbnQgdG8gYSByZXNvbHZlZCB2YWx1ZVxuICpcbiAqIFRoZSB0eXBlIGhpbnQgd2lsbCBvbmx5IGJlIGFwcGxpZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBUaGVzZSB0eXBlIGhpbnRzIGFyZSB1c2VkIGZvciBjb3JyZWN0IEpTT04taWZpY2F0aW9uIG9mIGludHJpbnNpYyB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHRhZ1Jlc29sdmVkVmFsdWUodmFsdWU6IGFueSwgdHlwZUhpbnQ6IFJlc29sdXRpb25UeXBlSGludCk6IGFueSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8IHZhbHVlID09IG51bGwpIHsgcmV0dXJuIHZhbHVlOyB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2YWx1ZSwgUkVTT0xVVElPTl9UWVBFSElOVF9TWU0sIHtcbiAgICB2YWx1ZTogdHlwZUhpbnQsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICB9KTtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgdHlwZSBoaW50IGZyb20gdGhlIGdpdmVuIHZhbHVlXG4gKlxuICogSWYgdGhlIHZhbHVlIGlzIG5vdCBhIHJlc29sdmVkIHZhbHVlIChpLmUsIHRoZSByZXN1bHQgb2YgcmVzb2x2aW5nIGEgdG9rZW4pLFxuICogYHVuZGVmaW5lZGAgd2lsbCBiZSByZXR1cm5lZC5cbiAqXG4gKiBUaGVzZSB0eXBlIGhpbnRzIGFyZSB1c2VkIGZvciBjb3JyZWN0IEpTT04taWZpY2F0aW9uIG9mIGludHJpbnNpYyB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlZFR5cGVIaW50KHZhbHVlOiBhbnkpOiBSZXNvbHV0aW9uVHlwZUhpbnQgfCB1bmRlZmluZWQge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCB2YWx1ZSA9PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgcmV0dXJuIHZhbHVlW1JFU09MVVRJT05fVFlQRUhJTlRfU1lNXTtcbn1cbiJdfQ==