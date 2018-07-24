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
    /**
     * Creates a token that resolves to `value`. If value is a function,
     * the function is evaluated upon resolution and the value it returns will be
     * uesd as the token's value.
     */
    constructor(private readonly valueOrFunction?: any) { }

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
