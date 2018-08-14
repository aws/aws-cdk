import { resolve } from "./tokens";

/**
 * Interface that provisioning engines implement
 */
export interface IProvisioningEngine {
    /**
     * The name of the engine.
     *
     * Must be unique per engine.
     */
    engineName: string;

    /**
     * Return the language intrinsic that will combine the strings in the given engine
     */
    combineStringFragments(fragments: StringFragment[]): any;
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
}

/**
 * Where the resolved fragment came from (a string literal or a Token)
 */
export enum FragmentSource {
    Literal = 'Literal',
    Intrinsic = 'Intrinsic'
}

/**
 * Mark a given object as a provisioning engine-intrinsic value.
 *
 * Pass a reference to a singleton object that implements the engine's
 * functionality.
 *
 * Any value that has been marked as intrinsic to a provisioning engine
 * will escape all further type checks and attempts to manipulate, and be
 * passed on as-is to the final provisioning engine.
 *
 * Note that this is separate from a Token: a Token represents a lazy value.
 * The result of evaluating a Token is a value, which may or may not be an
 * engine intrinsic value. If you want to combine the two, see `IntrinsicToken`.
 */
export function markAsIntrinsic(x: any, engine: IProvisioningEngine): any {
    // This could have been a wrapper class, but that breaks all test.deepEqual()s.
    // So instead, it's implemented as a hidden property on the object (which is
    // hidden from JSON.stringify() and test.deepEqual().

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
export function intrinsicEngine(x: any): IProvisioningEngine | undefined {
    return x[INTRINSIC_VALUE_PROPERTY];
}

/**
 * The hidden marker property that marks an object as an engine-intrinsic value.
 */
const INTRINSIC_VALUE_PROPERTY = '__intrinsicValue__';

/**
 * Combine resolved fragments using the appropriate engine.
 *
 * Resolves the result.
 */
export function combineStringFragments(fragments: StringFragment[]): any {
    simplifyFragments(fragments);

    if (fragments.length === 0) { return ''; }
    if (fragments.length === 1) { return fragments[0].value; }

    const engines: IProvisioningEngine[] = fragments.map(f => intrinsicEngine(f.value)).filter(x => x !== undefined) as any;

    // Two reasons to look at engine names here instead of object identity:
    // 1) So we can display a better error message
    // 2) If the library gets loaded multiple times, the same engine will be instantiated
    // multiple times and so the objects will compare as different, even though they all
    // do the same, and any one of them would be fine.
    const engineNames = Array.from(new Set<string>(engines.map(e => e.engineName)));

    if (engines.length === 0) {
        throw new Error('Should not happen; no intrinsics found in StringFragment list.');
    }
    if (engineNames.length > 1) {
        throw new Error(`Combining different engines in one string fragment: ${engineNames.join(', ')}`);
    }

    return resolve(engines[0].combineStringFragments(fragments));
}

/**
 * Combine adjacent string literals in the fragment list
 *
 * List is modified in-place.
 */
function simplifyFragments(fragments: StringFragment[]) {
    let i = 0;
    while (i < fragments.length - 1) {
        if (fragments[i].source === FragmentSource.Literal && fragments[i + 1].source === FragmentSource.Literal) {
            fragments[i].value += fragments[i + 1].value;
            fragments.splice(i + 1, 1);
        } else {
            i++;
        }
    }
}