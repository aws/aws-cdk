import { Construct } from "./construct";

/**
 * If objects has a function property by this name, they will be considered tokens, and this
 * function will be called to resolve the value for this object.
 */
export const RESOLVE_METHOD = 'resolve';

/**
 * Represents a lazy-evaluated value.
 *
 * Can be used to delay evaluation of a certain value in case, for example,
 * that it requires some context or late-bound data.
 */
export class Token {
    private tokenKey?: string;

    /**
     * Creates a token that resolves to `value`.
     *
     * If value is a function, the function is evaluated upon resolution and
     * the value it returns will be used as the token's value.
     *
     * stringRepresentation is used in the placeholder string of stringified
     * Tokens, so that if humans look at the string its purpose makes sense to
     * them. Must contain only alphanumeric and simple separator characters
     * (_.:-).
     *
     * @param valueOrFunction What this token will evaluate to, literal or function.
     * @param stringRepresentation A human-readable string describing the token's value.
     *
     */
    constructor(private readonly valueOrFunction?: any, public readonly stringRepresentation?: string) {
    }

    /**
     * @returns The resolved value for this token.
     */
    public resolve(): any {
        let value = this.valueOrFunction;
        if (typeof(value) === 'function') {
            value = value();
        }

        return value;
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
    public toString(): string {
        const valueType = typeof this.valueOrFunction;
        if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
            return this.valueOrFunction.toString();
        }
        // In particular: 'undefined' is not stringified here, since it should
        // probably evaluate to a proper "undefined" during resolve() later.

        return this.stringMarker();
    }

    /**
     * Return the JSON representation of this Token
     *
     * Implements JSON.stringify()-compatibility for this Token. Note that it
     * returns a string representation for the Token pre-resolution, NOT the
     * resolved value of the Token.
     *
     * If the Token evaluates to a string literal, the string literal will
     * undergo an additional level of escaping to make sure quotes and newlines
     * embed properly into a larger JSON context.
     *
     * In case the Token represents a value that is intrinsic to the deployment
     * engine (e.g. CloudFormation), the value is unavailable at synthesis time
     * and we cannot do this escaping. Typically the values returned by those
     * intrinsics are alphanumeric identifiers that don't need escaping, so
     * this is not an issue.
     *
     * This feature is only supported for Tokens that resolve to strings, or
     * to intrinsics that will produce strings.
     * In case the Token represents a value that is intrinsic to the deployment
     * engine (e.g. CloudFormation), the value is unavailable at synthesis time
     * and we cannot do this escaping. Typically the values returned by those
     * intrinsics are alphanumeric identifiers that don't need escaping, so
     * this is not an issue.
     *
     * This feature is only supported for Tokens that resolve to strings, or
     * to intrinsics that will produce strings.
     */
    public toJSON(): any {
        // Return immediately if it doesn't look like this value is ever going to change.
        if (!isIntrinsic(this.valueOrFunction) && typeof this.valueOrFunction !== 'function' && typeof this.valueOrFunction !== 'object') {
            return this.valueOrFunction;
        }

        // Otherwise return a marker for lazy evaluation.
        return this.stringMarker();
    }

    /**
     * Allocate and encode the appropriate string marker for this Token
     *
     * Implements caching of the key.
     */
    private stringMarker() {
        if (this.tokenKey === undefined) {
            this.tokenKey = TOKEN_STRING_MAP.register(this);
        }
        return this.tokenKey;
    }
}

/**
 * Returns true if obj is a token (i.e. has the resolve() method)
 * @param obj The object to test.
 */
export function isToken(obj: any): obj is Token {
    return typeof(obj[RESOLVE_METHOD]) === 'function';
}

export function istoken(obj: any): obj is Token {
    process.emitWarning('Deprecated; use isToken() instead');
    return isToken(obj);
}

/**
 * Resolves an object by evaluating all tokens and removing any undefined or empty objects or arrays.
 * Values can only be primitives, arrays or tokens. Other objects (i.e. with methods) will be rejected.
 *
 * @param obj The object to resolve.
 * @param prefix Prefix key path components for diagnostics.
 */
