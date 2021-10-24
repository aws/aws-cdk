import { PackageJson } from './packagejson';
/**
 * Expect a particular JSON key to be a given value
 */
export declare function expectJSON(ruleName: string, pkg: PackageJson, jsonPath: string, expected: any, ignore?: RegExp, caseInsensitive?: boolean): void;
/**
 * Export a package-level file to contain a given line
 */
export declare function fileShouldContain(ruleName: string, pkg: PackageJson, fileName: string, ...lines: string[]): void;
export declare function fileShouldNotContain(ruleName: string, pkg: PackageJson, fileName: string, ...lines: string[]): void;
/**
 * Export a package-level file to contain specific content
 */
export declare function fileShouldBe(ruleName: string, pkg: PackageJson, fileName: string, content: string): void;
/**
 * Export a package-level file to contain specific content
 */
export declare function fileShouldBeginWith(ruleName: string, pkg: PackageJson, fileName: string, ...lines: string[]): void;
/**
 * Enforce a dev dependency
 */
export declare function expectDevDependency(ruleName: string, pkg: PackageJson, packageName: string, version: string): void;
/**
 * Return whether the given value is an object
 *
 * Even though arrays technically are objects, we usually want to treat them differently,
 * so we return false in those cases.
 */
export declare function isObject(x: any): boolean;
/**
 * Deep get a value from a tree of nested objects
 *
 * Returns undefined if any part of the path was unset or
 * not an object.
 */
export declare function deepGet(x: any, jsonPath: string[]): any;
/**
 * Deep set a value in a tree of nested objects
 *
 * Throws an error if any part of the path is not an object.
 */
export declare function deepSet(x: any, jsonPath: string[], value: any): void;
export declare function findUpward(dir: string, pred: (x: string) => boolean): string | undefined;
export declare function monoRepoRoot(): string;
export declare function findInnerPackages(dir: string): IterableIterator<string>;
