import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { ArnFormat, Duration, IResource, Resource, Stack, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AccessLogFormat, IAccessLogDestination } from './access-log';
import { ApiGatewayMetrics } from './apigateway-canned-metrics.generated';
import { CfnStage } from './apigateway.generated';
import { Deployment } from './deployment';
import { IRestApi, RestApiBase } from './restapi';
import { parseMethodOptionsPath } from './util';

/**
 * Represents an APIGateway Stage.
 */
export interface IStage extends IResource {
  /**
   * Name of this stage.
   * @attribute
   */
  readonly stageName: string;

  /**
   * RestApi to which this stage is associated.
   */
  readonly restApi: IRestApi;
}

export interface StageOptions extends MethodDeploymentOptions {
  /**
   * The name of the stage, which API Gateway uses as the first path segment
   * in the invoked Uniform Resource Identifier (URI).
   *
   * @default - "prod"
   */
  readonly stageName?: string;

  /**
   * The CloudWatch Logs log group.
   *
   * @default - No destination
   */
  readonly accessLogDestination?: IAccessLogDestination;

  /**
   * A single line format of access logs of data, as specified by selected $content variables.
   * The format must include at least `AccessLogFormat.contextRequestId()`.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference
   *
   * @default - Common Log Format
   */
  readonly accessLogFormat?: AccessLogFormat;

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
   * Specifies whether data trace logging is enabled for this method.
   * When enabled, API gateway will log the full API requests and responses.
   * This can be useful to troubleshoot APIs, but can result in logging sensitive data.
   * We recommend that you don't enable this feature for production APIs.
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

export class Stage extends Resource implements IStage {
  public readonly stageName: string;

  public readonly restApi: IRestApi;
  private enableCacheCluster?: boolean;

  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id);

    this.enableCacheCluster = props.cacheClusterEnabled;

    const methodSettings = this.renderMethodSettings(props); // this can mutate `this.cacheClusterEnabled`

    // custom access logging
    let accessLogSetting: CfnStage.AccessLogSettingProperty | undefined;
    const accessLogDestination = props.accessLogDestination;
    const accessLogFormat = props.accessLogFormat;
    if (!accessLogDestination && !accessLogFormat) {
      accessLogSetting = undefined;
    } else {
      if (accessLogFormat !== undefined &&
        !Token.isUnresolved(accessLogFormat.toString()) &&
        !/.*\$context.requestId.*/.test(accessLogFormat.toString())) {

        throw new Error('Access log must include at least `AccessLogFormat.contextRequestId()`');
      }
      if (accessLogFormat !== undefined && accessLogDestination === undefined) {
        throw new Error('Access log format is specified without a destination');
      }

      accessLogSetting = {
        destinationArn: accessLogDestination?.bind(this).destinationArn,
        format: accessLogFormat?.toString() ? accessLogFormat?.toString() : AccessLogFormat.clf().toString(),
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
      methodSettings,
    });

    this.stageName = resource.ref;
    this.restApi = props.deployment.api;

    if (RestApiBase._isRestApiBase(this.restApi)) {
      this.restApi._attachStage(this);
    }
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

  /**
   * Returns the resource ARN for this stage:
   *
   *   arn:aws:apigateway:{region}::/restapis/{restApiId}/stages/{stageName}
   *
   * Note that this is separate from the execute-api ARN for methods and resources
   * within this stage.
   *
   * @attribute
   */
  public get stageArn() {
    return Stack.of(this).formatArn({
      arnFormat: ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME,
      service: 'apigateway',
      account: '',
      resource: 'restapis',
      resourceName: `${this.restApi.restApiId}/stages/${this.stageName}`,
    });
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
      cacheDataEncrypted: props.cacheDataEncrypted,
    };

    // if any of them are defined, add an entry for '/*/*'.
    const hasCommonOptions = Object.keys(commonMethodOptions).map(v => (commonMethodOptions as any)[v]).filter(x => x !== undefined).length > 0;
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
        httpMethod,
        resourcePath,
        cacheDataEncrypted: options.cacheDataEncrypted,
        cacheTtlInSeconds: options.cacheTtl && options.cacheTtl.toSeconds(),
        cachingEnabled: options.cachingEnabled,
        dataTraceEnabled: options.dataTraceEnabled ?? false,
        loggingLevel: options.loggingLevel,
        metricsEnabled: options.metricsEnabled,
        throttlingBurstLimit: options.throttlingBurstLimit,
        throttlingRateLimit: options.throttlingRateLimit,
      };
    }
  }

  /**
   * Returns the given named metric for this stage
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ApiGateway',
      metricName,
      dimensionsMap: { ApiName: this.restApi.restApiName, Stage: this.stageName },
      ...props,
    }).attachTo(this);
  }

  /**
   * Metric for the number of client-side errors captured in a given period.
   *
   * Default: sum over 5 minutes
   */
  public metricClientError(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics._4XxErrorSum, props);
  }

  /**
   * Metric for the number of server-side errors captured in a given period.
   *
   * Default: sum over 5 minutes
   */
  public metricServerError(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics._5XxErrorSum, props);
  }

  /**
   * Metric for the number of requests served from the API cache in a given period.
   *
   * Default: sum over 5 minutes
   */
  public metricCacheHitCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics.cacheHitCountSum, props);
  }

  /**
   * Metric for the number of requests served from the backend in a given period,
   * when API caching is enabled.
   *
   * Default: sum over 5 minutes
   */
  public metricCacheMissCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics.cacheMissCountSum, props);
  }

  /**
   * Metric for the total number API requests in a given period.
   *
   * Default: sample count over 5 minutes
   */
  public metricCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics.countSum, {
      statistic: 'SampleCount',
      ...props,
    });
  }

  /**
   * Metric for the time between when API Gateway relays a request to the backend
   * and when it receives a response from the backend.
   *
   * Default: average over 5 minutes.
   */
  public metricIntegrationLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics.integrationLatencyAverage, props);
  }

  /**
   * The time between when API Gateway receives a request from a client
   * and when it returns a response to the client.
   * The latency includes the integration latency and other API Gateway overhead.
   *
   * Default: average over 5 minutes.
   */
  public metricLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics.latencyAverage, props);
  }

  private cannedMetric(fn: (dims: { ApiName: string; Stage: string }) => cloudwatch.MetricProps, props?: cloudwatch.MetricOptions) {
    return new cloudwatch.Metric({
      ...fn({ ApiName: this.restApi.restApiName, Stage: this.stageName }),
      ...props,
    }).attachTo(this);
  }
}
