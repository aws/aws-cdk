import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnUserPoolIdentityProvider } from './cognito.generated';
import { IUserPool } from './user-pool';

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
 * The options to create a new UserPoolIdentityProvider for a given UserPool.
 */
export interface UserPoolIdentityProviderOptions {
  /**
   * The name of this provider. This will be its primary identifier.
   */
  readonly userPoolIdentityProviderName: string;

  /**
   * Options to integrate with third party social identity providers such as Facebook, Google, Amazon and Apple.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-identity-provider.html#cognito-user-pools-facebook-provider
   */
  readonly socialIdentity: SocialIdentityProvider;
}

/**
 * The properties to initialize a new UserPoolIdentityProvider
 */
export interface UserPoolIdentityProviderProps extends UserPoolIdentityProviderOptions {
  /**
   * The user pool to whom this provider is attached to.
   */
  readonly userPool: IUserPool;
}

/**
 * Options to integrate with the various social identity providers.
 */
export class SocialIdentityProvider {
  /**
   * Federate with 'Facebook Login'
   * @see https://developers.facebook.com/docs/facebook-login/
   */
  public static facebook(options: FacebookProviderOptions) {
    const scopes = options.scopes ?? [ 'public_profile' ];
    return new SocialIdentityProvider('Facebook', {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      authorize_scopes: scopes.join(','),
      api_version: options.apiVersion,
    });
  }

  /**
   * Federate with 'Google Sign In'
   * @see https://developers.google.com/identity/
   */
  public static google(options: GoogleProviderOptions) {
    const scopes = options.scopes ?? [ 'profile', 'email', 'openid' ];
    return new SocialIdentityProvider('Google', {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      authorize_scopes: scopes.join(' '),
    });
  }

  /**
   * Federate with 'Login with Amazon'
   * @see https://developer.amazon.com/apps-and-games/login-with-amazon
   */
  public static amazon(options: AmazonProviderOptions) {
    const scopes = options.scopes ?? [ 'profile' ];
    return new SocialIdentityProvider('LoginWithAmazon', {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      authorize_scopes: scopes.join(' '),
    });
  }

  /**
   * Federate with 'Sign in with Apple'
   * @see https://developer.apple.com/sign-in-with-apple/
   */
  public static apple(options: AppleProviderOptions) {
    const scopes = options.scopes ?? [ 'public_profile', 'email' ];
    return new SocialIdentityProvider('SignInWithApple', {
      client_id: options.servicesId,
      team_id: options.teamId,
      key_id: options.keyId,
      private_key: options.privateKey,
      authorize_scopes: scopes.join(' '),
    });
  }

  /**
   * Custom configuration that is not yet supported by the CDK.
   */
  public static custom(providerType: string, providerDetails: { [key: string]: any }) {
    return new SocialIdentityProvider(providerType, providerDetails);
  }

  // tslint:disable:max-line-length
  /**
   * The type of the provider as recognized by CloudFormation
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-providertype
   */
  public readonly providerType: string;
  /**
   * The properties needed to connect to the provider as recognized by CloudFormation
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-providerdetails
   */
  public readonly providerDetails: { [key: string]: any };
  // tslint:enable

  private constructor(providerType: string, providerDetails: { [key: string]: any }) {
    this.providerType = providerType;
    this.providerDetails = providerDetails;
  }
}

/**
 * Options to integrate with 'Facebook Login'.
 */
export interface FacebookProviderOptions {
  /**
   * The client id recognized by Facebook APIs.
   */
  readonly clientId: string;
  /**
   * The client secret to be accompanied with clientUd for Facebook to authenticate the client.
   * @see https://developers.facebook.com/docs/facebook-login/security#appsecret
   */
  readonly clientSecret: string;
  /**
   * The list of facebook permissions to obtain for getting access to the Facebook profile.
   * @see https://developers.facebook.com/docs/facebook-login/permissions
   * @default [ public_profile ]
   */
  readonly scopes?: string[];
  /**
   * The Facebook API version to use
   * @default - to the oldest version supported by Facebook
   */
  readonly apiVersion?: string;
}

/**
 * Options to integrate with 'Google Sign in'.
 */
export interface GoogleProviderOptions {
  /**
   * The client id recognized by 'Google Sign in'.
   */
  readonly clientId: string;
  /**
   * The client secret to be accompanied with clientId for Google to authenticate the client.
   */
  readonly clientSecret: string;
  /**
   * The list of Google permissions to obtain for getting access to the Google profile.
   * @see https://developers.google.com/identity/protocols/oauth2/scopes
   * @default [ profile, email, openid ]
   */
  readonly scopes?: string[];
}

/**
 * Options to integrate with 'Login with Amazon'.
 */
export interface AmazonProviderOptions {
  /**
   * The client id recognized by 'Login with Amazon' APIs.
   * @see https://developer.amazon.com/docs/login-with-amazon/security-profile.html#client-identifier
   */
  readonly clientId: string;
  /**
   * The client secret to be accompanied with clientId for 'Login with Amazon' APIs to authenticate the client.
   * @see https://developer.amazon.com/docs/login-with-amazon/security-profile.html#client-identifier
   */
  readonly clientSecret: string;
  /**
   * The types of user profile data to obtain for the Amazon profile.
   * @see https://developer.amazon.com/docs/login-with-amazon/customer-profile.html
   * @default [ profile ]
   */
  readonly scopes?: string[];
}

/**
 * Options to integrate with 'Sign in with Apple'.
 */
export interface AppleProviderOptions {
  /**
   * The Services id received when the 'Sign in with Apple' client was created.
   */
  readonly servicesId: string;
  /**
   * The team id received when the 'Sign in with Apple' client was created.
   */
  readonly teamId: string;
  /**
   * The key id received when the 'Sign in with Apple' client was created.
   */
  readonly keyId: string;
  /**
   * The private key received when the 'Sign in with Apple' client was created.
   */
  readonly privateKey: string;
  /**
   * The types of user profile data to obtain for the Amazon profile.
   * @see https://developer.amazon.com/docs/login-with-amazon/customer-profile.html
   * @default [ public_profile, email ]
   */
  readonly scopes?: string[];
}

/**
 * Define a identity provider for a user pool.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-identity-provider.html
 */
export class UserPoolIdentityProvider extends Resource implements IUserPoolIdentityProvider {
  public readonly providerName: string;

  constructor(scope: Construct, id: string, props: UserPoolIdentityProviderProps) {
    super(scope, id, {
      physicalName: props.userPoolIdentityProviderName,
    });

    const resource = new CfnUserPoolIdentityProvider(this, 'Resource', {
      providerName: this.physicalName,
      userPoolId: props.userPool.userPoolId,
      providerType: props.socialIdentity.providerType,
      providerDetails: props.socialIdentity.providerDetails,
    });
    this.providerName = super.getResourceNameAttribute(resource.ref);
  }
}