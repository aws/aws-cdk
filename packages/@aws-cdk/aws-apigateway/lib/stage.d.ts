import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Duration, IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AccessLogFormat, IAccessLogDestination } from './access-log';
import { IApiKey, ApiKeyOptions } from './api-key';
import { Deployment } from './deployment';
import { IRestApi } from './restapi';
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
    /**
     * Add an ApiKey to this Stage
     */
    addApiKey(id: string, options?: ApiKeyOptions): IApiKey;
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
     * The format must include either `AccessLogFormat.contextRequestId()`
     * or `AccessLogFormat.contextExtendedRequestId()`.
     *
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
    readonly variables?: {
        [key: string]: string;
    };
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
    readonly methodOptions?: {
        [path: string]: MethodDeploymentOptions;
    };
}
export interface StageProps extends StageOptions {
    /**
     * The deployment that this stage points to [disable-awslint:ref-via-interface].
     */
    readonly deployment: Deployment;
}
export declare enum MethodLoggingLevel {
    OFF = "OFF",
    ERROR = "ERROR",
    INFO = "INFO"
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
/**
 * The attributes of an imported Stage
 */
export interface StageAttributes {
    /**
     * The name of the stage
     */
    readonly stageName: string;
    /**
     * The RestApi that the stage belongs to
     */
    readonly restApi: IRestApi;
}
/**
 * Base class for an ApiGateway Stage
 */
export declare abstract class StageBase extends Resource implements IStage {
    abstract readonly stageName: string;
    abstract readonly restApi: IRestApi;
    /**
     * Add an ApiKey to this stage
     */
    addApiKey(id: string, options?: ApiKeyOptions): IApiKey;
    /**
     * Returns the invoke URL for a certain path.
     * @param path The resource path
     */
    urlForPath(path?: string): string;
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
    get stageArn(): string;
    /**
     * Returns the given named metric for this stage
     */
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of client-side errors captured in a given period.
     *
     * @default - sum over 5 minutes
     */
    metricClientError(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of server-side errors captured in a given period.
     *
     * @default - sum over 5 minutes
     */
    metricServerError(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of requests served from the API cache in a given period.
     *
     * @default - sum over 5 minutes
     */
    metricCacheHitCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of requests served from the backend in a given period,
     * when API caching is enabled.
     *
     * @default - sum over 5 minutes
     */
    metricCacheMissCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the total number API requests in a given period.
     *
     * @default - sample count over 5 minutes
     */
    metricCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the time between when API Gateway relays a request to the backend
     * and when it receives a response from the backend.
     *
     * @default - average over 5 minutes.
     */
    metricIntegrationLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * The time between when API Gateway receives a request from a client
     * and when it returns a response to the client.
     * The latency includes the integration latency and other API Gateway overhead.
     *
     * @default - average over 5 minutes.
     */
    metricLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    private cannedMetric;
}
export declare class Stage extends StageBase {
    /**
     * Import a Stage by its attributes
     */
    static fromStageAttributes(scope: Construct, id: string, attrs: StageAttributes): IStage;
    readonly stageName: string;
    readonly restApi: IRestApi;
    private enableCacheCluster?;
    constructor(scope: Construct, id: string, props: StageProps);
    private renderMethodSettings;
}
