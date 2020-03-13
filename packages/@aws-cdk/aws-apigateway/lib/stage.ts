import { ILogGroup } from '@aws-cdk/aws-logs';
import { Construct, Duration, Resource, Stack } from '@aws-cdk/core';

import { CfnStage } from './apigateway.generated';
import { Deployment } from './deployment';
import { IRestApi } from './restapi';
import { parseMethodOptionsPath } from './util';

export interface StageOptions extends MethodDeploymentOptions {
  /**
   * The name of the stage, which API Gateway uses as the first path segment
   * in the invoked Uniform Resource Identifier (URI).
   *
   * @default - "prod"
   */
  readonly stageName?: string;

  /**
   * The CloudWatch Logs log group or Kinesis Data Firehose delivery stream.
   * If you specify a Kinesis Data Firehose delivery stream. the stream name must begin
   * with `amazon-apigateway-`.
   *
   * @default - No destination
   */
  readonly accessLogDestination?: IAccessLogDestination;

  /**
   * A single line format of access logs of data, as specified by selected $content variables.
   * https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference
   * The format must include at least `$context.requestId`.
   *
   * @default - No format
   */
  readonly accessLogFormat?: string;

  /**
   * Specifies whether Amazon X-Ray tracing is enabled for this method.
   *
   * @default false
   */
  readonly tracingEnabled?: boolean;

  /**
   * Indicates whether cache clustering is enabled for the stage.
   *
   * @default - Disabled for the stage.
   */
  readonly cacheClusterEnabled?: boolean;

  /**
   * The stage's cache cluster size.
   * @default 0.5
   */
  readonly cacheClusterSize?: string;

  /**
   * The identifier of the client certificate that API Gateway uses to call
   * your integration endpoints in the stage.
   *
   * @default - None.
   */
  readonly clientCertificateId?: string;

  /**
   * A description of the purpose of the stage.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * The version identifier of the API documentation snapshot.
   *
   * @default - No documentation version.
   */
  readonly documentationVersion?: string;

  /**
   * A map that defines the stage variables. Variable names must consist of
   * alphanumeric characters, and the values must match the following regular
   * expression: [A-Za-z0-9-._~:/?#&amp;=,]+.
   *
   * @default - No stage variables.
   */
  readonly variables?: { [key: string]: string };

  /**
   * Method deployment options for specific resources/methods. These will
   * override common options defined in `StageOptions#methodOptions`.
   *
   * @param path is {resource_path}/{http_method} (i.e. /api/toys/GET) for an
   * individual method override. You can use `*` for both {resource_path} and {http_method}
   * to define options for all methods/resources.
   *
   * @default - Common options will be used.
   */
  readonly methodOptions?: { [path: string]: MethodDeploymentOptions };
}

export interface StageProps extends StageOptions {
  /**
   * The deployment that this stage points to [disable-awslint:ref-via-interface].
   */
  readonly deployment: Deployment;
}

export enum MethodLoggingLevel {
  OFF = 'OFF',
  ERROR = 'ERROR',
  INFO = 'INFO'
}

export interface MethodDeploymentOptions {
  /**
   * Specifies whether Amazon CloudWatch metrics are enabled for this method.
   *
   * @default false
   */
  readonly metricsEnabled?: boolean;

  /**
   * Specifies the logging level for this method, which effects the log
   * entries pushed to Amazon CloudWatch Logs.
   *
   * @default - Off
   */
  readonly loggingLevel?: MethodLoggingLevel;

  /**
   * Specifies whether data trace logging is enabled for this method, which
   * effects the log entries pushed to Amazon CloudWatch Logs.
   *
   * @default false
   */
  readonly dataTraceEnabled?: boolean;

  /**
   * Specifies the throttling burst limit.
   * The total rate of all requests in your AWS account is limited to 5,000 requests.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html
   *
   * @default - No additional restriction.
   */
  readonly throttlingBurstLimit?: number;

  /**
   * Specifies the throttling rate limit.
   * The total rate of all requests in your AWS account is limited to 10,000 requests per second (rps).
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html
   *
   * @default - No additional restriction.
   */
  readonly throttlingRateLimit?: number;

  /**
   * Specifies whether responses should be cached and returned for requests. A
   * cache cluster must be enabled on the stage for responses to be cached.
   *
   * @default - Caching is Disabled.
   */
  readonly cachingEnabled?: boolean;

  /**
   * Specifies the time to live (TTL), in seconds, for cached responses. The
   * higher the TTL, the longer the response will be cached.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html
   *
   * @default Duration.minutes(5)
   */
  readonly cacheTtl?: Duration;

  /**
   * Indicates whether the cached responses are encrypted.
   *
   * @default false
   */
  readonly cacheDataEncrypted?: boolean;
}

export class Stage extends Resource {
  /**
   * @attribute
   */
  public readonly stageName: string;

  public readonly restApi: IRestApi;
  private enableCacheCluster?: boolean;

