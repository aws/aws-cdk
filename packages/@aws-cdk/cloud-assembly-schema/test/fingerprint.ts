import * as crypto from 'crypto';

export function hashObject(obj: any) {

    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(obj));
    return `${hash.digest('hex')}`;

  }
