import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { IResource } from '@aws-cdk/core';

/**
 * Represents a API Gateway HTTP/WebSocket API
 */
export interface IApi extends IResource {
  /**
   * The identifier of this API Gateway API.
   * @attribute
   */
  readonly apiId: string;

  /**
   * The default endpoint for an API
   * @attribute
   */
  readonly apiEndpoint: string;

  /**
   * Return the given named metric for this Api Gateway
   *
   * @default - average over 5 minutes
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
   * Metric for the amount of data processed in bytes.
   *
   * @default - sum over 5 minutes
   */
  metricDataProcessed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the total number API requests in a given period.
   *
   * @default - SampleCount over 5 minutes
   */
  metricCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the time between when API Gateway relays a request to the backend
   * and when it receives a response from the backend.
   *
   * @default - no statistic
   */
  metricIntegrationLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The time between when API Gateway receives a request from a client
   * and when it returns a response to the client.
   * The latency includes the integration latency and other API Gateway overhead.
   *
   * @default - no statistic
   */
  metricLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}
