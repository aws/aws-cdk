/**
 * This interface exposes what properties should be included in the `requestContext`
 *
 * More details can be found at mapping templates documentation
 *
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
 */
export interface RequestContext {
  /**
   * Represents the information of $context.identity.accountId
   *
   * The AWS account ID associated with the request.
   * @default false
   */
  readonly accountId?: boolean;

  /**
   * Represents the information of $context.apiId
   *
   * The identifier API Gateway assigns to your API.
   * @default false
   */
  readonly apiId?: boolean;

  /**
   * Represents the information of $context.identity.apiKey
   *
   * For API methods that require an API key, this variable is the API key associated with the method request.
   * For methods that don't require an API key, this variable is null.
   * @default false
   */
  readonly apiKey?: boolean;

  /**
   * Represents the information of $context.authorizer.principalId
   *
   * The principal user identification associated with the token sent by the client and returned from an API Gateway Lambda authorizer (formerly known as a custom authorizer)
   * @default false
   */
  readonly authorizerPrincipalId?: boolean;

  /**
   * Represents the information of $context.identity.caller
   *
   * The principal identifier of the caller that signed the request. Supported for resources that use IAM authorization.
   * @default false
   */
  readonly caller?: boolean;

  /**
   * Represents the information of $context.identity.cognitoAuthenticationProvider
   *
   * A comma-separated list of the Amazon Cognito authentication providers used by the caller making the request. Available only if the request was signed with Amazon Cognito credentials.
   * @default false
   */
  readonly cognitoAuthenticationProvider?: boolean;

  /**
   * Represents the information of $context.identity.cognitoAuthenticationType
   *
   * The Amazon Cognito authentication type of the caller making the request.
   * Available only if the request was signed with Amazon Cognito credentials.
   * Possible values include authenticated for authenticated identities and unauthenticated for unauthenticated identities.
   * @default false
   */
  readonly cognitoAuthenticationType?: boolean;

  /**
   * Represents the information of $context.identity.cognitoIdentityId
   *
   * The Amazon Cognito identity ID of the caller making the request. Available only if the request was signed with Amazon Cognito credentials.
   * @default false
   */
  readonly cognitoIdentityId?: boolean;

  /**
   * Represents the information of $context.identity.cognitoIdentityPoolId
   *
   * The Amazon Cognito identity pool ID of the caller making the request. Available only if the request was signed with Amazon Cognito credentials.
   * @default false
   */
  readonly cognitoIdentityPoolId?: boolean;

  /**
   * Represents the information of $context.httpMethod
   *
   * The HTTP method used. Valid values include: DELETE, GET, HEAD, OPTIONS, PATCH, POST, and PUT.
   * @default false
   */
  readonly httpMethod?: boolean;

  /**
   * Represents the information of $context.stage
   *
   * The deployment stage of the API request (for example, Beta or Prod).
   * @default false
   */
  readonly stage?: boolean;

  /**
   * Represents the information of $context.identity.sourceIp
   *
   * The source IP address of the immediate TCP connection making the request to API Gateway endpoint.
   * @default false
   */
  readonly sourceIp?: boolean;

  /**
   * Represents the information of $context.identity.user
   *
   * The principal identifier of the user that will be authorized against resource access. Supported for resources that use IAM authorization.
   * @default false
   */
  readonly user?: boolean;

  /**
   * Represents the information of $context.identity.userAgent
   *
   * The User-Agent header of the API caller.
   * @default false
   */
  readonly userAgent?: boolean;

  /**
   * Represents the information of $context.identity.userArn
   *
   * The Amazon Resource Name (ARN) of the effective user identified after authentication.
   * @default false
   */
  readonly userArn?: boolean;

  /**
   * Represents the information of $context.requestId
   *
   * An ID for the request. Clients can override this request ID.
   * @default false
   */
  readonly requestId?: boolean;

  /**
   * Represents the information of $context.resourceId
   *
   * The identifier that API Gateway assigns to your resource.
   * @default false
   */
  readonly resourceId?: boolean;

  /**
   * Represents the information of $context.resourcePath
   *
   * The path to your resource.
   * @default false
   */
  readonly resourcePath?: boolean;
}
