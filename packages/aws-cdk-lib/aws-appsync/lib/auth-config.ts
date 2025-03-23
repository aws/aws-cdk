import { Construct } from 'constructs';
import { CfnApiKey } from './appsync.generated';
import { IUserPool } from '../../aws-cognito';
import { IFunction } from '../../aws-lambda';
import { Duration, Expiration } from '../../core';

/**
 * Auth provider settings for AppSync Event APIs
 *
 * @see https://docs.aws.amazon.com/appsync/latest/eventapi/configure-event-api-auth.html
 */
export interface AppSyncAuthProvider {
  /**
   * One of possible authorization types AppSync supports
   *
   * @default - `AuthorizationType.API_KEY`
   */
  readonly authorizationType: AppSyncAuthorizationType;
  /**
   * If authorizationType is `AuthorizationType.USER_POOL`, this option is required.
   * @default - none
   */
  readonly cognitoConfig?: AppSyncCognitoConfig;
  /**
   * If authorizationType is `AuthorizationType.API_KEY`, this option can be configured.
   * @default - name: 'DefaultAPIKey'
   */
  readonly apiKeyConfig?: AppSyncApiKeyConfig;
  /**
   * If authorizationType is `AuthorizationType.OIDC`, this option is required.
   * @default - none
   */
  readonly openIdConnectConfig?: AppSyncOpenIdConnectConfig;
  /**
   * If authorizationType is `AuthorizationType.LAMBDA`, this option is required.
   * @default - none
   */
  readonly lambdaAuthorizerConfig?: AppSyncLambdaAuthorizerConfig;
}

/**
 * enum with all possible values for AppSync authorization type
 */
export enum AppSyncAuthorizationType {
  /**
   * API Key authorization type
   */
  API_KEY = 'API_KEY',
  /**
   * AWS IAM authorization type. Can be used with Cognito Identity Pool federated credentials
   */
  IAM = 'AWS_IAM',
  /**
   * Cognito User Pool authorization type
   */
  USER_POOL = 'AMAZON_COGNITO_USER_POOLS',
  /**
   * OpenID Connect authorization type
   */
  OIDC = 'OPENID_CONNECT',
  /**
   * Lambda authorization type
   */
  LAMBDA = 'AWS_LAMBDA',
}

/**
 * Configuration for Cognito user-pools in AppSync for Api
 */
export interface AppSyncCognitoConfig {
  /**
   * The Cognito user pool to use as identity source
   */
  readonly userPool: IUserPool;
  /**
   * the optional app id regex
   *
   * @default -  None
   */
  readonly appIdClientRegex?: string;
}

/**
 * Configuration for API Key authorization in AppSync
 */
export interface AppSyncApiKeyConfig {
  /**
   * Unique name of the API Key
   * @default - 'DefaultAPIKey'
   */
  readonly name?: string;
  /**
   * Description of API key
   * @default - 'Default API Key created by CDK'
   */
  readonly description?: string;

  /**
   * The time from creation time after which the API key expires.
   * It must be a minimum of 1 day and a maximum of 365 days from date of creation.
   * Rounded down to the nearest hour.
   *
   * @default - 7 days rounded down to nearest hour
   */
  readonly expires?: Expiration;
}

/**
 * Configuration for OpenID Connect authorization in AppSync
 */
export interface AppSyncOpenIdConnectConfig {
  /**
   * The number of milliseconds an OIDC token is valid after being authenticated by OIDC provider.
   * `auth_time` claim in OIDC token is required for this validation to work.
   * @default - no validation
   */
  readonly tokenExpiryFromAuth?: number;
  /**
   * The number of milliseconds an OIDC token is valid after being issued to a user.
   * This validation uses `iat` claim of OIDC token.
   * @default - no validation
   */
  readonly tokenExpiryFromIssue?: number;
  /**
   * The client identifier of the Relying party at the OpenID identity provider.
   * A regular expression can be specified so AppSync can validate against multiple client identifiers at a time.
   * @example - 'ABCD|CDEF' // where ABCD and CDEF are two different clientId
   * @default - * (All)
   */
  readonly clientId?: string;
  /**
   * The issuer for the OIDC configuration. The issuer returned by discovery must exactly match the value of `iss` in the OIDC token.
   */
  readonly oidcProvider: string;
}

/**
 * Configuration for Lambda authorization in AppSync. Note that you can only have a single AWS Lambda function configured to authorize your API.
 */
export interface AppSyncLambdaAuthorizerConfig {
  /**
   * The authorizer lambda function.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-lambdaauthorizerconfig.html
   */
  readonly handler: IFunction;

  /**
   * How long the results are cached.
   * Disable caching by setting this to 0.
   *
   * @default Duration.minutes(5)
   */
  readonly resultsCacheTtl?: Duration;

  /**
   * A regular expression for validation of tokens before the Lambda function is called.
   *
   * @default - no regex filter will be applied.
   */
  readonly validationRegex?: string;
}

/**
 * Exposes methods for defining authorization config for AppSync APIs
 */
export interface IAppSyncAuthConfig {
  /**
   * Set up OIDC Authorization configuration for AppSync APIs
   */
  setupOpenIdConnectConfig(config?: AppSyncOpenIdConnectConfig): any;

  /**
   * Set up Cognito Authorization configuration for AppSync APIs
   */
  setupCognitoConfig(config?: AppSyncCognitoConfig): any;

  /**
   * Set up Lambda Authorization configuration AppSync APIs
   */
  setupLambdaAuthorizerConfig(config?: AppSyncLambdaAuthorizerConfig): any;
}

/**
 * Create an API Key for GraphQL APIs and Event APIs
 */
export function createAPIKey(scope: Construct, apiId: string, config?: AppSyncApiKeyConfig) {
  if (config?.expires?.isBefore(Duration.days(1)) || config?.expires?.isAfter(Duration.days(365))) {
    throw Error('API key expiration must be between 1 and 365 days.');
  }
  const expires = config?.expires ? config?.expires.toEpoch() : undefined;
  return new CfnApiKey(scope, `${config?.name || 'Default'}ApiKey`, {
    expires,
    description: config?.description,
    apiId: apiId,
  });
}
