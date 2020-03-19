import * as crypto from 'crypto';

export function hashObject(obj: any) {

    function filterDocStrings(name: string, value: string) {
      if (name) {
        return value;
      }
      return "";
    }

    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(obj, filterDocStrings));
    return `${hash.digest('hex')}`;

  }
