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
        if (encoding_1.containsListTokenElement(obj)) {
            return tagResolvedValue(options.resolver.resolveList(obj, makeContext()[0]), type_hints_1.ResolutionTypeHint.STRING_LIST);
        }
        const arr = obj
            .map((x, i) => makeContext(`${i}`)[0].resolve(x))
            .filter(x => leaveEmpty || typeof (x) !== 'undefined');
        return arr;
    }
    //
    // tokens - invoke 'resolve' and continue to resolve recursively
    //
    if (encoding_1.unresolved(obj)) {
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
        if (!encoding_1.unresolved(key)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlc29sdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EseUNBQStFO0FBQy9FLDJDQUF1QztBQUN2Qyw4Q0FBOEo7QUFFOUosOENBQW1EO0FBRW5ELHFHQUFxRztBQUNyRyxNQUFNLFFBQVEsR0FBRyxvQkFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBRXJDOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUU3RTs7Ozs7Ozs7R0FRRztBQUNVLFFBQUEsb0JBQW9CLEdBQUcsZ0JBQWdCLENBQUM7QUFzRHJEOzs7Ozs7R0FNRztBQUNILFNBQWdCLE9BQU8sQ0FBQyxHQUFRLEVBQUUsT0FBd0I7SUFDeEQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDcEMsTUFBTSxRQUFRLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFeEM7O09BRUc7SUFDSCxTQUFTLFdBQVcsQ0FBQyxVQUFtQjtRQUN0QyxNQUFNLFNBQVMsR0FBRyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUUxRixJQUFJLGFBQXlDLENBQUM7UUFFOUMsTUFBTSxPQUFPLEdBQW9CO1lBQy9CLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztZQUM1QixLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQW1CO1lBQ2xDLFlBQVksRUFBRSxTQUFTLElBQUksRUFBRTtZQUM3QixxQkFBcUIsQ0FBQyxFQUFFLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQyxFQUFFO1lBQ2pELE9BQU8sQ0FBQyxDQUFNLEVBQUUsYUFBMkMsSUFB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QUVEOzs7OztHQUtHO0FBQ0gsU0FBUyxXQUFXLENBQUMsQ0FBTTtJQUN6QixPQUFPLENBQUMsQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLENBQUMsQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDO0FBQ2hFLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLENBQVMsRUFBRSxPQUF3QjtJQUM3RCxNQUFNLEtBQUssR0FBRyxvQkFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQUU7SUFDdEMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFTLGdCQUFnQixDQUFDLEtBQVUsRUFBRSxRQUE0QjtJQUNoRSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO1FBQUUsT0FBTyxLQUFLLENBQUM7S0FBRTtJQUNqRSxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSx1QkFBdUIsRUFBRTtRQUNwRCxLQUFLLEVBQUUsUUFBUTtRQUNmLFlBQVksRUFBRSxJQUFJO0tBQ25CLENBQUMsQ0FBQztJQUNILE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQixnQkFBZ0IsQ0FBQyxLQUFVO0lBQ3pDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFBRSxPQUFPLFNBQVMsQ0FBQztLQUFFO0lBQ3JFLE9BQU8sS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUhELDRDQUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgY29udGFpbnNMaXN0VG9rZW5FbGVtZW50LCBUb2tlblN0cmluZywgdW5yZXNvbHZlZCB9IGZyb20gJy4vZW5jb2RpbmcnO1xuaW1wb3J0IHsgVG9rZW5NYXAgfSBmcm9tICcuL3Rva2VuLW1hcCc7XG5pbXBvcnQgeyBEZWZhdWx0VG9rZW5SZXNvbHZlciwgSVBvc3RQcm9jZXNzb3IsIElSZXNvbHZhYmxlLCBJUmVzb2x2ZUNvbnRleHQsIElUb2tlblJlc29sdmVyLCBSZXNvbHZlQ2hhbmdlQ29udGV4dE9wdGlvbnMsIFN0cmluZ0NvbmNhdCB9IGZyb20gJy4uL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgVG9rZW5pemVkU3RyaW5nRnJhZ21lbnRzIH0gZnJvbSAnLi4vc3RyaW5nLWZyYWdtZW50cyc7XG5pbXBvcnQgeyBSZXNvbHV0aW9uVHlwZUhpbnQgfSBmcm9tICcuLi90eXBlLWhpbnRzJztcblxuLy8gVGhpcyBmaWxlIHNob3VsZCBub3QgYmUgZXhwb3J0ZWQgdG8gY29uc3VtZXJzLCByZXNvbHZpbmcgc2hvdWxkIGhhcHBlbiB0aHJvdWdoIENvbnN0cnVjdC5yZXNvbHZlKClcbmNvbnN0IHRva2VuTWFwID0gVG9rZW5NYXAuaW5zdGFuY2UoKTtcblxuLyoqXG4gKiBSZXNvbHZlZCBjb21wbGV4IHZhbHVlcyB3aWxsIGhhdmUgYSB0eXBlIGhpbnQgYXBwbGllZC5cbiAqXG4gKiBUaGUgdHlwZSBoaW50IHdpbGwgYmUgYmFzZWQgb24gdGhlIHR5cGUgb2YgdGhlIGlucHV0IHZhbHVlIHRoYXQgd2FzIHJlc29sdmVkLlxuICpcbiAqIElmIHRoZSB2YWx1ZSB3YXMgZW5jb2RlZCwgdGhlIHR5cGUgaGludCB3aWxsIGJlIHRoZSB0eXBlIG9mIHRoZSBlbmNvZGVkIHZhbHVlLiBJbiBjYXNlXG4gKiBvZiBhIHBsYWluIGBJUmVzb2x2YWJsZWAsIGEgdHlwZSBoaW50IG9mICdzdHJpbmcnIHdpbGwgYmUgYXNzdW1lZC5cbiAqL1xuY29uc3QgUkVTT0xVVElPTl9UWVBFSElOVF9TWU0gPSBTeW1ib2wuZm9yKCdAYXdzLWNkay9jb3JlLnJlc29sdmVkVHlwZUhpbnQnKTtcblxuLyoqXG4gKiBQcmVmaXggdXNlZCBmb3IgaW50cmluc2ljIGtleXNcbiAqXG4gKiBJZiBhIGtleSB3aXRoIHRoaXMgcHJlZml4IGlzIGZvdW5kIGluIGFuIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBvZiB0aGVcbiAqIGtleSBkb2Vzbid0IG1hdHRlci4gVGhlIHZhbHVlIG9mIHRoaXMga2V5IHdpbGwgYmUgYW4gYFsgYWN0dWFsS2V5LCBhY3R1YWxWYWx1ZSBdYFxuICogdHVwbGUsIGFuZCB0aGUgYGFjdHVhbEtleWAgd2lsbCBiZSBhIHZhbHVlIHdoaWNoIG90aGVyd2lzZSBjb3VsZG4ndCBiZSByZXByZXNlbnRlZFxuICogaW4gdGhlIHR5cGVzIG9mIGBzdHJpbmcgfCBudW1iZXIgfCBzeW1ib2xgLCB3aGljaCBhcmUgdGhlIG9ubHkgcG9zc2libGUgSmF2YVNjcmlwdFxuICogb2JqZWN0IGtleXMuXG4gKi9cbmV4cG9ydCBjb25zdCBJTlRSSU5TSUNfS0VZX1BSRUZJWCA9ICckSW50cmluc2ljS2V5JCc7XG5cbi8qKlxuICogT3B0aW9ucyB0byB0aGUgcmVzb2x2ZSgpIG9wZXJhdGlvblxuICpcbiAqIE5PVCB0aGUgc2FtZSBhcyB0aGUgUmVzb2x2ZUNvbnRleHQ7IFJlc29sdmVDb250ZXh0IGlzIGV4cG9zZWQgdG8gVG9rZW5cbiAqIGltcGxlbWVudG9ycyBhbmQgcmVzb2x1dGlvbiBob29rcywgd2hlcmVhcyB0aGlzIHN0cnVjdCBpcyBqdXN0IHRvIGJ1bmRsZVxuICogYSBudW1iZXIgb2YgdGhpbmdzIHRoYXQgd291bGQgb3RoZXJ3aXNlIGJlIGFyZ3VtZW50cyB0byByZXNvbHZlKCkgaW4gYVxuICogcmVhZGFibGUgd2F5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElSZXNvbHZlT3B0aW9ucyB7XG4gIHNjb3BlOiBJQ29uc3RydWN0O1xuICBwcmVwYXJpbmc6IGJvb2xlYW47XG4gIHJlc29sdmVyOiBJVG9rZW5SZXNvbHZlcjtcbiAgcHJlZml4Pzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRvIGFsbG93IGludHJpbnNpY3MgaW4ga2V5cyBvZiBhbiBvYmplY3RcbiAgICpcbiAgICogQmVjYXVzZSBrZXlzIG9mIGFuIG9iamVjdCBtdXN0IGJlIHN0cmluZ3MsIGEgKHJlc29sdmVkKSBpbnRyaW5zaWMsIHdoaWNoXG4gICAqIGlzIGFuIG9iamVjdCwgY2Fubm90IGJlIHN0b3JlZCBpbiB0aGF0IHBvc2l0aW9uLiBCeSBkZWZhdWx0LCB3ZSByZWplY3QgdGhlc2VcbiAgICogaW50cmluc2ljcyBpZiB3ZSBlbmNvdW50ZXIgdGhlbS5cbiAgICpcbiAgICogSWYgdGhpcyBpcyBzZXQgdG8gYHRydWVgLCBpbiBvcmRlciB0byBzdG9yZSB0aGUgY29tcGxleCB2YWx1ZSBpbiBhIG1hcCxcbiAgICoga2V5cyB0aGF0IGhhcHBlbiB0byBldmFsdWF0ZSB0byBpbnRyaW5zaWNzIHdpbGwgYmUgYWRkZWQgd2l0aCBhIHVuaXF1ZSBrZXlcbiAgICogaWRlbnRpZmllZCBieSBhbiB1bmNvbW1pbmcgcHJlZml4LCBtYXBwZWQgdG8gYSB0dXBsZSB0aGF0IHJlcHJlc2VudHMgdGhlXG4gICAqIGFjdHVhbCBrZXkvdmFsdWUtcGFpci4gVGhlIG1hcCB3aWxsIGxvb2sgbGlrZSB0aGlzOlxuICAgKlxuICAgKiB7XG4gICAqICAgICckSW50cmluc2ljS2V5JDAnOiBbIHsgUmVmOiAuLi4gfSwgJ3ZhbHVlMScgXSxcbiAgICogICAgJyRJbnRyaW5zaWNLZXkkMSc6IFsgeyBSZWY6IC4uLiB9LCAndmFsdWUyJyBdLFxuICAgKiAgICAncmVndWxhcktleSc6ICd2YWx1ZTMnLFxuICAgKiAgICAuLi5cbiAgICogfVxuICAgKlxuICAgKiBDYWxsZXJzIHNob3VsZCBvbmx5IHNldCB0aGlzIG9wdGlvbiB0byBgdHJ1ZWAgaWYgdGhleSBhcmUgcHJlcGFyZWQgdG8gZGVhbCB3aXRoXG4gICAqIHRoZSBvYmplY3QgaW4gdGhpcyB3ZWlyZCBzaGFwZSwgYW5kIG1hc3NhZ2UgaXQgYmFjayBpbnRvIGEgY29ycmVjdCBvYmplY3QgYWZ0ZXJ3YXJkcy5cbiAgICpcbiAgICogKEEgcmVndWxhciBidXQgdW5jb21tb24gc3RyaW5nIHdhcyBjaG9zZW4gb3ZlciBzb21ldGhpbmcgbGlrZSBzeW1ib2xzIG9yXG4gICAqIG90aGVyIHdheXMgb2YgdGFnZ2luZyB0aGUgZXh0cmEgdmFsdWVzIGluIG9yZGVyIHRvIHNpbXBsaWZ5IHRoZSBpbXBsZW1lbnRhdGlvbiB3aGljaFxuICAgKiBtYWludGFpbnMgdGhlIGRlc2lyZWQgYmVoYXZpb3IgYHJlc29sdmUocmVzb2x2ZSh4KSkgPT0gcmVzb2x2ZSh4KWApLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgYWxsb3dJbnRyaW5zaWNLZXlzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byByZW1vdmUgdW5kZWZpbmVkIGVsZW1lbnRzIGZyb20gYXJyYXlzIGFuZCBvYmplY3RzIHdoZW4gcmVzb2x2aW5nLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZW1vdmVFbXB0eT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUmVzb2x2ZXMgYW4gb2JqZWN0IGJ5IGV2YWx1YXRpbmcgYWxsIHRva2VucyBhbmQgcmVtb3ZpbmcgYW55IHVuZGVmaW5lZCBvciBlbXB0eSBvYmplY3RzIG9yIGFycmF5cy5cbiAqIFZhbHVlcyBjYW4gb25seSBiZSBwcmltaXRpdmVzLCBhcnJheXMgb3IgdG9rZW5zLiBPdGhlciBvYmplY3RzIChpLmUuIHdpdGggbWV0aG9kcykgd2lsbCBiZSByZWplY3RlZC5cbiAqXG4gKiBAcGFyYW0gb2JqIFRoZSBvYmplY3QgdG8gcmVzb2x2ZS5cbiAqIEBwYXJhbSBwcmVmaXggUHJlZml4IGtleSBwYXRoIGNvbXBvbmVudHMgZm9yIGRpYWdub3N0aWNzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZShvYmo6IGFueSwgb3B0aW9uczogSVJlc29sdmVPcHRpb25zKTogYW55IHtcbiAgY29uc3QgcHJlZml4ID0gb3B0aW9ucy5wcmVmaXggfHwgW107XG4gIGNvbnN0IHBhdGhOYW1lID0gJy8nICsgcHJlZml4LmpvaW4oJy8nKTtcblxuICAvKipcbiAgICogTWFrZSBhIG5ldyByZXNvbHV0aW9uIGNvbnRleHRcbiAgICovXG4gIGZ1bmN0aW9uIG1ha2VDb250ZXh0KGFwcGVuZFBhdGg/OiBzdHJpbmcpOiBbSVJlc29sdmVDb250ZXh0LCBJUG9zdFByb2Nlc3Nvcl0ge1xuICAgIGNvbnN0IG5ld1ByZWZpeCA9IGFwcGVuZFBhdGggIT09IHVuZGVmaW5lZCA/IHByZWZpeC5jb25jYXQoW2FwcGVuZFBhdGhdKSA6IG9wdGlvbnMucHJlZml4O1xuXG4gICAgbGV0IHBvc3RQcm9jZXNzb3I6IElQb3N0UHJvY2Vzc29yIHwgdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgY29udGV4dDogSVJlc29sdmVDb250ZXh0ID0ge1xuICAgICAgcHJlcGFyaW5nOiBvcHRpb25zLnByZXBhcmluZyxcbiAgICAgIHNjb3BlOiBvcHRpb25zLnNjb3BlIGFzIElDb25zdHJ1Y3QsXG4gICAgICBkb2N1bWVudFBhdGg6IG5ld1ByZWZpeCA/PyBbXSxcbiAgICAgIHJlZ2lzdGVyUG9zdFByb2Nlc3NvcihwcCkgeyBwb3N0UHJvY2Vzc29yID0gcHA7IH0sXG4gICAgICByZXNvbHZlKHg6IGFueSwgY2hhbmdlT3B0aW9ucz86IFJlc29sdmVDaGFuZ2VDb250ZXh0T3B0aW9ucykgeyByZXR1cm4gcmVzb2x2ZSh4LCB7IC4uLm9wdGlvbnMsIC4uLmNoYW5nZU9wdGlvbnMsIHByZWZpeDogbmV3UHJlZml4IH0pOyB9LFxuICAgIH07XG5cbiAgICByZXR1cm4gW2NvbnRleHQsIHsgcG9zdFByb2Nlc3MoeCkgeyByZXR1cm4gcG9zdFByb2Nlc3NvciA/IHBvc3RQcm9jZXNzb3IucG9zdFByb2Nlc3MoeCwgY29udGV4dCkgOiB4OyB9IH1dO1xuICB9XG5cbiAgLy8gcHJvdGVjdCBhZ2FpbnN0IGN5Y2xpYyByZWZlcmVuY2VzIGJ5IGxpbWl0aW5nIGRlcHRoLlxuICBpZiAocHJlZml4Lmxlbmd0aCA+IDIwMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHJlc29sdmUgb2JqZWN0IHRyZWUgd2l0aCBjaXJjdWxhciByZWZlcmVuY2UuIFBhdGg6ICcgKyBwYXRoTmFtZSk7XG4gIH1cblxuICAvLyB3aGV0aGVyIHRvIGxlYXZlIHRoZSBlbXB0eSBlbGVtZW50cyB3aGVuIHJlc29sdmluZyAtIGZhbHNlIGJ5IGRlZmF1bHRcbiAgY29uc3QgbGVhdmVFbXB0eSA9IG9wdGlvbnMucmVtb3ZlRW1wdHkgPT09IGZhbHNlO1xuXG4gIC8vXG4gIC8vIHVuZGVmaW5lZFxuICAvL1xuXG4gIGlmICh0eXBlb2Yob2JqKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLy9cbiAgLy8gbnVsbFxuICAvL1xuXG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vXG4gIC8vIGZ1bmN0aW9ucyAtIG5vdCBzdXBwb3J0ZWQgKG9ubHkgdG9rZW5zIGFyZSBzdXBwb3J0ZWQpXG4gIC8vXG5cbiAgaWYgKHR5cGVvZihvYmopID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUcnlpbmcgdG8gcmVzb2x2ZSBhIG5vbi1kYXRhIG9iamVjdC4gT25seSB0b2tlbiBhcmUgc3VwcG9ydGVkIGZvciBsYXp5IGV2YWx1YXRpb24uIFBhdGg6ICR7cGF0aE5hbWV9LiBPYmplY3Q6ICR7b2JqfWApO1xuICB9XG5cbiAgLy9cbiAgLy8gc3RyaW5nIC0gcG90ZW50aWFsbHkgcmVwbGFjZSBhbGwgc3RyaW5naWZpZWQgVG9rZW5zXG4gIC8vXG4gIGlmICh0eXBlb2Yob2JqKSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBJZiB0aGlzIGlzIGEgXCJsaXN0IGVsZW1lbnRcIiBUb2tlbiwgaXQgc2hvdWxkIG5ldmVyIG9jY3VyIGJ5IGl0c2VsZiBpbiBzdHJpbmcgY29udGV4dFxuICAgIGlmIChUb2tlblN0cmluZy5mb3JMaXN0VG9rZW4ob2JqKS50ZXN0KCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgYW4gZW5jb2RlZCBsaXN0IHRva2VuIHN0cmluZyBpbiBhIHNjYWxhciBzdHJpbmcgY29udGV4dC4gVXNlIFxcJ0ZuLnNlbGVjdCgwLCBsaXN0KVxcJyAobm90IFxcJ2xpc3RbMF1cXCcpIHRvIGV4dHJhY3QgZWxlbWVudHMgZnJvbSB0b2tlbiBsaXN0cy4nKTtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgbG9vayBmb3IgYSBzdHJpbmdpZmllZCBUb2tlbiBpbiB0aGlzIG9iamVjdFxuICAgIGNvbnN0IHN0ciA9IFRva2VuU3RyaW5nLmZvclN0cmluZyhvYmopO1xuICAgIGlmIChzdHIudGVzdCgpKSB7XG4gICAgICBjb25zdCBmcmFnbWVudHMgPSBzdHIuc3BsaXQodG9rZW5NYXAubG9va3VwVG9rZW4uYmluZCh0b2tlbk1hcCkpO1xuICAgICAgcmV0dXJuIHRhZ1Jlc29sdmVkVmFsdWUob3B0aW9ucy5yZXNvbHZlci5yZXNvbHZlU3RyaW5nKGZyYWdtZW50cywgbWFrZUNvbnRleHQoKVswXSksIFJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgLy9cbiAgLy8gbnVtYmVyIC0gcG90ZW50aWFsbHkgZGVjb2RlIFRva2VuaXplZCBudW1iZXJcbiAgLy9cbiAgaWYgKHR5cGVvZihvYmopID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB0YWdSZXNvbHZlZFZhbHVlKHJlc29sdmVOdW1iZXJUb2tlbihvYmosIG1ha2VDb250ZXh0KClbMF0pLCBSZXNvbHV0aW9uVHlwZUhpbnQuTlVNQkVSKTtcbiAgfVxuXG4gIC8vXG4gIC8vIHByaW1pdGl2ZXMgLSBhcy1pc1xuICAvL1xuXG4gIGlmICh0eXBlb2Yob2JqKSAhPT0gJ29iamVjdCcgfHwgb2JqIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICAvL1xuICAvLyBhcnJheXMgLSByZXNvbHZlIGFsbCB2YWx1ZXMsIHJlbW92ZSB1bmRlZmluZWQgYW5kIHJlbW92ZSBlbXB0eSBhcnJheXNcbiAgLy9cblxuICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgaWYgKGNvbnRhaW5zTGlzdFRva2VuRWxlbWVudChvYmopKSB7XG4gICAgICByZXR1cm4gdGFnUmVzb2x2ZWRWYWx1ZShvcHRpb25zLnJlc29sdmVyLnJlc29sdmVMaXN0KG9iaiwgbWFrZUNvbnRleHQoKVswXSksIFJlc29sdXRpb25UeXBlSGludC5TVFJJTkdfTElTVCk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyID0gb2JqXG4gICAgICAubWFwKCh4LCBpKSA9PiBtYWtlQ29udGV4dChgJHtpfWApWzBdLnJlc29sdmUoeCkpXG4gICAgICAuZmlsdGVyKHggPT4gbGVhdmVFbXB0eSB8fCB0eXBlb2YoeCkgIT09ICd1bmRlZmluZWQnKTtcblxuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICAvL1xuICAvLyB0b2tlbnMgLSBpbnZva2UgJ3Jlc29sdmUnIGFuZCBjb250aW51ZSB0byByZXNvbHZlIHJlY3Vyc2l2ZWx5XG4gIC8vXG5cbiAgaWYgKHVucmVzb2x2ZWQob2JqKSkge1xuICAgIGNvbnN0IFtjb250ZXh0LCBwb3N0UHJvY2Vzc29yXSA9IG1ha2VDb250ZXh0KCk7XG4gICAgY29uc3QgcmV0ID0gdGFnUmVzb2x2ZWRWYWx1ZShvcHRpb25zLnJlc29sdmVyLnJlc29sdmVUb2tlbihvYmosIGNvbnRleHQsIHBvc3RQcm9jZXNzb3IpLCBSZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy9cbiAgLy8gb2JqZWN0cyAtIGRlZXAtcmVzb2x2ZSBhbGwgdmFsdWVzXG4gIC8vXG5cbiAgLy8gTXVzdCBub3QgYmUgYSBDb25zdHJ1Y3QgYXQgdGhpcyBwb2ludCwgb3RoZXJ3aXNlIHlvdSBwcm9iYWJseSBtYWRlIGEgdHlwb1xuICAvLyBtaXN0YWtlIHNvbWV3aGVyZSBhbmQgcmVzb2x2ZSB3aWxsIGdldCBpbnRvIGFuIGluZmluaXRlIGxvb3AgcmVjdXJzaW5nIGludG9cbiAgLy8gY2hpbGQucGFyZW50IDwtLS0+IHBhcmVudC5jaGlsZHJlblxuICBpZiAoaXNDb25zdHJ1Y3Qob2JqKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHJlc29sdmUoKSBhIENvbnN0cnVjdCBhdCAnICsgcGF0aE5hbWUpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0OiBhbnkgPSB7IH07XG4gIGxldCBpbnRyaW5zaWNLZXlDdHIgPSAwO1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG4gICAgY29uc3QgdmFsdWUgPSBtYWtlQ29udGV4dChTdHJpbmcoa2V5KSlbMF0ucmVzb2x2ZShvYmpba2V5XSk7XG5cbiAgICAvLyBza2lwIHVuZGVmaW5lZFxuICAgIGlmICh0eXBlb2YodmFsdWUpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKGxlYXZlRW1wdHkpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBTaW1wbGUgY2FzZSAtLSBub3QgYW4gdW5yZXNvbHZlZCBrZXlcbiAgICBpZiAoIXVucmVzb2x2ZWQoa2V5KSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc29sdmVkS2V5ID0gbWFrZUNvbnRleHQoKVswXS5yZXNvbHZlKGtleSk7XG4gICAgaWYgKHR5cGVvZihyZXNvbHZlZEtleSkgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXN1bHRbcmVzb2x2ZWRLZXldID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghb3B0aW9ucy5hbGxvd0ludHJpbnNpY0tleXMpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIiR7U3RyaW5nKGtleSl9XCIgaXMgdXNlZCBhcyB0aGUga2V5IGluIGEgbWFwIHNvIG11c3QgcmVzb2x2ZSB0byBhIHN0cmluZywgYnV0IGl0IHJlc29sdmVzIHRvOiAke0pTT04uc3RyaW5naWZ5KHJlc29sdmVkS2V5KX0uIENvbnNpZGVyIHVzaW5nIFwiQ2ZuSnNvblwiIHRvIGRlbGF5IHJlc29sdXRpb24gdG8gZGVwbG95bWVudC10aW1lYCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENhbid0IHJlcHJlc2VudCB0aGlzIG9iamVjdCBpbiBhIEphdmFTY3JpcHQga2V5IHBvc2l0aW9uLCBidXQgd2UgY2FuIHN0b3JlIGl0XG4gICAgICAvLyBpbiB2YWx1ZSBwb3NpdGlvbi4gVXNlIGEgdW5pcXVlIHN5bWJvbCBhcyB0aGUga2V5LlxuICAgICAgcmVzdWx0W2Ake0lOVFJJTlNJQ19LRVlfUFJFRklYfSR7aW50cmluc2ljS2V5Q3RyKyt9YF0gPSBbcmVzb2x2ZWRLZXksIHZhbHVlXTtcbiAgICB9XG4gIH1cblxuICAvLyBCZWNhdXNlIHdlIG1heSBiZSBjYWxsZWQgdG8gcmVjdXJzZSBvbiBhbHJlYWR5IHJlc29sdmVkIHZhbHVlcyAodGhhdCBhbHJlYWR5IGhhdmUgdHlwZSBoaW50cyBhcHBsaWVkKVxuICAvLyBhbmQgd2UganVzdCBjb3BpZWQgdGhvc2UgdmFsdWVzIGludG8gYSBmcmVzaCBvYmplY3QsIGJlIHN1cmUgdG8gcmV0YWluIGFueSB0eXBlIGhpbnRzLlxuICBjb25zdCBwcmV2aW91c1R5cGVIaW50ID0gcmVzb2x2ZWRUeXBlSGludChvYmopO1xuICByZXR1cm4gcHJldmlvdXNUeXBlSGludCA/IHRhZ1Jlc29sdmVkVmFsdWUocmVzdWx0LCBwcmV2aW91c1R5cGVIaW50KSA6IHJlc3VsdDtcbn1cblxuLyoqXG4gKiBGaW5kIGFsbCBUb2tlbnMgdGhhdCBhcmUgdXNlZCBpbiB0aGUgZ2l2ZW4gc3RydWN0dXJlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kVG9rZW5zKHNjb3BlOiBJQ29uc3RydWN0LCBmbjogKCkgPT4gYW55KTogSVJlc29sdmFibGVbXSB7XG4gIGNvbnN0IHJlc29sdmVyID0gbmV3IFJlbWVtYmVyaW5nVG9rZW5SZXNvbHZlcihuZXcgU3RyaW5nQ29uY2F0KCkpO1xuXG4gIHJlc29sdmUoZm4oKSwgeyBzY29wZSwgcHJlZml4OiBbXSwgcmVzb2x2ZXIsIHByZXBhcmluZzogdHJ1ZSB9KTtcblxuICByZXR1cm4gcmVzb2x2ZXIudG9rZW5zO1xufVxuXG4vKipcbiAqIFJlbWVtYmVyIGFsbCBUb2tlbnMgZW5jb3VudGVyZWQgd2hpbGUgcmVzb2x2aW5nXG4gKi9cbmV4cG9ydCBjbGFzcyBSZW1lbWJlcmluZ1Rva2VuUmVzb2x2ZXIgZXh0ZW5kcyBEZWZhdWx0VG9rZW5SZXNvbHZlciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgdG9rZW5zU2VlbiA9IG5ldyBTZXQ8SVJlc29sdmFibGU+KCk7XG5cbiAgcHVibGljIHJlc29sdmVUb2tlbih0OiBJUmVzb2x2YWJsZSwgY29udGV4dDogSVJlc29sdmVDb250ZXh0LCBwb3N0UHJvY2Vzc29yOiBJUG9zdFByb2Nlc3Nvcikge1xuICAgIHRoaXMudG9rZW5zU2Vlbi5hZGQodCk7XG4gICAgcmV0dXJuIHN1cGVyLnJlc29sdmVUb2tlbih0LCBjb250ZXh0LCBwb3N0UHJvY2Vzc29yKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlU3RyaW5nKHM6IFRva2VuaXplZFN0cmluZ0ZyYWdtZW50cywgY29udGV4dDogSVJlc29sdmVDb250ZXh0KSB7XG4gICAgY29uc3QgcmV0ID0gc3VwZXIucmVzb2x2ZVN0cmluZyhzLCBjb250ZXh0KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgcHVibGljIGdldCB0b2tlbnMoKTogSVJlc29sdmFibGVbXSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy50b2tlbnNTZWVuKTtcbiAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIENvbnN0cnVjdFxuICpcbiAqIE5vdCBpbiAnY29uc3RydWN0LnRzJyBiZWNhdXNlIHRoYXQgd291bGQgbGVhZCB0byBhIGRlcGVuZGVuY3kgY3ljbGUgdmlhICd1bmlxdWVpZC50cycsXG4gKiBhbmQgdGhpcyBpcyBhIGJlc3QtZWZmb3J0IHByb3RlY3Rpb24gYWdhaW5zdCBhIGNvbW1vbiBwcm9ncmFtbWluZyBtaXN0YWtlIGFueXdheS5cbiAqL1xuZnVuY3Rpb24gaXNDb25zdHJ1Y3QoeDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB4Ll9jaGlsZHJlbiAhPT0gdW5kZWZpbmVkICYmIHguX21ldGFkYXRhICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVOdW1iZXJUb2tlbih4OiBudW1iZXIsIGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCk6IGFueSB7XG4gIGNvbnN0IHRva2VuID0gVG9rZW5NYXAuaW5zdGFuY2UoKS5sb29rdXBOdW1iZXJUb2tlbih4KTtcbiAgaWYgKHRva2VuID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHg7IH1cbiAgcmV0dXJuIGNvbnRleHQucmVzb2x2ZSh0b2tlbik7XG59XG5cbi8qKlxuICogQXBwbHkgYSB0eXBlIGhpbnQgdG8gYSByZXNvbHZlZCB2YWx1ZVxuICpcbiAqIFRoZSB0eXBlIGhpbnQgd2lsbCBvbmx5IGJlIGFwcGxpZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBUaGVzZSB0eXBlIGhpbnRzIGFyZSB1c2VkIGZvciBjb3JyZWN0IEpTT04taWZpY2F0aW9uIG9mIGludHJpbnNpYyB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHRhZ1Jlc29sdmVkVmFsdWUodmFsdWU6IGFueSwgdHlwZUhpbnQ6IFJlc29sdXRpb25UeXBlSGludCk6IGFueSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8IHZhbHVlID09IG51bGwpIHsgcmV0dXJuIHZhbHVlOyB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2YWx1ZSwgUkVTT0xVVElPTl9UWVBFSElOVF9TWU0sIHtcbiAgICB2YWx1ZTogdHlwZUhpbnQsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICB9KTtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgdHlwZSBoaW50IGZyb20gdGhlIGdpdmVuIHZhbHVlXG4gKlxuICogSWYgdGhlIHZhbHVlIGlzIG5vdCBhIHJlc29sdmVkIHZhbHVlIChpLmUsIHRoZSByZXN1bHQgb2YgcmVzb2x2aW5nIGEgdG9rZW4pLFxuICogYHVuZGVmaW5lZGAgd2lsbCBiZSByZXR1cm5lZC5cbiAqXG4gKiBUaGVzZSB0eXBlIGhpbnRzIGFyZSB1c2VkIGZvciBjb3JyZWN0IEpTT04taWZpY2F0aW9uIG9mIGludHJpbnNpYyB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlZFR5cGVIaW50KHZhbHVlOiBhbnkpOiBSZXNvbHV0aW9uVHlwZUhpbnQgfCB1bmRlZmluZWQge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCB2YWx1ZSA9PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgcmV0dXJuIHZhbHVlW1JFU09MVVRJT05fVFlQRUhJTlRfU1lNXTtcbn1cbiJdfQ==