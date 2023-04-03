"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessLogFormat = exports.AccessLogField = exports.LogGroupLogDestination = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Use CloudWatch Logs as a custom access log destination for API Gateway.
 */
class LogGroupLogDestination {
    constructor(logGroup) {
        this.logGroup = logGroup;
    }
    /**
     * Binds this destination to the CloudWatch Logs.
     */
    bind(_stage) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IStage(_stage);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        return {
            destinationArn: this.logGroup.logGroupArn,
        };
    }
}
exports.LogGroupLogDestination = LogGroupLogDestination;
_a = JSII_RTTI_SYMBOL_1;
LogGroupLogDestination[_a] = { fqn: "@aws-cdk/aws-apigateway.LogGroupLogDestination", version: "0.0.0" };
/**
 * $context variables that can be used to customize access log pattern.
 */
class AccessLogField {
    /**
     * The API callers AWS account ID.
     * @deprecated Use `contextCallerAccountId` or `contextOwnerAccountId` instead
     */
    static contextAccountId() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.AccessLogField#contextAccountId", "Use `contextCallerAccountId` or `contextOwnerAccountId` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.contextAccountId);
            }
            throw error;
        }
        return '$context.identity.accountId';
    }
    /**
     * The API callers AWS account ID.
     */
    static contextCallerAccountId() {
        return '$context.identity.accountId';
    }
    /**
     * The API owner's AWS account ID.
     */
    static contextOwnerAccountId() {
        return '$context.accountId';
    }
    /**
     * The identifier API Gateway assigns to your API.
     */
    static contextApiId() {
        return '$context.apiId';
    }
    /**
     * A property of the claims returned from the Amazon Cognito user pool after the method caller is successfully authenticated.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html
     *
     * @param property A property key of the claims.
     */
    static contextAuthorizerClaims(property) {
        return `$context.authorizer.claims.${property}`;
    }
    /**
     * The principal user identification associated with the token sent by the client and returned
     * from an API Gateway Lambda authorizer (formerly known as a custom authorizer).
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
     */
    static contextAuthorizerPrincipalId() {
        return '$context.authorizer.principalId';
    }
    /**
     * The stringified value of the specified key-value pair of the `context` map returned from an API Gateway Lambda authorizer function.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
     * @param property key of the context map.
     */
    static contextAuthorizer(property) {
        return `$context.authorizer.${property}`;
    }
    /**
     * The AWS endpoint's request ID.
     */
    static contextAwsEndpointRequestId() {
        return '$context.awsEndpointRequestId';
    }
    /**
     * The full domain name used to invoke the API. This should be the same as the incoming `Host` header.
     */
    static contextDomainName() {
        return '$context.domainName';
    }
    /**
     * The first label of the `$context.domainName`. This is often used as a caller/customer identifier.
     */
    static contextDomainPrefix() {
        return '$context.domainPrefix';
    }
    /**
     * A string containing an API Gateway error message.
     */
    static contextErrorMessage() {
        return '$context.error.message';
    }
    /**
     * The quoted value of $context.error.message, namely "$context.error.message".
     */
    static contextErrorMessageString() {
        return '$context.error.messageString';
    }
    /**
     * A type of GatewayResponse. This variable can only be used for simple variable substitution in a GatewayResponse body-mapping template,
     * which is not processed by the Velocity Template Language engine, and in access logging.
     *
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-logging.html
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/customize-gateway-responses.html
     */
    static contextErrorResponseType() {
        return '$context.error.responseType';
    }
    /**
     * A string containing a detailed validation error message.
     */
    static contextErrorValidationErrorString() {
        return '$context.error.validationErrorString';
    }
    /**
     * The extended ID that API Gateway assigns to the API request, which contains more useful information for debugging/troubleshooting.
     */
    static contextExtendedRequestId() {
        return '$context.extendedRequestId';
    }
    /**
     * The HTTP method used. Valid values include: `DELETE`, `GET`, `HEAD`, `OPTIONS`, `PATCH`, `POST`, and `PUT`.
     */
    static contextHttpMethod() {
        return '$context.httpMethod';
    }
    /**
     * The AWS account ID associated with the request.
     */
    static contextIdentityAccountId() {
        return '$context.identity.accountId';
    }
    /**
     * For API methods that require an API key, this variable is the API key associated with the method request.
     * For methods that don't require an API key, this variable is
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html
     */
    static contextIdentityApiKey() {
        return '$context.identity.apiKey';
    }
    /**
     * The API key ID associated with an API request that requires an API key.
     */
    static contextIdentityApiKeyId() {
        return '$context.identity.apiKeyId';
    }
    /**
     * The principal identifier of the caller making the request.
     */
    static contextIdentityCaller() {
        return '$context.identity.caller';
    }
    /**
     * The Amazon Cognito authentication provider used by the caller making the request.
     * Available only if the request was signed with Amazon Cognito credentials.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html
     */
    static contextIdentityCognitoAuthenticationProvider() {
        return '$context.identity.cognitoAuthenticationProvider';
    }
    /**
     * The Amazon Cognito authentication type of the caller making the request.
     * Available only if the request was signed with Amazon Cognito credentials.
     */
    static contextIdentityCognitoAuthenticationType() {
        return '$context.identity.cognitoAuthenticationType';
    }
    /**
     * The Amazon Cognito identity ID of the caller making the request. Available only if the request was signed with Amazon Cognito credentials.
     */
    static contextIdentityCognitoIdentityId() {
        return '$context.identity.cognitoIdentityId';
    }
    /**
     * The Amazon Cognito identity pool ID of the caller making the request.
     * Available only if the request was signed with Amazon Cognito credentials.
     */
    static contextIdentityCognitoIdentityPoolId() {
        return '$context.identity.cognitoIdentityPoolId';
    }
    /**
     * The AWS organization ID.
     */
    static contextIdentityPrincipalOrgId() {
        return '$context.identity.principalOrgId';
    }
    /**
     * The source IP address of the TCP connection making the request to API Gateway.
     * Warning: You should not trust this value if there is any chance that the `X-Forwarded-For` header could be forged.
     */
    static contextIdentitySourceIp() {
        return '$context.identity.sourceIp';
    }
    /**
     * The PEM-encoded client certificate that the client presented during mutual TLS authentication.
     * Present when a client accesses an API by using a custom domain name that has mutual TLS enabled.
     * Present only in access logs if mutual TLS authentication fails.
     */
    static contextIdentityClientCertPem() {
        return '$context.identity.clientCert.clientCertPem';
    }
    /**
     * The distinguished name of the subject of the certificate that a client presents.
     * Present when a client accesses an API by using a custom domain name that has mutual TLS enabled.
     * Present only in access logs if mutual TLS authentication fails.
     */
    static contextIdentityClientCertSubjectDN() {
        return '$context.identity.clientCert.subjectDN';
    }
    /**
     * The distinguished name of the issuer of the certificate that a client presents.
     * Present when a client accesses an API by using a custom domain name that has mutual TLS enabled.
     * Present only in access logs if mutual TLS authentication fails.
     */
    static contextIdentityClientCertIssunerDN() {
        return '$context.identity.clientCert.issuerDN';
    }
    /**
     * The serial number of the certificate.
     * Present when a client accesses an API by using a custom domain name that has mutual TLS enabled.
     * Present only in access logs if mutual TLS authentication fails.
     */
    static contextIdentityClientCertSerialNumber() {
        return '$context.identity.clientCert.serialNumber';
    }
    /**
     * The date before which the certificate is invalid.
     * Present when a client accesses an API by using a custom domain name that has mutual TLS enabled.
     * Present only in access logs if mutual TLS authentication fails.
     */
    static contextIdentityClientCertValidityNotBefore() {
        return '$context.identity.clientCert.validity.notBefore';
    }
    /**
     * The date after which the certificate is invalid.
     * Present when a client accesses an API by using a custom domain name that has mutual TLS enabled.
     * Present only in access logs if mutual TLS authentication fails.
     */
    static contextIdentityClientCertValidityNotAfter() {
        return '$context.identity.clientCert.validity.notAfter';
    }
    /**
     * The principal identifier of the user making the request. Used in Lambda authorizers.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
     */
    static contextIdentityUser() {
        return '$context.identity.user';
    }
    /**
     * The User-Agent header of the API caller.
     */
    static contextIdentityUserAgent() {
        return '$context.identity.userAgent';
    }
    /**
     * The Amazon Resource Name (ARN) of the effective user identified after authentication.
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html
     */
    static contextIdentityUserArn() {
        return '$context.identity.userArn';
    }
    /**
     * The request path.
     * For example, for a non-proxy request URL of https://{rest-api-id.execute-api.{region}.amazonaws.com/{stage}/root/child,
     * this value is /{stage}/root/child.
     */
    static contextPath() {
        return '$context.path';
    }
    /**
     * The request protocol, for example, HTTP/1.1.
     */
    static contextProtocol() {
        return '$context.protocol';
    }
    /**
     * The ID that API Gateway assigns to the API request.
     */
    static contextRequestId() {
        return '$context.requestId';
    }
    /**
     * The request header override.
     * If this parameter is defined, it contains the headers to be used instead of the HTTP Headers that are defined in the Integration Request pane.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-override-request-response-parameters.html
     *
     * @param headerName
     */
    static contextRequestOverrideHeader(headerName) {
        return `$context.requestOverride.header.${headerName}`;
    }
    /**
     * The request path override. If this parameter is defined,
     * it contains the request path to be used instead of the URL Path Parameters that are defined in the Integration Request pane.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-override-request-response-parameters.html
     *
     * @param pathName
     */
    static contextRequestOverridePath(pathName) {
        return `$context.requestOverride.path.${pathName}`;
    }
    /**
     * The request query string override.
     * If this parameter is defined, it contains the request query strings to be used instead
     * of the URL Query String Parameters that are defined in the Integration Request pane.
     *
     * @param querystringName
     */
    static contextRequestOverrideQuerystring(querystringName) {
        return `$context.requestOverride.querystring.${querystringName}`;
    }
    /**
     * The response header override.
     * If this parameter is defined, it contains the header to be returned instead of the Response header
     * that is defined as the Default mapping in the Integration Response pane.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-override-request-response-parameters.html
     *
     * @param headerName
     */
    static contextResponseOverrideHeader(headerName) {
        return `$context.responseOverride.header.${headerName}`;
    }
    /**
     * The response status code override.
     * If this parameter is defined, it contains the status code to be returned instead of the Method response status
     * that is defined as the Default mapping in the Integration Response pane.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-override-request-response-parameters.html
     */
    static contextResponseOverrideStatus() {
        return '$context.responseOverride.status';
    }
    /**
     * The CLF-formatted request time (dd/MMM/yyyy:HH:mm:ss +-hhmm).
     */
    static contextRequestTime() {
        return '$context.requestTime';
    }
    /**
     * The Epoch-formatted request time.
     */
    static contextRequestTimeEpoch() {
        return '$context.requestTimeEpoch';
    }
    /**
     * The identifier that API Gateway assigns to your resource.
     */
    static contextResourceId() {
        return '$context.resourceId';
    }
    /**
     * The path to your resource.
     * For example, for the non-proxy request URI of `https://{rest-api-id.execute-api.{region}.amazonaws.com/{stage}/root/child`,
     * The $context.resourcePath value is `/root/child`.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-step-by-step.html
     */
    static contextResourcePath() {
        return '$context.resourcePath';
    }
    /**
     * The deployment stage of the API request (for example, `Beta` or `Prod`).
     */
    static contextStage() {
        return '$context.stage';
    }
    /**
     * The response received from AWS WAF: `WAF_ALLOW` or `WAF_BLOCK`. Will not be set if the stage is not associated with a web ACL.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-aws-waf.html
     */
    static contextWafResponseCode() {
        return '$context.wafResponseCode';
    }
    /**
     * The complete ARN of the web ACL that is used to decide whether to allow or block the request.
     * Will not be set if the stage is not associated with a web ACL.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-aws-waf.html
     */
    static contextWebaclArn() {
        return '$context.webaclArn';
    }
    /**
     * The trace ID for the X-Ray trace.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-enabling-xray.html
     */
    static contextXrayTraceId() {
        return '$context.xrayTraceId';
    }
    /**
     * The authorizer latency in ms.
     */
    static contextAuthorizerIntegrationLatency() {
        return '$context.authorizer.integrationLatency';
    }
    /**
     * The integration latency in ms.
     */
    static contextIntegrationLatency() {
        return '$context.integrationLatency';
    }
    /**
     * For Lambda proxy integration, this parameter represents the status code returned from AWS Lambda,
     * not from the backend Lambda function.
     */
    static contextIntegrationStatus() {
        return '$context.integrationStatus';
    }
    /**
     * The response latency in ms.
     */
    static contextResponseLatency() {
        return '$context.responseLatency';
    }
    /**
     * The response payload length.
     */
    static contextResponseLength() {
        return '$context.responseLength';
    }
    /**
     * The method response status.
     */
    static contextStatus() {
        return '$context.status';
    }
    /**
     * The authorization error message.
     */
    static contextAuthorizeError() {
        return '$context.authorize.error';
    }
    /**
     * The authorization latency in ms.
     */
    static contextAuthorizeLatency() {
        return '$context.authorize.latency';
    }
    /**
     * The status code returned from an authorization attempt.
     */
    static contextAuthorizeStatus() {
        return '$context.authorize.status';
    }
    /**
     * The error message returned from an authorizer.
     */
    static contextAuthorizerError() {
        return '$context.authorizer.error';
    }
    /**
     * The status code returned from a Lambda authorizer.
     */
    static contextAuthorizerIntegrationStatus() {
        return '$context.authorizer.integrationStatus';
    }
    /**
     * The authorizer latency in ms.
     */
    static contextAuthorizerLatency() {
        return '$context.authorizer.latency';
    }
    /**
     * The AWS endpoint's request ID.
     */
    static contextAuthorizerRequestId() {
        return '$context.authorizer.requestId';
    }
    /**
     * The status code returned from an authorizer.
     */
    static contextAuthorizerStatus() {
        return '$context.authorizer.status';
    }
    /**
     * The error message returned from an authentication attempt.
     */
    static contextAuthenticateError() {
        return '$context.authenticate.error';
    }
    /**
     * The authentication latency in ms.
     */
    static contextAuthenticateLatency() {
        return '$context.authenticate.latency';
    }
    /**
     * The status code returned from an authentication attempt.
     */
    static contextAuthenticateStatus() {
        return '$context.authenticate.status';
    }
    /**
     * The path for an API mapping that an incoming request matched.
     * Applicable when a client uses a custom domain name to access an API. For example if a client sends a request to
     * https://api.example.com/v1/orders/1234, and the request matches the API mapping with the path v1/orders, the value is v1/orders.
     * @see https://docs.aws.amazon.com/en_jp/apigateway/latest/developerguide/rest-api-mappings.html
     */
    static contextCustomDomainBasePathMatched() {
        return '$context.customDomain.basePathMatched';
    }
    /**
     * A string that contains an integration error message.
     */
    static contextIntegrationErrorMessage() {
        return '$context.integrationErrorMessage';
    }
    /**
     * The error message returned from AWS WAF.
     */
    static contextWafError() {
        return '$context.waf.error';
    }
    /**
     * The AWS WAF latency in ms.
     */
    static contextWafLatency() {
        return '$context.waf.latency';
    }
    /**
     * The status code returned from AWS WAF.
     */
    static contextWafStatus() {
        return '$context.waf.status';
    }
}
exports.AccessLogField = AccessLogField;
_b = JSII_RTTI_SYMBOL_1;
AccessLogField[_b] = { fqn: "@aws-cdk/aws-apigateway.AccessLogField", version: "0.0.0" };
/**
 * factory methods for access log format.
 */
