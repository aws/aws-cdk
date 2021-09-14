/**
 * Jest/Nodeunit compatibility shim
 *
 * Use this to mass-convert Nodeunit tests to Jest tests.
 */
/**
 * Compatibility shim test
 */
export declare class Test {
    private readonly cb;
    constructor(cb: () => void);
    equal(actual: any, expected: any, _message?: string): void;
    notEqual(actual: any, expected: any, _message?: string): void;
    equals(actual: any, expected: any, _message?: string): void;
    strictEqual(actual: any, expected: any, _message?: string): void;
    deepEqual(actual: any, expected: any, _message?: string): void;
    notDeepEqual(actual: any, expected: any, _message?: string): void;
    ok(actual: any, _message?: string): void;
    same(actual: any, expected: any): void;
    throws(block: () => any, error?: string | RegExp | ErrorConstructor, _message?: string): void;
    doesNotThrow(block: () => any, error?: string | RegExp | ErrorConstructor, _message?: string): void;
    done(): void;
}
export declare function nodeunitShim(exports: Record<string, any>): void;
declare type ErrorConstructor = new (...args: any[]) => Error;
export {};
