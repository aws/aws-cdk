/**
 * Request Context interface
 */
export interface RequestContext {
  /**
   * Account ID string
   * @default false
   */
  readonly accountId?: boolean;

  /**
   * Api ID string
   * @default false
   */
  readonly apiId?: boolean;

  /**
   * Api Key string
   * @default false
   */
  readonly apiKey?: boolean;

  /**
   * Authorizer Principal ID string
   * @default false
   */
  readonly authorizerPrincipalId?: boolean;

  /**
   * Caller string
   * @default false
   */
  readonly caller?: boolean;

  /**
   * Cognito Authentication Provider string
   * @default false
   */
  readonly cognitoAuthenticationProvider?: boolean;

  /**
   * Cognito Authentication Type string
   * @default false
   */
  readonly cognitoAuthenticationType?: boolean;

  /**
   * Cognito Identity ID string
   * @default false
   */
  readonly cognitoIdentityId?: boolean;

  /**
   * Cognito Identity Pool ID string
   * @default false
   */
  readonly cognitoIdentityPoolId?: boolean;

  /**
   * Http Method string
   * @default false
   */
  readonly httpMethod?: boolean;

  /**
   * Stage string
   * @default false
   */
  readonly stage?: boolean;

  /**
   * Source IP string
   * @default false
   */
  readonly sourceIp?: boolean;

  /**
   * User string
   * @default false
   */
  readonly user?: boolean;

  /**
   * User Agent string
   * @default false
   */
  readonly userAgent?: boolean;

  /**
   * User Arn string
   * @default false
   */
  readonly userArn?: boolean;

  /**
   * Request ID string
   * @default false
   */
  readonly requestId?: boolean;

  /**
   * Resource ID string
   * @default false
   */
  readonly resourceId?: boolean;

  /**
   * Resource Path string
   * @default false
   */
  readonly resourcePath?: boolean;
}
