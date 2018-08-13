import { Construct } from "./construct";
import { isIntrinsic, markAsIntrinsic } from "./engine-intrinsics";
import { ProvisioningEngine } from "./engine-strings";
import { resolveMarkerSpans, splitOnMarkers } from './util';

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
        // Optimization: if we can immediately resolve this, don't bother
        // registering a Token.
        if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
            return this.valueOrFunction.toString();
        }

        if (this.tokenKey === undefined) {
            this.tokenKey = TOKEN_STRING_MAP.register(this);
        }
        return this.tokenKey;
    }

    /**
     * Turn this Token into JSON
     *
     * This gets called by JSON.stringify(). We want to prohibit this, because
     * it's not possible to do this properly, so we just throw an error here.
     */
    public toJSON(): any {
        throw new Error('JSON.stringify() cannot be applied to structure with a deferred Token in it. Use TokenJSON.stringify() instead.');
    }
}

/**
 * Class that tags the Token's return value as an Intrinsic.
 *
 */
export abstract class IntrinsicToken extends Token {
    protected abstract readonly engine: string;

    public resolve(): any {
        // Get the inner value, and deep-resolve it to resolve further Tokens.
        // Necessary to do this now since an intrinsic will never be resolved
        // any deeper.
        const resolved = resolve(super.resolve());
        return markAsIntrinsic(resolved, this.engine);
    }
}

/**
 * Returns true if obj is a token (i.e. has the resolve() method)
 * @param obj The object to test.
 */
export function isToken(obj: any): obj is Token {
    return typeof(obj[RESOLVE_METHOD]) === 'function';
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
        const unresolved = splitOnMarkers(s, BEGIN_TOKEN_MARKER, `[${VALID_KEY_CHARS}]+`, END_TOKEN_MARKER);
        const fragments = resolveMarkerSpans(unresolved, (id) => {
            const resolved = resolve(this.lookupToken(id));

            // Convert to string unless intrinsic
            return isIntrinsic(resolved) ? resolved : `${resolved}`;
        });

        return ProvisioningEngine.combineStringFragments(fragments);
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

const BEGIN_TOKEN_MARKER = '${Token[';
const END_TOKEN_MARKER = ']}';
const VALID_KEY_CHARS = 'a-zA-Z0-9:._-';

/**
 * Singleton instance of the token string map
 */
const TOKEN_STRING_MAP = new TokenStringMap();