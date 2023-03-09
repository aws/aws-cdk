import * as cdk from '@aws-cdk/core';
import { md5hash } from '@aws-cdk/core/lib/helpers-internal';

/**
 * Generates a hash from the provided string for the purposes of avoiding construct ID collision
 * for models with multiple distinct sets of model data.
 * @param s A string for which to generate a hash
 * @returns A hex string representing the hash of the provided string
 */
export function hashcode(s: string): string {
  return md5hash(s);
}

/**
 * Whether two strings probably contain the same environment attribute (region or account).
 *
 * Used to compare either accounts or regions, and also returns true if both
 * are unresolved (in which case both are expected to be "current region" or "current account").
 * @param attr1 The first attribute to compare
 * @param attr2 The second attribute to compare
 */
export function sameEnv(attr1: string, attr2: string): boolean {
  return [cdk.TokenComparison.SAME, cdk.TokenComparison.BOTH_UNRESOLVED].includes(cdk.Token.compareStrings(attr1, attr2));
}