export function resolve(obj: any, prefix?: string[]): any {
    const path = prefix || [ ];
    const pathName = '/' + path.join('/');

    // protect against cyclic references by limiting depth.
    if (path.length > 200) {
        throw new Error('Unable to resolve object tree with circular reference. Path: ' + pathName);
    }

    //
    // undefined
    //

    if (typeof(obj) === 'undefined') {
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

    if (typeof(obj) === 'function') {
        throw new Error(`Trying to resolve a non-data object. Only token are supported for lazy evaluation. Path: ${pathName}. Object: ${obj}`);
    }

    //
    // string - potentially replace all stringified Tokens
    //
    if (typeof(obj) === 'string') {
        return TOKEN_STRING_MAP.resolveMarkers(obj as string);
    }

    //
    // primitives - as-is
    //

    if (typeof(obj) !== 'object' || obj instanceof Date) {
        return obj;
    }

    //
    // intrinsics - return intrinsic without further resolution
    //

    if (isIntrinsic(obj)) {
        return obj;
    }

    //
    // tokens - invoke 'resolve' and continue to resolve recursively
    //

    if (isToken(obj)) {
        const value = obj[RESOLVE_METHOD]();
        return resolve(value, path);
    }

    //
    // arrays - resolve all values, remove undefined and remove empty arrays
    //

    if (Array.isArray(obj)) {
        const arr = obj
            .map((x, i) => resolve(x, path.concat(i.toString())))
            .filter(x => typeof(x) !== 'undefined');

        return arr;
    }

    //
    // objects - deep-resolve all values
    //

    // Must not be a Construct at this point, otherwise you probably made a type
    // mistake somewhere and resolve will get into an infinite loop recursing into
    // child.parent <---> parent.children
    if (obj instanceof Construct) {
        throw new Error('Trying to resolve() a Construct at ' + pathName);
    }

    const result: any = { };
    for (const key of Object.keys(obj)) {
        const value = resolve(obj[key], path.concat(key));

        // skip undefined
        if (typeof(value) === 'undefined') {
            continue;
        }

        result[key] = value;
    }

    return result;
}

/**
 * Central place where we keep a mapping from Tokens to their String representation
 *
 * The string representation is used to embed token into strings,
 * and stored to be able to
 *
 * All instances of TokenStringMap share the same storage, so that this process
 * works even when different copies of the library are loaded.
 */
class TokenStringMap {
    private readonly tokenMap: {[key: string]: Token};

    constructor() {
        const glob = global as any;
        this.tokenMap = glob.__cdkTokenMap = glob.__cdkTokenMap || {};
    }

    /**
     * Generating a unique string for this Token, returning a key
     *
     * Every call for the same Token will produce a new unique string, no
     * attempt is made to deduplicate. Token objects should cache the
     * value themselves, if required.
     *
     * The token can choose (part of) its own representation string with a
     * hint. This may be used to produce aesthetically pleasing and
     * recognizable token representations for humans.
     */
    public register(token: Token): string {
        const counter = Object.keys(this.tokenMap).length;
        const representation = token.stringRepresentation || `TOKEN`;

        const key = `${representation}.${counter}`;
        if (new RegExp(`[^${VALID_KEY_CHARS}]`).exec(key)) {
            throw new Error(`Invalid characters in token representation: ${key}`);
        }

        this.tokenMap[key] = token;
        return `${BEGIN_TOKEN_MARKER}${key}${END_TOKEN_MARKER}`;
    }

    /**
     * Replace any Token markers in this string with their resolved values
     */
    public resolveMarkers(s: string): any {
        const unresolved = this.splitMarkers(s);
        const resolved = resolveFragments(unresolved);
        return combineStringFragments(resolved);
    }

    /**
     * Split a string up into string and Token Spans
     */
    public splitMarkers(s: string): UnresolvedFragment[] {
        // tslint:disable-next-line:max-line-length
        const re = new RegExp(`${regexQuote(BEGIN_TOKEN_MARKER)}([${VALID_KEY_CHARS}]+)${regexQuote(END_TOKEN_MARKER)}`, 'g');
        const ret = new Array<UnresolvedFragment>();

        let rest = 0;
        let m = re.exec(s);
        while (m) {
            if (m.index > rest) {
                ret.push({ type: 'string', value: s.substring(rest, m.index) });
            }

            ret.push({
                type: 'token',
                token: this.lookupToken(m[1])
            });

            rest = re.lastIndex;
            m = re.exec(s);
        }

        if (rest < s.length) {
            ret.push({ type: 'string', value: s.substring(rest) });
        }

        if (ret.length === 0) {
            ret.push({ type: 'string', value: '' });
        }

        return ret;
    }

    /**
     * Find a Token by key
     */
    private lookupToken(key: string): Token {
        if (!(key in this.tokenMap)) {
            throw new Error(`Unrecognized token key: ${key}`);
        }

        return this.tokenMap[key];
    }
}

/**
 * Result of the split of a string with Tokens
 *
 * Either a literal part of the string, or an unresolved Token.
 */
type UnresolvedFragment = { type: 'string'; value: string } | { type: 'token'; token: Token };

/**
 * Resolves string fragments
 */
function resolveFragments(spans: UnresolvedFragment[]): StringFragment[] {
    return spans.map(span => {
        if (span.type === 'string') {
            return { source: FragmentSource.Literal, value: span.value };
        }

        // If not, then it's a Token that needs resolving
        const resolved = resolve(span.token);

        // This must resolve to a string or an intrinsic to make any sense. Let's see
        // what errors crop up if we're strict and then see if we want to loosen up the
        // rules later.
        if (!isIntrinsic(resolved) && typeof resolved !== 'string') {
            throw new Error(`Result of Token evaluation must be a string, got: ${resolved}`);
        }

        return { source: FragmentSource.Token, value: resolved, intrinsicEngine: intrinsicEngine(resolved) };
    });
}

const BEGIN_TOKEN_MARKER = '${Token[';
const END_TOKEN_MARKER = ']}';
const VALID_KEY_CHARS = 'a-zA-Z0-9:._-';

/**
 * Singleton instance of the token string map
 */
const TOKEN_STRING_MAP = new TokenStringMap();

function regexQuote(s: string) {
    return s.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}

/**
 * The hidden marker property that marks an object as an engine-intrinsic value.
 */
const INTRINSIC_VALUE_PROPERTY = '__intrinsicValue__';

/**
 * Mark a given object as an engine-intrinsic value.
 *
 * This will avoid it from being resolved by resolve(). Note that if the value
 * returns any Tokens, they should be resolved before marking the object
 * as an intrinsic.
 *
 * This could have been a wrapper class, but that breaks all test.deepEqual()s.
 * So instead, it's implemented as a hidden property on the object (which is
 * hidden from JSON.stringify() and test.deepEqual().
 */
export function markAsIntrinsic(x: any, engine: string): any {
    Object.defineProperty(x, INTRINSIC_VALUE_PROPERTY, {
        value: engine,
        enumerable: false,
        writable: false,
    });
    return x;
}

/**
 * Return whether the given value is an intrinsic
 */
export function isIntrinsic(x: any): boolean {
    return x[INTRINSIC_VALUE_PROPERTY] !== undefined;
}

/**
 * Return the intrinsic engine for the given intrinsic value
 */
export function intrinsicEngine(x: any): string | undefined {
    return x[INTRINSIC_VALUE_PROPERTY];
}

/**
 * A (resolved) fragment of a string to be combined.
 *
 * The values may be string literals or intrinsics.
 */
export interface StringFragment {
    /**
     * Source of the fragment
     */
    source: FragmentSource;

    /**
     * String value
     *
     * Either a string literal or an intrinsic.
     */
    value: any;

    /**
     * The intrinsic engine
     */
    intrinsicEngine?: string;
}

/**
 * Where the resolved fragment came from (a string literal or a Token)
 */
export enum FragmentSource {
    Literal = 'Literal',
    Token = 'Token'
}

/**
 * Interface for engine-specific Token marker handlers
 */
export interface IEngineTokenHandler {
    /**
     * Return the language intrinsic that will combine the strings in the given engine
     */
    combineStringFragments(fragments: StringFragment[]): any;
}

/**
 * The engine that will be used if no Tokens are found
 */
export const DEFAULT_ENGINE_NAME = 'default';

/**
 * Global handler map
 */
const HANDLERS: {[engine: string]: IEngineTokenHandler} = {};

/**
 * Register a handler for all intrinsics for the given engine
 */
export function registerEngineTokenHandler(engineName: string, handler: IEngineTokenHandler) {
    HANDLERS[engineName] = handler;
}

/**
 * Combine resolved fragments using the appropriate engine.
 *
 * Resolves the result.
 */
function combineStringFragments(fragments: StringFragment[]): any {
    if (fragments.length === 0) { return ''; }
    if (fragments.length === 1) { return fragments[0].value; }

    const engines = Array.from(new Set<string>(fragments.filter(f => f.intrinsicEngine !== undefined).map(f => f.intrinsicEngine!)));
    if (engines.length > 1) {
        throw new Error(`Combining different engines in one string fragment: ${engines.join(', ')}`);
    }

    const engine = engines.length > 0 ? engines[0] : DEFAULT_ENGINE_NAME;
    if (!(engine in HANDLERS)) {
        throw new Error(`No Token handler registered for engine: ${engine}`);
    }

    return resolve(HANDLERS[engine].combineStringFragments(fragments));
}

/**
 * Turn an arbitrary structure potentially containing Tokens into JSON.
 */
export function tokenAwareJsonify(obj: any): any {
    // This function must exist because even if we changed token.toJSON()
    // to return a special marker, we couldn't handle both of the following
    // cases correctly:
    //
    // [a] Embed into JSON structure directly, result:
    //
    //     {"key":"#{Token[0]}"}
    //
    // [b] First toString() to embed into string literal, then embed in JSON
    // structure, result:
    //
    //     {"key":"larger string with ${Token[0]}"}
    //
    // In [a], we could detect from '#' vs the '$' that the value of Token[0]
    // needs to undergo additional JSON-escaping, but we couldn't do the same in
    // case [b], even though the resultant string needs to undergo JSON-escaping
    // all the same.
    //
    // The correct way to handle this is to resolve scalars as usual, and do
    // an additional layer of JSON-postprocessing afterwards.
    return new Token(() => {
        const unresolved = TOKEN_STRING_MAP.splitMarkers(JSON.stringify(obj));
        const fragments = resolveFragments(unresolved);

        // Here's the magic sauce: everything that used to be a string before
        // has already been escaped, so we leave alone. Everything that came
        // rolling fresh out of a Token could _theoretically_ be everything
        // but in practice is either a string literal (escape!) or an intrinsic,
        // which in this RARE case we also recurse over and escape the strings
        // we find in it. This is technically cheating since we don't know which
        // strings in the intrinsics are instructions and which will be rendered
        // into the output, but in practice the instruction strings will not
        // contain escapable characters anyway.
        for (const fragment of fragments) {
            if (fragment.source === FragmentSource.Token) {
                fragment.value = deepEscape(fragment.value);
            }
        }

        return combineStringFragments(fragments);
    });

    function deepEscape(x: any): any {
        if (typeof x === 'string') {
            // Whenever we escape a string we strip off the outermost quotes
            // since we're already in a quoted context.
            const stringified = JSON.stringify(x);
            return stringified.substring(1, stringified.length - 1);
        }

        if (Array.isArray(x)) {
            return x.map(deepEscape);
        }

        if (typeof x === 'object') {
            for (const key of Object.keys(x)) {
                x[key] = deepEscape(x[key]);
            }
        }

        return x;
    }
}