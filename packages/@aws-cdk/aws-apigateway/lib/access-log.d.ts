import { ILogGroup } from '@aws-cdk/aws-logs';
import { IStage } from './stage';
/**
 * Access log destination for a RestApi Stage.
 */
export interface IAccessLogDestination {
    /**
     * Binds this destination to the RestApi Stage.
     */
    bind(stage: IStage): AccessLogDestinationConfig;
}
/**
 * Options when binding a log destination to a RestApi Stage.
 */
export interface AccessLogDestinationConfig {
    /**
     * The Amazon Resource Name (ARN) of the destination resource
     */
    readonly destinationArn: string;
}
/**
 * Use CloudWatch Logs as a custom access log destination for API Gateway.
 */
export declare class LogGroupLogDestination implements IAccessLogDestination {
    private readonly logGroup;
    constructor(logGroup: ILogGroup);
    /**
     * Binds this destination to the CloudWatch Logs.
     */
    bind(_stage: IStage): AccessLogDestinationConfig;
}
/**
 * $context variables that can be used to customize access log pattern.
 */
export declare class AccessLogField {
    /**
     * The API callers AWS account ID.
     * @deprecated Use `contextCallerAccountId` or `contextOwnerAccountId` instead
     */
    static contextAccountId(): string;
    /**
     * The API callers AWS account ID.
     */
    static contextCallerAccountId(): string;
    /**
     * The API owner's AWS account ID.
     */
    static contextOwnerAccountId(): string;
    /**
     * The identifier API Gateway assigns to your API.
     */
    static contextApiId(): string;
    /**
     * A property of the claims returned from the Amazon Cognito user pool after the method caller is successfully authenticated.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html
     *
     * @param property A property key of the claims.
     */
    static contextAuthorizerClaims(property: string): string;
    /**
     * The principal user identification associated with the token sent by the client and returned
     * from an API Gateway Lambda authorizer (formerly known as a custom authorizer).
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
     */
    static contextAuthorizerPrincipalId(): string;
    /**
     * The stringified value of the specified key-value pair of the `context` map returned from an API Gateway Lambda authorizer function.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
     * @param property key of the context map.
     */
    static contextAuthorizer(property: string): string;
    /**
     * The AWS endpoint's request ID.
     */
    static contextAwsEndpointRequestId(): string;
    /**
     * The full domain name used to invoke the API. This should be the same as the incoming `Host` header.
     */
    static contextDomainName(): string;
    /**
     * The first label of the `$context.domainName`. This is often used as a caller/customer identifier.
     */
    static contextDomainPrefix(): string;
    /**
     * A string containing an API Gateway error message.
     */
    static contextErrorMessage(): string;
    /**
     * The quoted value of $context.error.message, namely "$context.error.message".
     */
    static contextErrorMessageString(): string;
    /**
     * A type of GatewayResponse. This variable can only be used for simple variable substitution in a GatewayResponse body-mapping template,
     * which is not processed by the Velocity Template Language engine, and in access logging.
     *
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-logging.html
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/customize-gateway-responses.html
     */
    static contextErrorResponseType(): string;
    /**
     * A string containing a detailed validation error message.
     */
    static contextErrorValidationErrorString(): string;
    /**
     * The extended ID that API Gateway assigns to the API request, which contains more useful information for debugging/troubleshooting.
     */
    static contextExtendedRequestId(): string;
    /**
     * The HTTP method used. Valid values include: `DELETE`, `GET`, `HEAD`, `OPTIONS`, `PATCH`, `POST`, and `PUT`.
     */
    static contextHttpMethod(): string;
    /**
     * The AWS account ID associated with the request.
     */
    static contextIdentityAccountId(): string;
    /**
     * For API methods that require an API key, this variable is the API key associated with the method request.
     * For methods that don't require an API key, this variable is
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html
     */
    static contextIdentityApiKey(): string;
    /**
     * The API key ID associated with an API request that requires an API key.
     */
    static contextIdentityApiKeyId(): string;
    /**
     * The principal identifier of the caller making the request.
     */
    static contextIdentityCaller(): string;
    /**
     * The Amazon Cognito authentication provider used by the caller making the request.
     * Available only if the request was signed with Amazon Cognito credentials.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html
     */
    static contextIdentityCognitoAuthenticationProvider(): string;
    /**
     * The Amazon Cognito authentication type of the caller making the request.
     * Available only if the request was signed with Amazon Cognito credentials.
     */
    static contextIdentityCognitoAuthenticationType(): string;
    /**
     * The Amazon Cognito identity ID of the caller making the request. Available only if the request was signed with Amazon Cognito credentials.
     */
    static contextIdentityCognitoIdentityId(): string;
    /**
     * The Amazon Cognito identity pool ID of the caller making the request.
     * Available only if the request was signed with Amazon Cognito credentials.
     */
    static contextIdentityCognitoIdentityPoolId(): string;
    /**
     * The AWS organization ID.
     */
    static contextIdentityPrincipalOrgId(): string;
    /**
     * The source IP address of the TCP connection making the request to API Gateway.
     * Warning: You should not trust this value if there is any chance that the `X-Forwarded-For` header could be forged.
     */
    static contextIdentitySourceIp(): string;
    /**
     * The PEM-encoded client certificate that the client presented during mutual TLS authentication.
     * Present when a client accesses an API by using a custom domain name that has mutual TLS enabled.
     * Present only in access logs if mutual TLS authentication fails.
     */
    static contextIdentityClientCertPem(): string;
    /**
     * The distinguished name of the subject of the certificate that a client presents.
     * Present when a client accesses an API by using a custom domain name that has mutual TLS enabled.
     * Present only in access logs if mutual TLS authentication fails.
     */
    static contextIdentityClientCertSubjectDN(): string;
    /**
     * The distinguished name of the issuer of the certificate that a client presents.
     * Present when a client accesses an API by using a custom domain name that has mutual TLS enabled.
     * Present only in access logs if mutual TLS authentication fails.
     */
    static contextIdentityClientCertIssunerDN(): string;
    /**
     * The serial number of the certificate.
     * Present when a client accesses an API by using a custom domain name that has mutual TLS enabled.
     * Present only in access logs if mutual TLS authentication fails.
     */
    static contextIdentityClientCertSerialNumber(): string;
    /**
     * The date before which the certificate is invalid.
     * Present when a client accesses an API by using a custom domain name that has mutual TLS enabled.
     * Present only in access logs if mutual TLS authentication fails.
     */
    static contextIdentityClientCertValidityNotBefore(): string;
    /**
     * The date after which the certificate is invalid.
     * Present when a client accesses an API by using a custom domain name that has mutual TLS enabled.
     * Present only in access logs if mutual TLS authentication fails.
     */
    static contextIdentityClientCertValidityNotAfter(): string;
    /**
     * The principal identifier of the user making the request. Used in Lambda authorizers.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
     */
    static contextIdentityUser(): string;
    /**
     * The User-Agent header of the API caller.
     */
    static contextIdentityUserAgent(): string;
    /**
     * The Amazon Resource Name (ARN) of the effective user identified after authentication.
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html
     */
    static contextIdentityUserArn(): string;
    /**
     * The request path.
     * For example, for a non-proxy request URL of https://{rest-api-id.execute-api.{region}.amazonaws.com/{stage}/root/child,
     * this value is /{stage}/root/child.
     */
    static contextPath(): string;
    /**
     * The request protocol, for example, HTTP/1.1.
     */
    static contextProtocol(): string;
    /**
     * The ID that API Gateway assigns to the API request.
     */
    static contextRequestId(): string;
    /**
     * The request header override.
     * If this parameter is defined, it contains the headers to be used instead of the HTTP Headers that are defined in the Integration Request pane.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-override-request-response-parameters.html
     *
     * @param headerName
     */
    static contextRequestOverrideHeader(headerName: string): string;
    /**
     * The request path override. If this parameter is defined,
     * it contains the request path to be used instead of the URL Path Parameters that are defined in the Integration Request pane.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-override-request-response-parameters.html
     *
     * @param pathName
     */
    static contextRequestOverridePath(pathName: string): string;
    /**
     * The request query string override.
     * If this parameter is defined, it contains the request query strings to be used instead
     * of the URL Query String Parameters that are defined in the Integration Request pane.
     *
     * @param querystringName
     */
    static contextRequestOverrideQuerystring(querystringName: string): string;
    /**
     * The response header override.
     * If this parameter is defined, it contains the header to be returned instead of the Response header
     * that is defined as the Default mapping in the Integration Response pane.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-override-request-response-parameters.html
     *
     * @param headerName
     */
    static contextResponseOverrideHeader(headerName: string): string;
    /**
     * The response status code override.
     * If this parameter is defined, it contains the status code to be returned instead of the Method response status
     * that is defined as the Default mapping in the Integration Response pane.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-override-request-response-parameters.html
     */
    static contextResponseOverrideStatus(): string;
    /**
     * The CLF-formatted request time (dd/MMM/yyyy:HH:mm:ss +-hhmm).
     */
    static contextRequestTime(): string;
    /**
     * The Epoch-formatted request time.
     */
    static contextRequestTimeEpoch(): string;
    /**
     * The identifier that API Gateway assigns to your resource.
     */
    static contextResourceId(): string;
    /**
     * The path to your resource.
     * For example, for the non-proxy request URI of `https://{rest-api-id.execute-api.{region}.amazonaws.com/{stage}/root/child`,
     * The $context.resourcePath value is `/root/child`.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-step-by-step.html
     */
    static contextResourcePath(): string;
    /**
     * The deployment stage of the API request (for example, `Beta` or `Prod`).
     */
    static contextStage(): string;
    /**
     * The response received from AWS WAF: `WAF_ALLOW` or `WAF_BLOCK`. Will not be set if the stage is not associated with a web ACL.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-aws-waf.html
     */
    static contextWafResponseCode(): string;
    /**
     * The complete ARN of the web ACL that is used to decide whether to allow or block the request.
     * Will not be set if the stage is not associated with a web ACL.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-aws-waf.html
     */
    static contextWebaclArn(): string;
    /**
     * The trace ID for the X-Ray trace.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-enabling-xray.html
     */
    static contextXrayTraceId(): string;
    /**
     * The authorizer latency in ms.
     */
    static contextAuthorizerIntegrationLatency(): string;
    /**
     * The integration latency in ms.
     */
    static contextIntegrationLatency(): string;
    /**
     * For Lambda proxy integration, this parameter represents the status code returned from AWS Lambda,
     * not from the backend Lambda function.
     */
    static contextIntegrationStatus(): string;
    /**
     * The response latency in ms.
     */
    static contextResponseLatency(): string;
    /**
     * The response payload length.
     */
    static contextResponseLength(): string;
    /**
     * The method response status.
     */
    static contextStatus(): string;
    /**
     * The authorization error message.
     */
    static contextAuthorizeError(): string;
    /**
     * The authorization latency in ms.
     */
    static contextAuthorizeLatency(): string;
    /**
     * The status code returned from an authorization attempt.
     */
    static contextAuthorizeStatus(): string;
    /**
     * The error message returned from an authorizer.
     */
    static contextAuthorizerError(): string;
    /**
     * The status code returned from a Lambda authorizer.
     */
    static contextAuthorizerIntegrationStatus(): string;
    /**
     * The authorizer latency in ms.
     */
    static contextAuthorizerLatency(): string;
    /**
     * The AWS endpoint's request ID.
     */
    static contextAuthorizerRequestId(): string;
    /**
     * The status code returned from an authorizer.
     */
    static contextAuthorizerStatus(): string;
    /**
     * The error message returned from an authentication attempt.
     */
    static contextAuthenticateError(): string;
    /**
     * The authentication latency in ms.
     */
    static contextAuthenticateLatency(): string;
    /**
     * The status code returned from an authentication attempt.
     */
    static contextAuthenticateStatus(): string;
    /**
     * The path for an API mapping that an incoming request matched.
     * Applicable when a client uses a custom domain name to access an API. For example if a client sends a request to
     * https://api.example.com/v1/orders/1234, and the request matches the API mapping with the path v1/orders, the value is v1/orders.
     * @see https://docs.aws.amazon.com/en_jp/apigateway/latest/developerguide/rest-api-mappings.html
     */
    static contextCustomDomainBasePathMatched(): string;
    /**
     * A string that contains an integration error message.
     */
    static contextIntegrationErrorMessage(): string;
    /**
     * The error message returned from AWS WAF.
     */
    static contextWafError(): string;
    /**
     * The AWS WAF latency in ms.
     */
    static contextWafLatency(): string;
    /**
     * The status code returned from AWS WAF.
     */
    static contextWafStatus(): string;
}
/**
 * Properties for controlling items output in JSON standard format
 */
