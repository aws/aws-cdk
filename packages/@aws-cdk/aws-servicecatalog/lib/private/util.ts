import * as crypto from 'crypto';

/**
 * Generates a unique hash identfifer
 */
export function getIdentifier(...ids: string[]): string {
  const md5 = crypto.createHash('md5');
  ids.map(val => md5.update(val));
  return md5.digest('hex');
}
