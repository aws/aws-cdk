import { Metric, MetricOptions } from '@aws-cdk/aws-cloudwatch';
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

  /**
   * Metric for the number of client-side errors captured in a given period.
   *
   * @default - sum over 5 minutes
   */
  metricClientError(props?: MetricOptions): Metric

  /**
   * Metric for the number of server-side errors captured in a given period.
   *
   * @default - sum over 5 minutes
   */
  metricServerError(props?: MetricOptions): Metric

  /**
   * Metric for the amount of data processed in bytes.
   *
   * @default - sum over 5 minutes
   */
  metricDataProcessed(props?: MetricOptions): Metric

  /**
   * Metric for the total number API requests in a given period.
   *
   * @default - SampleCount over 5 minutes
   */
  metricCount(props?: MetricOptions): Metric

  /**
   * Metric for the time between when API Gateway relays a request to the backend
   * and when it receives a response from the backend.
   *
   * @default - no statistic
   */
  metricIntegrationLatency(props?: MetricOptions): Metric

  /**
   * The time between when API Gateway receives a request from a client
   * and when it returns a response to the client.
   * The latency includes the integration latency and other API Gateway overhead.
   *
   * @default - no statistic
   */
  metricLatency(props?: MetricOptions): Metric
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
