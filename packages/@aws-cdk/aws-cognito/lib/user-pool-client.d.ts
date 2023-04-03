import { IResource, Resource, Duration, SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IUserPool } from './user-pool';
import { ClientAttributes } from './user-pool-attr';
import { IUserPoolResourceServer, ResourceServerScope } from './user-pool-resource-server';
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
}
/**
 * OAuth settings to configure the interaction between the app and this client.
 */
export interface OAuthSettings {
    /**
     * OAuth flows that are allowed with this client.
     * @see - the 'Allowed OAuth Flows' section at https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-idp-settings.html
     * @default {authorizationCodeGrant:true,implicitCodeGrant:true}
     */
    readonly flows?: OAuthFlows;
    /**
     * List of allowed redirect URLs for the identity providers.
     * @default - ['https://example.com'] if either authorizationCodeGrant or implicitCodeGrant flows are enabled, no callback URLs otherwise.
     */
    readonly callbackUrls?: string[];
    /**
     * List of allowed logout URLs for the identity providers.
     * @default - no logout URLs
     */
    readonly logoutUrls?: string[];
    /**
     * OAuth scopes that are allowed with this client.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-idp-settings.html
     * @default [OAuthScope.PHONE,OAuthScope.EMAIL,OAuthScope.OPENID,OAuthScope.PROFILE,OAuthScope.COGNITO_ADMIN]
     */
    readonly scopes?: OAuthScope[];
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
export declare class OAuthScope {
    /**
     * Grants access to the 'phone_number' and 'phone_number_verified' claims.
     * Automatically includes access to `OAuthScope.OPENID`.
     */
    static readonly PHONE: OAuthScope;
    /**
     * Grants access to the 'email' and 'email_verified' claims.
     * Automatically includes access to `OAuthScope.OPENID`.
     */
    static readonly EMAIL: OAuthScope;
    /**
     * Returns all user attributes in the ID token that are readable by the client
     */
    static readonly OPENID: OAuthScope;
    /**
     * Grants access to all user attributes that are readable by the client
     * Automatically includes access to `OAuthScope.OPENID`.
     */
    static readonly PROFILE: OAuthScope;
    /**
     * Grants access to Amazon Cognito User Pool API operations that require access tokens,
     * such as UpdateUserAttributes and VerifyUserAttribute.
     */
    static readonly COGNITO_ADMIN: OAuthScope;
    /**
     * Custom scope is one that you define for your own resource server in the Resource Servers.
     * The format is 'resource-server-identifier/scope'.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-define-resource-servers.html
     */
    static custom(name: string): OAuthScope;
    /**
     * Adds a custom scope that's tied to a resource server in your stack
     */
    static resourceServer(server: IUserPoolResourceServer, scope: ResourceServerScope): OAuthScope;
    /**
     * The name of this scope as recognized by CloudFormation.
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-allowedoauthscopes
     */
    readonly scopeName: string;
    private constructor();
}
/**
 * Identity providers supported by the UserPoolClient
 */
export declare class UserPoolClientIdentityProvider {
    /**
     * Allow users to sign in using 'Sign In With Apple'.
     * A `UserPoolIdentityProviderApple` must be attached to the user pool.
     */
    static readonly APPLE: UserPoolClientIdentityProvider;
    /**
     * Allow users to sign in using 'Facebook Login'.
     * A `UserPoolIdentityProviderFacebook` must be attached to the user pool.
     */
    static readonly FACEBOOK: UserPoolClientIdentityProvider;
    /**
     * Allow users to sign in using 'Google Login'.
     * A `UserPoolIdentityProviderGoogle` must be attached to the user pool.
     */
    static readonly GOOGLE: UserPoolClientIdentityProvider;
    /**
     * Allow users to sign in using 'Login With Amazon'.
     * A `UserPoolIdentityProviderAmazon` must be attached to the user pool.
     */
    static readonly AMAZON: UserPoolClientIdentityProvider;
    /**
     * Allow users to sign in directly as a user of the User Pool
     */
    static readonly COGNITO: UserPoolClientIdentityProvider;
    /**
     * Specify a provider not yet supported by the CDK.
     * @param name name of the identity provider as recognized by CloudFormation property `SupportedIdentityProviders`
     */
    static custom(name: string): UserPoolClientIdentityProvider;
    /** The name of the identity provider as recognized by CloudFormation property `SupportedIdentityProviders` */
    readonly name: string;
    private constructor();
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
     * Turns off all OAuth interactions for this client.
     * @default false
     */
    readonly disableOAuth?: boolean;
    /**
     * OAuth settings for this client to interact with the app.
     * An error is thrown when this is specified and `disableOAuth` is set.
     * @default - see defaults in `OAuthSettings`. meaningless if `disableOAuth` is set.
     */
    readonly oAuth?: OAuthSettings;
    /**
     * Cognito creates a session token for each API request in an authentication flow.
     * AuthSessionValidity is the duration, in minutes, of that session token.
     * see defaults in `AuthSessionValidity`. Valid duration is from 3 to 15 minutes.
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-authsessionvalidity
     * @default - Duration.minutes(3)
     */
    readonly authSessionValidity?: Duration;
    /**
     * Whether Cognito returns a UserNotFoundException exception when the
     * user does not exist in the user pool (false), or whether it returns
     * another type of error that doesn't reveal the user's absence.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-managing-errors.html
     * @default false
     */
    readonly preventUserExistenceErrors?: boolean;
    /**
     * The list of identity providers that users should be able to use to sign in using this client.
     *
     * @default - supports all identity providers that are registered with the user pool. If the user pool and/or
     * identity providers are imported, either specify this option explicitly or ensure that the identity providers are
     * registered with the user pool using the `UserPool.registerIdentityProvider()` API.
     */
    readonly supportedIdentityProviders?: UserPoolClientIdentityProvider[];
    /**
     * Validity of the ID token.
     * Values between 5 minutes and 1 day are valid. The duration can not be longer than the refresh token validity.
     * @see https://docs.aws.amazon.com/en_us/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html#amazon-cognito-user-pools-using-the-id-token
     * @default Duration.minutes(60)
     */
    readonly idTokenValidity?: Duration;
    /**
     * Validity of the refresh token.
     * Values between 60 minutes and 10 years are valid.
     * @see https://docs.aws.amazon.com/en_us/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html#amazon-cognito-user-pools-using-the-refresh-token
     * @default Duration.days(30)
     */
    readonly refreshTokenValidity?: Duration;
    /**
     * Validity of the access token.
     * Values between 5 minutes and 1 day are valid. The duration can not be longer than the refresh token validity.
     * @see https://docs.aws.amazon.com/en_us/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html#amazon-cognito-user-pools-using-the-access-token
     * @default Duration.minutes(60)
     */
    readonly accessTokenValidity?: Duration;
    /**
     * The set of attributes this client will be able to read.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-attribute-permissions-and-scopes
     * @default - all standard and custom attributes
     */
    readonly readAttributes?: ClientAttributes;
    /**
     * The set of attributes this client will be able to write.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-attribute-permissions-and-scopes
     * @default - all standard and custom attributes
     */
    readonly writeAttributes?: ClientAttributes;
    /**
     * Enable token revocation for this client.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/token-revocation.html#enable-token-revocation
     * @default true for new user pool clients
     */
    readonly enableTokenRevocation?: boolean;
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
    /**
     * The generated client secret. Only available if the "generateSecret" props is set to true
     * @attribute
     */
    readonly userPoolClientSecret: SecretValue;
}
/**
 * Define a UserPool App Client
 */
export declare class UserPoolClient extends Resource implements IUserPoolClient {
    /**
     * Import a user pool client given its id.
     */
    static fromUserPoolClientId(scope: Construct, id: string, userPoolClientId: string): IUserPoolClient;
    readonly userPoolClientId: string;
    private _generateSecret?;
    private readonly userPool;
    private _userPoolClientSecret?;
    /**
     * The OAuth flows enabled for this client.
     */
    readonly oAuthFlows: OAuthFlows;
    private readonly _userPoolClientName?;
    constructor(scope: Construct, id: string, props: UserPoolClientProps);
    /**
     * The client name that was specified via the `userPoolClientName` property during initialization,
     * throws an error otherwise.
     */
    get userPoolClientName(): string;
    get userPoolClientSecret(): SecretValue;
    private configureAuthFlows;
    private configureOAuthFlows;
    private configureOAuthScopes;
    private configurePreventUserExistenceErrors;
    private configureIdentityProviders;
    private configureAuthSessionValidity;
    private configureTokenValidity;
    private validateDuration;
}
