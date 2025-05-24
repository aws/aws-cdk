import { IAccessLogDestination } from './access-log';
import { IDomainName } from './domain-name';
import { AccessLogFormat } from '../../../aws-apigateway/lib';
import { Metric, MetricOptions } from '../../../aws-cloudwatch';
import { IResource } from '../../../core';

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
  metric(metricName: string, props?: MetricOptions): Metric;

  /**
   * Adds a stage variable to this stage.
   *
   * @param name The name of the stage variable. Names can only contain alphanumeric characters and underscores.
   * @param value The value of the stage variable. Values can contain letters, numbers, and the following characters: _, ., :, /, +, -, @
   */
  addStageVariable(name: string, value: string): void;
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
   * The description for the API stage
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * Specifies whether detailed metrics are enabled.
   *
   * @default false
   */
  readonly detailedMetricsEnabled?: boolean;

  /**
   * Settings for access logging.
   *
   * @default - No access logging
   */
  readonly accessLogSettings?: IAccessLogSettings;

  /**
   * Stage variables for the stage.
   * These are key-value pairs that you can define and use in your API routes.
   *
   * @default - No stage variables
   */
  readonly stageVariables?: {[key: string]: string};
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

/**
 * Settings for access logging.
 */
export interface IAccessLogSettings {
  /**
   * The destination where to write access logs.
   *
   * @default - No destination
   */
  readonly destination: IAccessLogDestination;

  /**
   * A single line format of access logs of data, as specified by selected $context variables.
   * The format must include either `AccessLogFormat.contextRequestId()`
   * or `AccessLogFormat.contextExtendedRequestId()`.
   *
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-logging-variables.html
   *
   * @default - Common Log Format
   */
  readonly format?: AccessLogFormat;
}
