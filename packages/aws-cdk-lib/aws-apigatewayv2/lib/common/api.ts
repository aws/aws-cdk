import type * as cloudwatch from '../../../aws-cloudwatch';
import type { IResource } from '../../../core';
import type { IApiRef } from '../apigatewayv2.generated';

/**
 * Represents a API Gateway HTTP/WebSocket API
 */
export interface IApi extends IResource, IApiRef {
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

/**
 * Supported IP Address Types
 */
export enum IpAddressType {
  /**
   * IPv4 address type
   */
  IPV4 = 'ipv4',

  /**
   * IPv4 and IPv6 address type
   */
  DUAL_STACK = 'dualstack',
}
