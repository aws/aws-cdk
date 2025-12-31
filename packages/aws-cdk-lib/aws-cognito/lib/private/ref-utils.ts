import { UnscopedValidationError } from '../../../core';
import { IUserPool, IUserPoolRef } from '../user-pool';

export type { IUserPoolRef };

/**
 * Converts an IUserPoolRef to IUserPool, validating that it implements the full interface
 */
export function toIUserPool(ref: IUserPoolRef): IUserPool {
  const pool = ref as any;
  if (typeof pool.userPoolId !== 'string' || typeof pool.userPoolArn !== 'string' || typeof pool.userPoolProviderName !== 'string') {
    throw new UnscopedValidationError(`'userPool' instance should implement IUserPool, but doesn't: ${ref.constructor.name}`);
  }
  return ref as IUserPool;
}
