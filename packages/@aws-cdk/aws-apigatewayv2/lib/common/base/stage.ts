import { Metric, MetricOptions } from '@aws-cdk/aws-cloudwatch';
import { Resource } from '@aws-cdk/core';
import { IApi } from '../api';
import { ApiMapping } from '../api-mapping';
import { DomainMappingOptions, IStage } from '../stage';

/**
 * Base class representing a Stage
 * @internal
 */
export abstract class StageBase extends Resource implements IStage {
  public abstract readonly stageName: string;
  public abstract readonly api: IApi;

  /**
   * The URL to this stage.
   */
  abstract get url(): string;

  /**
   * @internal
   */
  protected _addDomainMapping(domainMapping: DomainMappingOptions) {
    new ApiMapping(this, `${domainMapping.domainName}${domainMapping.mappingKey}`, {
      api: this.api,
      domainName: domainMapping.domainName,
      stage: this,
      apiMappingKey: domainMapping.mappingKey,
    });
    // ensure the dependency
    this.node.addDependency(domainMapping.domainName);
  }

  public metric(metricName: string, props?: MetricOptions): Metric {
    return this.api.metric(metricName, props).with({
      dimensions: { ApiId: this.api.apiId, Stage: this.stageName },
    }).attachTo(this);
  }

  public metricClientError(props?: MetricOptions): Metric {
    return this.metric('4XXError', { statistic: 'Sum', ...props });
  }

  public metricServerError(props?: MetricOptions): Metric {
    return this.metric('5XXError', { statistic: 'Sum', ...props });
  }

  public metricDataProcessed(props?: MetricOptions): Metric {
    return this.metric('DataProcessed', { statistic: 'Sum', ...props });
  }

  public metricCount(props?: MetricOptions): Metric {
    return this.metric('Count', { statistic: 'SampleCount', ...props });
  }

  public metricIntegrationLatency(props?: MetricOptions): Metric {
    return this.metric('IntegrationLatency', props);
  }

  public metricLatency(props?: MetricOptions): Metric {
    return this.metric('Latency', props);
  }
}
