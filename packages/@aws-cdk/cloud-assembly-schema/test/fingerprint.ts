import * as crypto from 'crypto';

export function hashObject(obj: any) {

  const docStringFields = [
    'description'
  ];

  function filterDocStrings(name: string, value: any) {
    if (docStringFields.includes(name) && typeof(value) === 'string') {
      return "";
    }
    return value;
  }

  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(obj, filterDocStrings));
  return `${hash.digest('hex')}`;

}
