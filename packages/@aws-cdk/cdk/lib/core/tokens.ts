import { Construct } from "./construct";

/**
 * If objects has a function property by this name, they will be considered tokens, and this
 * function will be called to resolve the value for this object.
 */
export const RESOLVE_METHOD = 'resolve';

/**
 * Represents a lazy-evaluated value. Can be used to delay evaluation of a certain value
 * in case, for example, that it requires some context or late-bound data.
 */
export class Token {
    private stringRepr?: string;

    /**
     * Creates a token that resolves to `value`. If value is a function,
     * the function is evaluated upon resolution and the value it returns will be
     * used as the token's value.
     */
    constructor(private readonly valueOrFunction?: any, public readonly stringRepresentation?: string) { }

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
     * Return a string representation of this token
     *
     * This string representation can be embedded into strings and
     * will be turned into the actual representation of the token
     * when resolve() is called on the string.
     */
    public toString(): string {
        const valueType = typeof this.valueOrFunction;
        if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
            return this.valueOrFunction.toString();
        }

        // In particular: 'undefined' is not stringified here, since it should
        // probably evaluate to a proper "undefined" later.
        if (this.stringRepr === undefined) {
            this.stringRepr = TOKEN_STRING_MAP.register(this);
        }
        return this.stringRepr;
    }

    /**
     * Return the JSON representation of this Token
     *
     * Implements JSON.stringify()-compatibility for this Token. Note that it
     * returns a string representation for the Token pre-resolution, NOT the
     * resolved value of the Token.
     */
    public toJSON(): any {
        return this.toString();
    }
}

/**
 * Returns true if obj is a token (i.e. has the resolve() method)
 * @param obj The object to test.
 */
export function istoken(obj: any) {
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
    // tokens - invoke 'resolve' and continue to resolve recursively
    //

    if (istoken(obj)) {
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

import { FnConcat } from "../cloudformation/fn";

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
     * Return a unique string for this Token
     *
     * Every call for the same Token will produce a new unique string, no
     * attempt is made to deduplicate. Token objects should cache the
     * value themselves, if required.
     *
     * If the token is an IRepresentableToken, it chooses its own representation
     * string. This may be used to produce aesthetically pleasing and recognizable
     * token representations for humans.
     */
    public register(token: Token | HintedToken): string {
        const counter = Object.keys(this.tokenMap).length;
        const representation = isHintedToken(token) ? token.representationHint : `TOKEN`;

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
        const spans = this.split(s);
        const resolved = spans.map(this.resolveSpan.bind(this));

        switch (resolved.length) {
            case 0: return '';
            case 1: return resolved[0];
            default: return resolve(new FnConcat(...resolved));
        }
    }

    /**
     * Split a string on Token markers
     */
    private split(s: string): Span[] {
        const re = new RegExp(`${BEGIN_TOKEN_MARKER}([${VALID_KEY_CHARS}]+)${END_TOKEN_MARKER}`, 'gu');
        const ret: Span[] = [];

        let rest = 0;
        let m = re.exec(s);
        while (m) {
            if (m.index > rest) {
                ret.push({ type: 'string', value: s.substring(rest, m.index) });
            }

            ret.push({ type: 'token', key: m[1] });

            rest = re.lastIndex;
            m = re.exec(s);
        }

        if (rest < s.length) {
            ret.push({ type: 'string', value: s.substring(rest) });
        }

        return ret;
    }

    /**
     * Resolve a single Span
     */
    private resolveSpan(span: Span): any {
        if (span.type === 'string') {
            return span.value;
        }
        if (!(span.key in this.tokenMap)) {
            throw new Error(`Unrecognized token representation: ${span.key}`);
        }

        return resolve(this.tokenMap[span.key]);
    }
}

interface StringSpan {
    type: 'string';
    value: string;
}

interface TokenSpan {
    type: 'token';
    key: string;
}

type Span = StringSpan | TokenSpan;

const BEGIN_TOKEN_MARKER = '🔸🔹';
const END_TOKEN_MARKER = '🔹🔸';
const VALID_KEY_CHARS = 'a-zA-Z0-9:._-';

/**
 * Singleton instance of the token string map
 */
const TOKEN_STRING_MAP = new TokenStringMap();