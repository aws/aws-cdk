import * as crypto from 'crypto';

export function hashObject(obj: any) {

    function filterDocStrings(name: string, value: any) {
      if (name === 'description' && typeof(value) === 'string') {
        return "";
      }
      return value;
    }

    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(obj, filterDocStrings));
    return `${hash.digest('hex')}`;

  }
