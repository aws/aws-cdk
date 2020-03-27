import { ILogGroup } from '@aws-cdk/aws-logs';

/**
 * A API Gateway custom access log destination.
 */
export interface IAccessLogDestination {
  /**
   * Binds destination.
   */
  bind(): AccessLogDestinationConfig
}

/**
 * Options when binding a destination to a API Gateway
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
export class LogGroupLogDestination implements IAccessLogDestination {
  constructor(private readonly logGroup: ILogGroup) {
  }

  /**
   * Binds this destination to the CloudWatch Logs.
   */
  public bind(): AccessLogDestinationConfig {
    return {
      destinationArn: this.logGroup.logGroupArn
    };
  }
}

/**
 * $context variables when customize access log.
 */
export class AccessLogField {
  /**
   * The API owner's AWS account ID.
   */
  public static contextAccountId() {
    return '$context.requestId';
  }

  /**
   * The identifier API Gateway assigns to your API.
   */
  public static contextApiId() {
    return '$context.apiId';
  }

  /**
   * A property of the claims returned from the Amazon Cognito user pool after the method caller is successfully authenticated.
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html
   *
   * @param property A property key of the claims.
   */
  public static contextAuthorizerClaims(property: string) {
    return `$context.authorizer.claims.${property}`;
  }

  /**
   * The principal user identification associated with the token sent by the client and returned
   * from an API Gateway Lambda authorizer (formerly known as a custom authorizer).
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
   */
  public static contextAuthorizerPrincipalId() {
    return '$context.authorizer.principalId';
  }

  /**
   * The stringified value of the specified key-value pair of the `context` map returned from an API Gateway Lambda authorizer function.
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
   * @param property key of the context map.
   */
  public static contextAuthorizer(property: string) {
    return `$context.authorizer.${property}`;
  }

  /**
   * The AWS endpoint's request ID.
   */
  public static contextAwsEndpointRequestId() {
    return '$context.awsEndpointRequestId';
  }

  /**
   * The full domain name used to invoke the API. This should be the same as the incoming `Host` header.
   */
  public static contextDomainName() {
    return '$context.domainName';
  }

  /**
   * The first label of the `$context.domainName`. This is often used as a caller/customer identifier.
   */
  public static contextDomainPrefix() {
    return '$context.domainPrefix';
  }

  /**
   * A string containing an API Gateway error message.
   * This variable can only be used for simple variable substitution in a GatewayResponse body-mapping template,
   * which is not processed by the Velocity Template Language engine, and in access logging.
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-logging.html
   *                       https://docs.aws.amazon.com/apigateway/latest/developerguide/customize-gateway-responses.html
   */
  public static contextErrorMessage() {
    return '$context.error.message';
  }

  /**
   * The quoted value of $context.error.message, namely "$context.error.message".
   */
  public static contextErrorMessageString() {
    return '$context.error.messageString';
  }

  /**
   * A type of GatewayResponse. This variable can only be used for simple variable substitution in a GatewayResponse body-mapping template,
   * which is not processed by the Velocity Template Language engine, and in access logging.
   *
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-logging.html
   *                       https://docs.aws.amazon.com/apigateway/latest/developerguide/customize-gateway-responses.html
   */
  public static contextErrorResponseType() {
    return '$context.error.responseType';
  }

  /**
   * A string containing a detailed validation error message.
   */
  public static contextErrorValidationErrorString() {
    return '$context.error.validationErrorString';
  }

  /**
   * The extended ID that API Gateway assigns to the API request, which contains more useful information for debugging/troubleshooting.
   */
  public static contextExtendedRequestId() {
    return '$context.extendedRequestId';
  }

  /**
   * The HTTP method used. Valid values include: `DELETE`, `GET`, `HEAD`, `OPTIONS`, `PATCH`, `POST`, and `PUT`.
   */
  public static contextHttpMethod() {
    return '$context.httpMethod';
  }

  /**
   * The AWS account ID associated with the request.
   */
  public static contextIdentityAccountId() {
    return '$context.identity.accountId';
  }

  /**
   * For API methods that require an API key, this variable is the API key associated with the method request.
   * For methods that don't require an API key, this variable is
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html
   */
  public static contextIdentityApiKey() {
    return '$context.identity.apiKey';
  }

  /**
   * The API key ID associated with an API request that requires an API key.
   */
  public static contextIdentityApiKeyId() {
    return '$context.identity.apiKeyId';
  }

  /**
   * The principal identifier of the caller making the request.
   */
  public static contextIdentityCaller() {
    return '$context.identity.caller';
  }

  /**
   * The Amazon Cognito authentication provider used by the caller making the request.
   * Available only if the request was signed with Amazon Cognito credentials.
   * For more information: https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html
   */
  public static contextIdentityCognitoAuthenticationProvider() {
    return '$context.identity.cognitoAuthenticationProvider';
  }

  /**
   * The Amazon Cognito authentication type of the caller making the request.
   * Available only if the request was signed with Amazon Cognito credentials.
   */
  public static contextIdentityCognitoAuthenticationType() {
    return '$context.identity.cognitoAuthenticationType';
  }

