import { Metric, MetricOptions } from '@aws-cdk/aws-cloudwatch';
import { ILogGroup } from '@aws-cdk/aws-logs';
import { IResource } from '@aws-cdk/core';
import { IDomainName } from './domain-name';

/**
 * Represents a Stage.
 */
export interface IStage extends IResource {
  /**
   * The name of the stage; its primary identifier.
   * @attribute
   */
  readonly stageName: string;

  /**
   * The URL to this stage.
   */
  readonly url: string;

  /**
   * Return the given named metric for this HTTP Api Gateway Stage
   *
   * @default - average over 5 minutes
   */
  metric(metricName: string, props?: MetricOptions): Metric
}

/**
 * Options for DomainMapping
 */
export interface DomainMappingOptions {
  /**
   * The domain name for the mapping
   *
   */
  readonly domainName: IDomainName;

  /**
   * The API mapping key. Leave it undefined for the root path mapping.
   * @default - empty key for the root path mapping
   */
  readonly mappingKey?: string;
}

export const defaultAccessLogFormat = JSON.stringify({
  apigw: {
    api_id: '$context.apiId',
    stage: '$context.stage',
  },
  client: {
    ip: '$context.identity.sourceIp',
  },
  request: {
    request_id: '$context.requestId',
    extended_request_id: '$context.extendedRequestId',
    time: '$context.requestTime',
    time_epoch: '$context.requestTimeEpoch',
    protocol: '$context.protocol',
  },
  integration: {
    latency: '$context.integrationLatency',
    status: '$context.integrationStatus',
  },
  response: {
    latency: '$context.responseLatency',
    status: '$context.status',
  },
  error: {
    error_message: '$context.error.message',
    error_responsetype: '$context.error.responseType',
  },
});

/**
 * Options required to create a new stage.
 * Options that are common between HTTP and Websocket APIs.
 */
export interface StageOptions {
  /**
   * Whether updates to an API automatically trigger a new deployment.
   * @default false
   */
  readonly autoDeploy?: boolean;

  /**
   * The options for custom domain and api mapping
   *
   * @default - no custom domain and api mapping configuration
   */
  readonly domainMapping?: DomainMappingOptions;

  /**
   * Throttle settings for the routes of this stage
   *
   * @default - no throttling configuration
   */
  readonly throttle?: ThrottleSettings;

  /**
   * Whether or not to enable access logging.
   *
   * @default false
   */
  readonly accessLogEnabled?: boolean;

  /**
   * Optionally, specify a log group that access log entries will be written to.
   * @default - If not specified a log group will be created if access logs are enabled.
   */
  readonly accessLogGroup?: ILogGroup;

  /**
   * The format and contents of an access log entry.
   *
   * @default - If not specified a the default fields logged will be set to
   * apigw: {
   * api_id: '$context.apiId',
   * stage: '$context.stage',
   * },
   * client: {
   * ip: '$context.identity.sourceIp',
   * },
   * request: {
   * request_id: '$context.requestId',
   * extended_request_id: '$context.extendedRequestId',
   * time: '$context.requestTime',
   * time_epoch: '$context.requestTimeEpoch',
   * protocol: '$context.protocol',
   * },
   * integration: {
   * latency: '$context.integrationLatency',
   * status: '$context.integrationStatus',
   * },
   * response: {
   * latency: '$context.responseLatency',
   * status: '$context.status',
   * },
   * error: {
   * error_message: '$context.error.message',
   * error_responsetype: '$context.error.responseType',
   * }
   */
  readonly accessLogFormat?: string;
}

/**
 * The attributes used to import existing Stage
 */
export interface StageAttributes {
  /**
   * The name of the stage
   */
  readonly stageName: string;
}

/**
 * Container for defining throttling parameters to API stages
 */
export interface ThrottleSettings {
  /**
   * The API request steady-state rate limit (average requests per second over an extended period of time)
   * @default none
   */
  readonly rateLimit?: number;

  /**
   * The maximum API request rate limit over a time ranging from one to a few seconds.
   * @default none
   */
  readonly burstLimit?: number;
}


