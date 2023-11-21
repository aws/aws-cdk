import * as cloudwatch from '../../aws-cloudwatch';
import { IResource } from '../../core';

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
}
