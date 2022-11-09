import * as crypto from 'crypto';

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
