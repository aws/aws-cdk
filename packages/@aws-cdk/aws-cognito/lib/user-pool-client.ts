import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnUserPoolClient } from './cognito.generated';
import { IUserPool } from './user-pool';

/**
 * Types of authentication flow
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow.html
 */
export interface AuthFlow {
  /**
   * Enable admin based user password authentication flow
   * @default false
   */
  readonly adminUserPassword?: boolean;

  /**
   * Enable custom authentication flow
   * @default false
   */
  readonly custom?: boolean;

  /**
   * Enable auth using username & password
   * @default false
   */
  readonly userPassword?: boolean;

  /**
   * Enable SRP based authentication
   * @default false
   */
  readonly userSrp?: boolean;

  /**
   * Enable authflow to refresh tokens
   * @default false
   */
  readonly refreshToken?: boolean;
}

/**
 * OAuth settings to configure the interaction between the app and this client.
 */
export interface OAuthSettings {

  /**
   * OAuth flows that are allowed with this client.
   * @see - the 'Allowed OAuth Flows' section at https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-idp-settings.html
   * @default - all OAuth flows disabled
   */
  readonly flows: OAuthFlows;

  /**
   * List of allowed redirect URLs for the identity providers.
   * @default - no callback URLs
   */
  readonly callbackUrls?: string[];

  /**
   * OAuth scopes that are allowed with this client.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-idp-settings.html
   * @default - no OAuth scopes are configured.
   */
  readonly scopes: OAuthScope[];
}

/**
 * Types of OAuth grant flows
 * @see - the 'Allowed OAuth Flows' section at https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-idp-settings.html
 */
export interface OAuthFlows {
  /**
   * Initiate an authorization code grant flow, which provides an authorization code as the response.
   * @default false
   */
  readonly authorizationCodeGrant?: boolean;

  /**
   * The client should get the access token and ID token directly.
   * @default false
   */
  readonly implicitCodeGrant?: boolean;

  /**
   * Client should get the access token and ID token from the token endpoint
   * using a combination of client and client_secret.
   * @default false
   */
  readonly clientCredentials?: boolean;
}

/**
 * OAuth scopes that are allowed with this client.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-idp-settings.html
 */
export class OAuthScope {
  /**
   * Grants access to the 'phone_number' and 'phone_number_verified' claims.
   * Automatically includes access to `OAuthScope.OPENID`.
   */
  public static readonly PHONE = new OAuthScope('phone');

  /**
   * Grants access to the 'email' and 'email_verified' claims.
   * Automatically includes access to `OAuthScope.OPENID`.
   */
  public static readonly EMAIL = new OAuthScope('email');

  /**
   * Returns all user attributes in the ID token that are readable by the client
   */
  public static readonly OPENID = new OAuthScope('openid');

  /**
   * Grants access to all user attributes that are readable by the client
   * Automatically includes access to `OAuthScope.OPENID`.
   */
  public static readonly PROFILE = new OAuthScope('profile');

  /**
   * Grants access to Amazon Cognito User Pool API operations that require access tokens,
   * such as UpdateUserAttributes and VerifyUserAttribute.
   */
  public static readonly COGNITO_ADMIN = new OAuthScope('aws.cognito.signin.user.admin');

  /**
   * Custom scope is one that you define for your own resource server in the Resource Servers.
   * The format is 'resource-server-identifier/scope'.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-define-resource-servers.html
   */
  public static custom(name: string) {
    return new OAuthScope(name);
  }

  // tslint:disable:max-line-length
  /**
   * The name of this scope as recognized by CloudFormation.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-allowedoauthscopes
   */
  // tslint:enable:max-line-length
  public readonly scopeName: string;

  private constructor(scopeName: string) {
    this.scopeName = scopeName;
  }
}

/**
 * Options to create a UserPoolClient
 */
export interface UserPoolClientOptions {
  /**
   * Name of the application client
   * @default - cloudformation generated name
   */
  readonly userPoolClientName?: string;

  /**
   * Whether to generate a client secret
   * @default false
   */
  readonly generateSecret?: boolean;

  /**
   * The set of OAuth authentication flows to enable on the client
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow.html
   * @default - all auth flows disabled
   */
  readonly authFlows?: AuthFlow;

  /**
   * OAuth settings for this to client to interact with the app.
   * @default - see defaults in `OAuthSettings`
   */
  readonly oAuth?: OAuthSettings;
}

/**
 * Properties for the UserPoolClient construct
 */
export interface UserPoolClientProps extends UserPoolClientOptions {
  /**
   * The UserPool resource this client will have access to
   */
  readonly userPool: IUserPool;
}

/**
 * Represents a Cognito user pool client.
 */
