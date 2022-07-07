import { Fn } from '@aws-cdk/core';

/**
 * Wrap a string in `Fn.sub`, but return the same `Fn.sub` value for the same string
 *
 * (If we don't do this, we can't dedupe the tokenified `Fn.sub` values.
 */
export class CachedFnSub {
  private cache = new Map<string, string>();

  public fnSub(x: string) {
    const existing = this.cache.get(x);
    if (existing) {
      return existing;
    }

    const ret = Fn.sub(x);
    this.cache.set(x, ret);
    return ret;
  }
}