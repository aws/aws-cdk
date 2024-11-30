import * as crypto from 'crypto';

export function getHash(stringToHash: string): string {
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  const truncatedHash = hash.substring(0, 5).toUpperCase();
  return truncatedHash;
}

export function stringifyObjects(...objects: any[]): string {
  const combinedObject = Object.assign({}, ...objects);
  return JSON.stringify(combinedObject);
}
