import { Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAppsyncFunction } from './appsync-function';
import { CfnResolver } from './appsync.generated';
import { CachingConfig } from './caching-config';
import { BASE_CACHING_KEYS } from './caching-key';
import { Code } from './code';
import { BaseDataSource } from './data-source';
import { IGraphqlApi } from './graphqlapi-base';
import { MappingTemplate } from './mapping-template';
import { FunctionRuntime } from './runtime';

/**
 * Basic properties for an AppSync resolver
 */
export interface BaseResolverProps {
  /**
   * name of the GraphQL type this resolver is attached to
   */
  readonly typeName: string;
  /**
   * name of the GraphQL field in the given type this resolver is attached to
   */
  readonly fieldName: string;
  /**
   * configuration of the pipeline resolver
   *
   * @default - no pipeline resolver configuration
   * An empty array | undefined sets resolver to be of kind, unit
   */
  readonly pipelineConfig?: IAppsyncFunction[];
  /**
   * The request mapping template for this resolver
   *
   * @default - No mapping template
   */
  readonly requestMappingTemplate?: MappingTemplate;
  /**
   * The response mapping template for this resolver
   *
   * @default - No mapping template
   */
  readonly responseMappingTemplate?: MappingTemplate;
  /**
   * The caching configuration for this resolver
   *
   * @default - No caching configuration
   */
  readonly cachingConfig?: CachingConfig;
  /**
   * The maximum number of elements per batch, when using batch invoke
   *
   * @default - No max batch size
   */
  readonly maxBatchSize?: number;

  /**
   * The functions runtime
   *
   * @default - no function runtime, VTL mapping templates used
   */
  readonly runtime?: FunctionRuntime;
  /**
   * The function code
   *
   * @default - no code is used
   */
  readonly code?: Code;
}

/**
 * Additional property for an AppSync resolver for data source reference
 */
export interface ExtendedResolverProps extends BaseResolverProps {
  /**
   * The data source this resolver is using
   *
   * @default - No datasource
   */
  readonly dataSource?: BaseDataSource;
}

/**
 * Additional property for an AppSync resolver for GraphQL API reference
 */
export interface ResolverProps extends ExtendedResolverProps {
  /**
   * The API this resolver is attached to
   */
  readonly api: IGraphqlApi;
}

/**
 * An AppSync resolver
 */
export class Resolver extends Construct {
  /**
   * the ARN of the resolver
   */
  public readonly arn: string;

  private resolver: CfnResolver;

  constructor(scope: Construct, id: string, props: ResolverProps) {
    super(scope, id);

    const pipelineConfig = props.pipelineConfig && props.pipelineConfig.length ?
      { functions: props.pipelineConfig.map((func) => func.functionId) }
      : undefined;

    // If runtime is specified, code must also be
    if (props.runtime && !props.code) {
      throw new Error('Code is required when specifying a runtime');
    }

    if (props.code && (props.requestMappingTemplate || props.responseMappingTemplate)) {
      throw new Error('Mapping templates cannot be used alongside code');
    }

    if (pipelineConfig && props.dataSource) {
      throw new Error(`Pipeline Resolver cannot have data source. Received: ${props.dataSource.name}`);
    }

    if (props.cachingConfig?.ttl && (props.cachingConfig.ttl.toSeconds() < 1 || props.cachingConfig.ttl.toSeconds() > 3600)) {
      throw new Error(`Caching config TTL must be between 1 and 3600 seconds. Received: ${props.cachingConfig.ttl.toSeconds()}`);
    }

    if (props.cachingConfig?.cachingKeys) {
      if (props.cachingConfig.cachingKeys.find(cachingKey =>
        !Token.isUnresolved(cachingKey) && !BASE_CACHING_KEYS.find(baseCachingKey => cachingKey.startsWith(baseCachingKey)))) {
        throw new Error(`Caching config keys must begin with $context.arguments, $context.source or $context.identity. Received: ${props.cachingConfig.cachingKeys}`);
      }
    }

    const code = props.code?.bind(this);
    this.resolver = new CfnResolver(this, 'Resource', {
      apiId: props.api.apiId,
      typeName: props.typeName,
      fieldName: props.fieldName,
      dataSourceName: props.dataSource ? props.dataSource.name : undefined,
      kind: pipelineConfig ? 'PIPELINE' : 'UNIT',
      runtime: props.runtime?.toProperties(),
      codeS3Location: code?.s3Location,
      code: code?.inlineCode,
      pipelineConfig: pipelineConfig,
      requestMappingTemplate: props.requestMappingTemplate ? props.requestMappingTemplate.renderTemplate() : undefined,
      responseMappingTemplate: props.responseMappingTemplate ? props.responseMappingTemplate.renderTemplate() : undefined,
      cachingConfig: this.createCachingConfig(props.cachingConfig),
      maxBatchSize: props.maxBatchSize,
    });
    props.api.addSchemaDependency(this.resolver);
    if (props.dataSource) {
      this.resolver.addDependency(props.dataSource.ds);
    }
    this.arn = this.resolver.attrResolverArn;
  }

  private createCachingConfig(config?: CachingConfig) {
    return config ? {
      cachingKeys: config.cachingKeys,
      ttl: config.ttl?.toSeconds(),
    } : undefined;
  }

}
