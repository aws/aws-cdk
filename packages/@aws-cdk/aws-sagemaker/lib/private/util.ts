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
