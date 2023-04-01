import { Construct } from 'constructs';
import { Alias, AliasOptions } from './alias';
import { IVersion } from './lambda-version';

export function addAlias(scope: Construct, version: IVersion, aliasName: string, options: AliasOptions = {}) {
  return new Alias(scope, `Alias${aliasName}`, {
    aliasName,
    version,
    ...options,
  });
}

/**
 * Map a function over an array and concatenate the results
 */
export function flatMap<T, U>(xs: T[], fn: ((x: T, i: number) => U[])): U[] {
  return flatten(xs.map(fn));
}

/**
 * Flatten a list of lists into a list of elements
 */
export function flatten<T>(xs: T[][]): T[] {
  return Array.prototype.concat.apply([], xs);
}
