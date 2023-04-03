import { Construct } from 'constructs';
import { Alias, AliasOptions } from './alias';
import { IVersion } from './lambda-version';
export declare function addAlias(scope: Construct, version: IVersion, aliasName: string, options?: AliasOptions): Alias;
/**
 * Map a function over an array and concatenate the results
 */
export declare function flatMap<T, U>(xs: T[], fn: ((x: T, i: number) => U[])): U[];
/**
 * Flatten a list of lists into a list of elements
 */
export declare function flatten<T>(xs: T[][]): T[];
