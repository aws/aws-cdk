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
    equal(a: any, b: any, _message?: string): void;
    notEqual(a: any, b: any, _message?: string): void;
    equals(a: any, b: any, _message?: string): void;
    strictEqual(a: any, b: any, _message?: string): void;
    deepEqual(a: any, b: any, _message?: string): void;
    notDeepEqual(a: any, b: any, _message?: string): void;
    ok(a: any, _message?: string): void;
    same(a: any, b: any): void;
    throws(block: () => any, error?: string | RegExp | ErrorConstructor, _message?: string): void;
    doesNotThrow(block: () => any, error?: string | RegExp | ErrorConstructor, _message?: string): void;
    done(): void;
}
export declare function nodeunitShim(exports: Record<string, any>): void;
declare type ErrorConstructor = new (...args: any[]) => Error;
export {};