  /**
   * The Amazon Cognito identity ID of the caller making the request. Available only if the request was signed with Amazon Cognito credentials.
   */
  public static contextIdentityCognitoIdentityId() {
    return '$context.identity.cognitoIdentityId';
  }

  /**
   * The Amazon Cognito identity pool ID of the caller making the request.
   * Available only if the request was signed with Amazon Cognito credentials.
   */
  public static contextIdentityCognitoIdentityPoolId() {
    return '$context.identity.cognitoIdentityPoolId';
  }

  /**
   * The AWS organization ID.
   */
  public static contextIdentityPrincipalOrgId() {
    return '$context.identity.principalOrgId';
  }

  /**
   * The source IP address of the TCP connection making the request to API Gateway.
   * Warning: You should not trust this value if there is any chance that the `X-Forwarded-For` header could be forged.
   */
  public static contextIdentitySourceIp() {
    return '$context.identity.sourceIp';
  }

  /**
   * The principal identifier of the user making the request. Used in Lambda authorizers.
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
   */
  public static contextIdentityUser() {
    return '$context.identity.user';
  }

  /**
   * The User-Agent header of the API caller.
   */
  public static contextIdentityUserAgent() {
    return '$context.identity.userAgent';
  }

  /**
   * The Amazon Resource Name (ARN) of the effective user identified after authentication.
   * For more information: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html
   */
  public static contextIdentityUserArn() {
    return '$context.identity.userArn';
  }

  /**
   * The request path.
   * For example, for a non-proxy request URL of https://{rest-api-id.execute-api.{region}.amazonaws.com/{stage}/root/child,
   * the $context.path value is /{stage}/root/child.
   */
  public static contextPath() {
    return '$context.path';
  }

  /**
   * The request protocol, for example, HTTP/1.1.
   */
  public static contextProtocol() {
    return '$context.protocol';
  }

  /**
   * The ID that API Gateway assigns to the API request.
   */
  public static contextRequestId() {
    return '$context.requestId';
  }

  /**
   * The request header override.
   * If this parameter is defined, it contains the headers to be used instead of the HTTP Headers that are defined in the Integration Request pane.
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-override-request-response-parameters.html
   *
   * @param headerName
   */
  public static contextRequestOverrideHeader(headerName: string) {
    return `$context.requestOverride.header.${headerName}`;
  }

  /**
   * The request path override. If this parameter is defined,
   * it contains the request path to be used instead of the URL Path Parameters that are defined in the Integration Request pane.
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-override-request-response-parameters.html
   *
   * @param pathName
   */
  public static contextRequestOverridePath(pathName: string) {
    return `$context.requestOverride.path.${pathName}`;
  }

  /**
   * The request query string override.
   * If this parameter is defined, it contains the request query strings to be used instead
   * of the URL Query String Parameters that are defined in the Integration Request pane.
   *
   * @param querystringName
   */
  public static contextRequestOverrideQuerystring(querystringName: string) {
    return `$context.requestOverride.querystring.${querystringName}`;
  }

  /**
   * The response header override.
   * If this parameter is defined, it contains the header to be returned instead of the Response header
   * that is defined as the Default mapping in the Integration Response pane.
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-override-request-response-parameters.html
   *
   * @param headerName
   */
  public static contextResponseOverrideHeader(headerName: string) {
    return `$context.responseOverride.header.${headerName}`;
  }

  /**
   * The response status code override.
   * If this parameter is defined, it contains the status code to be returned instead of the Method response status
   * that is defined as the Default mapping in the Integration Response pane.
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-override-request-response-parameters.html
   */
  public static contextResponseOverrideStatus() {
    return '$context.responseOverride.status';
  }

  /**
   * The CLF-formatted request time (dd/MMM/yyyy:HH:mm:ss +-hhmm).
   */
  public static contextRequestTime() {
    return '$context.requestTime';
  }

  /**
   * The Epoch-formatted request time.
   */
  public static contextRequestTimeEpoch() {
    return '$context.requestTimeEpoch';
  }

  /**
   * The identifier that API Gateway assigns to your resource.
   */
  public static contextResourceId() {
    return '$context.resourceId';
  }

  /**
   * The path to your resource.
   * For example, for the non-proxy request URI of `https://{rest-api-id.execute-api.{region}.amazonaws.com/{stage}/root/child`,
   * The $context.resourcePath value is `/root/child`.
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-step-by-step.html
   */
  public static contextResourcePath() {
    return '$context.resourcePath';
  }

  /**
   * The deployment stage of the API request (for example, `Beta` or `Prod`).
   */
  public static contextStage() {
    return '$context.stage';
  }

  /**
   * The response received from AWS WAF: `WAF_ALLOW` or `WAF_BLOCK`. Will not be set if the stage is not associated with a web ACL.
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-aws-waf.html
   */
  public static contextWafResponseCode() {
    return '$context.wafResponseCode';
  }

