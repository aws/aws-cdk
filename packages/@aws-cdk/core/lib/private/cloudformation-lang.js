"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNameOfCloudFormationIntrinsic = exports.minimalCloudFormationJoin = exports.CLOUDFORMATION_TOKEN_RESOLVER = exports.CloudFormationLang = void 0;
const cfn_utils_provider_1 = require("./cfn-utils-provider");
const resolve_1 = require("./resolve");
const yaml_cfn = require("./yaml-cfn");
const lazy_1 = require("../lazy");
const resolvable_1 = require("../resolvable");
const stack_1 = require("../stack");
const token_1 = require("../token");
const type_hints_1 = require("../type-hints");
/**
 * Routines that know how to do operations at the CloudFormation document language level
 */
class CloudFormationLang {
    /**
     * Turn an arbitrary structure potentially containing Tokens into a JSON string.
     *
     * Returns a Token which will evaluate to CloudFormation expression that
     * will be evaluated by CloudFormation to the JSON representation of the
     * input structure.
     *
     * All Tokens substituted in this way must return strings, or the evaluation
     * in CloudFormation will fail.
     *
     * @param obj The object to stringify
     * @param space Indentation to use (default: no pretty-printing)
     */
    static toJSON(obj, space) {
        return lazy_1.Lazy.uncachedString({
            // We used to do this by hooking into `JSON.stringify()` by adding in objects
            // with custom `toJSON()` functions, but it's ultimately simpler just to
            // reimplement the `stringify()` function from scratch.
            produce: (ctx) => tokenAwareStringify(obj, space ?? 0, ctx),
        });
    }
    /**
     * Turn an arbitrary structure potentially containing Tokens into a YAML string.
     *
     * Returns a Token which will evaluate to CloudFormation expression that
     * will be evaluated by CloudFormation to the YAML representation of the
     * input structure.
     *
     * All Tokens substituted in this way must return strings, or the evaluation
     * in CloudFormation will fail.
     *
     * @param obj The object to stringify
     */
    static toYAML(obj) {
        return lazy_1.Lazy.uncachedString({
            produce: () => yaml_cfn.serialize(obj),
        });
    }
    /**
     * Produce a CloudFormation expression to concat two arbitrary expressions when resolving
     */
    static concat(left, right) {
        if (left === undefined && right === undefined) {
            return '';
        }
        const parts = new Array();
        if (left !== undefined) {
            parts.push(left);
        }
        if (right !== undefined) {
            parts.push(right);
        }
        // Some case analysis to produce minimal expressions
        if (parts.length === 1) {
            return parts[0];
        }
        if (parts.length === 2 && isConcatable(parts[0]) && isConcatable(parts[1])) {
            return `${parts[0]}${parts[1]}`;
        }
        // Otherwise return a Join intrinsic (already in the target document language to avoid taking
        // circular dependencies on FnJoin & friends)
        return fnJoinConcat(parts);
    }
}
exports.CloudFormationLang = CloudFormationLang;
/**
 * Return a CFN intrinsic mass concatenating any number of CloudFormation expressions
 */
function fnJoinConcat(parts) {
    return { 'Fn::Join': ['', minimalCloudFormationJoin('', parts)] };
}
/**
 * Perform a JSON.stringify()-like operation, except aware of Tokens and CloudFormation intrincics
 *
 * Tokens will be resolved and if any resolve to CloudFormation intrinsics, the intrinsics
 * will be lifted to the top of a giant `{ Fn::Join }` expression.
 *
 * If Tokens resolve to primitive types (for example, by using Lazies), we'll
 * use the primitive type to determine how to encode the value into the JSON.
 *
 * If Tokens resolve to CloudFormation intrinsics, we'll use the type of the encoded
 * value as a type hint to determine how to encode the value into the JSON. The difference
 * is that we add quotes (") around strings, and don't add anything around non-strings.
 *
 * The following structure:
 *
 *    { SomeAttr: resource.someAttr }
 *
 * Will JSONify to either:
 *
 *    '{ "SomeAttr": "' ++ { Fn::GetAtt: [Resource, SomeAttr] } ++ '" }'
 * or '{ "SomeAttr": ' ++ { Fn::GetAtt: [Resource, SomeAttr] } ++ ' }'
 *
 * Depending on whether `someAttr` is type-hinted to be a string or not.
 *
 * (Where ++ is the CloudFormation string-concat operation (`{ Fn::Join }`).
 *
 * -----------------------
 *
 * This work requires 2 features from the `resolve()` function:
 *
 * - INTRINSICS TYPE HINTS: intrinsics are represented by values like
 *   `{ Ref: 'XYZ' }`. These values can reference either a string or a list/number at
 *   deploy time, and from the value alone there's no way to know which. We need
 *   to know the type to know whether to JSONify this reference to:
 *
 *      '{ "referencedValue": "' ++ { Ref: XYZ } ++ '"}'
 *   or '{ "referencedValue": ' ++ { Ref: XYZ } ++ '}'
 *
 *   I.e., whether or not we need to enclose the reference in quotes or not.
 *
 *   We COULD have done this by resolving one token at a time, and looking at the
 *   type of the encoded token we were resolving to obtain a type hint. However,
 *   the `resolve()` and Token system resist a level-at-a-time resolve
 *   operation: because of the existence of post-processors, we must have done a
 *   complete recursive resolution of a token before we can look at its result
 *   (after which any type information about the sources of nested resolved
 *   values is lost).
 *
 *   To fix this, "type hints" have been added to the `resolve()` function,
 *   giving an idea of the type of the source value for complex result values.
 *   This only works for objects (not strings and numbers) but fortunately
 *   we only care about the types of intrinsics, which are always complex values.
 *
 *   Type hinting could have been added to the `IResolvable` protocol as well,
 *   but for now we just use the type of an encoded value as a type hint. That way
 *   we don't need to annotate anything more at the L1 level--we will use the type
 *   encodings added by construct authors at the L2 levels. L1 users can escape the
 *   default decision of "string" by using `Token.asList()`.
 *
 * - COMPLEX KEYS: since tokens can be string-encoded, we can use string-encoded tokens
 *   as the keys in JavaScript objects. However, after resolution, those string-encoded
 *   tokens could resolve to intrinsics (`{ Ref: ... }`), which CANNOT be stored in
 *   JavaScript objects anymore.
 *
 *   We therefore need a protocol to store the resolved values somewhere in the JavaScript
 *   type model,  which can be returned by `resolve()`, and interpreted by `tokenAwareStringify()`
 *   to produce the correct JSON.
 *
 *   And example will quickly show the point:
 *
 *    User writes:
 *       { [resource.resourceName]: 'SomeValue' }
 *    ------ string actually looks like ------>
 *       { '${Token[1234]}': 'SomeValue' }
 *    ------ resolve ------->
 *       { '$IntrinsicKey$0': [ {Ref: Resource}, 'SomeValue' ] }
 *    ------ tokenAwareStringify ------->
 *       '{ "' ++ { Ref: Resource } ++ '": "SomeValue" }'
 */
