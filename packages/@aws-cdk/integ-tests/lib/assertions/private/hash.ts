import * as crypto from 'crypto';

export function md5hash(obj: any): string {
  if (!obj || (typeof(obj) === 'object' && Object.keys(obj).length === 0)) {
    throw new Error('Cannot compute md5 hash for falsy object');
  }
  const hash = crypto.createHash('md5');
  hash.update(JSON.stringify(obj));
  return hash.digest('hex');
}
