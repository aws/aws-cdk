import * as crypto from 'crypto';

export function hashObject(obj: any) {

    function filterDocStrings(name: string, value: string) {
      return value;
    }

    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(obj, filterDocStrings));
    return `${hash.digest('hex')}`;

  }
