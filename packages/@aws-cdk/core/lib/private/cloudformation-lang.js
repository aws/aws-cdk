"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNameOfCloudFormationIntrinsic = exports.minimalCloudFormationJoin = exports.CLOUDFORMATION_TOKEN_RESOLVER = exports.CloudFormationLang = void 0;
const cfn_utils_provider_1 = require("./cfn-utils-provider");
const resolve_1 = require("./resolve");
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
 * Return a CFN intrinsic mass concatting any number of CloudFormation expressions
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
 *   giving an idea of the type of the source value for compplex result values.
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
            throw new Error('This shouldnt happen anymore');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWRmb3JtYXRpb24tbGFuZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsb3VkZm9ybWF0aW9uLWxhbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkRBQWdEO0FBQ2hELHVDQUFtRTtBQUNuRSxrQ0FBK0I7QUFDL0IsOENBQTZGO0FBQzdGLG9DQUFpQztBQUNqQyxvQ0FBaUM7QUFDakMsOENBQW1EO0FBRW5EOztHQUVHO0FBQ0gsTUFBYSxrQkFBa0I7SUFDN0I7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFRLEVBQUUsS0FBYztRQUMzQyxPQUFPLFdBQUksQ0FBQyxjQUFjLENBQUM7WUFDekIsNkVBQTZFO1lBQzdFLHdFQUF3RTtZQUN4RSx1REFBdUQ7WUFDdkQsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUM7U0FDNUQsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBcUIsRUFBRSxLQUFzQjtRQUNoRSxJQUFJLElBQUksS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUFFLE9BQU8sRUFBRSxDQUFDO1NBQUU7UUFFN0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQU8sQ0FBQztRQUMvQixJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7WUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQUU7UUFDN0MsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFFO1FBRS9DLG9EQUFvRDtRQUNwRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FBRTtRQUM1QyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDMUUsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNqQztRQUVELDZGQUE2RjtRQUM3Riw2Q0FBNkM7UUFDN0MsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDNUI7Q0FDRjtBQTNDRCxnREEyQ0M7QUFFRDs7R0FFRztBQUNILFNBQVMsWUFBWSxDQUFDLEtBQVk7SUFDaEMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSx5QkFBeUIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3BFLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOEVHO0FBQ0gsU0FBUyxtQkFBbUIsQ0FBQyxJQUFTLEVBQUUsS0FBYSxFQUFFLEdBQW9CO0lBQ3pFLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxFQUFXLENBQUM7SUFFakMsbUZBQW1GO0lBQ25GLDRDQUE0QztJQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFekQsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFFO1FBQ2xCLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxTQUFTLENBQUM7UUFDekIsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQztZQUNFLE9BQU8sWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztLQUMvQztJQUVEOztPQUVHO0lBQ0gsU0FBUyxPQUFPLENBQUMsR0FBUTtRQUN2QixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFFbEMsSUFBSSxhQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztTQUNqRDtRQUNELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN0QixPQUFPLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxZQUFZLElBQUksQ0FBQyxFQUFFO1lBQ3BFLDRFQUE0RTtZQUM1RSwyRUFBMkU7WUFDM0UscUZBQXFGO1lBQ3JGLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUEsMEJBQWdCLEVBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzdDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckIsT0FBTzthQUNSO1lBRUQsT0FBTyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RFLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyw4QkFBb0IsQ0FBQyxFQUFFO29CQUN4QyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7aUJBQ3RCO2dCQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDYixXQUFXLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCx1RUFBdUU7UUFDdkUsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLGdCQUFnQixDQUFJLEdBQVcsRUFBRSxJQUFZLEVBQUUsRUFBZSxFQUFFLElBQW9CO1FBQzNGLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixNQUFNLElBQUksS0FBSyxDQUFDO1FBQ2hCLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN2QixLQUFLLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3ZDLElBQUksS0FBSyxFQUFFO2dCQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUFFO1lBQ2hDLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDbkI7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDO1FBQ2hCLElBQUksVUFBVSxFQUFFO1lBQUUsYUFBYSxFQUFFLENBQUM7U0FBRTtRQUNwQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELFNBQVMsZUFBZSxDQUFDLFNBQWM7UUFDckMsUUFBUSxJQUFBLDBCQUFnQixFQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ25DLEtBQUssK0JBQWtCLENBQUMsTUFBTTtnQkFDNUIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixhQUFhLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixPQUFPO1lBRVQsS0FBSywrQkFBa0IsQ0FBQyxXQUFXO2dCQUNqQyw2QkFBNkI7Z0JBQzdCLEVBQUU7Z0JBQ0Ysb0VBQW9FO2dCQUNwRSxFQUFFO2dCQUNGLHNHQUFzRztnQkFDdEcsRUFBRTtnQkFDRix5QkFBeUI7Z0JBQ3pCLEVBQUU7Z0JBQ0YsK0RBQStEO2dCQUMvRCxFQUFFO2dCQUNGLG9HQUFvRztnQkFDcEcsK0ZBQStGO2dCQUMvRiwrREFBK0Q7Z0JBQy9ELEVBQUU7Z0JBQ0YsbUZBQW1GO2dCQUNuRixnQ0FBZ0M7Z0JBQ2hDLE1BQU0sS0FBSyxHQUFHLGFBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUVsQyxvRkFBb0Y7Z0JBQ3BGLHlEQUF5RDtnQkFDekQsTUFBTSxpQkFBaUIsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNyRiw2QkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FDOUUsQ0FBQztnQkFFRixhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDakMsT0FBTztZQUVULEtBQUssK0JBQWtCLENBQUMsTUFBTTtnQkFDNUIsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN6QixPQUFPO1NBQ1Y7UUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixJQUFBLDBCQUFnQixFQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLFdBQVcsQ0FBQyxHQUFXO1FBQzlCLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQUksSUFBSSxFQUFFLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDNUIsSUFBSSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdEMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoQjtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7T0FFRztJQUNILFNBQVMsYUFBYSxDQUFDLFNBQWM7UUFDbkMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLGFBQWE7UUFDcEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsV0FBVyxDQUFDLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDeEM7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLGlCQUFpQixDQUFDLElBQVk7UUFDckMsT0FBTyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDdkMsQ0FBQztBQUNILENBQUM7QUFPRDs7R0FFRztBQUNILFNBQVMsYUFBYSxDQUFDLENBQVU7SUFDL0IsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFO1FBQ2QsS0FBSyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLEtBQUssV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDO0tBQ3RDO0FBQ0gsQ0FBQztBQUVELE1BQU0scUJBQXFCLEdBQTBCO0lBQ25ELElBQUksQ0FBQyxJQUFTLEVBQUUsS0FBVTtRQUN4QixPQUFPLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDL0M7Q0FDRixDQUFDO0FBRUY7O0dBRUc7QUFDVSxRQUFBLDZCQUE2QixHQUFHLElBQUksaUNBQW9CLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUU3Rjs7R0FFRztBQUNILFNBQWdCLHlCQUF5QixDQUFDLFNBQWlCLEVBQUUsTUFBYTtJQUN4RSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDVixPQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQ3hCLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixJQUFJLDBCQUEwQixDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNDO2FBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUN6RCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNyQjthQUFNO1lBQ0wsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNSO0tBQ0Y7SUFFRCxPQUFPLE1BQU0sQ0FBQztJQUVkLFNBQVMsMEJBQTBCLENBQUMsR0FBUTtRQUMxQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUM7U0FBRTtRQUN4QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssVUFBVSxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUM7U0FBRTtRQUV6RCxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0QyxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQztTQUFFO1FBRTFDLElBQUksYUFBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUFFLE9BQU8sS0FBSyxDQUFDO1NBQUU7UUFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQztTQUFFO1FBRTNDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUM7QUE1QkQsOERBNEJDO0FBRUQsU0FBUyxZQUFZLENBQUMsR0FBUTtJQUM1QixPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvRSxDQUFDO0FBR0Q7O0dBRUc7QUFDSCxTQUFTLFdBQVcsQ0FBQyxDQUFNO0lBQ3pCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtRQUFFLE9BQU8sS0FBSyxDQUFDO0tBQUU7SUFFOUUsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQUUsT0FBTyxLQUFLLENBQUM7S0FBRTtJQUV4QyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksK0JBQStCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkUsQ0FBQztBQUVELFNBQWdCLCtCQUErQixDQUFDLElBQVk7SUFDMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDNUIsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELHVHQUF1RztJQUN2RyxPQUFPLElBQUksS0FBSyxvQkFBb0IsSUFBSSxJQUFJLEtBQUssY0FBYyxDQUFDO0FBQ2xFLENBQUM7QUFORCwwRUFNQztBQUVEOztHQUVHO0FBQ0gsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFJLEVBQWU7SUFDbEMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ2xCLEtBQUssTUFBTSxJQUFJLElBQUksRUFBRSxFQUFFO1FBQ3JCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEIsS0FBSyxHQUFHLElBQUksQ0FBQztLQUNkO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFtQixFQUFLO0lBQzlDLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQzdDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QixNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3BCO0tBQ0Y7QUFDSCxDQUFDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILFNBQVMsdUJBQXVCLENBQUMsQ0FBTTtJQUNyQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDdkM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO1FBQ3RDLE1BQU0sR0FBRyxHQUFRLEVBQUUsQ0FBQztRQUNwQixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1QyxHQUFHLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwRTtRQUNELE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtRQUN6QixPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN2QjtJQUNELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxXQUFXLENBQUMsQ0FBUztJQUM1QixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QixPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQUVELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBRXpCOztHQUVHO0FBQ0gsTUFBTSxXQUFXO0lBQWpCO1FBQ1UsVUFBSyxHQUFHLElBQUksT0FBTyxFQUFnQixDQUFDO0lBZ0I5QyxDQUFDO0lBZFEsTUFBTSxDQUFDLE1BQVMsRUFBRSxHQUFNLEVBQUUsSUFBYTtRQUM1QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsS0FBSyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDckIsR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDO1lBQ2IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDckI7UUFDRCxPQUFPLEdBQUcsQ0FBQztLQUNaO0NBQ0Y7QUFFRCxNQUFNLGNBQWMsR0FBRyxJQUFJLFdBQVcsRUFBeUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENmblV0aWxzIH0gZnJvbSAnLi9jZm4tdXRpbHMtcHJvdmlkZXInO1xuaW1wb3J0IHsgSU5UUklOU0lDX0tFWV9QUkVGSVgsIHJlc29sdmVkVHlwZUhpbnQgfSBmcm9tICcuL3Jlc29sdmUnO1xuaW1wb3J0IHsgTGF6eSB9IGZyb20gJy4uL2xhenknO1xuaW1wb3J0IHsgRGVmYXVsdFRva2VuUmVzb2x2ZXIsIElGcmFnbWVudENvbmNhdGVuYXRvciwgSVJlc29sdmVDb250ZXh0IH0gZnJvbSAnLi4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi4vdG9rZW4nO1xuaW1wb3J0IHsgUmVzb2x1dGlvblR5cGVIaW50IH0gZnJvbSAnLi4vdHlwZS1oaW50cyc7XG5cbi8qKlxuICogUm91dGluZXMgdGhhdCBrbm93IGhvdyB0byBkbyBvcGVyYXRpb25zIGF0IHRoZSBDbG91ZEZvcm1hdGlvbiBkb2N1bWVudCBsYW5ndWFnZSBsZXZlbFxuICovXG5leHBvcnQgY2xhc3MgQ2xvdWRGb3JtYXRpb25MYW5nIHtcbiAgLyoqXG4gICAqIFR1cm4gYW4gYXJiaXRyYXJ5IHN0cnVjdHVyZSBwb3RlbnRpYWxseSBjb250YWluaW5nIFRva2VucyBpbnRvIGEgSlNPTiBzdHJpbmcuXG4gICAqXG4gICAqIFJldHVybnMgYSBUb2tlbiB3aGljaCB3aWxsIGV2YWx1YXRlIHRvIENsb3VkRm9ybWF0aW9uIGV4cHJlc3Npb24gdGhhdFxuICAgKiB3aWxsIGJlIGV2YWx1YXRlZCBieSBDbG91ZEZvcm1hdGlvbiB0byB0aGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGVcbiAgICogaW5wdXQgc3RydWN0dXJlLlxuICAgKlxuICAgKiBBbGwgVG9rZW5zIHN1YnN0aXR1dGVkIGluIHRoaXMgd2F5IG11c3QgcmV0dXJuIHN0cmluZ3MsIG9yIHRoZSBldmFsdWF0aW9uXG4gICAqIGluIENsb3VkRm9ybWF0aW9uIHdpbGwgZmFpbC5cbiAgICpcbiAgICogQHBhcmFtIG9iaiBUaGUgb2JqZWN0IHRvIHN0cmluZ2lmeVxuICAgKiBAcGFyYW0gc3BhY2UgSW5kZW50YXRpb24gdG8gdXNlIChkZWZhdWx0OiBubyBwcmV0dHktcHJpbnRpbmcpXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRvSlNPTihvYmo6IGFueSwgc3BhY2U/OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBMYXp5LnVuY2FjaGVkU3RyaW5nKHtcbiAgICAgIC8vIFdlIHVzZWQgdG8gZG8gdGhpcyBieSBob29raW5nIGludG8gYEpTT04uc3RyaW5naWZ5KClgIGJ5IGFkZGluZyBpbiBvYmplY3RzXG4gICAgICAvLyB3aXRoIGN1c3RvbSBgdG9KU09OKClgIGZ1bmN0aW9ucywgYnV0IGl0J3MgdWx0aW1hdGVseSBzaW1wbGVyIGp1c3QgdG9cbiAgICAgIC8vIHJlaW1wbGVtZW50IHRoZSBgc3RyaW5naWZ5KClgIGZ1bmN0aW9uIGZyb20gc2NyYXRjaC5cbiAgICAgIHByb2R1Y2U6IChjdHgpID0+IHRva2VuQXdhcmVTdHJpbmdpZnkob2JqLCBzcGFjZSA/PyAwLCBjdHgpLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb2R1Y2UgYSBDbG91ZEZvcm1hdGlvbiBleHByZXNzaW9uIHRvIGNvbmNhdCB0d28gYXJiaXRyYXJ5IGV4cHJlc3Npb25zIHdoZW4gcmVzb2x2aW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbmNhdChsZWZ0OiBhbnkgfCB1bmRlZmluZWQsIHJpZ2h0OiBhbnkgfCB1bmRlZmluZWQpOiBhbnkge1xuICAgIGlmIChsZWZ0ID09PSB1bmRlZmluZWQgJiYgcmlnaHQgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gJyc7IH1cblxuICAgIGNvbnN0IHBhcnRzID0gbmV3IEFycmF5PGFueT4oKTtcbiAgICBpZiAobGVmdCAhPT0gdW5kZWZpbmVkKSB7IHBhcnRzLnB1c2gobGVmdCk7IH1cbiAgICBpZiAocmlnaHQgIT09IHVuZGVmaW5lZCkgeyBwYXJ0cy5wdXNoKHJpZ2h0KTsgfVxuXG4gICAgLy8gU29tZSBjYXNlIGFuYWx5c2lzIHRvIHByb2R1Y2UgbWluaW1hbCBleHByZXNzaW9uc1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHsgcmV0dXJuIHBhcnRzWzBdOyB9XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMiAmJiBpc0NvbmNhdGFibGUocGFydHNbMF0pICYmIGlzQ29uY2F0YWJsZShwYXJ0c1sxXSkpIHtcbiAgICAgIHJldHVybiBgJHtwYXJ0c1swXX0ke3BhcnRzWzFdfWA7XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlIHJldHVybiBhIEpvaW4gaW50cmluc2ljIChhbHJlYWR5IGluIHRoZSB0YXJnZXQgZG9jdW1lbnQgbGFuZ3VhZ2UgdG8gYXZvaWQgdGFraW5nXG4gICAgLy8gY2lyY3VsYXIgZGVwZW5kZW5jaWVzIG9uIEZuSm9pbiAmIGZyaWVuZHMpXG4gICAgcmV0dXJuIGZuSm9pbkNvbmNhdChwYXJ0cyk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBDRk4gaW50cmluc2ljIG1hc3MgY29uY2F0dGluZyBhbnkgbnVtYmVyIG9mIENsb3VkRm9ybWF0aW9uIGV4cHJlc3Npb25zXG4gKi9cbmZ1bmN0aW9uIGZuSm9pbkNvbmNhdChwYXJ0czogYW55W10pIHtcbiAgcmV0dXJuIHsgJ0ZuOjpKb2luJzogWycnLCBtaW5pbWFsQ2xvdWRGb3JtYXRpb25Kb2luKCcnLCBwYXJ0cyldIH07XG59XG5cbi8qKlxuICogUGVyZm9ybSBhIEpTT04uc3RyaW5naWZ5KCktbGlrZSBvcGVyYXRpb24sIGV4Y2VwdCBhd2FyZSBvZiBUb2tlbnMgYW5kIENsb3VkRm9ybWF0aW9uIGludHJpbmNpY3NcbiAqXG4gKiBUb2tlbnMgd2lsbCBiZSByZXNvbHZlZCBhbmQgaWYgYW55IHJlc29sdmUgdG8gQ2xvdWRGb3JtYXRpb24gaW50cmluc2ljcywgdGhlIGludHJpbnNpY3NcbiAqIHdpbGwgYmUgbGlmdGVkIHRvIHRoZSB0b3Agb2YgYSBnaWFudCBgeyBGbjo6Sm9pbiB9YCBleHByZXNzaW9uLlxuICpcbiAqIElmIFRva2VucyByZXNvbHZlIHRvIHByaW1pdGl2ZSB0eXBlcyAoZm9yIGV4YW1wbGUsIGJ5IHVzaW5nIExhemllcyksIHdlJ2xsXG4gKiB1c2UgdGhlIHByaW1pdGl2ZSB0eXBlIHRvIGRldGVybWluZSBob3cgdG8gZW5jb2RlIHRoZSB2YWx1ZSBpbnRvIHRoZSBKU09OLlxuICpcbiAqIElmIFRva2VucyByZXNvbHZlIHRvIENsb3VkRm9ybWF0aW9uIGludHJpbnNpY3MsIHdlJ2xsIHVzZSB0aGUgdHlwZSBvZiB0aGUgZW5jb2RlZFxuICogdmFsdWUgYXMgYSB0eXBlIGhpbnQgdG8gZGV0ZXJtaW5lIGhvdyB0byBlbmNvZGUgdGhlIHZhbHVlIGludG8gdGhlIEpTT04uIFRoZSBkaWZmZXJlbmNlXG4gKiBpcyB0aGF0IHdlIGFkZCBxdW90ZXMgKFwiKSBhcm91bmQgc3RyaW5ncywgYW5kIGRvbid0IGFkZCBhbnl0aGluZyBhcm91bmQgbm9uLXN0cmluZ3MuXG4gKlxuICogVGhlIGZvbGxvd2luZyBzdHJ1Y3R1cmU6XG4gKlxuICogICAgeyBTb21lQXR0cjogcmVzb3VyY2Uuc29tZUF0dHIgfVxuICpcbiAqIFdpbGwgSlNPTmlmeSB0byBlaXRoZXI6XG4gKlxuICogICAgJ3sgXCJTb21lQXR0clwiOiBcIicgKysgeyBGbjo6R2V0QXR0OiBbUmVzb3VyY2UsIFNvbWVBdHRyXSB9ICsrICdcIiB9J1xuICogb3IgJ3sgXCJTb21lQXR0clwiOiAnICsrIHsgRm46OkdldEF0dDogW1Jlc291cmNlLCBTb21lQXR0cl0gfSArKyAnIH0nXG4gKlxuICogRGVwZW5kaW5nIG9uIHdoZXRoZXIgYHNvbWVBdHRyYCBpcyB0eXBlLWhpbnRlZCB0byBiZSBhIHN0cmluZyBvciBub3QuXG4gKlxuICogKFdoZXJlICsrIGlzIHRoZSBDbG91ZEZvcm1hdGlvbiBzdHJpbmctY29uY2F0IG9wZXJhdGlvbiAoYHsgRm46OkpvaW4gfWApLlxuICpcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogVGhpcyB3b3JrIHJlcXVpcmVzIDIgZmVhdHVyZXMgZnJvbSB0aGUgYHJlc29sdmUoKWAgZnVuY3Rpb246XG4gKlxuICogLSBJTlRSSU5TSUNTIFRZUEUgSElOVFM6IGludHJpbnNpY3MgYXJlIHJlcHJlc2VudGVkIGJ5IHZhbHVlcyBsaWtlXG4gKiAgIGB7IFJlZjogJ1hZWicgfWAuIFRoZXNlIHZhbHVlcyBjYW4gcmVmZXJlbmNlIGVpdGhlciBhIHN0cmluZyBvciBhIGxpc3QvbnVtYmVyIGF0XG4gKiAgIGRlcGxveSB0aW1lLCBhbmQgZnJvbSB0aGUgdmFsdWUgYWxvbmUgdGhlcmUncyBubyB3YXkgdG8ga25vdyB3aGljaC4gV2UgbmVlZFxuICogICB0byBrbm93IHRoZSB0eXBlIHRvIGtub3cgd2hldGhlciB0byBKU09OaWZ5IHRoaXMgcmVmZXJlbmNlIHRvOlxuICpcbiAqICAgICAgJ3sgXCJyZWZlcmVuY2VkVmFsdWVcIjogXCInICsrIHsgUmVmOiBYWVogfSArKyAnXCJ9J1xuICogICBvciAneyBcInJlZmVyZW5jZWRWYWx1ZVwiOiAnICsrIHsgUmVmOiBYWVogfSArKyAnfSdcbiAqXG4gKiAgIEkuZS4sIHdoZXRoZXIgb3Igbm90IHdlIG5lZWQgdG8gZW5jbG9zZSB0aGUgcmVmZXJlbmNlIGluIHF1b3RlcyBvciBub3QuXG4gKlxuICogICBXZSBDT1VMRCBoYXZlIGRvbmUgdGhpcyBieSByZXNvbHZpbmcgb25lIHRva2VuIGF0IGEgdGltZSwgYW5kIGxvb2tpbmcgYXQgdGhlXG4gKiAgIHR5cGUgb2YgdGhlIGVuY29kZWQgdG9rZW4gd2Ugd2VyZSByZXNvbHZpbmcgdG8gb2J0YWluIGEgdHlwZSBoaW50LiBIb3dldmVyLFxuICogICB0aGUgYHJlc29sdmUoKWAgYW5kIFRva2VuIHN5c3RlbSByZXNpc3QgYSBsZXZlbC1hdC1hLXRpbWUgcmVzb2x2ZVxuICogICBvcGVyYXRpb246IGJlY2F1c2Ugb2YgdGhlIGV4aXN0ZW5jZSBvZiBwb3N0LXByb2Nlc3NvcnMsIHdlIG11c3QgaGF2ZSBkb25lIGFcbiAqICAgY29tcGxldGUgcmVjdXJzaXZlIHJlc29sdXRpb24gb2YgYSB0b2tlbiBiZWZvcmUgd2UgY2FuIGxvb2sgYXQgaXRzIHJlc3VsdFxuICogICAoYWZ0ZXIgd2hpY2ggYW55IHR5cGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHNvdXJjZXMgb2YgbmVzdGVkIHJlc29sdmVkXG4gKiAgIHZhbHVlcyBpcyBsb3N0KS5cbiAqXG4gKiAgIFRvIGZpeCB0aGlzLCBcInR5cGUgaGludHNcIiBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIGByZXNvbHZlKClgIGZ1bmN0aW9uLFxuICogICBnaXZpbmcgYW4gaWRlYSBvZiB0aGUgdHlwZSBvZiB0aGUgc291cmNlIHZhbHVlIGZvciBjb21wcGxleCByZXN1bHQgdmFsdWVzLlxuICogICBUaGlzIG9ubHkgd29ya3MgZm9yIG9iamVjdHMgKG5vdCBzdHJpbmdzIGFuZCBudW1iZXJzKSBidXQgZm9ydHVuYXRlbHlcbiAqICAgd2Ugb25seSBjYXJlIGFib3V0IHRoZSB0eXBlcyBvZiBpbnRyaW5zaWNzLCB3aGljaCBhcmUgYWx3YXlzIGNvbXBsZXggdmFsdWVzLlxuICpcbiAqICAgVHlwZSBoaW50aW5nIGNvdWxkIGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgYElSZXNvbHZhYmxlYCBwcm90b2NvbCBhcyB3ZWxsLFxuICogICBidXQgZm9yIG5vdyB3ZSBqdXN0IHVzZSB0aGUgdHlwZSBvZiBhbiBlbmNvZGVkIHZhbHVlIGFzIGEgdHlwZSBoaW50LiBUaGF0IHdheVxuICogICB3ZSBkb24ndCBuZWVkIHRvIGFubm90YXRlIGFueXRoaW5nIG1vcmUgYXQgdGhlIEwxIGxldmVsLS13ZSB3aWxsIHVzZSB0aGUgdHlwZVxuICogICBlbmNvZGluZ3MgYWRkZWQgYnkgY29uc3RydWN0IGF1dGhvcnMgYXQgdGhlIEwyIGxldmVscy4gTDEgdXNlcnMgY2FuIGVzY2FwZSB0aGVcbiAqICAgZGVmYXVsdCBkZWNpc2lvbiBvZiBcInN0cmluZ1wiIGJ5IHVzaW5nIGBUb2tlbi5hc0xpc3QoKWAuXG4gKlxuICogLSBDT01QTEVYIEtFWVM6IHNpbmNlIHRva2VucyBjYW4gYmUgc3RyaW5nLWVuY29kZWQsIHdlIGNhbiB1c2Ugc3RyaW5nLWVuY29kZWQgdG9rZW5zXG4gKiAgIGFzIHRoZSBrZXlzIGluIEphdmFTY3JpcHQgb2JqZWN0cy4gSG93ZXZlciwgYWZ0ZXIgcmVzb2x1dGlvbiwgdGhvc2Ugc3RyaW5nLWVuY29kZWRcbiAqICAgdG9rZW5zIGNvdWxkIHJlc29sdmUgdG8gaW50cmluc2ljcyAoYHsgUmVmOiAuLi4gfWApLCB3aGljaCBDQU5OT1QgYmUgc3RvcmVkIGluXG4gKiAgIEphdmFTY3JpcHQgb2JqZWN0cyBhbnltb3JlLlxuICpcbiAqICAgV2UgdGhlcmVmb3JlIG5lZWQgYSBwcm90b2NvbCB0byBzdG9yZSB0aGUgcmVzb2x2ZWQgdmFsdWVzIHNvbWV3aGVyZSBpbiB0aGUgSmF2YVNjcmlwdFxuICogICB0eXBlIG1vZGVsLCAgd2hpY2ggY2FuIGJlIHJldHVybmVkIGJ5IGByZXNvbHZlKClgLCBhbmQgaW50ZXJwcmV0ZWQgYnkgYHRva2VuQXdhcmVTdHJpbmdpZnkoKWBcbiAqICAgdG8gcHJvZHVjZSB0aGUgY29ycmVjdCBKU09OLlxuICpcbiAqICAgQW5kIGV4YW1wbGUgd2lsbCBxdWlja2x5IHNob3cgdGhlIHBvaW50OlxuICpcbiAqICAgIFVzZXIgd3JpdGVzOlxuICogICAgICAgeyBbcmVzb3VyY2UucmVzb3VyY2VOYW1lXTogJ1NvbWVWYWx1ZScgfVxuICogICAgLS0tLS0tIHN0cmluZyBhY3R1YWxseSBsb29rcyBsaWtlIC0tLS0tLT5cbiAqICAgICAgIHsgJyR7VG9rZW5bMTIzNF19JzogJ1NvbWVWYWx1ZScgfVxuICogICAgLS0tLS0tIHJlc29sdmUgLS0tLS0tLT5cbiAqICAgICAgIHsgJyRJbnRyaW5zaWNLZXkkMCc6IFsge1JlZjogUmVzb3VyY2V9LCAnU29tZVZhbHVlJyBdIH1cbiAqICAgIC0tLS0tLSB0b2tlbkF3YXJlU3RyaW5naWZ5IC0tLS0tLS0+XG4gKiAgICAgICAneyBcIicgKysgeyBSZWY6IFJlc291cmNlIH0gKysgJ1wiOiBcIlNvbWVWYWx1ZVwiIH0nXG4gKi9cbmZ1bmN0aW9uIHRva2VuQXdhcmVTdHJpbmdpZnkocm9vdDogYW55LCBzcGFjZTogbnVtYmVyLCBjdHg6IElSZXNvbHZlQ29udGV4dCkge1xuICBsZXQgaW5kZW50ID0gMDtcblxuICBjb25zdCByZXQgPSBuZXcgQXJyYXk8U2VnbWVudD4oKTtcblxuICAvLyBGaXJzdCBjb21wbGV0ZWx5IHJlc29sdmUgdGhlIHRyZWUsIHRoZW4gZW5jb2RlIHRvIEpTT04gd2hpbGUgcmVzcGVjdGluZyB0aGUgdHlwZVxuICAvLyBoaW50cyB3ZSBnb3QgZm9yIHRoZSByZXNvbHZlZCBpbnRyaW5zaWNzLlxuICByZWN1cnNlKGN0eC5yZXNvbHZlKHJvb3QsIHsgYWxsb3dJbnRyaW5zaWNLZXlzOiB0cnVlIH0pKTtcblxuICBzd2l0Y2ggKHJldC5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiB1bmRlZmluZWQ7XG4gICAgY2FzZSAxOiByZXR1cm4gcmVuZGVyU2VnbWVudChyZXRbMF0pO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZm5Kb2luQ29uY2F0KHJldC5tYXAocmVuZGVyU2VnbWVudCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0cmluZ2lmeSBhIEpTT04gZWxlbWVudFxuICAgKi9cbiAgZnVuY3Rpb24gcmVjdXJzZShvYmo6IGFueSk6IHZvaWQge1xuICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCkgeyByZXR1cm47IH1cblxuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQob2JqKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIHNob3VsZG50IGhhcHBlbiBhbnltb3JlJyk7XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgIHJldHVybiByZW5kZXJDb2xsZWN0aW9uKCdbJywgJ10nLCBvYmosIHJlY3Vyc2UpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqICE9IG51bGwgJiYgIShvYmogaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgLy8gVHJlYXQgYXMgYW4gaW50cmluc2ljIGlmIHRoaXMgTE9PS1MgbGlrZSBhIENGTiBpbnRyaW5zaWMgKGB7IFJlZjogLi4uIH1gKVxuICAgICAgLy8gQU5EIGl0J3MgdGhlIHJlc3VsdCBvZiBhIHRva2VuIHJlc29sdXRpb24uIE90aGVyd2lzZSwgd2UganVzdCB0cmVhdCB0aGlzXG4gICAgICAvLyB2YWx1ZSBhcyBhIHJlZ3VsYXIgb2xkIEpTT04gb2JqZWN0ICh0aGF0IGhhcHBlbnMgdG8gbG9vayBhIGxvdCBsaWtlIGFuIGludHJpbnNpYykuXG4gICAgICBpZiAoaXNJbnRyaW5zaWMob2JqKSAmJiByZXNvbHZlZFR5cGVIaW50KG9iaikpIHtcbiAgICAgICAgcmVuZGVySW50cmluc2ljKG9iaik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlbmRlckNvbGxlY3Rpb24oJ3snLCAnfScsIGRlZmluZWRFbnRyaWVzKG9iaiksIChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKElOVFJJTlNJQ19LRVlfUFJFRklYKSkge1xuICAgICAgICAgIFtrZXksIHZhbHVlXSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVjdXJzZShrZXkpO1xuICAgICAgICBwdXNoTGl0ZXJhbChwcmV0dHlQdW5jdHVhdGlvbignOicpKTtcbiAgICAgICAgcmVjdXJzZSh2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlIHdlIGhhdmUgYSBzY2FsYXIsIGRlZmVyIHRvIEpTT04uc3RyaW5naWZ5KClzIHNlcmlhbGl6YXRpb25cbiAgICBwdXNoTGl0ZXJhbChKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYW4gb2JqZWN0IG9yIGxpc3RcbiAgICovXG4gIGZ1bmN0aW9uIHJlbmRlckNvbGxlY3Rpb248QT4ocHJlOiBzdHJpbmcsIHBvc3Q6IHN0cmluZywgeHM6IEl0ZXJhYmxlPEE+LCBlYWNoOiAoeDogQSkgPT4gdm9pZCkge1xuICAgIHB1c2hMaXRlcmFsKHByZSk7XG4gICAgaW5kZW50ICs9IHNwYWNlO1xuICAgIGxldCBhdExlYXN0T25lID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBbY29tbWEsIGl0ZW1dIG9mIHNlcEl0ZXIoeHMpKSB7XG4gICAgICBpZiAoY29tbWEpIHsgcHVzaExpdGVyYWwoJywnKTsgfVxuICAgICAgcHVzaExpbmVCcmVhaygpO1xuICAgICAgZWFjaChpdGVtKTtcbiAgICAgIGF0TGVhc3RPbmUgPSB0cnVlO1xuICAgIH1cbiAgICBpbmRlbnQgLT0gc3BhY2U7XG4gICAgaWYgKGF0TGVhc3RPbmUpIHsgcHVzaExpbmVCcmVhaygpOyB9XG4gICAgcHVzaExpdGVyYWwocG9zdCk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJJbnRyaW5zaWMoaW50cmluc2ljOiBhbnkpIHtcbiAgICBzd2l0Y2ggKHJlc29sdmVkVHlwZUhpbnQoaW50cmluc2ljKSkge1xuICAgICAgY2FzZSBSZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HOlxuICAgICAgICBwdXNoTGl0ZXJhbCgnXCInKTtcbiAgICAgICAgcHVzaEludHJpbnNpYyhkZWVwUXVvdGVTdHJpbmdMaXRlcmFscyhpbnRyaW5zaWMpKTtcbiAgICAgICAgcHVzaExpdGVyYWwoJ1wiJyk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSBSZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HX0xJU1Q6XG4gICAgICAgIC8vIFdlIG5lZWQgdGhpcyB0byBsb29rIGxpa2U6XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICd7XCJsaXN0VmFsdWVcIjonICsrIFNUUklOR0lGWShDRk5fRVZBTCh7IFJlZjogTXlMaXN0IH0pKSArKyAnfSdcbiAgICAgICAgLy9cbiAgICAgICAgLy8gSG93ZXZlciwgU1RSSU5HSUZZIHdvdWxkIG5lZWQgdG8gZXhlY3V0ZSBhdCBDbG91ZEZvcm1hdGlvbiBkZXBsb3ltZW50IHRpbWUsIGFuZCB0aGF0IGRvZXNuJ3QgZXhpc3QuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFdlIGNvdWxkICpBTE1PU1QqIHVzZTpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAne1wibGlzdFZhbHVlXCI6W1wiJyArKyBKT0lOKCdcIixcIicsIHsgUmVmOiBNeUxpc3QgfSkgKysgJ1wiXX0nXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEJ1dCB0aGF0IGhhcyB0aGUgdW5mb3J0dW5hdGUgc2lkZSBlZmZlY3QgdGhhdCBpZiBgQ0ZOX0VWQUwoeyBSZWY6IE15TGlzdCB9KSA9PSBbXWAsIHRoZW4gaXQgd291bGRcbiAgICAgICAgLy8gZXZhbHVhdGUgdG8gYFtcIlwiXWAsIHdoaWNoIGlzIGEgZGlmZmVyZW50IHZhbHVlLiBTaW5jZSBDbG91ZEZvcm1hdGlvbiBkb2VzIG5vdCBoYXZlIGFyYml0cmFyeVxuICAgICAgICAvLyBjb25kaXRpb25hbHMgdGhlcmUncyBubyB3YXkgdG8gZGVhbCB3aXRoIHRoaXMgY2FzZSBwcm9wZXJseS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhlcmVmb3JlLCBpZiB3ZSBlbmNvdW50ZXIgbGlzdHMgd2UgbmVlZCB0byBkZWZlciB0byBhIGN1c3RvbSByZXNvdXJjZSB0byBoYW5kbGVcbiAgICAgICAgLy8gdGhlbSBwcm9wZXJseSBhdCBkZXBsb3kgdGltZS5cbiAgICAgICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihjdHguc2NvcGUpO1xuXG4gICAgICAgIC8vIEJlY2F1c2UgdGhpcyB3aWxsIGJlIGNhbGxlZCB0d2ljZSAob25jZSBkdXJpbmcgYHByZXBhcmVgLCBvbmNlIGR1cmluZyBgcmVzb2x2ZWApLFxuICAgICAgICAvLyB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0byBiZSBpZGVtcG90ZW50LCBzbyB1c2UgYSBjYWNoZS5cbiAgICAgICAgY29uc3Qgc3RyaW5naWZ5UmVzcG9uc2UgPSBzdHJpbmdpZnlDYWNoZS5vYnRhaW4oc3RhY2ssIEpTT04uc3RyaW5naWZ5KGludHJpbnNpYyksICgpID0+XG4gICAgICAgICAgQ2ZuVXRpbHMuc3RyaW5naWZ5KHN0YWNrLCBgQ2RrSnNvblN0cmluZ2lmeSR7c3RyaW5naWZ5Q291bnRlcisrfWAsIGludHJpbnNpYyksXG4gICAgICAgICk7XG5cbiAgICAgICAgcHVzaEludHJpbnNpYyhzdHJpbmdpZnlSZXNwb25zZSk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSBSZXNvbHV0aW9uVHlwZUhpbnQuTlVNQkVSOlxuICAgICAgICBwdXNoSW50cmluc2ljKGludHJpbnNpYyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgdHlwZSBoaW50OiAke3Jlc29sdmVkVHlwZUhpbnQoaW50cmluc2ljKX1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdXNoIGEgbGl0ZXJhbCBvbnRvIHRoZSBjdXJyZW50IHNlZ21lbnQgaWYgaXQncyBhbHNvIGEgbGl0ZXJhbCwgb3RoZXJ3aXNlIG9wZW4gYSBuZXcgU2VnbWVudFxuICAgKi9cbiAgZnVuY3Rpb24gcHVzaExpdGVyYWwobGl0OiBzdHJpbmcpIHtcbiAgICBsZXQgbGFzdCA9IHJldFtyZXQubGVuZ3RoIC0gMV07XG4gICAgaWYgKGxhc3Q/LnR5cGUgIT09ICdsaXRlcmFsJykge1xuICAgICAgbGFzdCA9IHsgdHlwZTogJ2xpdGVyYWwnLCBwYXJ0czogW10gfTtcbiAgICAgIHJldC5wdXNoKGxhc3QpO1xuICAgIH1cbiAgICBsYXN0LnBhcnRzLnB1c2gobGl0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgaW50cmluc2ljIHNlZ21lbnRcbiAgICovXG4gIGZ1bmN0aW9uIHB1c2hJbnRyaW5zaWMoaW50cmluc2ljOiBhbnkpIHtcbiAgICByZXQucHVzaCh7IHR5cGU6ICdpbnRyaW5zaWMnLCBpbnRyaW5zaWMgfSk7XG4gIH1cblxuICAvKipcbiAgICogUHVzaCBhIGxpbmUgYnJlYWsgaWYgd2UgYXJlIHByZXR0eS1wcmludGluZywgb3RoZXJ3aXNlIGRvbid0XG4gICAqL1xuICBmdW5jdGlvbiBwdXNoTGluZUJyZWFrKCkge1xuICAgIGlmIChzcGFjZSA+IDApIHtcbiAgICAgIHB1c2hMaXRlcmFsKGBcXG4keycgJy5yZXBlYXQoaW5kZW50KX1gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgc3BhY2UgYWZ0ZXIgdGhlIHB1bmN0dWF0aW9uIGlmIHdlIGFyZSBwcmV0dHktcHJpbnRpbmcsIG5vIHNwYWNlIGlmIG5vdFxuICAgKi9cbiAgZnVuY3Rpb24gcHJldHR5UHVuY3R1YXRpb24ocHVuYzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHNwYWNlID4gMCA/IGAke3B1bmN9IGAgOiBwdW5jO1xuICB9XG59XG5cbi8qKlxuICogQSBTZWdtZW50IGlzIGVpdGhlciBhIGxpdGVyYWwgc3RyaW5nIG9yIGEgQ2xvdWRGb3JtYXRpb24gaW50cmluc2ljXG4gKi9cbnR5cGUgU2VnbWVudCA9IHsgdHlwZTogJ2xpdGVyYWwnOyBwYXJ0czogc3RyaW5nW10gfSB8IHsgdHlwZTogJ2ludHJpbnNpYyc7IGludHJpbnNpYzogYW55IH07XG5cbi8qKlxuICogUmVuZGVyIGEgc2VnbWVudFxuICovXG5mdW5jdGlvbiByZW5kZXJTZWdtZW50KHM6IFNlZ21lbnQpOiBOb25OdWxsYWJsZTxhbnk+IHtcbiAgc3dpdGNoIChzLnR5cGUpIHtcbiAgICBjYXNlICdsaXRlcmFsJzogcmV0dXJuIHMucGFydHMuam9pbignJyk7XG4gICAgY2FzZSAnaW50cmluc2ljJzogcmV0dXJuIHMuaW50cmluc2ljO1xuICB9XG59XG5cbmNvbnN0IENMT1VERk9STUFUSU9OX0NPTkNBVDogSUZyYWdtZW50Q29uY2F0ZW5hdG9yID0ge1xuICBqb2luKGxlZnQ6IGFueSwgcmlnaHQ6IGFueSkge1xuICAgIHJldHVybiBDbG91ZEZvcm1hdGlvbkxhbmcuY29uY2F0KGxlZnQsIHJpZ2h0KTtcbiAgfSxcbn07XG5cbi8qKlxuICogRGVmYXVsdCBUb2tlbiByZXNvbHZlciBmb3IgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGVzXG4gKi9cbmV4cG9ydCBjb25zdCBDTE9VREZPUk1BVElPTl9UT0tFTl9SRVNPTFZFUiA9IG5ldyBEZWZhdWx0VG9rZW5SZXNvbHZlcihDTE9VREZPUk1BVElPTl9DT05DQVQpO1xuXG4vKipcbiAqIERvIGFuIGludGVsbGlnZW50IENsb3VkRm9ybWF0aW9uIGpvaW4gb24gdGhlIGdpdmVuIHZhbHVlcywgcHJvZHVjaW5nIGEgbWluaW1hbCBleHByZXNzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaW5pbWFsQ2xvdWRGb3JtYXRpb25Kb2luKGRlbGltaXRlcjogc3RyaW5nLCB2YWx1ZXM6IGFueVtdKTogYW55W10ge1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlIChpIDwgdmFsdWVzLmxlbmd0aCkge1xuICAgIGNvbnN0IGVsID0gdmFsdWVzW2ldO1xuICAgIGlmIChpc1NwbGljYWJsZUZuSm9pbkludHJpbnNpYyhlbCkpIHtcbiAgICAgIHZhbHVlcy5zcGxpY2UoaSwgMSwgLi4uZWxbJ0ZuOjpKb2luJ11bMV0pO1xuICAgIH0gZWxzZSBpZiAoaSA+IDAgJiYgaXNDb25jYXRhYmxlKHZhbHVlc1tpIC0gMV0pICYmIGlzQ29uY2F0YWJsZSh2YWx1ZXNbaV0pKSB7XG4gICAgICB2YWx1ZXNbaSAtIDFdID0gYCR7dmFsdWVzW2ktMV19JHtkZWxpbWl0ZXJ9JHt2YWx1ZXNbaV19YDtcbiAgICAgIHZhbHVlcy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGkgKz0gMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGlzU3BsaWNhYmxlRm5Kb2luSW50cmluc2ljKG9iajogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKCFpc0ludHJpbnNpYyhvYmopKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGlmIChPYmplY3Qua2V5cyhvYmopWzBdICE9PSAnRm46OkpvaW4nKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgY29uc3QgW2RlbGltLCBsaXN0XSA9IG9ialsnRm46OkpvaW4nXTtcbiAgICBpZiAoZGVsaW0gIT09IGRlbGltaXRlcikgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQobGlzdCkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGxpc3QpKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNDb25jYXRhYmxlKG9iajogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiBbJ3N0cmluZycsICdudW1iZXInXS5pbmNsdWRlcyh0eXBlb2Ygb2JqKSAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKG9iaik7XG59XG5cblxuLyoqXG4gKiBSZXR1cm4gd2hldGhlciB0aGUgZ2l2ZW4gdmFsdWUgcmVwcmVzZW50cyBhIENsb3VkRm9ybWF0aW9uIGludHJpbnNpY1xuICovXG5mdW5jdGlvbiBpc0ludHJpbnNpYyh4OiBhbnkpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoeCkgfHwgeCA9PT0gbnVsbCB8fCB0eXBlb2YgeCAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHgpO1xuICBpZiAoa2V5cy5sZW5ndGggIT09IDEpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcmV0dXJuIGtleXNbMF0gPT09ICdSZWYnIHx8IGlzTmFtZU9mQ2xvdWRGb3JtYXRpb25JbnRyaW5zaWMoa2V5c1swXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05hbWVPZkNsb3VkRm9ybWF0aW9uSW50cmluc2ljKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBpZiAoIW5hbWUuc3RhcnRzV2l0aCgnRm46OicpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIHRoZXNlIGFyZSAnZmFrZScgaW50cmluc2ljcywgb25seSB1c2FibGUgaW5zaWRlIHRoZSBwYXJhbWV0ZXIgb3ZlcnJpZGVzIG9mIGEgQ0ZOIENvZGVQaXBlbGluZSBBY3Rpb25cbiAgcmV0dXJuIG5hbWUgIT09ICdGbjo6R2V0QXJ0aWZhY3RBdHQnICYmIG5hbWUgIT09ICdGbjo6R2V0UGFyYW0nO1xufVxuXG4vKipcbiAqIFNlcGFyYXRlZCBpdGVyYXRvclxuICovXG5mdW5jdGlvbiogc2VwSXRlcjxBPih4czogSXRlcmFibGU8QT4pOiBJdGVyYWJsZUl0ZXJhdG9yPFtib29sZWFuLCBBXT4ge1xuICBsZXQgY29tbWEgPSBmYWxzZTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIHhzKSB7XG4gICAgeWllbGQgW2NvbW1hLCBpdGVtXTtcbiAgICBjb21tYSA9IHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBPYmplY3QuZW50cmllcygpIGJ1dCBza2lwcGluZyB1bmRlZmluZWQgdmFsdWVzXG4gKi9cbmZ1bmN0aW9uKiBkZWZpbmVkRW50cmllczxBIGV4dGVuZHMgb2JqZWN0Pih4czogQSk6IEl0ZXJhYmxlSXRlcmF0b3I8W3N0cmluZywgYW55XT4ge1xuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh4cykpIHtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgeWllbGQgW2tleSwgdmFsdWVdO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFF1b3RlIHN0cmluZyBsaXRlcmFscyBpbnNpZGUgYW4gaW50cmluc2ljXG4gKlxuICogRm9ybWFsbHksIHRoaXMgc2hvdWxkIG9ubHkgbWF0Y2ggc3RyaW5nIGxpdGVyYWxzIHRoYXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhc1xuICogc3RyaW5nIGxpdGVyYWxzLiBGb3J0dW5hdGVseSwgdGhlIHN0cmluZ3MgdGhhdCBzaG91bGQgTk9UIGJlIHF1b3RlZCBhcmVcbiAqIExvZ2ljYWwgSURzIGFuZCBhdHRyaWJ1dGUgbmFtZXMsIHdoaWNoIGNhbm5vdCBjb250YWluIHF1b3RlcyBhbnl3YXkuIEhlbmNlLFxuICogd2UgY2FuIGdldCBhd2F5IG5vdCBjYXJpbmcgYWJvdXQgdGhlIGRpc3RpbmN0aW9uIGFuZCBqdXN0IHF1b3RpbmcgZXZlcnl0aGluZy5cbiAqL1xuZnVuY3Rpb24gZGVlcFF1b3RlU3RyaW5nTGl0ZXJhbHMoeDogYW55KTogYW55IHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoeCkpIHtcbiAgICByZXR1cm4geC5tYXAoZGVlcFF1b3RlU3RyaW5nTGl0ZXJhbHMpO1xuICB9XG4gIGlmICh0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPSBudWxsKSB7XG4gICAgY29uc3QgcmV0OiBhbnkgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh4KSkge1xuICAgICAgcmV0W2RlZXBRdW90ZVN0cmluZ0xpdGVyYWxzKGtleSldID0gZGVlcFF1b3RlU3RyaW5nTGl0ZXJhbHModmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG4gIGlmICh0eXBlb2YgeCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gcXVvdGVTdHJpbmcoeCk7XG4gIH1cbiAgcmV0dXJuIHg7XG59XG5cbi8qKlxuICogUXVvdGUgdGhlIGNoYXJhY3RlcnMgaW5zaWRlIGEgc3RyaW5nLCBmb3IgdXNlIGluc2lkZSB0b0pTT05cbiAqL1xuZnVuY3Rpb24gcXVvdGVTdHJpbmcoczogc3RyaW5nKSB7XG4gIHMgPSBKU09OLnN0cmluZ2lmeShzKTtcbiAgcmV0dXJuIHMuc3Vic3RyaW5nKDEsIHMubGVuZ3RoIC0gMSk7XG59XG5cbmxldCBzdHJpbmdpZnlDb3VudGVyID0gMTtcblxuLyoqXG4gKiBBIGNhY2hlIHNjb3BlZCB0byBvYmplY3QgaW5zdGFuY2VzLCB0aGF0J3MgbWFpbnRhaW5lZCBleHRlcm5hbGx5IHRvIHRoZSBvYmplY3QgaW5zdGFuY2VzXG4gKi9cbmNsYXNzIFNjb3BlZENhY2hlPE8gZXh0ZW5kcyBvYmplY3QsIEssIFY+IHtcbiAgcHJpdmF0ZSBjYWNoZSA9IG5ldyBXZWFrTWFwPE8sIE1hcDxLLCBWPj4oKTtcblxuICBwdWJsaWMgb2J0YWluKG9iamVjdDogTywga2V5OiBLLCBpbml0OiAoKSA9PiBWKTogViB7XG4gICAgbGV0IGt2TWFwID0gdGhpcy5jYWNoZS5nZXQob2JqZWN0KTtcbiAgICBpZiAoIWt2TWFwKSB7XG4gICAgICBrdk1hcCA9IG5ldyBNYXAoKTtcbiAgICAgIHRoaXMuY2FjaGUuc2V0KG9iamVjdCwga3ZNYXApO1xuICAgIH1cblxuICAgIGxldCByZXQgPSBrdk1hcC5nZXQoa2V5KTtcbiAgICBpZiAocmV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldCA9IGluaXQoKTtcbiAgICAgIGt2TWFwLnNldChrZXksIHJldCk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cbn1cblxuY29uc3Qgc3RyaW5naWZ5Q2FjaGUgPSBuZXcgU2NvcGVkQ2FjaGU8U3RhY2ssIHN0cmluZywgc3RyaW5nPigpO1xuIl19