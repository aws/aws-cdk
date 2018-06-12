import { PackageJson } from "./packagejson";

/**
 * Expect a particular JSON key to be a given value
 */
export function expectJSON(pkg: PackageJson, path: string, expected: any) {
    const parts = path.split('.');
    const actual = deepGet(pkg.json, parts);
    if (actual !== expected) {
        pkg.report({
            message: `${path} should be '${expected}', is '${actual}'`,
            fix: () => { deepSet(pkg.json, parts, expected); }
        });
    }
}

/**
 * Return whether the given value is an object
 *
 * Even though arrays technically are objects, we usually want to treat them differently,
 * so we return false in those cases.
 */
export function isObject(x: any) {
    return x !== null && typeof x === 'object' && !Array.isArray(x);
}

/**
 * Deep get a value from a tree of nested objects
 *
 * Returns undefined if any part of the path was unset or
 * not an object.
 */
export function deepGet(x: any, path: string[]): any {
    path = path.slice();

    while (path.length > 0 && isObject(x)) {
        const key = path.shift()!;
        x = x[key];
    }
    return path.length === 0 ? x : undefined;
}

/**
 * Deep set a value in a tree of nested objects
 *
 * Throws an error if any part of the path is not an object.
 */
export function deepSet(x: any, path: string[], value: any) {
    path = path.slice();

    if (path.length === 0) {
        throw new Error('Path may not be empty');
    }

    while (path.length > 1 && isObject(x)) {
        const key = path.shift()!;
        if (!(key in x)) { x[key] = {}; }
        x = x[key];
    }

    if (!isObject(x)) {
        throw new Error(`Expected an object, got '${x}'`);
    }

    x[path[0]] = value;
}