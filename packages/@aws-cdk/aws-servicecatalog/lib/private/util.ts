import * as crypto from 'crypto';

/**
 * Generates a unique hash identfifer using SHA256 encryption algorithm
 */
export function getIdentifier(...ids: string[]): string {
  const hashLength = 12;
  const sha256 = crypto.createHash('sha256');
  ids.map(val => sha256.update(val));
  return sha256.digest('hex').slice(0, hashLength);
}
