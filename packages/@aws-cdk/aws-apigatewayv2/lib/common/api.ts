import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { IResource, Resource } from '@aws-cdk/core';
import { IntegrationCache } from '../private/integration-cache';

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

/**
 * Base class representing an API
 * @internal
 */
export abstract class ApiBase extends Resource implements IApi {
  abstract readonly apiId: string;
  abstract readonly apiEndpoint: string;
  /**
   * @internal
   */
  protected _integrationCache: IntegrationCache = new IntegrationCache();

  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ApiGateway',
      metricName,
      dimensions: { ApiId: this.apiId },
      ...props,
    }).attachTo(this);
  }
}
