import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Resource } from '@aws-cdk/core';
import { IntegrationCache } from '../private/integration-cache';
import { IApi } from './api';
import { ApiMapping } from './api-mapping';
import { DomainMappingOptions, IStage } from './stage';

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


/**
 * Base class representing a Stage
 * @internal
 */
export abstract class StageBase extends Resource implements IStage {
  public abstract readonly stageName: string;
  protected abstract readonly baseApi: IApi;

  /**
   * The URL to this stage.
   */
  abstract get url(): string;

  /**
   * @internal
   */
  protected _addDomainMapping(domainMapping: DomainMappingOptions) {
    new ApiMapping(this, `${domainMapping.domainName}${domainMapping.mappingKey}`, {
      api: this.baseApi,
      domainName: domainMapping.domainName,
      stage: this,
      apiMappingKey: domainMapping.mappingKey,
    });
    // ensure the dependency
    this.node.addDependency(domainMapping.domainName);
  }

  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.baseApi.metric(metricName, props).with({
      dimensions: { ApiId: this.baseApi.apiId, Stage: this.stageName },
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
