/**
 * Mark a given object as a provisioning engine-intrinsic value.
 *
 * Any value that has been marked as intrinsic to a provisioning engine
 * will escape all further type checks and attempts to manipulate, and be
 * passed on as-is to the final provisioning engine.
 *
 * Note that this is separate from a Token: a Token represents a lazy value.
 * The result of evaluating a Token is a value, which may or may not be an
 * engine intrinsic value. If you want to combine the two, see `IntrinsicToken`.
 */
export function markAsIntrinsic(x: any, engine: string): any {
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
export function intrinsicEngine(x: any): string | undefined {
    return x[INTRINSIC_VALUE_PROPERTY];
}

/**
 * The hidden marker property that marks an object as an engine-intrinsic value.
 */
const INTRINSIC_VALUE_PROPERTY = '__intrinsicValue__';