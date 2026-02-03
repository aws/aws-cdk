import type { Construct } from 'constructs';
import type { IResource } from '../../core';
import { Resource } from '../../core';
import { UnscopedValidationError } from '../../core/lib/errors';
import type { IUserPoolIdentityProviderRef, UserPoolIdentityProviderReference } from '../../interfaces/generated/aws-cognito-interfaces.generated';

/**
 * Represents a UserPoolIdentityProvider
 */
export interface IUserPoolIdentityProvider extends IResource, IUserPoolIdentityProviderRef {
  /**
   * The primary identifier of this identity provider
   * @attribute
   */
  readonly providerName: string;
}

/**
 * User pool third-party identity providers
 */
export class UserPoolIdentityProvider {
  /**
   * Import an existing UserPoolIdentityProvider
   */
  public static fromProviderName(scope: Construct, id: string, providerName: string): IUserPoolIdentityProvider {
    class Import extends Resource implements IUserPoolIdentityProvider {
      public readonly providerName: string = providerName;

      public get userPoolIdentityProviderRef(): UserPoolIdentityProviderReference {
        return {
          providerName: providerName,
          get userPoolId(): string {
            throw new UnscopedValidationError('userPoolId is not available on imported UserPoolIdentityProvider.');
          },
        };
      }
    }

    return new Import(scope, id);
  }

  private constructor() {}
}
