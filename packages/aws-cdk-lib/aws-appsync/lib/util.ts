import { IUserPool } from '../../aws-cognito';
import { IRole } from '../../aws-iam';
import { IFunction } from '../../aws-lambda';
import { RetentionDays } from '../../aws-logs';
import { Duration, Expiration, IResolvable } from '../../core';

/**
 * enum with all possible values for AppSync authorization type
 */
export enum AuthorizationType {
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
 * log-level for fields in AppSync
 */
export enum FieldLogLevel {
  /**
   * Resolver logging is disabled
   */
  NONE = 'NONE',
  /**
   * Only Error messages appear in logs
   */
  ERROR = 'ERROR',
  /**
   * Info and Error messages appear in logs
   */
  INFO = 'INFO',
  /**
   * Debug, Info, and Error messages, appear in logs
   */
  DEBUG = 'DEBUG',
  /**
   * All messages (Debug, Error, Info, and Trace) appear in logs
   */
  ALL = 'ALL',
}
/**
 * Interface to specify default or additional authorization(s)
 */
export interface AuthorizationMode {
  /**
   * One of possible four values AppSync supports
   *
   * @see https://docs.aws.amazon.com/appsync/latest/devguide/security.html
   *
   * @default - `AuthorizationType.API_KEY`
   */
  readonly authorizationType: AuthorizationType;
  /**
   * If authorizationType is `AuthorizationType.USER_POOL`, this option is required.
   * @default - none
   */
  readonly userPoolConfig?: UserPoolConfig;
  /**
   * If authorizationType is `AuthorizationType.API_KEY`, this option can be configured.
   * @default - name: 'DefaultAPIKey' | description: 'Default API Key created by CDK'
   */
  readonly apiKeyConfig?: ApiKeyConfig;
  /**
   * If authorizationType is `AuthorizationType.OIDC`, this option is required.
   * @default - none
   */
  readonly openIdConnectConfig?: OpenIdConnectConfig;
  /**
   * If authorizationType is `AuthorizationType.LAMBDA`, this option is required.
   * @default - none
   */
  readonly lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
}

/**
 * enum with all possible values for Cognito user-pool default actions
 */
export enum UserPoolDefaultAction {
  /**
   * ALLOW access to API
   */
  ALLOW = 'ALLOW',
  /**
   * DENY access to API
   */
  DENY = 'DENY',
}

/**
 * Configuration for Cognito user-pools in AppSync
 */
export interface UserPoolConfig {
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
  /**
   * Default auth action
   *
   * @default ALLOW
   */
  readonly defaultAction?: UserPoolDefaultAction;
}

/**
 * Configuration for API Key authorization in AppSync
 */
export interface ApiKeyConfig {
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
export interface OpenIdConnectConfig {
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
export interface LambdaAuthorizerConfig {
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
 * Logging configuration for AppSync
 */
export interface LogConfig {
  /**
   * exclude verbose content
   *
   * @default false
   */
  readonly excludeVerboseContent?: boolean | IResolvable;
  /**
   * log level for fields
   *
   * @default - Use AppSync default
   */
  readonly fieldLogLevel?: FieldLogLevel;

  /**
   * The role for CloudWatch Logs
   *
   * @default - None
   */
  readonly role?: IRole;

  /**
  * The number of days log events are kept in CloudWatch Logs.
  * By default AppSync keeps the logs infinitely. When updating this property,
  * unsetting it doesn't remove the log retention policy.
  * To remove the retention policy, set the value to `INFINITE`
  *
  * @default RetentionDays.INFINITE
  */
  readonly retention?: RetentionDays;
}