function tokenAwareStringify(root, space, ctx) {
    let indent = 0;
    const ret = new Array();
    // First completely resolve the tree, then encode to JSON while respecting the type
    // hints we got for the resolved intrinsics.
    recurse(ctx.resolve(root, { allowIntrinsicKeys: true }));
    switch (ret.length) {
        case 0: return undefined;
        case 1: return renderSegment(ret[0]);
        default:
            return fnJoinConcat(ret.map(renderSegment));
    }
    /**
     * Stringify a JSON element
     */
    function recurse(obj) {
        if (obj === undefined) {
            return;
        }
        if (token_1.Token.isUnresolved(obj)) {
            throw new Error("This shouldn't happen anymore");
        }
        if (Array.isArray(obj)) {
            return renderCollection('[', ']', obj, recurse);
        }
        if (typeof obj === 'object' && obj != null && !(obj instanceof Date)) {
            // Treat as an intrinsic if this LOOKS like a CFN intrinsic (`{ Ref: ... }`)
            // AND it's the result of a token resolution. Otherwise, we just treat this
            // value as a regular old JSON object (that happens to look a lot like an intrinsic).
            if (isIntrinsic(obj) && (0, resolve_1.resolvedTypeHint)(obj)) {
                renderIntrinsic(obj);
                return;
            }
            return renderCollection('{', '}', definedEntries(obj), ([key, value]) => {
                if (key.startsWith(resolve_1.INTRINSIC_KEY_PREFIX)) {
                    [key, value] = value;
                }
                recurse(key);
                pushLiteral(prettyPunctuation(':'));
                recurse(value);
            });
        }
        // Otherwise we have a scalar, defer to JSON.stringify()s serialization
        pushLiteral(JSON.stringify(obj));
    }
    /**
     * Render an object or list
     */
    function renderCollection(pre, post, xs, each) {
        pushLiteral(pre);
        indent += space;
        let atLeastOne = false;
        for (const [comma, item] of sepIter(xs)) {
            if (comma) {
                pushLiteral(',');
            }
            pushLineBreak();
            each(item);
            atLeastOne = true;
        }
        indent -= space;
        if (atLeastOne) {
            pushLineBreak();
        }
        pushLiteral(post);
    }
    function renderIntrinsic(intrinsic) {
        switch ((0, resolve_1.resolvedTypeHint)(intrinsic)) {
            case type_hints_1.ResolutionTypeHint.STRING:
                pushLiteral('"');
                pushIntrinsic(deepQuoteStringLiterals(intrinsic));
                pushLiteral('"');
                return;
            case type_hints_1.ResolutionTypeHint.STRING_LIST:
                // We need this to look like:
                //
                //    '{"listValue":' ++ STRINGIFY(CFN_EVAL({ Ref: MyList })) ++ '}'
                //
                // However, STRINGIFY would need to execute at CloudFormation deployment time, and that doesn't exist.
                //
                // We could *ALMOST* use:
                //
                //   '{"listValue":["' ++ JOIN('","', { Ref: MyList }) ++ '"]}'
                //
                // But that has the unfortunate side effect that if `CFN_EVAL({ Ref: MyList }) == []`, then it would
                // evaluate to `[""]`, which is a different value. Since CloudFormation does not have arbitrary
                // conditionals there's no way to deal with this case properly.
                //
                // Therefore, if we encounter lists we need to defer to a custom resource to handle
                // them properly at deploy time.
                const stack = stack_1.Stack.of(ctx.scope);
                // Because this will be called twice (once during `prepare`, once during `resolve`),
                // we need to make sure to be idempotent, so use a cache.
                const stringifyResponse = stringifyCache.obtain(stack, JSON.stringify(intrinsic), () => cfn_utils_provider_1.CfnUtils.stringify(stack, `CdkJsonStringify${stringifyCounter++}`, intrinsic));
                pushIntrinsic(stringifyResponse);
                return;
            case type_hints_1.ResolutionTypeHint.NUMBER:
                pushIntrinsic(intrinsic);
                return;
        }
        throw new Error(`Unexpected type hint: ${(0, resolve_1.resolvedTypeHint)(intrinsic)}`);
    }
    /**
     * Push a literal onto the current segment if it's also a literal, otherwise open a new Segment
     */
    function pushLiteral(lit) {
        let last = ret[ret.length - 1];
        if (last?.type !== 'literal') {
            last = { type: 'literal', parts: [] };
            ret.push(last);
        }
        last.parts.push(lit);
    }
    /**
     * Add a new intrinsic segment
     */
    function pushIntrinsic(intrinsic) {
        ret.push({ type: 'intrinsic', intrinsic });
    }
    /**
     * Push a line break if we are pretty-printing, otherwise don't
     */
    function pushLineBreak() {
        if (space > 0) {
            pushLiteral(`\n${' '.repeat(indent)}`);
        }
    }
    /**
     * Add a space after the punctuation if we are pretty-printing, no space if not
     */
    function prettyPunctuation(punc) {
        return space > 0 ? `${punc} ` : punc;
    }
}
/**
 * Render a segment
 */
function renderSegment(s) {
    switch (s.type) {
        case 'literal': return s.parts.join('');
        case 'intrinsic': return s.intrinsic;
    }
}
const CLOUDFORMATION_CONCAT = {
    join(left, right) {
        return CloudFormationLang.concat(left, right);
    },
};
/**
 * Default Token resolver for CloudFormation templates
 */
exports.CLOUDFORMATION_TOKEN_RESOLVER = new resolvable_1.DefaultTokenResolver(CLOUDFORMATION_CONCAT);
/**
 * Do an intelligent CloudFormation join on the given values, producing a minimal expression
 */
function minimalCloudFormationJoin(delimiter, values) {
    let i = 0;
    while (i < values.length) {
        const el = values[i];
        if (isSplicableFnJoinIntrinsic(el)) {
            values.splice(i, 1, ...el['Fn::Join'][1]);
        }
        else if (i > 0 && isConcatable(values[i - 1]) && isConcatable(values[i])) {
            values[i - 1] = `${values[i - 1]}${delimiter}${values[i]}`;
            values.splice(i, 1);
        }
        else {
            i += 1;
        }
    }
    return values;
    function isSplicableFnJoinIntrinsic(obj) {
        if (!isIntrinsic(obj)) {
            return false;
        }
        if (Object.keys(obj)[0] !== 'Fn::Join') {
            return false;
        }
        const [delim, list] = obj['Fn::Join'];
        if (delim !== delimiter) {
            return false;
        }
        if (token_1.Token.isUnresolved(list)) {
            return false;
        }
        if (!Array.isArray(list)) {
            return false;
        }
        return true;
    }
}
exports.minimalCloudFormationJoin = minimalCloudFormationJoin;
function isConcatable(obj) {
    return ['string', 'number'].includes(typeof obj) && !token_1.Token.isUnresolved(obj);
}
/**
 * Return whether the given value represents a CloudFormation intrinsic
 */
function isIntrinsic(x) {
    if (Array.isArray(x) || x === null || typeof x !== 'object') {
        return false;
    }
    const keys = Object.keys(x);
    if (keys.length !== 1) {
        return false;
    }
    return keys[0] === 'Ref' || isNameOfCloudFormationIntrinsic(keys[0]);
}
function isNameOfCloudFormationIntrinsic(name) {
    if (!name.startsWith('Fn::')) {
        return false;
    }
    // these are 'fake' intrinsics, only usable inside the parameter overrides of a CFN CodePipeline Action
    return name !== 'Fn::GetArtifactAtt' && name !== 'Fn::GetParam';
}
exports.isNameOfCloudFormationIntrinsic = isNameOfCloudFormationIntrinsic;
/**
 * Separated iterator
 */
function* sepIter(xs) {
    let comma = false;
    for (const item of xs) {
        yield [comma, item];
        comma = true;
    }
}
/**
 * Object.entries() but skipping undefined values
 */
function* definedEntries(xs) {
    for (const [key, value] of Object.entries(xs)) {
        if (value !== undefined) {
            yield [key, value];
        }
    }
}
/**
 * Quote string literals inside an intrinsic
 *
 * Formally, this should only match string literals that will be interpreted as
 * string literals. Fortunately, the strings that should NOT be quoted are
 * Logical IDs and attribute names, which cannot contain quotes anyway. Hence,
 * we can get away not caring about the distinction and just quoting everything.
 */
function deepQuoteStringLiterals(x) {
    if (Array.isArray(x)) {
        return x.map(deepQuoteStringLiterals);
    }
    if (typeof x === 'object' && x != null) {
        const ret = {};
        for (const [key, value] of Object.entries(x)) {
            ret[deepQuoteStringLiterals(key)] = deepQuoteStringLiterals(value);
        }
        return ret;
    }
    if (typeof x === 'string') {
        return quoteString(x);
    }
    return x;
}
/**
 * Quote the characters inside a string, for use inside toJSON
 */
