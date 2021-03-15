import { Duration, SecretValue, Token } from '@aws-cdk/core';
import { BaseLogDriverProps } from './base-log-driver';

/**
 * Remove undefined values from a dictionary
 */
export function removeEmpty<T>(x: { [key: string]: (T | undefined | string) }): { [key: string]: string } {
  for (const key of Object.keys(x)) {
    if (x[key] === undefined) {
      delete x[key];
    }
  }
  return x as any;
}
