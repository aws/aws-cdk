import { Metric, MetricOptions } from '@aws-cdk/aws-cloudwatch';
import { IResource, Resource } from '@aws-cdk/core';
import { IApi } from './api';
import { ApiMapping } from './api-mapping';
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

  public metric(metricName: string, props?: MetricOptions): Metric {
    return this.baseApi.metric(metricName, props).with({
      dimensions: { ApiId: this.baseApi.apiId, Stage: this.stageName },
    }).attachTo(this);
  }
}

