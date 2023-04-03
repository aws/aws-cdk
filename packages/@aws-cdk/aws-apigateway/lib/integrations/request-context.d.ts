/**
 * Configure what must be included in the `requestContext`
 *
 * More details can be found at mapping templates documentation.
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
 */
export interface RequestContext {
    /**
     * Represents the information of $context.identity.accountId
     *
     * Whether the AWS account of the API owner should be included in the request context
     * @default false
     */
    readonly accountId?: boolean;
    /**
     * Represents the information of $context.apiId
     *
     * Whether the identifier API Gateway assigns to your API should be included in the request context.
     * @default false
     */
    readonly apiId?: boolean;
    /**
     * Represents the information of $context.identity.apiKey
     *
     * Whether the API key associated with the request should be included in request context.
     * @default false
     */
    readonly apiKey?: boolean;
    /**
     * Represents the information of $context.authorizer.principalId
     *
     * Whether the principal user identifier associated with the token sent by the client and returned
     * from an API Gateway Lambda authorizer should be included in the request context.
     * @default false
     */
    readonly authorizerPrincipalId?: boolean;
    /**
     * Represents the information of $context.identity.caller
     *
     * Whether the principal identifier of the caller that signed the request should be included in the request context.
     * Supported for resources that use IAM authorization.
     * @default false
     */
    readonly caller?: boolean;
    /**
     * Represents the information of $context.identity.cognitoAuthenticationProvider
     *
     * Whether the list of the Amazon Cognito authentication providers used by the caller making the request should be included in the request context.
     * Available only if the request was signed with Amazon Cognito credentials.
     * @default false
     */
    readonly cognitoAuthenticationProvider?: boolean;
    /**
     * Represents the information of $context.identity.cognitoAuthenticationType
     *
     * Whether the Amazon Cognito authentication type of the caller making the request should be included in the request context.
     * Available only if the request was signed with Amazon Cognito credentials.
     * Possible values include authenticated for authenticated identities and unauthenticated for unauthenticated identities.
     * @default false
     */
    readonly cognitoAuthenticationType?: boolean;
    /**
     * Represents the information of $context.identity.cognitoIdentityId
     *
     * Whether the Amazon Cognito identity ID of the caller making the request should be included in the request context.
     * Available only if the request was signed with Amazon Cognito credentials.
     * @default false
     */
    readonly cognitoIdentityId?: boolean;
    /**
     * Represents the information of $context.identity.cognitoIdentityPoolId
     *
     * Whether the Amazon Cognito identity pool ID of the caller making the request should be included in the request context.
     * Available only if the request was signed with Amazon Cognito credentials.
     * @default false
     */
    readonly cognitoIdentityPoolId?: boolean;
    /**
     * Represents the information of $context.httpMethod
     *
     * Whether the HTTP method used should be included in the request context.
     * Valid values include: DELETE, GET, HEAD, OPTIONS, PATCH, POST, and PUT.
     * @default false
     */
    readonly httpMethod?: boolean;
    /**
     * Represents the information of $context.stage
     *
     * Whether the deployment stage of the API request should be included in the request context.
     * @default false
     */
    readonly stage?: boolean;
    /**
     * Represents the information of $context.identity.sourceIp
     *
     * Whether the source IP address of the immediate TCP connection making the request
     * to API Gateway endpoint should be included in the request context.
     * @default false
     */
    readonly sourceIp?: boolean;
    /**
     * Represents the information of $context.identity.user
     *
     * Whether the principal identifier of the user that will be authorized should be included in the request context.
     * Supported for resources that use IAM authorization.
     * @default false
     */
    readonly user?: boolean;
    /**
     * Represents the information of $context.identity.userAgent
     *
     * Whether the User-Agent header of the API caller should be included in the request context.
     * @default false
     */
    readonly userAgent?: boolean;
    /**
     * Represents the information of $context.identity.userArn
     *
     * Whether the Amazon Resource Name (ARN) of the effective user identified after authentication should be included in the request context.
     * @default false
     */
    readonly userArn?: boolean;
    /**
     * Represents the information of $context.requestId
     *
     * Whether the ID for the request should be included in the request context.
     * @default false
     */
    readonly requestId?: boolean;
    /**
     * Represents the information of $context.resourceId
     *
     * Whether the identifier that API Gateway assigns to your resource should be included in the request context.
     * @default false
     */
    readonly resourceId?: boolean;
    /**
     * Represents the information of $context.resourcePath
     *
     * Whether the path to the resource should be included in the request context.
     * @default false
     */
    readonly resourcePath?: boolean;
}
