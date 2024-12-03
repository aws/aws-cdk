import * as crypto from 'crypto';

export function contentHash(data: string | Buffer | DataView) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * A stably sorted hash of an arbitrary JS object
 */
export function contentHashAny(value: unknown) {
  const ret = crypto.createHash('sha256');
  recurse(value);
  return ret.digest('hex');

  function recurse(x: unknown) {
    if (typeof x === 'string') {
      ret.update(x);
      return;
    }

    if (Array.isArray(x)) {
      ret.update('[');
      for (const e of x) {
        recurse(e);
        ret.update('||');
      }
      ret.update(']');
      return;
    }

    if (x && typeof x === 'object') {
      ret.update('{');
      for (const key of Object.keys(x).sort()) {
        ret.update(key);
        ret.update(':');
        recurse((x as any)[key]);
      }
      ret.update('}');
      return;
    }

    ret.update(`${x}${typeof x}`); // typeof to make sure hash('123') !== hash(123)
  }
}
