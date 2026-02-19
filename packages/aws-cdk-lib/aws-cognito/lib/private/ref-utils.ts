import { UnscopedValidationError } from '../../../core';
import type { IUserPoolIdentityProviderRef, IUserPoolRef } from '../cognito.generated';
import type { IUserPool } from '../user-pool';
import type { IUserPoolIdentityProvider } from '../user-pool-idp';

/**
 * Converts an IUserPoolRef to IUserPool, validating that it implements the full interface
 */
export function toIUserPool(ref: IUserPoolRef): IUserPool {
  if (!isIUserPool(ref)) {
    throw new UnscopedValidationError(`'userPool' instance should implement IUserPool, but doesn't: ${ref.constructor.name}`);
  }
  return ref;
}

function isIUserPool(pool: IUserPoolRef): pool is IUserPool {
  return ('userPoolId' in pool && 'userPoolArn' in pool && 'userPoolProviderName' in pool);
}

export function isIUserPoolIdentityProvider(x: IUserPoolIdentityProviderRef): x is IUserPoolIdentityProvider {
  return 'providerName' in x;
}
