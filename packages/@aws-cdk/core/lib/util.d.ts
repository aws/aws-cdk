import { IConstruct } from 'constructs';
import { Intrinsic } from './private/intrinsic';
import { IPostProcessor, IResolveContext } from './resolvable';
import { Stack } from './stack';
/**
 * Given an object, converts all keys to PascalCase given they are currently in camel case.
 * @param obj The object.
 */
export declare function capitalizePropertyNames(construct: IConstruct, obj: any): any;
/**
 * Turns empty arrays/objects to undefined (after evaluating tokens).
 */
export declare function ignoreEmpty(obj: any): any;
/**
 * Returns a copy of `obj` without `undefined` (or `null`) values in maps or arrays.
 */
export declare function filterUndefined(obj: any): any;
/**
 * A Token that applies a function AFTER resolve resolution
 */
export declare class PostResolveToken extends Intrinsic implements IPostProcessor {
    private readonly processor;
    constructor(value: any, processor: (x: any) => any);
    resolve(context: IResolveContext): any;
    postProcess(o: any, _context: IResolveContext): any;
}
/**
 * @returns the list of stacks that lead from the top-level stack (non-nested) all the way to a nested stack.
 */
export declare function pathToTopLevelStack(s: Stack): Stack[];
/**
 * Given two arrays, returns the last common element or `undefined` if there
 * isn't (arrays are foreign).
 */
export declare function findLastCommonElement<T>(path1: T[], path2: T[]): T | undefined;
export declare function undefinedIfAllValuesAreEmpty(object: object): object | undefined;
