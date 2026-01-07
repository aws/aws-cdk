import { UnscopedValidationError } from '../../../core';
import { IUserPoolIdentityProviderRef, IUserPoolRef } from '../cognito.generated';
import { IUserPool } from '../user-pool';
import { IUserPoolIdentityProvider } from '../user-pool-idp';

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

export function isIUserPoolIdentityProvider(x: IUserPoolIdentityProviderRef): x is IUserPoolIdentityProvider {
  return !!(x as IUserPoolIdentityProvider).providerName;
}