export interface JsonWithStandardFieldProps {
    /**
     * If this flag is enabled, the source IP of request will be output to the log
     */
    readonly ip: boolean;
    /**
     * If this flag is enabled, the principal identifier of the caller will be output to the log
     */
    readonly caller: boolean;
    /**
     * If this flag is enabled, the principal identifier of the user will be output to the log
     */
    readonly user: boolean;
    /**
     * If this flag is enabled, the CLF-formatted request time((dd/MMM/yyyy:HH:mm:ss +-hhmm) will be output to the log
     */
    readonly requestTime: boolean;
    /**
     * If this flag is enabled, the http method will be output to the log
     */
    readonly httpMethod: boolean;
    /**
     * If this flag is enabled, the path to your resource will be output to the log
     */
    readonly resourcePath: boolean;
    /**
     * If this flag is enabled, the method response status will be output to the log
     */
    readonly status: boolean;
    /**
     * If this flag is enabled, the request protocol will be output to the log
     */
    readonly protocol: boolean;
    /**
     * If this flag is enabled, the response payload length will be output to the log
     */
    readonly responseLength: boolean;
}
/**
 * factory methods for access log format.
 */
export declare class AccessLogFormat {
    /**
     * Custom log format.
     * You can create any log format string. You can easily get the $ context variable by using the methods of AccessLogField.
     * @param format
     * @example
     *
     *  apigateway.AccessLogFormat.custom(JSON.stringify({
     *      requestId: apigateway.AccessLogField.contextRequestId(),
     *      sourceIp: apigateway.AccessLogField.contextIdentitySourceIp(),
     *      method: apigateway.AccessLogField.contextHttpMethod(),
     *      userContext: {
     *        sub: apigateway.AccessLogField.contextAuthorizerClaims('sub'),
     *        email: apigateway.AccessLogField.contextAuthorizerClaims('email')
     *      }
     *   }))
     */
    static custom(format: string): AccessLogFormat;
    /**
     * Generate Common Log Format.
     */
    static clf(): AccessLogFormat;
    /**
     * Access log will be produced in the JSON format with a set of fields most useful in the access log. All fields are turned on by default with the
     * option to turn off specific fields.
     */
    static jsonWithStandardFields(fields?: JsonWithStandardFieldProps): AccessLogFormat;
    /**
     * A API Gateway custom access log format
     */
    private readonly format;
    private constructor();
    /**
     * Output a format string to be used with CloudFormation.
     */
    toString(): string;
}