export interface IUserPoolClient extends IResource {
  /**
   * Name of the application client
   * @attribute
   */
  readonly userPoolClientId: string;
}

/**
 * Define a UserPool App Client
 */
export class UserPoolClient extends Resource implements IUserPoolClient {
  /**
   * Import a user pool client given its id.
   */
  public static fromUserPoolClientId(scope: Construct, id: string, userPoolClientId: string): IUserPoolClient {
    class Import extends Resource implements IUserPoolClient {
      public readonly userPoolClientId = userPoolClientId;
    }

    return new Import(scope, id);
  }

  public readonly userPoolClientId: string;
  private readonly _userPoolClientName?: string;

  /*
   * Note to implementers: Two CloudFormation return values Name and ClientSecret are part of the spec.
   * However, they have been explicity not implemented here. They are not documented in CloudFormation, and
   * CloudFormation returns the following the string when these two attributes are 'GetAtt' - "attribute not supported
   * at this time, please use the CLI or Console to retrieve this value".
   * Awaiting updates from CloudFormation.
   */

  constructor(scope: Construct, id: string, props: UserPoolClientProps) {
    super(scope, id);

    const resource = new CfnUserPoolClient(this, 'Resource', {
      clientName: props.userPoolClientName,
      generateSecret: props.generateSecret,
      userPoolId: props.userPool.userPoolId,
      explicitAuthFlows: this.configureAuthFlows(props),
      allowedOAuthFlows: this.configureOAuthFlows(props.oAuth),
      allowedOAuthScopes: this.configureOAuthScopes(props.oAuth),
      callbackUrLs: (props.oAuth?.callbackUrls && props.oAuth?.callbackUrls.length > 0) ? props.oAuth?.callbackUrls : undefined,
      allowedOAuthFlowsUserPoolClient: props.oAuth ? true : undefined,
    });

    this.userPoolClientId = resource.ref;
    this._userPoolClientName = props.userPoolClientName;
  }

  /**
   * The client name that was specified via the `userPoolClientName` property during initialization,
   * throws an error otherwise.
   */
  public get userPoolClientName(): string {
    if (this._userPoolClientName === undefined) {
      throw new Error('userPoolClientName is available only if specified on the UserPoolClient during initialization');
    }
    return this._userPoolClientName;
  }

  private configureAuthFlows(props: UserPoolClientProps): string[] | undefined {
    const authFlows: string[] = [];
    if (props.authFlows?.userPassword) { authFlows.push('ALLOW_USER_PASSWORD_AUTH'); }
    if (props.authFlows?.adminUserPassword) { authFlows.push('ALLOW_ADMIN_USER_PASSWORD_AUTH'); }
    if (props.authFlows?.custom) { authFlows.push('ALLOW_CUSTOM_AUTH'); }
    if (props.authFlows?.userSrp) { authFlows.push('ALLOW_USER_SRP_AUTH'); }
    if (props.authFlows?.refreshToken) { authFlows.push('ALLOW_REFRESH_TOKEN_AUTH'); }

    if (authFlows.length === 0) {
      return undefined;
    }
    return authFlows;
  }

  private configureOAuthFlows(oAuth?: OAuthSettings): string[] | undefined {
    if (oAuth?.flows.authorizationCodeGrant || oAuth?.flows.implicitCodeGrant) {
      if (oAuth?.callbackUrls === undefined || oAuth?.callbackUrls.length === 0) {
        throw new Error('callbackUrl must be specified when codeGrant or implicitGrant OAuth flows are enabled.');
      }
      if (oAuth?.flows.clientCredentials) {
        throw new Error('clientCredentials OAuth flow cannot be selected along with codeGrant or implicitGrant.');
      }
    }

    const oAuthFlows: string[] = [];
    if (oAuth?.flows.clientCredentials) { oAuthFlows.push('client_credentials'); }
    if (oAuth?.flows.implicitCodeGrant) { oAuthFlows.push('implicit'); }
    if (oAuth?.flows.authorizationCodeGrant) { oAuthFlows.push('code'); }

    if (oAuthFlows.length === 0) {
      return undefined;
    }
    return oAuthFlows;
  }

  private configureOAuthScopes(oAuth?: OAuthSettings): string[] | undefined {
    const oAuthScopes = new Set(oAuth?.scopes.map((x) => x.scopeName));
    const autoOpenIdScopes = [ OAuthScope.PHONE, OAuthScope.EMAIL, OAuthScope.PROFILE ];
    if (autoOpenIdScopes.reduce((agg, s) => agg || oAuthScopes.has(s.scopeName), false)) {
      oAuthScopes.add(OAuthScope.OPENID.scopeName);
    }
    if (oAuthScopes.size > 0) {
      return Array.from(oAuthScopes);
    }
    return undefined;
  }
}
