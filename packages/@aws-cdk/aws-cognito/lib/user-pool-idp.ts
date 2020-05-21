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
 * Properties to initialize UserPoolFacebookIdentityProvider
 */
export interface UserPoolFacebookIdentityProviderProps {
  /**
   * The user pool to which this construct provides identities.
   */
  readonly userPool: IUserPool;

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
 * Represents a identity provider that integrates with 'Facebook Login'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export class UserPoolFacebookIdentityProvider extends Resource implements IUserPoolIdentityProvider {
  public readonly providerName: string;

  constructor(scope: Construct, id: string, props: UserPoolFacebookIdentityProviderProps) {
    super(scope, id);

    const scopes = props.scopes ?? [ 'public_profile' ];

    const resource = new CfnUserPoolIdentityProvider(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      providerName: 'Facebook', // must be 'Facebook' when the type is 'Facebook'
      providerType: 'Facebook',
      providerDetails: {
        client_id: props.clientId,
        client_secret: props.clientSecret,
        authorize_scopes: scopes.join(','),
        api_version: props.apiVersion,
      },
    });

    this.providerName = super.getResourceNameAttribute(resource.ref);
  }
}

/**
 * Properties to initialize UserPoolAmazonIdentityProvider
 */
export interface UserPoolAmazonIdentityProviderProps {
  /**
   * The user pool to which this construct provides identities.
   */
  readonly userPool: IUserPool;

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
 * Represents a identity provider that integrates with 'Login with Amazon'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export class UserPoolAmazonIdentityProvider extends Resource implements IUserPoolIdentityProvider {
  public readonly providerName: string;

  constructor(scope: Construct, id: string, props: UserPoolAmazonIdentityProviderProps) {
    super(scope, id);

    const scopes = props.scopes ?? [ 'profile' ];

    const resource = new CfnUserPoolIdentityProvider(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      providerName: 'LoginWithAmazon', // must be 'LoginWithAmazon' when the type is 'LoginWithAmazon'
      providerType: 'LoginWithAmazon',
      providerDetails: {
        client_id: props.clientId,
        client_secret: props.clientSecret,
        authorize_scopes: scopes.join(' '),
      },
    });

    this.providerName = super.getResourceNameAttribute(resource.ref);
  }
}

/**
 * Properties to initialize UserPoolAppleIdentityProvider
 */
export interface UserPoolAppleIdentityProviderProps {
  /**
   * The user pool to which this construct provides identities.
   */
  readonly userPool: IUserPool;

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
 * Represents a identity provider that integrates with 'Login with Amazon'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export class UserPoolAppleIdentityProvider extends Resource implements IUserPoolIdentityProvider {
  public readonly providerName: string;

  constructor(scope: Construct, id: string, props: UserPoolAppleIdentityProviderProps) {
    super(scope, id);

    const scopes = props.scopes ?? [ 'public_profile', 'email' ];

    const resource = new CfnUserPoolIdentityProvider(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      providerName: 'SignInWithApple', // must be 'SignInWithApple' when the type is 'SignInWithApple'
      providerType: 'SignInWithApple',
      providerDetails: {
        client_id: props.servicesId,
        team_id: props.teamId,
        key_id: props.keyId,
        private_key: props.privateKey,
        authorize_scopes: scopes.join(' '),
      },
    });

    this.providerName = super.getResourceNameAttribute(resource.ref);
  }
}

/**
 * Options to integrate with the various social identity providers.
 */
export class UserPoolIdentityProvider {
  /**
   * Federate with 'Facebook Login'
   * @see https://developers.facebook.com/docs/facebook-login/
   */
  public static facebook(scope: Construct, id: string, options: UserPoolFacebookIdentityProviderProps) {
    return new UserPoolFacebookIdentityProvider(scope, id, options);
  }

  /**
   * Federate with 'Login with Amazon'
   * @see https://developer.amazon.com/apps-and-games/login-with-amazon
   */
  public static amazon(scope: Construct, id: string, options: UserPoolAmazonIdentityProviderProps) {
    return new UserPoolAmazonIdentityProvider(scope, id, options);
  }

  /**
   * Federate with 'Sign in with Apple'
   * @see https://developer.apple.com/sign-in-with-apple/
   */
  public static apple(scope: Construct, id: string, options: UserPoolAppleIdentityProviderProps) {
    return new UserPoolAppleIdentityProvider(scope, id, options);
  }

  private constructor() {}
}