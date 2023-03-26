import { IResolvable, IResolveContext } from '@aws-cdk/core';
export declare class JsonPathToken implements IResolvable {
    readonly path: string;
    static isJsonPathToken(x: IResolvable): x is JsonPathToken;
    readonly creationStack: string[];
    displayHint: string;
    constructor(path: string);
    resolve(_ctx: IResolveContext): any;
    toString(): string;
    toJSON(): string;
}
/**
 * Deep render a JSON object to expand JSON path fields, updating the key to end in '.$'
 */
export declare function renderObject(obj: object | undefined): object | undefined;
/**
 * Return all JSON paths that are used in the given structure
 */
export declare function findReferencedPaths(obj: object | undefined): Set<string>;
interface FieldHandlers {
    handleString(key: string, x: string): {
        [key: string]: string;
    };
    handleList(key: string, x: string[]): {
        [key: string]: string[] | string;
    };
    handleNumber(key: string, x: number): {
        [key: string]: number | string;
    };
    handleBoolean(key: string, x: boolean): {
        [key: string]: boolean;
    };
    handleResolvable(key: string, x: IResolvable): {
        [key: string]: any;
    };
}
export declare function recurseObject(obj: object | undefined, handlers: FieldHandlers, visited?: object[]): object | undefined;
/**
 * If the indicated string is an encoded JSON path, return the path
 *
 * Otherwise return undefined.
 */
export declare function jsonPathString(x: string): string | undefined;
export declare function jsonPathFromAny(x: any): string | undefined;
/**
 * Render the string or number value in a valid JSON Path expression.
 *
 * If the value is a Tokenized JSON path reference -- return the JSON path reference inside it.
 * If the value is a number -- convert it to string.
 * If the value is a string -- single-quote it.
 * Otherwise, throw errors.
 *
 * Call this function whenever you're building compound JSONPath expressions, in
 * order to avoid having tokens-in-tokens-in-tokens which become very hard to parse.
 */
export declare function renderInExpression(x: any): string;
export {};
