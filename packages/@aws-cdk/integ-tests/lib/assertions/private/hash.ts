import { md5hash as coreMd5 } from '@aws-cdk/core/lib/helpers-internal';

export function md5hash(obj: any): string {
  if (!obj || (typeof(obj) === 'object' && Object.keys(obj).length === 0)) {
    throw new Error('Cannot compute md5 hash for falsy object');
  }
  return coreMd5(JSON.stringify(obj));
}
