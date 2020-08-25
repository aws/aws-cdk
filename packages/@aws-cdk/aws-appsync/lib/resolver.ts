import { Construct } from '@aws-cdk/core';
import { CfnResolver } from './appsync.generated';
import { BaseDataSource } from './data-source';
import { IGraphqlApi } from './graphqlapi-base';
import { MappingTemplate } from './mapping-template';

/**
 * Basic properties for an AppSync resolver
 */
export interface BaseResolverProps {
  /**
   * name of the GraphQL type this resolver is attached to
   */
  readonly typeName: string;
  /**
   * name of the GraphQL fiel din the given type this resolver is attached to
   */
  readonly fieldName: string;
  /**
   * configuration of the pipeline resolver
   *
   * @default - no pipeline resolver configuration
   * An empty array | undefined sets resolver to be of kind, unit
   */
  readonly pipelineConfig?: string[];
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
}

/**
 * Additional properties for an AppSync resolver like GraphQL API reference and datasource
 */
export interface ResolverProps extends BaseResolverProps {
  /**
   * The API this resolver is attached to
   */
  readonly api: IGraphqlApi;
  /**
   * The data source this resolver is using
   *
   * @default - No datasource
   */
  readonly dataSource?: BaseDataSource;
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

    const pipelineConfig = props.pipelineConfig && props.pipelineConfig.length ? { functions: props.pipelineConfig } : undefined;

    this.resolver = new CfnResolver(this, 'Resource', {
      apiId: props.api.apiId,
      typeName: props.typeName,
      fieldName: props.fieldName,
      dataSourceName: props.dataSource ? props.dataSource.name : undefined,
      kind: pipelineConfig ? 'PIPELINE' : 'UNIT',
      pipelineConfig: pipelineConfig,
      requestMappingTemplate: props.requestMappingTemplate ? props.requestMappingTemplate.renderTemplate() : undefined,
      responseMappingTemplate: props.responseMappingTemplate ? props.responseMappingTemplate.renderTemplate() : undefined,
    });
    props.api.addSchemaDependency(this.resolver);
    if (props.dataSource) {
      this.resolver.addDependsOn(props.dataSource.ds);
    }
    this.arn = this.resolver.attrResolverArn;
  }
}