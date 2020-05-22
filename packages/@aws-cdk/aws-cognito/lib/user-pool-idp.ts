import { Construct, IResource } from '@aws-cdk/core';
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
 * Options to integrate with the various social identity providers.
 */
export class UserPoolIdentityProvider {
  /**
   * Federate with 'Facebook Login'
   * @see https://developers.facebook.com/docs/facebook-login/
   */
  public static facebook(scope: Construct, id: string, options: UserPoolIdentityProviderFacebookProps) {
    return new UserPoolIdentityProviderFacebook(scope, id, options);
  }

  /**
   * Federate with 'Login with Amazon'
   * @see https://developer.amazon.com/apps-and-games/login-with-amazon
   */
  public static amazon(scope: Construct, id: string, options: UserPoolIdentityProviderAmazonProps) {
    return new UserPoolIdentityProviderAmazon(scope, id, options);
  }

  private constructor() {}
}