  private readonly accessLogDestination?: IAccessLogDestination;
  private readonly accessLogFormat?: string;

  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id);

    this.enableCacheCluster = props.cacheClusterEnabled;

    const methodSettings = this.renderMethodSettings(props); // this can mutate `this.cacheClusterEnabled`

    // custom access logging
    let accessLogSetting: CfnStage.AccessLogSettingProperty | undefined;
    this.accessLogDestination = props.accessLogDestination;
    this.accessLogFormat = props.accessLogFormat;
    if (this.accessLogDestination == null && this.accessLogFormat == null) {
      accessLogSetting = undefined;
    } else {
      accessLogSetting = {
        destinationArn: this.accessLogDestination?.bind().destinationArn,
        format: this.accessLogFormat
      };
    }

    // enable cache cluster if cacheClusterSize is set
    if (props.cacheClusterSize !== undefined) {
      if (this.enableCacheCluster === undefined) {
        this.enableCacheCluster = true;
      } else if (this.enableCacheCluster === false) {
        throw new Error(`Cannot set "cacheClusterSize" to ${props.cacheClusterSize} and "cacheClusterEnabled" to "false"`);
      }
    }

    const cacheClusterSize = this.enableCacheCluster ? (props.cacheClusterSize || '0.5') : undefined;
    const resource = new CfnStage(this, 'Resource', {
      stageName: props.stageName || 'prod',
      accessLogSetting,
      cacheClusterEnabled: this.enableCacheCluster,
      cacheClusterSize,
      clientCertificateId: props.clientCertificateId,
      deploymentId: props.deployment.deploymentId,
      restApiId: props.deployment.api.restApiId,
      description: props.description,
      documentationVersion: props.documentationVersion,
      variables: props.variables,
      tracingEnabled: props.tracingEnabled,
      methodSettings
    });

    this.stageName = resource.ref;
    this.restApi = props.deployment.api;
  }

  /**
   * Returns the invoke URL for a certain path.
   * @param path The resource path
   */
  public urlForPath(path: string = '/') {
    if (!path.startsWith('/')) {
      throw new Error(`Path must begin with "/": ${path}`);
    }
    return `https://${this.restApi.restApiId}.execute-api.${Stack.of(this).region}.${Stack.of(this).urlSuffix}/${this.stageName}${path}`;
  }

  private renderMethodSettings(props: StageProps): CfnStage.MethodSettingProperty[] | undefined {
    const settings = new Array<CfnStage.MethodSettingProperty>();
    const self = this;

    // extract common method options from the stage props
    const commonMethodOptions: MethodDeploymentOptions = {
      metricsEnabled: props.metricsEnabled,
      loggingLevel: props.loggingLevel,
      dataTraceEnabled: props.dataTraceEnabled,
      throttlingBurstLimit: props.throttlingBurstLimit,
      throttlingRateLimit: props.throttlingRateLimit,
      cachingEnabled: props.cachingEnabled,
      cacheTtl: props.cacheTtl,
      cacheDataEncrypted: props.cacheDataEncrypted
    };

    // if any of them are defined, add an entry for '/*/*'.
    const hasCommonOptions = Object.keys(commonMethodOptions).map(v => (commonMethodOptions as any)[v]).filter(x => x).length > 0;
    if (hasCommonOptions) {
      settings.push(renderEntry('/*/*', commonMethodOptions));
    }

    if (props.methodOptions) {
      for (const path of Object.keys(props.methodOptions)) {
        settings.push(renderEntry(path, props.methodOptions[path]));
      }
    }

    return settings.length === 0 ? undefined : settings;

    function renderEntry(path: string, options: MethodDeploymentOptions): CfnStage.MethodSettingProperty {
      if (options.cachingEnabled) {
        if (self.enableCacheCluster === undefined) {
          self.enableCacheCluster = true;
        } else if (self.enableCacheCluster === false) {
          throw new Error(`Cannot enable caching for method ${path} since cache cluster is disabled on stage`);
        }
      }

      const { httpMethod, resourcePath } = parseMethodOptionsPath(path);

      return {
        httpMethod, resourcePath,
        cacheDataEncrypted: options.cacheDataEncrypted,
        cacheTtlInSeconds: options.cacheTtl && options.cacheTtl.toSeconds(),
        cachingEnabled: options.cachingEnabled,
        dataTraceEnabled: options.dataTraceEnabled,
        loggingLevel: options.loggingLevel,
        metricsEnabled: options.metricsEnabled,
        throttlingBurstLimit: options.throttlingBurstLimit,
        throttlingRateLimit: options.throttlingRateLimit
      };
    }
  }
}

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
export class CloudWatchLogsDestination implements IAccessLogDestination {
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
 * Use Kinesis Data Firehose as a custom access log destination for API Gateway.
 */
export class KinesisDataFirehoseDestination implements IAccessLogDestination {
  constructor(private readonly deliveryStreamArn: string) {
  }

  /**
   * Binds this destination to the Kinesis Data Firehose.
   */
  public bind(): AccessLogDestinationConfig {
    const pattern = 'amazon-apigateway-';
    const deliveryStreamName = this.deliveryStreamArn.split('/')[1];
    if (deliveryStreamName.indexOf(pattern)) {
      throw new Error(`Delivery stream name must begin with ${pattern}.`);
    }

    return {
      destinationArn: this.deliveryStreamArn
    };
  }
}

/**
 * $context variables when customize access log.
 */
export class AccessLogFormat {
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