  /**
   * The complete ARN of the web ACL that is used to decide whether to allow or block the request.
   * Will not be set if the stage is not associated with a web ACL.
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-aws-waf.html
   */
  public static contextWebaclArn() {
    return '$context.webaclArn';
  }

  /**
   * The trace ID for the X-Ray trace.
   * For more information: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-enabling-xray.html
   */
  public static contextXrayTraceId() {
    return '$context.xrayTraceId';
  }

  /**
   * The authorizer latency in ms.
   */
  public static contextAuthorizerIntegrationLatency() {
    return '$context.authorizer.integrationLatency';
  }

  /**
   * The integration latency in ms.
   */
  public static contextIntegrationLatency() {
    return '$context.integrationLatency';
  }

  /**
   * For Lambda proxy integration, this parameter represents the status code returned from AWS Lambda,
   * not from the backend Lambda function.
   */
  public static contextIntegrationStatus() {
    return '$context.integrationStatus.';
  }

  /**
   * The response latency in ms.
   */
  public static contextResponseLatency() {
    return '$context.responseLatency';
  }

  /**
   * The response payload length.
   */
  public static contextResponseLength() {
    return '$context.responseLength';
  }

  /**
   * The method response status.
   */
  public static contextStatus() {
    return '$context.status';
  }
}

/**
 * A API Gateway custom access log format.
 */
export interface AccessLogOptions {
  /**
   * A API Gateway custom access log format
   */
  readonly format: string;
}

/**
 * jsonWithStandardFields property
 */
export interface IJsonWithStandardFieldProps {
  /**
   * If this flag is enabled, $context.identity.sourceIp will be output to the log
   */
  ip: boolean,
  /**
   * If this flag is enabled, $context.identity.caller will be output to the log
   */
  caller: boolean,
  /**
   * If this flag is enabled, $context.identity.user will be output to the log
   */
  user: boolean,
  /**
   * If this flag is enabled, $context.requestTime will be output to the log
   */
  requestTime: boolean,
  /**
   * If this flag is enabled, $context.httpMethod will be output to the log
   */
  httpMethod: boolean,
  /**
   * If this flag is enabled, $context.resourcePath will be output to the log
   */
  resourcePath: boolean,
  /**
   * If this flag is enabled, $context.status will be output to the log
   */
  status: boolean,
  /**
   * If this flag is enabled, $context.protocol will be output to the log
   */
  protocol: boolean,
  /**
   * If this flag is enabled, $context.responseLength will be output to the log
   */
  responseLength: boolean
}

/**
 * factory methods for access log format.
 */
export class AccessLogFormat {
  /**
   * Generate Common Log Format.
   */
  public static clf(): AccessLogOptions {
    return {
      format: `${AccessLogField.contextIdentitySourceIp()} ${AccessLogField.contextIdentityCaller()} ${AccessLogField.contextIdentityUser()} \
[${AccessLogField.contextRequestTime()}] "${AccessLogField.contextHttpMethod()} ${AccessLogField.contextResourcePath()} ${AccessLogField.contextProtocol()}" \
${AccessLogField.contextStatus()} ${AccessLogField.contextResponseLength()} ${AccessLogField.contextRequestId()}`
    };
  }

  /**
   * Access log will be produced in the JSON format with a set of fields most useful in the
   * access log. All fields are turned on by default with the option to turn off specific fields.
   */
  public static jsonWithStandardFields(
    fields: IJsonWithStandardFieldProps = {
      ip: true,
      user: true,
      caller: true,
      requestTime: true,
      httpMethod: true,
      resourcePath: true,
      status: true,
      protocol: true,
      responseLength: true
    }): AccessLogOptions {
    return {
      format: JSON.stringify({
        requestId: AccessLogField.contextRequestId(),
        ip: fields.ip ? AccessLogField.contextIdentitySourceIp() : undefined,
        user: fields.user ? AccessLogField.contextIdentityUser() : undefined,
        caller: fields.caller ? AccessLogField.contextIdentityCaller() : undefined,
        requestTime: fields.requestTime ? AccessLogField.contextRequestTime() : undefined,
        httpMethod: fields.httpMethod ? AccessLogField.contextHttpMethod() : undefined,
        resourcePath: fields.resourcePath ? AccessLogField.contextResourcePath() : undefined,
        status: fields.status ? AccessLogField.contextStatus() : undefined,
        protocol: fields.protocol ? AccessLogField.contextProtocol() : undefined,
        responseLength: fields.responseLength ? AccessLogField.contextResponseLength() : undefined
      })
    };
  }

  /**
   * Custom log format.
   * You can create any log format string. You can easily get the $ context variable by using the methods of AccessLogField.
   * @param format
   * @example custom(JSON.stringify({
   *  requestId: AccessLogField.contextRequestId(),
   *  sourceIp: AccessLogField.contextIdentitySourceIp(),
   *  method: AccessLogFiled.contextHttpMethod(),
   *  userContext: {
   *    sub: AccessLogField.contextAuthorizerClaims('sub'),
   *    email: AccessLogField.contextAuthorizerClaims('email')
   *  }
   * }))
   */
  public static custom(format: string): AccessLogOptions {
    return {format};
  }
}
