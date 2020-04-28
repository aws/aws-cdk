import * as crypto from 'crypto';

export function contentHash(data: string | Buffer | DataView) {
  return crypto.createHash('sha256').update(data).digest('hex');
}