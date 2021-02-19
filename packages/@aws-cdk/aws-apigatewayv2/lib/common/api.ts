import * as crypto from 'crypto';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IIntegration, IRouteIntegrationConfig } from './integration';
import { IStage } from './stage';
/**
 * Represents a API Gateway HTTP/WebSocket API
 */
export interface IApi {
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
   * The default stage for this API
   */
  readonly defaultStage?: IStage;

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

  /**
   * Add an integration
   * @internal
   */
  _addIntegration(scope: Construct, config: IRouteIntegrationConfig): IIntegration;
}

/**
 * Base class representing an API
 */
export abstract class ApiBase extends Resource implements IApi {
  abstract readonly apiId: string;
  abstract readonly apiEndpoint: string;
  protected integrations: Record<string, IIntegration> = {};

  /**
   * @internal
   */
  abstract _addIntegration(scope: Construct, config: IRouteIntegrationConfig): IIntegration;

  /**
   * @internal
   */
  protected _getIntegrationConfigHash(scope: Construct, config: IRouteIntegrationConfig): string {
    const stringifiedConfig = JSON.stringify(Stack.of(scope).resolve(config));
    const configHash = crypto.createHash('md5').update(stringifiedConfig).digest('hex');
    return configHash;
  }

  /**
   * @internal
   */
  protected _getSavedIntegration(configHash: string) {
    return this.integrations[configHash];
  }

  /**
   * @internal
   */
  protected _saveIntegration(configHash: string, integration: IIntegration) {
    this.integrations[configHash] = integration;
  }

  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ApiGateway',
      metricName,
      dimensions: { ApiId: this.apiId },
      ...props,
    }).attachTo(this);
  }

  public metricClientError(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('4XXError', { statistic: 'Sum', ...props });
  }

  public metricServerError(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('5XXError', { statistic: 'Sum', ...props });
  }

  public metricDataProcessed(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('DataProcessed', { statistic: 'Sum', ...props });
  }

  public metricCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('Count', { statistic: 'SampleCount', ...props });
  }

  public metricIntegrationLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('IntegrationLatency', props);
  }

  public metricLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('Latency', props);
  }
}