function quoteString(s) {
    s = JSON.stringify(s);
    return s.substring(1, s.length - 1);
}
let stringifyCounter = 1;
/**
 * A cache scoped to object instances, that's maintained externally to the object instances
 */
class ScopedCache {
    constructor() {
        this.cache = new WeakMap();
    }
    obtain(object, key, init) {
        let kvMap = this.cache.get(object);
        if (!kvMap) {
            kvMap = new Map();
            this.cache.set(object, kvMap);
        }
        let ret = kvMap.get(key);
        if (ret === undefined) {
            ret = init();
            kvMap.set(key, ret);
        }
        return ret;
    }
}
const stringifyCache = new ScopedCache();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWRmb3JtYXRpb24tbGFuZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsb3VkZm9ybWF0aW9uLWxhbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkRBQWdEO0FBQ2hELHVDQUFtRTtBQUNuRSx1Q0FBdUM7QUFDdkMsa0NBQStCO0FBQy9CLDhDQUE2RjtBQUM3RixvQ0FBaUM7QUFDakMsb0NBQWlDO0FBQ2pDLDhDQUFtRDtBQUVuRDs7R0FFRztBQUNILE1BQWEsa0JBQWtCO0lBQzdCOzs7Ozs7Ozs7Ozs7T0FZRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBUSxFQUFFLEtBQWM7UUFDM0MsT0FBTyxXQUFJLENBQUMsY0FBYyxDQUFDO1lBQ3pCLDZFQUE2RTtZQUM3RSx3RUFBd0U7WUFDeEUsdURBQXVEO1lBQ3ZELE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDO1NBQzVELENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBUTtRQUMzQixPQUFPLFdBQUksQ0FBQyxjQUFjLENBQUM7WUFDekIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1NBQ3ZDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBcUIsRUFBRSxLQUFzQjtRQUNoRSxJQUFJLElBQUksS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUFFLE9BQU8sRUFBRSxDQUFDO1NBQUU7UUFFN0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQU8sQ0FBQztRQUMvQixJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7WUFBRSxLQUFLLENBQUMsSUFBSSxDQUFD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Q3JCLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUNiLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3JCO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0NBQ0Y7QUFFRCxNQUFNLGNBQWMsR0FBRyxJQUFJLFdBQVcsRUFBeUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENmblV0aWxzIH0gZnJvbSAnLi9jZm4tdXRpbHMtcHJvdmlkZXInO1xuaW1wb3J0IHsgSU5UUklOU0lDX0tFWV9QUkVGSVgsIHJlc29sdmVkVHlwZUhpbnQgfSBmcm9tICcuL3Jlc29sdmUnO1xuaW1wb3J0ICogYXMgeWFtbF9jZm4gZnJvbSAnLi95YW1sLWNmbic7XG5pbXBvcnQgeyBMYXp5IH0gZnJvbSAnLi4vbGF6eSc7XG5pbXBvcnQgeyBEZWZhdWx0VG9rZW5SZXNvbHZlciwgSUZyYWdtZW50Q29uY2F0ZW5hdG9yLCBJUmVzb2x2ZUNvbnRleHQgfSBmcm9tICcuLi9yZXNvbHZhYmxlJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi4vc3RhY2snO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICcuLi90b2tlbic7XG5pbXBvcnQgeyBSZXNvbHV0aW9uVHlwZUhpbnQgfSBmcm9tICcuLi90eXBlLWhpbnRzJztcblxuLyoqXG4gKiBSb3V0aW5lcyB0aGF0IGtub3cgaG93IHRvIGRvIG9wZXJhdGlvbnMgYXQgdGhlIENsb3VkRm9ybWF0aW9uIGRvY3VtZW50IGxhbmd1YWdlIGxldmVsXG4gKi9cbmV4cG9ydCBjbGFzcyBDbG91ZEZvcm1hdGlvbkxhbmcge1xuICAvKipcbiAgICogVHVybiBhbiBhcmJpdHJhcnkgc3RydWN0dXJlIHBvdGVudGlhbGx5IGNvbnRhaW5pbmcgVG9rZW5zIGludG8gYSBKU09OIHN0cmluZy5cbiAgICpcbiAgICogUmV0dXJucyBhIFRva2VuIHdoaWNoIHdpbGwgZXZhbHVhdGUgdG8gQ2xvdWRGb3JtYXRpb24gZXhwcmVzc2lvbiB0aGF0XG4gICAqIHdpbGwgYmUgZXZhbHVhdGVkIGJ5IENsb3VkRm9ybWF0aW9uIHRvIHRoZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZVxuICAgKiBpbnB1dCBzdHJ1Y3R1cmUuXG4gICAqXG4gICAqIEFsbCBUb2tlbnMgc3Vic3RpdHV0ZWQgaW4gdGhpcyB3YXkgbXVzdCByZXR1cm4gc3RyaW5ncywgb3IgdGhlIGV2YWx1YXRpb25cbiAgICogaW4gQ2xvdWRGb3JtYXRpb24gd2lsbCBmYWlsLlxuICAgKlxuICAgKiBAcGFyYW0gb2JqIFRoZSBvYmplY3QgdG8gc3RyaW5naWZ5XG4gICAqIEBwYXJhbSBzcGFjZSBJbmRlbnRhdGlvbiB0byB1c2UgKGRlZmF1bHQ6IG5vIHByZXR0eS1wcmludGluZylcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdG9KU09OKG9iajogYW55LCBzcGFjZT86IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIExhenkudW5jYWNoZWRTdHJpbmcoe1xuICAgICAgLy8gV2UgdXNlZCB0byBkbyB0aGlzIGJ5IGhvb2tpbmcgaW50byBgSlNPTi5zdHJpbmdpZnkoKWAgYnkgYWRkaW5nIGluIG9iamVjdHNcbiAgICAgIC8vIHdpdGggY3VzdG9tIGB0b0pTT04oKWAgZnVuY3Rpb25zLCBidXQgaXQncyB1bHRpbWF0ZWx5IHNpbXBsZXIganVzdCB0b1xuICAgICAgLy8gcmVpbXBsZW1lbnQgdGhlIGBzdHJpbmdpZnkoKWAgZnVuY3Rpb24gZnJvbSBzY3JhdGNoLlxuICAgICAgcHJvZHVjZTogKGN0eCkgPT4gdG9rZW5Bd2FyZVN0cmluZ2lmeShvYmosIHNwYWNlID8/IDAsIGN0eCksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVHVybiBhbiBhcmJpdHJhcnkgc3RydWN0dXJlIHBvdGVudGlhbGx5IGNvbnRhaW5pbmcgVG9rZW5zIGludG8gYSBZQU1MIHN0cmluZy5cbiAgICpcbiAgICogUmV0dXJucyBhIFRva2VuIHdoaWNoIHdpbGwgZXZhbHVhdGUgdG8gQ2xvdWRGb3JtYXRpb24gZXhwcmVzc2lvbiB0aGF0XG4gICAqIHdpbGwgYmUgZXZhbHVhdGVkIGJ5IENsb3VkRm9ybWF0aW9uIHRvIHRoZSBZQU1MIHJlcHJlc2VudGF0aW9uIG9mIHRoZVxuICAgKiBpbnB1dCBzdHJ1Y3R1cmUuXG4gICAqXG4gICAqIEFsbCBUb2tlbnMgc3Vic3RpdHV0ZWQgaW4gdGhpcyB3YXkgbXVzdCByZXR1cm4gc3RyaW5ncywgb3IgdGhlIGV2YWx1YXRpb25cbiAgICogaW4gQ2xvdWRGb3JtYXRpb24gd2lsbCBmYWlsLlxuICAgKlxuICAgKiBAcGFyYW0gb2JqIFRoZSBvYmplY3QgdG8gc3RyaW5naWZ5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRvWUFNTChvYmo6IGFueSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIExhenkudW5jYWNoZWRTdHJpbmcoe1xuICAgICAgcHJvZHVjZTogKCkgPT4geWFtbF9jZm4uc2VyaWFsaXplKG9iaiksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUHJvZHVjZSBhIENsb3VkRm9ybWF0aW9uIGV4cHJlc3Npb24gdG8gY29uY2F0IHR3byBhcmJpdHJhcnkgZXhwcmVzc2lvbnMgd2hlbiByZXNvbHZpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29uY2F0KGxlZnQ6IGFueSB8IHVuZGVmaW5lZCwgcmlnaHQ6IGFueSB8IHVuZGVmaW5lZCk6IGFueSB7XG4gICAgaWYgKGxlZnQgPT09IHVuZGVmaW5lZCAmJiByaWdodCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiAnJzsgfVxuXG4gICAgY29uc3QgcGFydHMgPSBuZXcgQXJyYXk8YW55PigpO1xuICAgIGlmIChsZWZ0ICE9PSB1bmRlZmluZWQpIHsgcGFydHMucHVzaChsZWZ0KTsgfVxuICAgIGlmIChyaWdodCAhPT0gdW5kZWZpbmVkKSB7IHBhcnRzLnB1c2gocmlnaHQpOyB9XG5cbiAgICAvLyBTb21lIGNhc2UgYW5hbHlzaXMgdG8gcHJvZHVjZSBtaW5pbWFsIGV4cHJlc3Npb25zXG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMSkgeyByZXR1cm4gcGFydHNbMF07IH1cbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyICYmIGlzQ29uY2F0YWJsZShwYXJ0c1swXSkgJiYgaXNDb25jYXRhYmxlKHBhcnRzWzFdKSkge1xuICAgICAgcmV0dXJuIGAke3BhcnRzWzBdfSR7cGFydHNbMV19YDtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgcmV0dXJuIGEgSm9pbiBpbnRyaW5zaWMgKGFscmVhZHkgaW4gdGhlIHRhcmdldCBkb2N1bWVudCBsYW5ndWFnZSB0byBhdm9pZCB0YWtpbmdcbiAgICAvLyBjaXJjdWxhciBkZXBlbmRlbmNpZXMgb24gRm5Kb2luICYgZnJpZW5kcylcbiAgICByZXR1cm4gZm5Kb2luQ29uY2F0KHBhcnRzKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiBhIENGTiBpbnRyaW5zaWMgbWFzcyBjb25jYXRlbmF0aW5nIGFueSBudW1iZXIgb2YgQ2xvdWRGb3JtYXRpb24gZXhwcmVzc2lvbnNcbiAqL1xuZnVuY3Rpb24gZm5Kb2luQ29uY2F0KHBhcnRzOiBhbnlbXSkge1xuICByZXR1cm4geyAnRm46OkpvaW4nOiBbJycsIG1pbmltYWxDbG91ZEZvcm1hdGlvbkpvaW4oJycsIHBhcnRzKV0gfTtcbn1cblxuLyoqXG4gKiBQZXJmb3JtIGEgSlNPTi5zdHJpbmdpZnkoKS1saWtlIG9wZXJhdGlvbiwgZXhjZXB0IGF3YXJlIG9mIFRva2VucyBhbmQgQ2xvdWRGb3JtYXRpb24gaW50cmluY2ljc1xuICpcbiAqIFRva2VucyB3aWxsIGJlIHJlc29sdmVkIGFuZCBpZiBhbnkgcmVzb2x2ZSB0byBDbG91ZEZvcm1hdGlvbiBpbnRyaW5zaWNzLCB0aGUgaW50cmluc2ljc1xuICogd2lsbCBiZSBsaWZ0ZWQgdG8gdGhlIHRvcCBvZiBhIGdpYW50IGB7IEZuOjpKb2luIH1gIGV4cHJlc3Npb24uXG4gKlxuICogSWYgVG9rZW5zIHJlc29sdmUgdG8gcHJpbWl0aXZlIHR5cGVzIChmb3IgZXhhbXBsZSwgYnkgdXNpbmcgTGF6aWVzKSwgd2UnbGxcbiAqIHVzZSB0aGUgcHJpbWl0aXZlIHR5cGUgdG8gZGV0ZXJtaW5lIGhvdyB0byBlbmNvZGUgdGhlIHZhbHVlIGludG8gdGhlIEpTT04uXG4gKlxuICogSWYgVG9rZW5zIHJlc29sdmUgdG8gQ2xvdWRGb3JtYXRpb24gaW50cmluc2ljcywgd2UnbGwgdXNlIHRoZSB0eXBlIG9mIHRoZSBlbmNvZGVkXG4gKiB2YWx1ZSBhcyBhIHR5cGUgaGludCB0byBkZXRlcm1pbmUgaG93IHRvIGVuY29kZSB0aGUgdmFsdWUgaW50byB0aGUgSlNPTi4gVGhlIGRpZmZlcmVuY2VcbiAqIGlzIHRoYXQgd2UgYWRkIHF1b3RlcyAoXCIpIGFyb3VuZCBzdHJpbmdzLCBhbmQgZG9uJ3QgYWRkIGFueXRoaW5nIGFyb3VuZCBub24tc3RyaW5ncy5cbiAqXG4gKiBUaGUgZm9sbG93aW5nIHN0cnVjdHVyZTpcbiAqXG4gKiAgICB7IFNvbWVBdHRyOiByZXNvdXJjZS5zb21lQXR0ciB9XG4gKlxuICogV2lsbCBKU09OaWZ5IHRvIGVpdGhlcjpcbiAqXG4gKiAgICAneyBcIlNvbWVBdHRyXCI6IFwiJyArKyB7IEZuOjpHZXRBdHQ6IFtSZXNvdXJjZSwgU29tZUF0dHJdIH0gKysgJ1wiIH0nXG4gKiBvciAneyBcIlNvbWVBdHRyXCI6ICcgKysgeyBGbjo6R2V0QXR0OiBbUmVzb3VyY2UsIFNvbWVBdHRyXSB9ICsrICcgfSdcbiAqXG4gKiBEZXBlbmRpbmcgb24gd2hldGhlciBgc29tZUF0dHJgIGlzIHR5cGUtaGludGVkIHRvIGJlIGEgc3RyaW5nIG9yIG5vdC5cbiAqXG4gKiAoV2hlcmUgKysgaXMgdGhlIENsb3VkRm9ybWF0aW9uIHN0cmluZy1jb25jYXQgb3BlcmF0aW9uIChgeyBGbjo6Sm9pbiB9YCkuXG4gKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBUaGlzIHdvcmsgcmVxdWlyZXMgMiBmZWF0dXJlcyBmcm9tIHRoZSBgcmVzb2x2ZSgpYCBmdW5jdGlvbjpcbiAqXG4gKiAtIElOVFJJTlNJQ1MgVFlQRSBISU5UUzogaW50cmluc2ljcyBhcmUgcmVwcmVzZW50ZWQgYnkgdmFsdWVzIGxpa2VcbiAqICAgYHsgUmVmOiAnWFlaJyB9YC4gVGhlc2UgdmFsdWVzIGNhbiByZWZlcmVuY2UgZWl0aGVyIGEgc3RyaW5nIG9yIGEgbGlzdC9udW1iZXIgYXRcbiAqICAgZGVwbG95IHRpbWUsIGFuZCBmcm9tIHRoZSB2YWx1ZSBhbG9uZSB0aGVyZSdzIG5vIHdheSB0byBrbm93IHdoaWNoLiBXZSBuZWVkXG4gKiAgIHRvIGtub3cgdGhlIHR5cGUgdG8ga25vdyB3aGV0aGVyIHRvIEpTT05pZnkgdGhpcyByZWZlcmVuY2UgdG86XG4gKlxuICogICAgICAneyBcInJlZmVyZW5jZWRWYWx1ZVwiOiBcIicgKysgeyBSZWY6IFhZWiB9ICsrICdcIn0nXG4gKiAgIG9yICd7IFwicmVmZXJlbmNlZFZhbHVlXCI6ICcgKysgeyBSZWY6IFhZWiB9ICsrICd9J1xuICpcbiAqICAgSS5lLiwgd2hldGhlciBvciBub3Qgd2UgbmVlZCB0byBlbmNsb3NlIHRoZSByZWZlcmVuY2UgaW4gcXVvdGVzIG9yIG5vdC5cbiAqXG4gKiAgIFdlIENPVUxEIGhhdmUgZG9uZSB0aGlzIGJ5IHJlc29sdmluZyBvbmUgdG9rZW4gYXQgYSB0aW1lLCBhbmQgbG9va2luZyBhdCB0aGVcbiAqICAgdHlwZSBvZiB0aGUgZW5jb2RlZCB0b2tlbiB3ZSB3ZXJlIHJlc29sdmluZyB0byBvYnRhaW4gYSB0eXBlIGhpbnQuIEhvd2V2ZXIsXG4gKiAgIHRoZSBgcmVzb2x2ZSgpYCBhbmQgVG9rZW4gc3lzdGVtIHJlc2lzdCBhIGxldmVsLWF0LWEtdGltZSByZXNvbHZlXG4gKiAgIG9wZXJhdGlvbjogYmVjYXVzZSBvZiB0aGUgZXhpc3RlbmNlIG9mIHBvc3QtcHJvY2Vzc29ycywgd2UgbXVzdCBoYXZlIGRvbmUgYVxuICogICBjb21wbGV0ZSByZWN1cnNpdmUgcmVzb2x1dGlvbiBvZiBhIHRva2VuIGJlZm9yZSB3ZSBjYW4gbG9vayBhdCBpdHMgcmVzdWx0XG4gKiAgIChhZnRlciB3aGljaCBhbnkgdHlwZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc291cmNlcyBvZiBuZXN0ZWQgcmVzb2x2ZWRcbiAqICAgdmFsdWVzIGlzIGxvc3QpLlxuICpcbiAqICAgVG8gZml4IHRoaXMsIFwidHlwZSBoaW50c1wiIGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgYHJlc29sdmUoKWAgZnVuY3Rpb24sXG4gKiAgIGdpdmluZyBhbiBpZGVhIG9mIHRoZSB0eXBlIG9mIHRoZSBzb3VyY2UgdmFsdWUgZm9yIGNvbXBsZXggcmVzdWx0IHZhbHVlcy5cbiAqICAgVGhpcyBvbmx5IHdvcmtzIGZvciBvYmplY3RzIChub3Qgc3RyaW5ncyBhbmQgbnVtYmVycykgYnV0IGZvcnR1bmF0ZWx5XG4gKiAgIHdlIG9ubHkgY2FyZSBhYm91dCB0aGUgdHlwZXMgb2YgaW50cmluc2ljcywgd2hpY2ggYXJlIGFsd2F5cyBjb21wbGV4IHZhbHVlcy5cbiAqXG4gKiAgIFR5cGUgaGludGluZyBjb3VsZCBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIGBJUmVzb2x2YWJsZWAgcHJvdG9jb2wgYXMgd2VsbCxcbiAqICAgYnV0IGZvciBub3cgd2UganVzdCB1c2UgdGhlIHR5cGUgb2YgYW4gZW5jb2RlZCB2YWx1ZSBhcyBhIHR5cGUgaGludC4gVGhhdCB3YXlcbiAqICAgd2UgZG9uJ3QgbmVlZCB0byBhbm5vdGF0ZSBhbnl0aGluZyBtb3JlIGF0IHRoZSBMMSBsZXZlbC0td2Ugd2lsbCB1c2UgdGhlIHR5cGVcbiAqICAgZW5jb2RpbmdzIGFkZGVkIGJ5IGNvbnN0cnVjdCBhdXRob3JzIGF0IHRoZSBMMiBsZXZlbHMuIEwxIHVzZXJzIGNhbiBlc2NhcGUgdGhlXG4gKiAgIGRlZmF1bHQgZGVjaXNpb24gb2YgXCJzdHJpbmdcIiBieSB1c2luZyBgVG9rZW4uYXNMaXN0KClgLlxuICpcbiAqIC0gQ09NUExFWCBLRVlTOiBzaW5jZSB0b2tlbnMgY2FuIGJlIHN0cmluZy1lbmNvZGVkLCB3ZSBjYW4gdXNlIHN0cmluZy1lbmNvZGVkIHRva2Vuc1xuICogICBhcyB0aGUga2V5cyBpbiBKYXZhU2NyaXB0IG9iamVjdHMuIEhvd2V2ZXIsIGFmdGVyIHJlc29sdXRpb24sIHRob3NlIHN0cmluZy1lbmNvZGVkXG4gKiAgIHRva2VucyBjb3VsZCByZXNvbHZlIHRvIGludHJpbnNpY3MgKGB7IFJlZjogLi4uIH1gKSwgd2hpY2ggQ0FOTk9UIGJlIHN0b3JlZCBpblxuICogICBKYXZhU2NyaXB0IG9iamVjdHMgYW55bW9yZS5cbiAqXG4gKiAgIFdlIHRoZXJlZm9yZSBuZWVkIGEgcHJvdG9jb2wgdG8gc3RvcmUgdGhlIHJlc29sdmVkIHZhbHVlcyBzb21ld2hlcmUgaW4gdGhlIEphdmFTY3JpcHRcbiAqICAgdHlwZSBtb2RlbCwgIHdoaWNoIGNhbiBiZSByZXR1cm5lZCBieSBgcmVzb2x2ZSgpYCwgYW5kIGludGVycHJldGVkIGJ5IGB0b2tlbkF3YXJlU3RyaW5naWZ5KClgXG4gKiAgIHRvIHByb2R1Y2UgdGhlIGNvcnJlY3QgSlNPTi5cbiAqXG4gKiAgIEFuZCBleGFtcGxlIHdpbGwgcXVpY2tseSBzaG93IHRoZSBwb2ludDpcbiAqXG4gKiAgICBVc2VyIHdyaXRlczpcbiAqICAgICAgIHsgW3Jlc291cmNlLnJlc291cmNlTmFtZV06ICdTb21lVmFsdWUnIH1cbiAqICAgIC0tLS0tLSBzdHJpbmcgYWN0dWFsbHkgbG9va3MgbGlrZSAtLS0tLS0+XG4gKiAgICAgICB7ICcke1Rva2VuWzEyMzRdfSc6ICdTb21lVmFsdWUnIH1cbiAqICAgIC0tLS0tLSByZXNvbHZlIC0tLS0tLS0+XG4gKiAgICAgICB7ICckSW50cmluc2ljS2V5JDAnOiBbIHtSZWY6IFJlc291cmNlfSwgJ1NvbWVWYWx1ZScgXSB9XG4gKiAgICAtLS0tLS0gdG9rZW5Bd2FyZVN0cmluZ2lmeSAtLS0tLS0tPlxuICogICAgICAgJ3sgXCInICsrIHsgUmVmOiBSZXNvdXJjZSB9ICsrICdcIjogXCJTb21lVmFsdWVcIiB9J1xuICovXG5mdW5jdGlvbiB0b2tlbkF3YXJlU3RyaW5naWZ5KHJvb3Q6IGFueSwgc3BhY2U6IG51bWJlciwgY3R4OiBJUmVzb2x2ZUNvbnRleHQpIHtcbiAgbGV0IGluZGVudCA9IDA7XG5cbiAgY29uc3QgcmV0ID0gbmV3IEFycmF5PFNlZ21lbnQ+KCk7XG5cbiAgLy8gRmlyc3QgY29tcGxldGVseSByZXNvbHZlIHRoZSB0cmVlLCB0aGVuIGVuY29kZSB0byBKU09OIHdoaWxlIHJlc3BlY3RpbmcgdGhlIHR5cGVcbiAgLy8gaGludHMgd2UgZ290IGZvciB0aGUgcmVzb2x2ZWQgaW50cmluc2ljcy5cbiAgcmVjdXJzZShjdHgucmVzb2x2ZShyb290LCB7IGFsbG93SW50cmluc2ljS2V5czogdHJ1ZSB9KSk7XG5cbiAgc3dpdGNoIChyZXQubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNhc2UgMTogcmV0dXJuIHJlbmRlclNlZ21lbnQocmV0WzBdKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZuSm9pbkNvbmNhdChyZXQubWFwKHJlbmRlclNlZ21lbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdHJpbmdpZnkgYSBKU09OIGVsZW1lbnRcbiAgICovXG4gIGZ1bmN0aW9uIHJlY3Vyc2Uob2JqOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAob2JqID09PSB1bmRlZmluZWQpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKG9iaikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgc2hvdWxkbid0IGhhcHBlbiBhbnltb3JlXCIpO1xuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICByZXR1cm4gcmVuZGVyQ29sbGVjdGlvbignWycsICddJywgb2JqLCByZWN1cnNlKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiAhPSBudWxsICYmICEob2JqIGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICAgIC8vIFRyZWF0IGFzIGFuIGludHJpbnNpYyBpZiB0aGlzIExPT0tTIGxpa2UgYSBDRk4gaW50cmluc2ljIChgeyBSZWY6IC4uLiB9YClcbiAgICAgIC8vIEFORCBpdCdzIHRoZSByZXN1bHQgb2YgYSB0b2tlbiByZXNvbHV0aW9uLiBPdGhlcndpc2UsIHdlIGp1c3QgdHJlYXQgdGhpc1xuICAgICAgLy8gdmFsdWUgYXMgYSByZWd1bGFyIG9sZCBKU09OIG9iamVjdCAodGhhdCBoYXBwZW5zIHRvIGxvb2sgYSBsb3QgbGlrZSBhbiBpbnRyaW5zaWMpLlxuICAgICAgaWYgKGlzSW50cmluc2ljKG9iaikgJiYgcmVzb2x2ZWRUeXBlSGludChvYmopKSB7XG4gICAgICAgIHJlbmRlckludHJpbnNpYyhvYmopO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZW5kZXJDb2xsZWN0aW9uKCd7JywgJ30nLCBkZWZpbmVkRW50cmllcyhvYmopLCAoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChJTlRSSU5TSUNfS0VZX1BSRUZJWCkpIHtcbiAgICAgICAgICBba2V5LCB2YWx1ZV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlY3Vyc2Uoa2V5KTtcbiAgICAgICAgcHVzaExpdGVyYWwocHJldHR5UHVuY3R1YXRpb24oJzonKSk7XG4gICAgICAgIHJlY3Vyc2UodmFsdWUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSB3ZSBoYXZlIGEgc2NhbGFyLCBkZWZlciB0byBKU09OLnN0cmluZ2lmeSgpcyBzZXJpYWxpemF0aW9uXG4gICAgcHVzaExpdGVyYWwoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGFuIG9iamVjdCBvciBsaXN0XG4gICAqL1xuICBmdW5jdGlvbiByZW5kZXJDb2xsZWN0aW9uPEE+KHByZTogc3RyaW5nLCBwb3N0OiBzdHJpbmcsIHhzOiBJdGVyYWJsZTxBPiwgZWFjaDogKHg6IEEpID0+IHZvaWQpIHtcbiAgICBwdXNoTGl0ZXJhbChwcmUpO1xuICAgIGluZGVudCArPSBzcGFjZTtcbiAgICBsZXQgYXRMZWFzdE9uZSA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgW2NvbW1hLCBpdGVtXSBvZiBzZXBJdGVyKHhzKSkge1xuICAgICAgaWYgKGNvbW1hKSB7IHB1c2hMaXRlcmFsKCcsJyk7IH1cbiAgICAgIHB1c2hMaW5lQnJlYWsoKTtcbiAgICAgIGVhY2goaXRlbSk7XG4gICAgICBhdExlYXN0T25lID0gdHJ1ZTtcbiAgICB9XG4gICAgaW5kZW50IC09IHNwYWNlO1xuICAgIGlmIChhdExlYXN0T25lKSB7IHB1c2hMaW5lQnJlYWsoKTsgfVxuICAgIHB1c2hMaXRlcmFsKHBvc3QpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVySW50cmluc2ljKGludHJpbnNpYzogYW55KSB7XG4gICAgc3dpdGNoIChyZXNvbHZlZFR5cGVIaW50KGludHJpbnNpYykpIHtcbiAgICAgIGNhc2UgUmVzb2x1dGlvblR5cGVIaW50LlNUUklORzpcbiAgICAgICAgcHVzaExpdGVyYWwoJ1wiJyk7XG4gICAgICAgIHB1c2hJbnRyaW5zaWMoZGVlcFF1b3RlU3RyaW5nTGl0ZXJhbHMoaW50cmluc2ljKSk7XG4gICAgICAgIHB1c2hMaXRlcmFsKCdcIicpO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgUmVzb2x1dGlvblR5cGVIaW50LlNUUklOR19MSVNUOlxuICAgICAgICAvLyBXZSBuZWVkIHRoaXMgdG8gbG9vayBsaWtlOlxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAne1wibGlzdFZhbHVlXCI6JyArKyBTVFJJTkdJRlkoQ0ZOX0VWQUwoeyBSZWY6IE15TGlzdCB9KSkgKysgJ30nXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEhvd2V2ZXIsIFNUUklOR0lGWSB3b3VsZCBuZWVkIHRvIGV4ZWN1dGUgYXQgQ2xvdWRGb3JtYXRpb24gZGVwbG95bWVudCB0aW1lLCBhbmQgdGhhdCBkb2Vzbid0IGV4aXN0LlxuICAgICAgICAvL1xuICAgICAgICAvLyBXZSBjb3VsZCAqQUxNT1NUKiB1c2U6XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgJ3tcImxpc3RWYWx1ZVwiOltcIicgKysgSk9JTignXCIsXCInLCB7IFJlZjogTXlMaXN0IH0pICsrICdcIl19J1xuICAgICAgICAvL1xuICAgICAgICAvLyBCdXQgdGhhdCBoYXMgdGhlIHVuZm9ydHVuYXRlIHNpZGUgZWZmZWN0IHRoYXQgaWYgYENGTl9FVkFMKHsgUmVmOiBNeUxpc3QgfSkgPT0gW11gLCB0aGVuIGl0IHdvdWxkXG4gICAgICAgIC8vIGV2YWx1YXRlIHRvIGBbXCJcIl1gLCB3aGljaCBpcyBhIGRpZmZlcmVudCB2YWx1ZS4gU2luY2UgQ2xvdWRGb3JtYXRpb24gZG9lcyBub3QgaGF2ZSBhcmJpdHJhcnlcbiAgICAgICAgLy8gY29uZGl0aW9uYWxzIHRoZXJlJ3Mgbm8gd2F5IHRvIGRlYWwgd2l0aCB0aGlzIGNhc2UgcHJvcGVybHkuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFRoZXJlZm9yZSwgaWYgd2UgZW5jb3VudGVyIGxpc3RzIHdlIG5lZWQgdG8gZGVmZXIgdG8gYSBjdXN0b20gcmVzb3VyY2UgdG8gaGFuZGxlXG4gICAgICAgIC8vIHRoZW0gcHJvcGVybHkgYXQgZGVwbG95IHRpbWUuXG4gICAgICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YoY3R4LnNjb3BlKTtcblxuICAgICAgICAvLyBCZWNhdXNlIHRoaXMgd2lsbCBiZSBjYWxsZWQgdHdpY2UgKG9uY2UgZHVyaW5nIGBwcmVwYXJlYCwgb25jZSBkdXJpbmcgYHJlc29sdmVgKSxcbiAgICAgICAgLy8gd2UgbmVlZCB0byBtYWtlIHN1cmUgdG8gYmUgaWRlbXBvdGVudCwgc28gdXNlIGEgY2FjaGUuXG4gICAgICAgIGNvbnN0IHN0cmluZ2lmeVJlc3BvbnNlID0gc3RyaW5naWZ5Q2FjaGUub2J0YWluKHN0YWNrLCBKU09OLnN0cmluZ2lmeShpbnRyaW5zaWMpLCAoKSA9PlxuICAgICAgICAgIENmblV0aWxzLnN0cmluZ2lmeShzdGFjaywgYENka0pzb25TdHJpbmdpZnkke3N0cmluZ2lmeUNvdW50ZXIrK31gLCBpbnRyaW5zaWMpLFxuICAgICAgICApO1xuXG4gICAgICAgIHB1c2hJbnRyaW5zaWMoc3RyaW5naWZ5UmVzcG9uc2UpO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgUmVzb2x1dGlvblR5cGVIaW50Lk5VTUJFUjpcbiAgICAgICAgcHVzaEludHJpbnNpYyhpbnRyaW5zaWMpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIHR5cGUgaGludDogJHtyZXNvbHZlZFR5cGVIaW50KGludHJpbnNpYyl9YCk7XG4gIH1cblxuICAvKipcbiAgICogUHVzaCBhIGxpdGVyYWwgb250byB0aGUgY3VycmVudCBzZWdtZW50IGlmIGl0J3MgYWxzbyBhIGxpdGVyYWwsIG90aGVyd2lzZSBvcGVuIGEgbmV3IFNlZ21lbnRcbiAgICovXG4gIGZ1bmN0aW9uIHB1c2hMaXRlcmFsKGxpdDogc3RyaW5nKSB7XG4gICAgbGV0IGxhc3QgPSByZXRbcmV0Lmxlbmd0aCAtIDFdO1xuICAgIGlmIChsYXN0Py50eXBlICE9PSAnbGl0ZXJhbCcpIHtcbiAgICAgIGxhc3QgPSB7IHR5cGU6ICdsaXRlcmFsJywgcGFydHM6IFtdIH07XG4gICAgICByZXQucHVzaChsYXN0KTtcbiAgICB9XG4gICAgbGFzdC5wYXJ0cy5wdXNoKGxpdCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGludHJpbnNpYyBzZWdtZW50XG4gICAqL1xuICBmdW5jdGlvbiBwdXNoSW50cmluc2ljKGludHJpbnNpYzogYW55KSB7XG4gICAgcmV0LnB1c2goeyB0eXBlOiAnaW50cmluc2ljJywgaW50cmluc2ljIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1c2ggYSBsaW5lIGJyZWFrIGlmIHdlIGFyZSBwcmV0dHktcHJpbnRpbmcsIG90aGVyd2lzZSBkb24ndFxuICAgKi9cbiAgZnVuY3Rpb24gcHVzaExpbmVCcmVhaygpIHtcbiAgICBpZiAoc3BhY2UgPiAwKSB7XG4gICAgICBwdXNoTGl0ZXJhbChgXFxuJHsnICcucmVwZWF0KGluZGVudCl9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHNwYWNlIGFmdGVyIHRoZSBwdW5jdHVhdGlvbiBpZiB3ZSBhcmUgcHJldHR5LXByaW50aW5nLCBubyBzcGFjZSBpZiBub3RcbiAgICovXG4gIGZ1bmN0aW9uIHByZXR0eVB1bmN0dWF0aW9uKHB1bmM6IHN0cmluZykge1xuICAgIHJldHVybiBzcGFjZSA+IDAgPyBgJHtwdW5jfSBgIDogcHVuYztcbiAgfVxufVxuXG4vKipcbiAqIEEgU2VnbWVudCBpcyBlaXRoZXIgYSBsaXRlcmFsIHN0cmluZyBvciBhIENsb3VkRm9ybWF0aW9uIGludHJpbnNpY1xuICovXG50eXBlIFNlZ21lbnQgPSB7IHR5cGU6ICdsaXRlcmFsJzsgcGFydHM6IHN0cmluZ1tdIH0gfCB7IHR5cGU6ICdpbnRyaW5zaWMnOyBpbnRyaW5zaWM6IGFueSB9O1xuXG4vKipcbiAqIFJlbmRlciBhIHNlZ21lbnRcbiAqL1xuZnVuY3Rpb24gcmVuZGVyU2VnbWVudChzOiBTZWdtZW50KTogTm9uTnVsbGFibGU8YW55PiB7XG4gIHN3aXRjaCAocy50eXBlKSB7XG4gICAgY2FzZSAnbGl0ZXJhbCc6IHJldHVybiBzLnBhcnRzLmpvaW4oJycpO1xuICAgIGNhc2UgJ2ludHJpbnNpYyc6IHJldHVybiBzLmludHJpbnNpYztcbiAgfVxufVxuXG5jb25zdCBDTE9VREZPUk1BVElPTl9DT05DQVQ6IElGcmFnbWVudENvbmNhdGVuYXRvciA9IHtcbiAgam9pbihsZWZ0OiBhbnksIHJpZ2h0OiBhbnkpIHtcbiAgICByZXR1cm4gQ2xvdWRGb3JtYXRpb25MYW5nLmNvbmNhdChsZWZ0LCByaWdodCk7XG4gIH0sXG59O1xuXG4vKipcbiAqIERlZmF1bHQgVG9rZW4gcmVzb2x2ZXIgZm9yIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlc1xuICovXG5leHBvcnQgY29uc3QgQ0xPVURGT1JNQVRJT05fVE9LRU5fUkVTT0xWRVIgPSBuZXcgRGVmYXVsdFRva2VuUmVzb2x2ZXIoQ0xPVURGT1JNQVRJT05fQ09OQ0FUKTtcblxuLyoqXG4gKiBEbyBhbiBpbnRlbGxpZ2VudCBDbG91ZEZvcm1hdGlvbiBqb2luIG9uIHRoZSBnaXZlbiB2YWx1ZXMsIHByb2R1Y2luZyBhIG1pbmltYWwgZXhwcmVzc2lvblxuICovXG5leHBvcnQgZnVuY3Rpb24gbWluaW1hbENsb3VkRm9ybWF0aW9uSm9pbihkZWxpbWl0ZXI6IHN0cmluZywgdmFsdWVzOiBhbnlbXSk6IGFueVtdIHtcbiAgbGV0IGkgPSAwO1xuICB3aGlsZSAoaSA8IHZhbHVlcy5sZW5ndGgpIHtcbiAgICBjb25zdCBlbCA9IHZhbHVlc1tpXTtcbiAgICBpZiAoaXNTcGxpY2FibGVGbkpvaW5JbnRyaW5zaWMoZWwpKSB7XG4gICAgICB2YWx1ZXMuc3BsaWNlKGksIDEsIC4uLmVsWydGbjo6Sm9pbiddWzFdKTtcbiAgICB9IGVsc2UgaWYgKGkgPiAwICYmIGlzQ29uY2F0YWJsZSh2YWx1ZXNbaSAtIDFdKSAmJiBpc0NvbmNhdGFibGUodmFsdWVzW2ldKSkge1xuICAgICAgdmFsdWVzW2kgLSAxXSA9IGAke3ZhbHVlc1tpLTFdfSR7ZGVsaW1pdGVyfSR7dmFsdWVzW2ldfWA7XG4gICAgICB2YWx1ZXMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpICs9IDE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbHVlcztcblxuICBmdW5jdGlvbiBpc1NwbGljYWJsZUZuSm9pbkludHJpbnNpYyhvYmo6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmICghaXNJbnRyaW5zaWMob2JqKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBpZiAoT2JqZWN0LmtleXMob2JqKVswXSAhPT0gJ0ZuOjpKb2luJykgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIGNvbnN0IFtkZWxpbSwgbGlzdF0gPSBvYmpbJ0ZuOjpKb2luJ107XG4gICAgaWYgKGRlbGltICE9PSBkZWxpbWl0ZXIpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGxpc3QpKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzQ29uY2F0YWJsZShvYmo6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gWydzdHJpbmcnLCAnbnVtYmVyJ10uaW5jbHVkZXModHlwZW9mIG9iaikgJiYgIVRva2VuLmlzVW5yZXNvbHZlZChvYmopO1xufVxuXG5cbi8qKlxuICogUmV0dXJuIHdoZXRoZXIgdGhlIGdpdmVuIHZhbHVlIHJlcHJlc2VudHMgYSBDbG91ZEZvcm1hdGlvbiBpbnRyaW5zaWNcbiAqL1xuZnVuY3Rpb24gaXNJbnRyaW5zaWMoeDogYW55KSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHgpIHx8IHggPT09IG51bGwgfHwgdHlwZW9mIHggIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh4KTtcbiAgaWYgKGtleXMubGVuZ3RoICE9PSAxKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHJldHVybiBrZXlzWzBdID09PSAnUmVmJyB8fCBpc05hbWVPZkNsb3VkRm9ybWF0aW9uSW50cmluc2ljKGtleXNbMF0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOYW1lT2ZDbG91ZEZvcm1hdGlvbkludHJpbnNpYyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFuYW1lLnN0YXJ0c1dpdGgoJ0ZuOjonKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyB0aGVzZSBhcmUgJ2Zha2UnIGludHJpbnNpY3MsIG9ubHkgdXNhYmxlIGluc2lkZSB0aGUgcGFyYW1ldGVyIG92ZXJyaWRlcyBvZiBhIENGTiBDb2RlUGlwZWxpbmUgQWN0aW9uXG4gIHJldHVybiBuYW1lICE9PSAnRm46OkdldEFydGlmYWN0QXR0JyAmJiBuYW1lICE9PSAnRm46OkdldFBhcmFtJztcbn1cblxuLyoqXG4gKiBTZXBhcmF0ZWQgaXRlcmF0b3JcbiAqL1xuZnVuY3Rpb24qIHNlcEl0ZXI8QT4oeHM6IEl0ZXJhYmxlPEE+KTogSXRlcmFibGVJdGVyYXRvcjxbYm9vbGVhbiwgQV0+IHtcbiAgbGV0IGNvbW1hID0gZmFsc2U7XG4gIGZvciAoY29uc3QgaXRlbSBvZiB4cykge1xuICAgIHlpZWxkIFtjb21tYSwgaXRlbV07XG4gICAgY29tbWEgPSB0cnVlO1xuICB9XG59XG5cbi8qKlxuICogT2JqZWN0LmVudHJpZXMoKSBidXQgc2tpcHBpbmcgdW5kZWZpbmVkIHZhbHVlc1xuICovXG5mdW5jdGlvbiogZGVmaW5lZEVudHJpZXM8QSBleHRlbmRzIG9iamVjdD4oeHM6IEEpOiBJdGVyYWJsZUl0ZXJhdG9yPFtzdHJpbmcsIGFueV0+IHtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoeHMpKSB7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHlpZWxkIFtrZXksIHZhbHVlXTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBRdW90ZSBzdHJpbmcgbGl0ZXJhbHMgaW5zaWRlIGFuIGludHJpbnNpY1xuICpcbiAqIEZvcm1hbGx5LCB0aGlzIHNob3VsZCBvbmx5IG1hdGNoIHN0cmluZyBsaXRlcmFscyB0aGF0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXNcbiAqIHN0cmluZyBsaXRlcmFscy4gRm9ydHVuYXRlbHksIHRoZSBzdHJpbmdzIHRoYXQgc2hvdWxkIE5PVCBiZSBxdW90ZWQgYXJlXG4gKiBMb2dpY2FsIElEcyBhbmQgYXR0cmlidXRlIG5hbWVzLCB3aGljaCBjYW5ub3QgY29udGFpbiBxdW90ZXMgYW55d2F5LiBIZW5jZSxcbiAqIHdlIGNhbiBnZXQgYXdheSBub3QgY2FyaW5nIGFib3V0IHRoZSBkaXN0aW5jdGlvbiBhbmQganVzdCBxdW90aW5nIGV2ZXJ5dGhpbmcuXG4gKi9cbmZ1bmN0aW9uIGRlZXBRdW90ZVN0cmluZ0xpdGVyYWxzKHg6IGFueSk6IGFueSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHgpKSB7XG4gICAgcmV0dXJuIHgubWFwKGRlZXBRdW90ZVN0cmluZ0xpdGVyYWxzKTtcbiAgfVxuICBpZiAodHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT0gbnVsbCkge1xuICAgIGNvbnN0IHJldDogYW55ID0ge307XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoeCkpIHtcbiAgICAgIHJldFtkZWVwUXVvdGVTdHJpbmdMaXRlcmFscyhrZXkpXSA9IGRlZXBRdW90ZVN0cmluZ0xpdGVyYWxzKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuICBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHF1b3RlU3RyaW5nKHgpO1xuICB9XG4gIHJldHVybiB4O1xufVxuXG4vKipcbiAqIFF1b3RlIHRoZSBjaGFyYWN0ZXJzIGluc2lkZSBhIHN0cmluZywgZm9yIHVzZSBpbnNpZGUgdG9KU09OXG4gKi9cbmZ1bmN0aW9uIHF1b3RlU3RyaW5nKHM6IHN0cmluZykge1xuICBzID0gSlNPTi5zdHJpbmdpZnkocyk7XG4gIHJldHVybiBzLnN1YnN0cmluZygxLCBzLmxlbmd0aCAtIDEpO1xufVxuXG5sZXQgc3RyaW5naWZ5Q291bnRlciA9IDE7XG5cbi8qKlxuICogQSBjYWNoZSBzY29wZWQgdG8gb2JqZWN0IGluc3RhbmNlcywgdGhhdCdzIG1haW50YWluZWQgZXh0ZXJuYWxseSB0byB0aGUgb2JqZWN0IGluc3RhbmNlc1xuICovXG5jbGFzcyBTY29wZWRDYWNoZTxPIGV4dGVuZHMgb2JqZWN0LCBLLCBWPiB7XG4gIHByaXZhdGUgY2FjaGUgPSBuZXcgV2Vha01hcDxPLCBNYXA8SywgVj4+KCk7XG5cbiAgcHVibGljIG9idGFpbihvYmplY3Q6IE8sIGtleTogSywgaW5pdDogKCkgPT4gVik6IFYge1xuICAgIGxldCBrdk1hcCA9IHRoaXMuY2FjaGUuZ2V0KG9iamVjdCk7XG4gICAgaWYgKCFrdk1hcCkge1xuICAgICAga3ZNYXAgPSBuZXcgTWFwKCk7XG4gICAgICB0aGlzLmNhY2hlLnNldChvYmplY3QsIGt2TWFwKTtcbiAgICB9XG5cbiAgICBsZXQgcmV0ID0ga3ZNYXAuZ2V0KGtleSk7XG4gICAgaWYgKHJldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXQgPSBpbml0KCk7XG4gICAgICBrdk1hcC5zZXQoa2V5LCByZXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG59XG5cbmNvbnN0IHN0cmluZ2lmeUNhY2hlID0gbmV3IFNjb3BlZENhY2hlPFN0YWNrLCBzdHJpbmcsIHN0cmluZz4oKTtcbiJdfQ==