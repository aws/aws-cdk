import { Construct, IResource, Resource } from '@aws-cdk/core';
import {
  UserPoolIdentityProviderAmazon,
  UserPoolIdentityProviderAmazonProps,
  UserPoolIdentityProviderFacebook,
  UserPoolIdentityProviderFacebookProps,
} from './user-pool-idps';

/**
 * Represents a UserPoolIdentityProvider
 */
export interface IUserPoolIdentityProvider extends IResource {
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
    }

    return new Import(scope, id);
  }

  /**
   * Federate login with 'Login with Amazon'
   */
  public static amazon(scope: Construct, id: string, props: UserPoolIdentityProviderAmazonProps) {
    return new UserPoolIdentityProviderAmazon(scope, id, props);
  }

  /**
   * Federate login with 'Facebook Login'
   */
  public static facebook(scope: Construct, id: string, props: UserPoolIdentityProviderFacebookProps) {
    return new UserPoolIdentityProviderFacebook(scope, id, props);
  }

  private constructor() {}
}