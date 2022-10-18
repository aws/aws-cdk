import * as crypto from 'crypto';
import * as cdk from '@aws-cdk/core';

/**
 * Generates a hash from the provided string for the purposes of avoiding construct ID collision
 * for models with multiple distinct sets of model data.
 * @param s A string for which to generate a hash
 * @returns A hex string representing the hash of the provided string
 */
export function hashcode(s: string): string {
  const hash = crypto.createHash('md5');
  hash.update(s);
  return hash.digest('hex');
}

/**
 * Whether two strings probably contain the same environment dimension (region or account).
 *
 * Used to compare either accounts or regions, and also returns true if both
 * are unresolved (in which case both are expted to be "current region" or "current account").
 * @param dim1 The first dimension to compare
 * @param dim2 The second dimension to compare
 */
export function sameEnvDimension(dim1: string, dim2: string): boolean {
  return [cdk.TokenComparison.SAME, cdk.TokenComparison.BOTH_UNRESOLVED].includes(cdk.Token.compareStrings(dim1, dim2));
}
