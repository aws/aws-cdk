import { Construct } from 'constructs';
import { IResource, Resource } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { IUserPoolIdentityProviderRef, UserPoolIdentityProviderReference } from '../../interfaces/generated/aws-cognito-interfaces.generated';

export type { IUserPoolIdentityProviderRef, UserPoolIdentityProviderReference };

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
        throw new ValidationError('userPoolIdentityProviderRef is not available on imported UserPoolIdentityProvider. Use UserPoolIdentityProvider.fromUserPoolIdentityProviderAttributes() instead.', this);
      }
    }

    return new Import(scope, id);
  }

  private constructor() {}
}
