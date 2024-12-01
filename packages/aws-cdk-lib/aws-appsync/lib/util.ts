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