class AccessLogFormat {
    constructor(format) {
        this.format = format;
    }
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
    static custom(format) {
        return new AccessLogFormat(format);
    }
    /**
     * Generate Common Log Format.
     */
    static clf() {
        const requester = [AccessLogField.contextIdentitySourceIp(), AccessLogField.contextIdentityCaller(), AccessLogField.contextIdentityUser()].join(' ');
        const requestTime = AccessLogField.contextRequestTime();
        const request = [AccessLogField.contextHttpMethod(), AccessLogField.contextResourcePath(), AccessLogField.contextProtocol()].join(' ');
        const status = [AccessLogField.contextStatus(), AccessLogField.contextResponseLength(), AccessLogField.contextRequestId()].join(' ');
        return new AccessLogFormat(`${requester} [${requestTime}] "${request}" ${status}`);
    }
    /**
     * Access log will be produced in the JSON format with a set of fields most useful in the access log. All fields are turned on by default with the
     * option to turn off specific fields.
     */
    static jsonWithStandardFields(fields = {
        ip: true,
        user: true,
        caller: true,
        requestTime: true,
        httpMethod: true,
        resourcePath: true,
        status: true,
        protocol: true,
        responseLength: true,
    }) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_JsonWithStandardFieldProps(fields);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.jsonWithStandardFields);
            }
            throw error;
        }
        return this.custom(JSON.stringify({
            requestId: AccessLogField.contextRequestId(),
            ip: fields.ip ? AccessLogField.contextIdentitySourceIp() : undefined,
            user: fields.user ? AccessLogField.contextIdentityUser() : undefined,
            caller: fields.caller ? AccessLogField.contextIdentityCaller() : undefined,
            requestTime: fields.requestTime ? AccessLogField.contextRequestTime() : undefined,
            httpMethod: fields.httpMethod ? AccessLogField.contextHttpMethod() : undefined,
            resourcePath: fields.resourcePath ? AccessLogField.contextResourcePath() : undefined,
            status: fields.status ? AccessLogField.contextStatus() : undefined,
            protocol: fields.protocol ? AccessLogField.contextProtocol() : undefined,
            responseLength: fields.responseLength ? AccessLogField.contextResponseLength() : undefined,
        }));
    }
    /**
     * Output a format string to be used with CloudFormation.
     */
    toString() {
        return this.format;
    }
}
exports.AccessLogFormat = AccessLogFormat;
_c = JSII_RTTI_SYMBOL_1;
AccessLogFormat[_c] = { fqn: "@aws-cdk/aws-apigateway.AccessLogFormat", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZXNzLWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFjY2Vzcy1sb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBdUJBOztHQUVHO0FBQ0gsTUFBYSxzQkFBc0I7SUFDakMsWUFBNkIsUUFBbUI7UUFBbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVztLQUMvQztJQUVEOztPQUVHO0lBQ0ksSUFBSSxDQUFDLE1BQWM7Ozs7Ozs7Ozs7UUFDeEIsT0FBTztZQUNMLGNBQWMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVc7U0FDMUMsQ0FBQztLQUNIOztBQVhILHdEQVlDOzs7QUFFRDs7R0FFRztBQUNILE1BQWEsY0FBYztJQUN6Qjs7O09BR0c7SUFDSSxNQUFNLENBQUMsZ0JBQWdCOzs7Ozs7Ozs7O1FBQzVCLE9BQU8sNkJBQTZCLENBQUM7S0FDdEM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxzQkFBc0I7UUFDbEMsT0FBTyw2QkFBNkIsQ0FBQztLQUN0QztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLHFCQUFxQjtRQUNqQyxPQUFPLG9CQUFvQixDQUFDO0tBQzdCO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsWUFBWTtRQUN4QixPQUFPLGdCQUFnQixDQUFDO0tBQ3pCO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsdUJBQXVCLENBQUMsUUFBZ0I7UUFDcEQsT0FBTyw4QkFBOEIsUUFBUSxFQUFFLENBQUM7S0FDakQ7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLDRCQUE0QjtRQUN4QyxPQUFPLGlDQUFpQyxDQUFDO0tBQzFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxRQUFnQjtRQUM5QyxPQUFPLHVCQUF1QixRQUFRLEVBQUUsQ0FBQztLQUMxQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLDJCQUEyQjtRQUN2QyxPQUFPLCtCQUErQixDQUFDO0tBQ3hDO0lBRUQ7O09BRUc7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Q0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ3BFLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUMxRSxXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDakYsVUFBVSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQzlFLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUNwRixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ2xFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDeEUsY0FBYyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1NBQzNGLENBQUMsQ0FBQyxDQUFDO0tBQ0w7SUFXRDs7T0FFRztJQUNJLFFBQVE7UUFDYixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7S0FDcEI7O0FBN0VILDBDQThFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElMb2dHcm91cCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1sb2dzJztcbmltcG9ydCB7IElTdGFnZSB9IGZyb20gJy4vc3RhZ2UnO1xuXG4vKipcbiAqIEFjY2VzcyBsb2cgZGVzdGluYXRpb24gZm9yIGEgUmVzdEFwaSBTdGFnZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQWNjZXNzTG9nRGVzdGluYXRpb24ge1xuICAvKipcbiAgICogQmluZHMgdGhpcyBkZXN0aW5hdGlvbiB0byB0aGUgUmVzdEFwaSBTdGFnZS5cbiAgICovXG4gIGJpbmQoc3RhZ2U6IElTdGFnZSk6IEFjY2Vzc0xvZ0Rlc3RpbmF0aW9uQ29uZmlnXG59XG5cbi8qKlxuICogT3B0aW9ucyB3aGVuIGJpbmRpbmcgYSBsb2cgZGVzdGluYXRpb24gdG8gYSBSZXN0QXBpIFN0YWdlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFjY2Vzc0xvZ0Rlc3RpbmF0aW9uQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgZGVzdGluYXRpb24gcmVzb3VyY2VcbiAgICovXG4gIHJlYWRvbmx5IGRlc3RpbmF0aW9uQXJuOiBzdHJpbmc7XG59XG5cbi8qKlxuICogVXNlIENsb3VkV2F0Y2ggTG9ncyBhcyBhIGN1c3RvbSBhY2Nlc3MgbG9nIGRlc3RpbmF0aW9uIGZvciBBUEkgR2F0ZXdheS5cbiAqL1xuZXhwb3J0IGNsYXNzIExvZ0dyb3VwTG9nRGVzdGluYXRpb24gaW1wbGVtZW50cyBJQWNjZXNzTG9nRGVzdGluYXRpb24ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGxvZ0dyb3VwOiBJTG9nR3JvdXApIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyB0aGlzIGRlc3RpbmF0aW9uIHRvIHRoZSBDbG91ZFdhdGNoIExvZ3MuXG4gICAqL1xuICBwdWJsaWMgYmluZChfc3RhZ2U6IElTdGFnZSk6IEFjY2Vzc0xvZ0Rlc3RpbmF0aW9uQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzdGluYXRpb25Bcm46IHRoaXMubG9nR3JvdXAubG9nR3JvdXBBcm4sXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqICRjb250ZXh0IHZhcmlhYmxlcyB0aGF0IGNhbiBiZSB1c2VkIHRvIGN1c3RvbWl6ZSBhY2Nlc3MgbG9nIHBhdHRlcm4uXG4gKi9cbmV4cG9ydCBjbGFzcyBBY2Nlc3NMb2dGaWVsZCB7XG4gIC8qKlxuICAgKiBUaGUgQVBJIGNhbGxlcnMgQVdTIGFjY291bnQgSUQuXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgY29udGV4dENhbGxlckFjY291bnRJZGAgb3IgYGNvbnRleHRPd25lckFjY291bnRJZGAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0QWNjb3VudElkKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQuaWRlbnRpdHkuYWNjb3VudElkJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQVBJIGNhbGxlcnMgQVdTIGFjY291bnQgSUQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRDYWxsZXJBY2NvdW50SWQoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5pZGVudGl0eS5hY2NvdW50SWQnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBBUEkgb3duZXIncyBBV1MgYWNjb3VudCBJRC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dE93bmVyQWNjb3VudElkKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQuYWNjb3VudElkJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaWRlbnRpZmllciBBUEkgR2F0ZXdheSBhc3NpZ25zIHRvIHlvdXIgQVBJLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0QXBpSWQoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5hcGlJZCc7XG4gIH1cblxuICAvKipcbiAgICogQSBwcm9wZXJ0eSBvZiB0aGUgY2xhaW1zIHJldHVybmVkIGZyb20gdGhlIEFtYXpvbiBDb2duaXRvIHVzZXIgcG9vbCBhZnRlciB0aGUgbWV0aG9kIGNhbGxlciBpcyBzdWNjZXNzZnVsbHkgYXV0aGVudGljYXRlZC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYXBpZ2F0ZXdheS9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvYXBpZ2F0ZXdheS1pbnRlZ3JhdGUtd2l0aC1jb2duaXRvLmh0bWxcbiAgICpcbiAgICogQHBhcmFtIHByb3BlcnR5IEEgcHJvcGVydHkga2V5IG9mIHRoZSBjbGFpbXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRBdXRob3JpemVyQ2xhaW1zKHByb3BlcnR5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCRjb250ZXh0LmF1dGhvcml6ZXIuY2xhaW1zLiR7cHJvcGVydHl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcHJpbmNpcGFsIHVzZXIgaWRlbnRpZmljYXRpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSB0b2tlbiBzZW50IGJ5IHRoZSBjbGllbnQgYW5kIHJldHVybmVkXG4gICAqIGZyb20gYW4gQVBJIEdhdGV3YXkgTGFtYmRhIGF1dGhvcml6ZXIgKGZvcm1lcmx5IGtub3duIGFzIGEgY3VzdG9tIGF1dGhvcml6ZXIpLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9hcGlnYXRld2F5LXVzZS1sYW1iZGEtYXV0aG9yaXplci5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRBdXRob3JpemVyUHJpbmNpcGFsSWQoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5hdXRob3JpemVyLnByaW5jaXBhbElkJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc3RyaW5naWZpZWQgdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBrZXktdmFsdWUgcGFpciBvZiB0aGUgYGNvbnRleHRgIG1hcCByZXR1cm5lZCBmcm9tIGFuIEFQSSBHYXRld2F5IExhbWJkYSBhdXRob3JpemVyIGZ1bmN0aW9uLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9hcGlnYXRld2F5LXVzZS1sYW1iZGEtYXV0aG9yaXplci5odG1sXG4gICAqIEBwYXJhbSBwcm9wZXJ0eSBrZXkgb2YgdGhlIGNvbnRleHQgbWFwLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0QXV0aG9yaXplcihwcm9wZXJ0eTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAkY29udGV4dC5hdXRob3JpemVyLiR7cHJvcGVydHl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQVdTIGVuZHBvaW50J3MgcmVxdWVzdCBJRC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dEF3c0VuZHBvaW50UmVxdWVzdElkKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQuYXdzRW5kcG9pbnRSZXF1ZXN0SWQnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBmdWxsIGRvbWFpbiBuYW1lIHVzZWQgdG8gaW52b2tlIHRoZSBBUEkuIFRoaXMgc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBpbmNvbWluZyBgSG9zdGAgaGVhZGVyLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0RG9tYWluTmFtZSgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmRvbWFpbk5hbWUnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBmaXJzdCBsYWJlbCBvZiB0aGUgYCRjb250ZXh0LmRvbWFpbk5hbWVgLiBUaGlzIGlzIG9mdGVuIHVzZWQgYXMgYSBjYWxsZXIvY3VzdG9tZXIgaWRlbnRpZmllci5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dERvbWFpblByZWZpeCgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmRvbWFpblByZWZpeCc7XG4gIH1cblxuICAvKipcbiAgICogQSBzdHJpbmcgY29udGFpbmluZyBhbiBBUEkgR2F0ZXdheSBlcnJvciBtZXNzYWdlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0RXJyb3JNZXNzYWdlKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQuZXJyb3IubWVzc2FnZSc7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHF1b3RlZCB2YWx1ZSBvZiAkY29udGV4dC5lcnJvci5tZXNzYWdlLCBuYW1lbHkgXCIkY29udGV4dC5lcnJvci5tZXNzYWdlXCIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRFcnJvck1lc3NhZ2VTdHJpbmcoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5lcnJvci5tZXNzYWdlU3RyaW5nJztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHR5cGUgb2YgR2F0ZXdheVJlc3BvbnNlLiBUaGlzIHZhcmlhYmxlIGNhbiBvbmx5IGJlIHVzZWQgZm9yIHNpbXBsZSB2YXJpYWJsZSBzdWJzdGl0dXRpb24gaW4gYSBHYXRld2F5UmVzcG9uc2UgYm9keS1tYXBwaW5nIHRlbXBsYXRlLFxuICAgKiB3aGljaCBpcyBub3QgcHJvY2Vzc2VkIGJ5IHRoZSBWZWxvY2l0eSBUZW1wbGF0ZSBMYW5ndWFnZSBlbmdpbmUsIGFuZCBpbiBhY2Nlc3MgbG9nZ2luZy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYXBpZ2F0ZXdheS9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvYXBpZ2F0ZXdheS13ZWJzb2NrZXQtYXBpLWxvZ2dpbmcuaHRtbFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jdXN0b21pemUtZ2F0ZXdheS1yZXNwb25zZXMuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0RXJyb3JSZXNwb25zZVR5cGUoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5lcnJvci5yZXNwb25zZVR5cGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc3RyaW5nIGNvbnRhaW5pbmcgYSBkZXRhaWxlZCB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRFcnJvclZhbGlkYXRpb25FcnJvclN0cmluZygpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmVycm9yLnZhbGlkYXRpb25FcnJvclN0cmluZyc7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGV4dGVuZGVkIElEIHRoYXQgQVBJIEdhdGV3YXkgYXNzaWducyB0byB0aGUgQVBJIHJlcXVlc3QsIHdoaWNoIGNvbnRhaW5zIG1vcmUgdXNlZnVsIGluZm9ybWF0aW9uIGZvciBkZWJ1Z2dpbmcvdHJvdWJsZXNob290aW5nLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0RXh0ZW5kZWRSZXF1ZXN0SWQoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5leHRlbmRlZFJlcXVlc3RJZCc7XG4gIH1cblxuICAvKipcbiAgICogVGhlIEhUVFAgbWV0aG9kIHVzZWQuIFZhbGlkIHZhbHVlcyBpbmNsdWRlOiBgREVMRVRFYCwgYEdFVGAsIGBIRUFEYCwgYE9QVElPTlNgLCBgUEFUQ0hgLCBgUE9TVGAsIGFuZCBgUFVUYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dEh0dHBNZXRob2QoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5odHRwTWV0aG9kJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQVdTIGFjY291bnQgSUQgYXNzb2NpYXRlZCB3aXRoIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0SWRlbnRpdHlBY2NvdW50SWQoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5pZGVudGl0eS5hY2NvdW50SWQnO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBBUEkgbWV0aG9kcyB0aGF0IHJlcXVpcmUgYW4gQVBJIGtleSwgdGhpcyB2YXJpYWJsZSBpcyB0aGUgQVBJIGtleSBhc3NvY2lhdGVkIHdpdGggdGhlIG1ldGhvZCByZXF1ZXN0LlxuICAgKiBGb3IgbWV0aG9kcyB0aGF0IGRvbid0IHJlcXVpcmUgYW4gQVBJIGtleSwgdGhpcyB2YXJpYWJsZSBpc1xuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9hcGktZ2F0ZXdheS1hcGktdXNhZ2UtcGxhbnMuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0SWRlbnRpdHlBcGlLZXkoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5pZGVudGl0eS5hcGlLZXknO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBBUEkga2V5IElEIGFzc29jaWF0ZWQgd2l0aCBhbiBBUEkgcmVxdWVzdCB0aGF0IHJlcXVpcmVzIGFuIEFQSSBrZXkuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRJZGVudGl0eUFwaUtleUlkKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQuaWRlbnRpdHkuYXBpS2V5SWQnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwcmluY2lwYWwgaWRlbnRpZmllciBvZiB0aGUgY2FsbGVyIG1ha2luZyB0aGUgcmVxdWVzdC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dElkZW50aXR5Q2FsbGVyKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQuaWRlbnRpdHkuY2FsbGVyJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIENvZ25pdG8gYXV0aGVudGljYXRpb24gcHJvdmlkZXIgdXNlZCBieSB0aGUgY2FsbGVyIG1ha2luZyB0aGUgcmVxdWVzdC5cbiAgICogQXZhaWxhYmxlIG9ubHkgaWYgdGhlIHJlcXVlc3Qgd2FzIHNpZ25lZCB3aXRoIEFtYXpvbiBDb2duaXRvIGNyZWRlbnRpYWxzLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jb2duaXRvLWlkZW50aXR5Lmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dElkZW50aXR5Q29nbml0b0F1dGhlbnRpY2F0aW9uUHJvdmlkZXIoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5pZGVudGl0eS5jb2duaXRvQXV0aGVudGljYXRpb25Qcm92aWRlcic7XG4gIH1cblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBDb2duaXRvIGF1dGhlbnRpY2F0aW9uIHR5cGUgb2YgdGhlIGNhbGxlciBtYWtpbmcgdGhlIHJlcXVlc3QuXG4gICAqIEF2YWlsYWJsZSBvbmx5IGlmIHRoZSByZXF1ZXN0IHdhcyBzaWduZWQgd2l0aCBBbWF6b24gQ29nbml0byBjcmVkZW50aWFscy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dElkZW50aXR5Q29nbml0b0F1dGhlbnRpY2F0aW9uVHlwZSgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmlkZW50aXR5LmNvZ25pdG9BdXRoZW50aWNhdGlvblR5cGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBBbWF6b24gQ29nbml0byBpZGVudGl0eSBJRCBvZiB0aGUgY2FsbGVyIG1ha2luZyB0aGUgcmVxdWVzdC4gQXZhaWxhYmxlIG9ubHkgaWYgdGhlIHJlcXVlc3Qgd2FzIHNpZ25lZCB3aXRoIEFtYXpvbiBDb2duaXRvIGNyZWRlbnRpYWxzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0SWRlbnRpdHlDb2duaXRvSWRlbnRpdHlJZCgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmlkZW50aXR5LmNvZ25pdG9JZGVudGl0eUlkJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIENvZ25pdG8gaWRlbnRpdHkgcG9vbCBJRCBvZiB0aGUgY2FsbGVyIG1ha2luZyB0aGUgcmVxdWVzdC5cbiAgICogQXZhaWxhYmxlIG9ubHkgaWYgdGhlIHJlcXVlc3Qgd2FzIHNpZ25lZCB3aXRoIEFtYXpvbiBDb2duaXRvIGNyZWRlbnRpYWxzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0SWRlbnRpdHlDb2duaXRvSWRlbnRpdHlQb29sSWQoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5pZGVudGl0eS5jb2duaXRvSWRlbnRpdHlQb29sSWQnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBBV1Mgb3JnYW5pemF0aW9uIElELlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0SWRlbnRpdHlQcmluY2lwYWxPcmdJZCgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmlkZW50aXR5LnByaW5jaXBhbE9yZ0lkJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc291cmNlIElQIGFkZHJlc3Mgb2YgdGhlIFRDUCBjb25uZWN0aW9uIG1ha2luZyB0aGUgcmVxdWVzdCB0byBBUEkgR2F0ZXdheS5cbiAgICogV2FybmluZzogWW91IHNob3VsZCBub3QgdHJ1c3QgdGhpcyB2YWx1ZSBpZiB0aGVyZSBpcyBhbnkgY2hhbmNlIHRoYXQgdGhlIGBYLUZvcndhcmRlZC1Gb3JgIGhlYWRlciBjb3VsZCBiZSBmb3JnZWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRJZGVudGl0eVNvdXJjZUlwKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQuaWRlbnRpdHkuc291cmNlSXAnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBQRU0tZW5jb2RlZCBjbGllbnQgY2VydGlmaWNhdGUgdGhhdCB0aGUgY2xpZW50IHByZXNlbnRlZCBkdXJpbmcgbXV0dWFsIFRMUyBhdXRoZW50aWNhdGlvbi5cbiAgICogUHJlc2VudCB3aGVuIGEgY2xpZW50IGFjY2Vzc2VzIGFuIEFQSSBieSB1c2luZyBhIGN1c3RvbSBkb21haW4gbmFtZSB0aGF0IGhhcyBtdXR1YWwgVExTIGVuYWJsZWQuXG4gICAqIFByZXNlbnQgb25seSBpbiBhY2Nlc3MgbG9ncyBpZiBtdXR1YWwgVExTIGF1dGhlbnRpY2F0aW9uIGZhaWxzLlxuICAgKi9cblxuICBwdWJsaWMgc3RhdGljIGNvbnRleHRJZGVudGl0eUNsaWVudENlcnRQZW0oKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5pZGVudGl0eS5jbGllbnRDZXJ0LmNsaWVudENlcnRQZW0nO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkaXN0aW5ndWlzaGVkIG5hbWUgb2YgdGhlIHN1YmplY3Qgb2YgdGhlIGNlcnRpZmljYXRlIHRoYXQgYSBjbGllbnQgcHJlc2VudHMuXG4gICAqIFByZXNlbnQgd2hlbiBhIGNsaWVudCBhY2Nlc3NlcyBhbiBBUEkgYnkgdXNpbmcgYSBjdXN0b20gZG9tYWluIG5hbWUgdGhhdCBoYXMgbXV0dWFsIFRMUyBlbmFibGVkLlxuICAgKiBQcmVzZW50IG9ubHkgaW4gYWNjZXNzIGxvZ3MgaWYgbXV0dWFsIFRMUyBhdXRoZW50aWNhdGlvbiBmYWlscy5cbiAgICovXG5cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0SWRlbnRpdHlDbGllbnRDZXJ0U3ViamVjdEROKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQuaWRlbnRpdHkuY2xpZW50Q2VydC5zdWJqZWN0RE4nO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkaXN0aW5ndWlzaGVkIG5hbWUgb2YgdGhlIGlzc3VlciBvZiB0aGUgY2VydGlmaWNhdGUgdGhhdCBhIGNsaWVudCBwcmVzZW50cy5cbiAgICogUHJlc2VudCB3aGVuIGEgY2xpZW50IGFjY2Vzc2VzIGFuIEFQSSBieSB1c2luZyBhIGN1c3RvbSBkb21haW4gbmFtZSB0aGF0IGhhcyBtdXR1YWwgVExTIGVuYWJsZWQuXG4gICAqIFByZXNlbnQgb25seSBpbiBhY2Nlc3MgbG9ncyBpZiBtdXR1YWwgVExTIGF1dGhlbnRpY2F0aW9uIGZhaWxzLlxuICAgKi9cblxuICBwdWJsaWMgc3RhdGljIGNvbnRleHRJZGVudGl0eUNsaWVudENlcnRJc3N1bmVyRE4oKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5pZGVudGl0eS5jbGllbnRDZXJ0Lmlzc3VlckROJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc2VyaWFsIG51bWJlciBvZiB0aGUgY2VydGlmaWNhdGUuXG4gICAqIFByZXNlbnQgd2hlbiBhIGNsaWVudCBhY2Nlc3NlcyBhbiBBUEkgYnkgdXNpbmcgYSBjdXN0b20gZG9tYWluIG5hbWUgdGhhdCBoYXMgbXV0dWFsIFRMUyBlbmFibGVkLlxuICAgKiBQcmVzZW50IG9ubHkgaW4gYWNjZXNzIGxvZ3MgaWYgbXV0dWFsIFRMUyBhdXRoZW50aWNhdGlvbiBmYWlscy5cbiAgICovXG5cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0SWRlbnRpdHlDbGllbnRDZXJ0U2VyaWFsTnVtYmVyKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQuaWRlbnRpdHkuY2xpZW50Q2VydC5zZXJpYWxOdW1iZXInO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkYXRlIGJlZm9yZSB3aGljaCB0aGUgY2VydGlmaWNhdGUgaXMgaW52YWxpZC5cbiAgICogUHJlc2VudCB3aGVuIGEgY2xpZW50IGFjY2Vzc2VzIGFuIEFQSSBieSB1c2luZyBhIGN1c3RvbSBkb21haW4gbmFtZSB0aGF0IGhhcyBtdXR1YWwgVExTIGVuYWJsZWQuXG4gICAqIFByZXNlbnQgb25seSBpbiBhY2Nlc3MgbG9ncyBpZiBtdXR1YWwgVExTIGF1dGhlbnRpY2F0aW9uIGZhaWxzLlxuICAgKi9cblxuICBwdWJsaWMgc3RhdGljIGNvbnRleHRJZGVudGl0eUNsaWVudENlcnRWYWxpZGl0eU5vdEJlZm9yZSgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmlkZW50aXR5LmNsaWVudENlcnQudmFsaWRpdHkubm90QmVmb3JlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZGF0ZSBhZnRlciB3aGljaCB0aGUgY2VydGlmaWNhdGUgaXMgaW52YWxpZC5cbiAgICogUHJlc2VudCB3aGVuIGEgY2xpZW50IGFjY2Vzc2VzIGFuIEFQSSBieSB1c2luZyBhIGN1c3RvbSBkb21haW4gbmFtZSB0aGF0IGhhcyBtdXR1YWwgVExTIGVuYWJsZWQuXG4gICAqIFByZXNlbnQgb25seSBpbiBhY2Nlc3MgbG9ncyBpZiBtdXR1YWwgVExTIGF1dGhlbnRpY2F0aW9uIGZhaWxzLlxuICAgKi9cblxuICBwdWJsaWMgc3RhdGljIGNvbnRleHRJZGVudGl0eUNsaWVudENlcnRWYWxpZGl0eU5vdEFmdGVyKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQuaWRlbnRpdHkuY2xpZW50Q2VydC52YWxpZGl0eS5ub3RBZnRlcic7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHByaW5jaXBhbCBpZGVudGlmaWVyIG9mIHRoZSB1c2VyIG1ha2luZyB0aGUgcmVxdWVzdC4gVXNlZCBpbiBMYW1iZGEgYXV0aG9yaXplcnMuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwaWdhdGV3YXkvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2FwaS1nYXRld2F5LWxhbWJkYS1hdXRob3JpemVyLW91dHB1dC5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRJZGVudGl0eVVzZXIoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5pZGVudGl0eS51c2VyJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgVXNlci1BZ2VudCBoZWFkZXIgb2YgdGhlIEFQSSBjYWxsZXIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRJZGVudGl0eVVzZXJBZ2VudCgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmlkZW50aXR5LnVzZXJBZ2VudCc7XG4gIH1cblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBlZmZlY3RpdmUgdXNlciBpZGVudGlmaWVkIGFmdGVyIGF1dGhlbnRpY2F0aW9uLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9pZF91c2Vycy5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRJZGVudGl0eVVzZXJBcm4oKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5pZGVudGl0eS51c2VyQXJuJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVxdWVzdCBwYXRoLlxuICAgKiBGb3IgZXhhbXBsZSwgZm9yIGEgbm9uLXByb3h5IHJlcXVlc3QgVVJMIG9mIGh0dHBzOi8ve3Jlc3QtYXBpLWlkLmV4ZWN1dGUtYXBpLntyZWdpb259LmFtYXpvbmF3cy5jb20ve3N0YWdlfS9yb290L2NoaWxkLFxuICAgKiB0aGlzIHZhbHVlIGlzIC97c3RhZ2V9L3Jvb3QvY2hpbGQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRQYXRoKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQucGF0aCc7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJlcXVlc3QgcHJvdG9jb2wsIGZvciBleGFtcGxlLCBIVFRQLzEuMS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dFByb3RvY29sKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQucHJvdG9jb2wnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBJRCB0aGF0IEFQSSBHYXRld2F5IGFzc2lnbnMgdG8gdGhlIEFQSSByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0UmVxdWVzdElkKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQucmVxdWVzdElkJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVxdWVzdCBoZWFkZXIgb3ZlcnJpZGUuXG4gICAqIElmIHRoaXMgcGFyYW1ldGVyIGlzIGRlZmluZWQsIGl0IGNvbnRhaW5zIHRoZSBoZWFkZXJzIHRvIGJlIHVzZWQgaW5zdGVhZCBvZiB0aGUgSFRUUCBIZWFkZXJzIHRoYXQgYXJlIGRlZmluZWQgaW4gdGhlIEludGVncmF0aW9uIFJlcXVlc3QgcGFuZS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYXBpZ2F0ZXdheS9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvYXBpZ2F0ZXdheS1vdmVycmlkZS1yZXF1ZXN0LXJlc3BvbnNlLXBhcmFtZXRlcnMuaHRtbFxuICAgKlxuICAgKiBAcGFyYW0gaGVhZGVyTmFtZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0UmVxdWVzdE92ZXJyaWRlSGVhZGVyKGhlYWRlck5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBgJGNvbnRleHQucmVxdWVzdE92ZXJyaWRlLmhlYWRlci4ke2hlYWRlck5hbWV9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVxdWVzdCBwYXRoIG92ZXJyaWRlLiBJZiB0aGlzIHBhcmFtZXRlciBpcyBkZWZpbmVkLFxuICAgKiBpdCBjb250YWlucyB0aGUgcmVxdWVzdCBwYXRoIHRvIGJlIHVzZWQgaW5zdGVhZCBvZiB0aGUgVVJMIFBhdGggUGFyYW1ldGVycyB0aGF0IGFyZSBkZWZpbmVkIGluIHRoZSBJbnRlZ3JhdGlvbiBSZXF1ZXN0IHBhbmUuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwaWdhdGV3YXkvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2FwaWdhdGV3YXktb3ZlcnJpZGUtcmVxdWVzdC1yZXNwb25zZS1wYXJhbWV0ZXJzLmh0bWxcbiAgICpcbiAgICogQHBhcmFtIHBhdGhOYW1lXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRSZXF1ZXN0T3ZlcnJpZGVQYXRoKHBhdGhOYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCRjb250ZXh0LnJlcXVlc3RPdmVycmlkZS5wYXRoLiR7cGF0aE5hbWV9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVxdWVzdCBxdWVyeSBzdHJpbmcgb3ZlcnJpZGUuXG4gICAqIElmIHRoaXMgcGFyYW1ldGVyIGlzIGRlZmluZWQsIGl0IGNvbnRhaW5zIHRoZSByZXF1ZXN0IHF1ZXJ5IHN0cmluZ3MgdG8gYmUgdXNlZCBpbnN0ZWFkXG4gICAqIG9mIHRoZSBVUkwgUXVlcnkgU3RyaW5nIFBhcmFtZXRlcnMgdGhhdCBhcmUgZGVmaW5lZCBpbiB0aGUgSW50ZWdyYXRpb24gUmVxdWVzdCBwYW5lLlxuICAgKlxuICAgKiBAcGFyYW0gcXVlcnlzdHJpbmdOYW1lXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRSZXF1ZXN0T3ZlcnJpZGVRdWVyeXN0cmluZyhxdWVyeXN0cmluZ05hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBgJGNvbnRleHQucmVxdWVzdE92ZXJyaWRlLnF1ZXJ5c3RyaW5nLiR7cXVlcnlzdHJpbmdOYW1lfWA7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJlc3BvbnNlIGhlYWRlciBvdmVycmlkZS5cbiAgICogSWYgdGhpcyBwYXJhbWV0ZXIgaXMgZGVmaW5lZCwgaXQgY29udGFpbnMgdGhlIGhlYWRlciB0byBiZSByZXR1cm5lZCBpbnN0ZWFkIG9mIHRoZSBSZXNwb25zZSBoZWFkZXJcbiAgICogdGhhdCBpcyBkZWZpbmVkIGFzIHRoZSBEZWZhdWx0IG1hcHBpbmcgaW4gdGhlIEludGVncmF0aW9uIFJlc3BvbnNlIHBhbmUuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwaWdhdGV3YXkvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2FwaWdhdGV3YXktb3ZlcnJpZGUtcmVxdWVzdC1yZXNwb25zZS1wYXJhbWV0ZXJzLmh0bWxcbiAgICpcbiAgICogQHBhcmFtIGhlYWRlck5hbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dFJlc3BvbnNlT3ZlcnJpZGVIZWFkZXIoaGVhZGVyTmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAkY29udGV4dC5yZXNwb25zZU92ZXJyaWRlLmhlYWRlci4ke2hlYWRlck5hbWV9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVzcG9uc2Ugc3RhdHVzIGNvZGUgb3ZlcnJpZGUuXG4gICAqIElmIHRoaXMgcGFyYW1ldGVyIGlzIGRlZmluZWQsIGl0IGNvbnRhaW5zIHRoZSBzdGF0dXMgY29kZSB0byBiZSByZXR1cm5lZCBpbnN0ZWFkIG9mIHRoZSBNZXRob2QgcmVzcG9uc2Ugc3RhdHVzXG4gICAqIHRoYXQgaXMgZGVmaW5lZCBhcyB0aGUgRGVmYXVsdCBtYXBwaW5nIGluIHRoZSBJbnRlZ3JhdGlvbiBSZXNwb25zZSBwYW5lLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9hcGlnYXRld2F5LW92ZXJyaWRlLXJlcXVlc3QtcmVzcG9uc2UtcGFyYW1ldGVycy5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRSZXNwb25zZU92ZXJyaWRlU3RhdHVzKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQucmVzcG9uc2VPdmVycmlkZS5zdGF0dXMnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBDTEYtZm9ybWF0dGVkIHJlcXVlc3QgdGltZSAoZGQvTU1NL3l5eXk6SEg6bW06c3MgKy1oaG1tKS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dFJlcXVlc3RUaW1lKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQucmVxdWVzdFRpbWUnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBFcG9jaC1mb3JtYXR0ZWQgcmVxdWVzdCB0aW1lLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0UmVxdWVzdFRpbWVFcG9jaCgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LnJlcXVlc3RUaW1lRXBvY2gnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpZGVudGlmaWVyIHRoYXQgQVBJIEdhdGV3YXkgYXNzaWducyB0byB5b3VyIHJlc291cmNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0UmVzb3VyY2VJZCgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LnJlc291cmNlSWQnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwYXRoIHRvIHlvdXIgcmVzb3VyY2UuXG4gICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIG5vbi1wcm94eSByZXF1ZXN0IFVSSSBvZiBgaHR0cHM6Ly97cmVzdC1hcGktaWQuZXhlY3V0ZS1hcGkue3JlZ2lvbn0uYW1hem9uYXdzLmNvbS97c3RhZ2V9L3Jvb3QvY2hpbGRgLFxuICAgKiBUaGUgJGNvbnRleHQucmVzb3VyY2VQYXRoIHZhbHVlIGlzIGAvcm9vdC9jaGlsZGAuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwaWdhdGV3YXkvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2FwaS1nYXRld2F5LWNyZWF0ZS1hcGktc3RlcC1ieS1zdGVwLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dFJlc291cmNlUGF0aCgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LnJlc291cmNlUGF0aCc7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGRlcGxveW1lbnQgc3RhZ2Ugb2YgdGhlIEFQSSByZXF1ZXN0IChmb3IgZXhhbXBsZSwgYEJldGFgIG9yIGBQcm9kYCkuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRTdGFnZSgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LnN0YWdlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVzcG9uc2UgcmVjZWl2ZWQgZnJvbSBBV1MgV0FGOiBgV0FGX0FMTE9XYCBvciBgV0FGX0JMT0NLYC4gV2lsbCBub3QgYmUgc2V0IGlmIHRoZSBzdGFnZSBpcyBub3QgYXNzb2NpYXRlZCB3aXRoIGEgd2ViIEFDTC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYXBpZ2F0ZXdheS9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvYXBpZ2F0ZXdheS1jb250cm9sLWFjY2Vzcy1hd3Mtd2FmLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dFdhZlJlc3BvbnNlQ29kZSgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LndhZlJlc3BvbnNlQ29kZSc7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNvbXBsZXRlIEFSTiBvZiB0aGUgd2ViIEFDTCB0aGF0IGlzIHVzZWQgdG8gZGVjaWRlIHdoZXRoZXIgdG8gYWxsb3cgb3IgYmxvY2sgdGhlIHJlcXVlc3QuXG4gICAqIFdpbGwgbm90IGJlIHNldCBpZiB0aGUgc3RhZ2UgaXMgbm90IGFzc29jaWF0ZWQgd2l0aCBhIHdlYiBBQ0wuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwaWdhdGV3YXkvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2FwaWdhdGV3YXktY29udHJvbC1hY2Nlc3MtYXdzLXdhZi5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRXZWJhY2xBcm4oKSB7XG4gICAgcmV0dXJuICckY29udGV4dC53ZWJhY2xBcm4nO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0cmFjZSBJRCBmb3IgdGhlIFgtUmF5IHRyYWNlLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9hcGlnYXRld2F5LWVuYWJsaW5nLXhyYXkuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0WHJheVRyYWNlSWQoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC54cmF5VHJhY2VJZCc7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGF1dGhvcml6ZXIgbGF0ZW5jeSBpbiBtcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dEF1dGhvcml6ZXJJbnRlZ3JhdGlvbkxhdGVuY3koKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5hdXRob3JpemVyLmludGVncmF0aW9uTGF0ZW5jeSc7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGludGVncmF0aW9uIGxhdGVuY3kgaW4gbXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRJbnRlZ3JhdGlvbkxhdGVuY3koKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5pbnRlZ3JhdGlvbkxhdGVuY3knO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBMYW1iZGEgcHJveHkgaW50ZWdyYXRpb24sIHRoaXMgcGFyYW1ldGVyIHJlcHJlc2VudHMgdGhlIHN0YXR1cyBjb2RlIHJldHVybmVkIGZyb20gQVdTIExhbWJkYSxcbiAgICogbm90IGZyb20gdGhlIGJhY2tlbmQgTGFtYmRhIGZ1bmN0aW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0SW50ZWdyYXRpb25TdGF0dXMoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5pbnRlZ3JhdGlvblN0YXR1cyc7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJlc3BvbnNlIGxhdGVuY3kgaW4gbXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRSZXNwb25zZUxhdGVuY3koKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5yZXNwb25zZUxhdGVuY3knO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByZXNwb25zZSBwYXlsb2FkIGxlbmd0aC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dFJlc3BvbnNlTGVuZ3RoKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQucmVzcG9uc2VMZW5ndGgnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgcmVzcG9uc2Ugc3RhdHVzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0U3RhdHVzKCkge1xuICAgIHJldHVybiAnJGNvbnRleHQuc3RhdHVzJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYXV0aG9yaXphdGlvbiBlcnJvciBtZXNzYWdlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0QXV0aG9yaXplRXJyb3IoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5hdXRob3JpemUuZXJyb3InO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhdXRob3JpemF0aW9uIGxhdGVuY3kgaW4gbXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRBdXRob3JpemVMYXRlbmN5KCkge1xuICAgIHJldHVybiAnJGNvbnRleHQuYXV0aG9yaXplLmxhdGVuY3knO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0dXMgY29kZSByZXR1cm5lZCBmcm9tIGFuIGF1dGhvcml6YXRpb24gYXR0ZW1wdC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dEF1dGhvcml6ZVN0YXR1cygpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmF1dGhvcml6ZS5zdGF0dXMnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBlcnJvciBtZXNzYWdlIHJldHVybmVkIGZyb20gYW4gYXV0aG9yaXplci5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dEF1dGhvcml6ZXJFcnJvcigpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmF1dGhvcml6ZXIuZXJyb3InO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0dXMgY29kZSByZXR1cm5lZCBmcm9tIGEgTGFtYmRhIGF1dGhvcml6ZXIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRBdXRob3JpemVySW50ZWdyYXRpb25TdGF0dXMoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5hdXRob3JpemVyLmludGVncmF0aW9uU3RhdHVzJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYXV0aG9yaXplciBsYXRlbmN5IGluIG1zLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0QXV0aG9yaXplckxhdGVuY3koKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5hdXRob3JpemVyLmxhdGVuY3knO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBBV1MgZW5kcG9pbnQncyByZXF1ZXN0IElELlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0QXV0aG9yaXplclJlcXVlc3RJZCgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmF1dGhvcml6ZXIucmVxdWVzdElkJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc3RhdHVzIGNvZGUgcmV0dXJuZWQgZnJvbSBhbiBhdXRob3JpemVyLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250ZXh0QXV0aG9yaXplclN0YXR1cygpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmF1dGhvcml6ZXIuc3RhdHVzJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZXJyb3IgbWVzc2FnZSByZXR1cm5lZCBmcm9tIGFuIGF1dGhlbnRpY2F0aW9uIGF0dGVtcHQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRBdXRoZW50aWNhdGVFcnJvcigpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmF1dGhlbnRpY2F0ZS5lcnJvcic7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGF1dGhlbnRpY2F0aW9uIGxhdGVuY3kgaW4gbXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRBdXRoZW50aWNhdGVMYXRlbmN5KCkge1xuICAgIHJldHVybiAnJGNvbnRleHQuYXV0aGVudGljYXRlLmxhdGVuY3knO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0dXMgY29kZSByZXR1cm5lZCBmcm9tIGFuIGF1dGhlbnRpY2F0aW9uIGF0dGVtcHQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRBdXRoZW50aWNhdGVTdGF0dXMoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5hdXRoZW50aWNhdGUuc3RhdHVzJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCBmb3IgYW4gQVBJIG1hcHBpbmcgdGhhdCBhbiBpbmNvbWluZyByZXF1ZXN0IG1hdGNoZWQuXG4gICAqIEFwcGxpY2FibGUgd2hlbiBhIGNsaWVudCB1c2VzIGEgY3VzdG9tIGRvbWFpbiBuYW1lIHRvIGFjY2VzcyBhbiBBUEkuIEZvciBleGFtcGxlIGlmIGEgY2xpZW50IHNlbmRzIGEgcmVxdWVzdCB0b1xuICAgKiBodHRwczovL2FwaS5leGFtcGxlLmNvbS92MS9vcmRlcnMvMTIzNCwgYW5kIHRoZSByZXF1ZXN0IG1hdGNoZXMgdGhlIEFQSSBtYXBwaW5nIHdpdGggdGhlIHBhdGggdjEvb3JkZXJzLCB0aGUgdmFsdWUgaXMgdjEvb3JkZXJzLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lbl9qcC9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9yZXN0LWFwaS1tYXBwaW5ncy5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRDdXN0b21Eb21haW5CYXNlUGF0aE1hdGNoZWQoKSB7XG4gICAgcmV0dXJuICckY29udGV4dC5jdXN0b21Eb21haW4uYmFzZVBhdGhNYXRjaGVkJztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHN0cmluZyB0aGF0IGNvbnRhaW5zIGFuIGludGVncmF0aW9uIGVycm9yIG1lc3NhZ2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRJbnRlZ3JhdGlvbkVycm9yTWVzc2FnZSgpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LmludGVncmF0aW9uRXJyb3JNZXNzYWdlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZXJyb3IgbWVzc2FnZSByZXR1cm5lZCBmcm9tIEFXUyBXQUYuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHRXYWZFcnJvcigpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LndhZi5lcnJvcic7XG4gIH1cblxuICAvKipcbiAgICogVGhlIEFXUyBXQUYgbGF0ZW5jeSBpbiBtcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dFdhZkxhdGVuY3koKSB7XG4gICAgcmV0dXJuICckY29udGV4dC53YWYubGF0ZW5jeSc7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHN0YXR1cyBjb2RlIHJldHVybmVkIGZyb20gQVdTIFdBRi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGV4dFdhZlN0YXR1cygpIHtcbiAgICByZXR1cm4gJyRjb250ZXh0LndhZi5zdGF0dXMnO1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgY29udHJvbGxpbmcgaXRlbXMgb3V0cHV0IGluIEpTT04gc3RhbmRhcmQgZm9ybWF0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSnNvbldpdGhTdGFuZGFyZEZpZWxkUHJvcHMge1xuICAvKipcbiAgICogSWYgdGhpcyBmbGFnIGlzIGVuYWJsZWQsIHRoZSBzb3VyY2UgSVAgb2YgcmVxdWVzdCB3aWxsIGJlIG91dHB1dCB0byB0aGUgbG9nXG4gICAqL1xuICByZWFkb25seSBpcDogYm9vbGVhbixcbiAgLyoqXG4gICAqIElmIHRoaXMgZmxhZyBpcyBlbmFibGVkLCB0aGUgcHJpbmNpcGFsIGlkZW50aWZpZXIgb2YgdGhlIGNhbGxlciB3aWxsIGJlIG91dHB1dCB0byB0aGUgbG9nXG4gICAqL1xuICByZWFkb25seSBjYWxsZXI6IGJvb2xlYW4sXG4gIC8qKlxuICAgKiBJZiB0aGlzIGZsYWcgaXMgZW5hYmxlZCwgdGhlIHByaW5jaXBhbCBpZGVudGlmaWVyIG9mIHRoZSB1c2VyIHdpbGwgYmUgb3V0cHV0IHRvIHRoZSBsb2dcbiAgICovXG4gIHJlYWRvbmx5IHVzZXI6IGJvb2xlYW4sXG4gIC8qKlxuICAgKiBJZiB0aGlzIGZsYWcgaXMgZW5hYmxlZCwgdGhlIENMRi1mb3JtYXR0ZWQgcmVxdWVzdCB0aW1lKChkZC9NTU0veXl5eTpISDptbTpzcyArLWhobW0pIHdpbGwgYmUgb3V0cHV0IHRvIHRoZSBsb2dcbiAgICovXG4gIHJlYWRvbmx5IHJlcXVlc3RUaW1lOiBib29sZWFuLFxuICAvKipcbiAgICogSWYgdGhpcyBmbGFnIGlzIGVuYWJsZWQsIHRoZSBodHRwIG1ldGhvZCB3aWxsIGJlIG91dHB1dCB0byB0aGUgbG9nXG4gICAqL1xuICByZWFkb25seSBodHRwTWV0aG9kOiBib29sZWFuLFxuICAvKipcbiAgICogSWYgdGhpcyBmbGFnIGlzIGVuYWJsZWQsIHRoZSBwYXRoIHRvIHlvdXIgcmVzb3VyY2Ugd2lsbCBiZSBvdXRwdXQgdG8gdGhlIGxvZ1xuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VQYXRoOiBib29sZWFuLFxuICAvKipcbiAgICogSWYgdGhpcyBmbGFnIGlzIGVuYWJsZWQsIHRoZSBtZXRob2QgcmVzcG9uc2Ugc3RhdHVzIHdpbGwgYmUgb3V0cHV0IHRvIHRoZSBsb2dcbiAgICovXG4gIHJlYWRvbmx5IHN0YXR1czogYm9vbGVhbixcbiAgLyoqXG4gICAqIElmIHRoaXMgZmxhZyBpcyBlbmFibGVkLCB0aGUgcmVxdWVzdCBwcm90b2NvbCB3aWxsIGJlIG91dHB1dCB0byB0aGUgbG9nXG4gICAqL1xuICByZWFkb25seSBwcm90b2NvbDogYm9vbGVhbixcbiAgLyoqXG4gICAqIElmIHRoaXMgZmxhZyBpcyBlbmFibGVkLCB0aGUgcmVzcG9uc2UgcGF5bG9hZCBsZW5ndGggd2lsbCBiZSBvdXRwdXQgdG8gdGhlIGxvZ1xuICAgKi9cbiAgcmVhZG9ubHkgcmVzcG9uc2VMZW5ndGg6IGJvb2xlYW5cbn1cblxuLyoqXG4gKiBmYWN0b3J5IG1ldGhvZHMgZm9yIGFjY2VzcyBsb2cgZm9ybWF0LlxuICovXG5leHBvcnQgY2xhc3MgQWNjZXNzTG9nRm9ybWF0IHtcbiAgLyoqXG4gICAqIEN1c3RvbSBsb2cgZm9ybWF0LlxuICAgKiBZb3UgY2FuIGNyZWF0ZSBhbnkgbG9nIGZvcm1hdCBzdHJpbmcuIFlvdSBjYW4gZWFzaWx5IGdldCB0aGUgJCBjb250ZXh0IHZhcmlhYmxlIGJ5IHVzaW5nIHRoZSBtZXRob2RzIG9mIEFjY2Vzc0xvZ0ZpZWxkLlxuICAgKiBAcGFyYW0gZm9ybWF0XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICBhcGlnYXRld2F5LkFjY2Vzc0xvZ0Zvcm1hdC5jdXN0b20oSlNPTi5zdHJpbmdpZnkoe1xuICAgKiAgICAgIHJlcXVlc3RJZDogYXBpZ2F0ZXdheS5BY2Nlc3NMb2dGaWVsZC5jb250ZXh0UmVxdWVzdElkKCksXG4gICAqICAgICAgc291cmNlSXA6IGFwaWdhdGV3YXkuQWNjZXNzTG9nRmllbGQuY29udGV4dElkZW50aXR5U291cmNlSXAoKSxcbiAgICogICAgICBtZXRob2Q6IGFwaWdhdGV3YXkuQWNjZXNzTG9nRmllbGQuY29udGV4dEh0dHBNZXRob2QoKSxcbiAgICogICAgICB1c2VyQ29udGV4dDoge1xuICAgKiAgICAgICAgc3ViOiBhcGlnYXRld2F5LkFjY2Vzc0xvZ0ZpZWxkLmNvbnRleHRBdXRob3JpemVyQ2xhaW1zKCdzdWInKSxcbiAgICogICAgICAgIGVtYWlsOiBhcGlnYXRld2F5LkFjY2Vzc0xvZ0ZpZWxkLmNvbnRleHRBdXRob3JpemVyQ2xhaW1zKCdlbWFpbCcpXG4gICAqICAgICAgfVxuICAgKiAgIH0pKVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjdXN0b20oZm9ybWF0OiBzdHJpbmcpOiBBY2Nlc3NMb2dGb3JtYXQge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTG9nRm9ybWF0KGZvcm1hdCk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgQ29tbW9uIExvZyBGb3JtYXQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNsZigpOiBBY2Nlc3NMb2dGb3JtYXQge1xuICAgIGNvbnN0IHJlcXVlc3RlciA9IFtBY2Nlc3NMb2dGaWVsZC5jb250ZXh0SWRlbnRpdHlTb3VyY2VJcCgpLCBBY2Nlc3NMb2dGaWVsZC5jb250ZXh0SWRlbnRpdHlDYWxsZXIoKSwgQWNjZXNzTG9nRmllbGQuY29udGV4dElkZW50aXR5VXNlcigpXS5qb2luKCcgJyk7XG4gICAgY29uc3QgcmVxdWVzdFRpbWUgPSBBY2Nlc3NMb2dGaWVsZC5jb250ZXh0UmVxdWVzdFRpbWUoKTtcbiAgICBjb25zdCByZXF1ZXN0ID0gW0FjY2Vzc0xvZ0ZpZWxkLmNvbnRleHRIdHRwTWV0aG9kKCksIEFjY2Vzc0xvZ0ZpZWxkLmNvbnRleHRSZXNvdXJjZVBhdGgoKSwgQWNjZXNzTG9nRmllbGQuY29udGV4dFByb3RvY29sKCldLmpvaW4oJyAnKTtcbiAgICBjb25zdCBzdGF0dXMgPSBbQWNjZXNzTG9nRmllbGQuY29udGV4dFN0YXR1cygpLCBBY2Nlc3NMb2dGaWVsZC5jb250ZXh0UmVzcG9uc2VMZW5ndGgoKSwgQWNjZXNzTG9nRmllbGQuY29udGV4dFJlcXVlc3RJZCgpXS5qb2luKCcgJyk7XG5cbiAgICByZXR1cm4gbmV3IEFjY2Vzc0xvZ0Zvcm1hdChgJHtyZXF1ZXN0ZXJ9IFske3JlcXVlc3RUaW1lfV0gXCIke3JlcXVlc3R9XCIgJHtzdGF0dXN9YCk7XG4gIH1cblxuICAvKipcbiAgICogQWNjZXNzIGxvZyB3aWxsIGJlIHByb2R1Y2VkIGluIHRoZSBKU09OIGZvcm1hdCB3aXRoIGEgc2V0IG9mIGZpZWxkcyBtb3N0IHVzZWZ1bCBpbiB0aGUgYWNjZXNzIGxvZy4gQWxsIGZpZWxkcyBhcmUgdHVybmVkIG9uIGJ5IGRlZmF1bHQgd2l0aCB0aGVcbiAgICogb3B0aW9uIHRvIHR1cm4gb2ZmIHNwZWNpZmljIGZpZWxkcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMganNvbldpdGhTdGFuZGFyZEZpZWxkcyhcbiAgICBmaWVsZHM6IEpzb25XaXRoU3RhbmRhcmRGaWVsZFByb3BzID0ge1xuICAgICAgaXA6IHRydWUsXG4gICAgICB1c2VyOiB0cnVlLFxuICAgICAgY2FsbGVyOiB0cnVlLFxuICAgICAgcmVxdWVzdFRpbWU6IHRydWUsXG4gICAgICBodHRwTWV0aG9kOiB0cnVlLFxuICAgICAgcmVzb3VyY2VQYXRoOiB0cnVlLFxuICAgICAgc3RhdHVzOiB0cnVlLFxuICAgICAgcHJvdG9jb2w6IHRydWUsXG4gICAgICByZXNwb25zZUxlbmd0aDogdHJ1ZSxcbiAgICB9KTogQWNjZXNzTG9nRm9ybWF0IHtcbiAgICByZXR1cm4gdGhpcy5jdXN0b20oSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgcmVxdWVzdElkOiBBY2Nlc3NMb2dGaWVsZC5jb250ZXh0UmVxdWVzdElkKCksXG4gICAgICBpcDogZmllbGRzLmlwID8gQWNjZXNzTG9nRmllbGQuY29udGV4dElkZW50aXR5U291cmNlSXAoKSA6IHVuZGVmaW5lZCxcbiAgICAgIHVzZXI6IGZpZWxkcy51c2VyID8gQWNjZXNzTG9nRmllbGQuY29udGV4dElkZW50aXR5VXNlcigpIDogdW5kZWZpbmVkLFxuICAgICAgY2FsbGVyOiBmaWVsZHMuY2FsbGVyID8gQWNjZXNzTG9nRmllbGQuY29udGV4dElkZW50aXR5Q2FsbGVyKCkgOiB1bmRlZmluZWQsXG4gICAgICByZXF1ZXN0VGltZTogZmllbGRzLnJlcXVlc3RUaW1lID8gQWNjZXNzTG9nRmllbGQuY29udGV4dFJlcXVlc3RUaW1lKCkgOiB1bmRlZmluZWQsXG4gICAgICBodHRwTWV0aG9kOiBmaWVsZHMuaHR0cE1ldGhvZCA/IEFjY2Vzc0xvZ0ZpZWxkLmNvbnRleHRIdHRwTWV0aG9kKCkgOiB1bmRlZmluZWQsXG4gICAgICByZXNvdXJjZVBhdGg6IGZpZWxkcy5yZXNvdXJjZVBhdGggPyBBY2Nlc3NMb2dGaWVsZC5jb250ZXh0UmVzb3VyY2VQYXRoKCkgOiB1bmRlZmluZWQsXG4gICAgICBzdGF0dXM6IGZpZWxkcy5zdGF0dXMgPyBBY2Nlc3NMb2dGaWVsZC5jb250ZXh0U3RhdHVzKCkgOiB1bmRlZmluZWQsXG4gICAgICBwcm90b2NvbDogZmllbGRzLnByb3RvY29sID8gQWNjZXNzTG9nRmllbGQuY29udGV4dFByb3RvY29sKCkgOiB1bmRlZmluZWQsXG4gICAgICByZXNwb25zZUxlbmd0aDogZmllbGRzLnJlc3BvbnNlTGVuZ3RoID8gQWNjZXNzTG9nRmllbGQuY29udGV4dFJlc3BvbnNlTGVuZ3RoKCkgOiB1bmRlZmluZWQsXG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgQVBJIEdhdGV3YXkgY3VzdG9tIGFjY2VzcyBsb2cgZm9ybWF0XG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGZvcm1hdDogc3RyaW5nO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoZm9ybWF0OiBzdHJpbmcpIHtcbiAgICB0aGlzLmZvcm1hdCA9IGZvcm1hdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdXRwdXQgYSBmb3JtYXQgc3RyaW5nIHRvIGJlIHVzZWQgd2l0aCBDbG91ZEZvcm1hdGlvbi5cbiAgICovXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmZvcm1hdDtcbiAgfVxufVxuIl19