import { Construct, IResolvable } from '@aws-cdk/core';
import { CfnResolver } from './appsync.generated';
import { BaseDataSource } from './data-source';
import { GraphQLApi } from './graphqlapi';
import { MappingTemplate } from './mapping-template';

/**
 * Types of Resolvers
 */
export enum ResolverType {
  /**
   * A UNIT resolver is the default resolver type.
   *
   * A UNIT resolver enables you to execute GraphQL queries against a single data source.
   */
  UNIT = 'UNIT',

  /**
   * A PIPELINE resolver enables you to execute a series of Functions in a serial manner, multiple data sources.
   */
  PIPELINE = 'PIPELINE'
}

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
   * type of resolver
   *
   * @default - UNIT resolver, single data source
   */
  readonly kind?: ResolverType;
  /**
   * configuration of the pipeline resolver
   *
   * @default - No pipelineConfig
   */
  readonly pipelineConfig?: CfnResolver.PipelineConfigProperty | IResolvable;
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
  readonly api: GraphQLApi;
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

    this.resolver = new CfnResolver(this, 'Resource', {
      apiId: props.api.apiId,
      typeName: props.typeName,
      fieldName: props.fieldName,
      dataSourceName: props.dataSource ? props.dataSource.name : undefined,
      kind: props.kind ?? ResolverType.UNIT,
      pipelineConfig: props.pipelineConfig,
      requestMappingTemplate: props.requestMappingTemplate ? props.requestMappingTemplate.renderTemplate() : undefined,
      responseMappingTemplate: props.responseMappingTemplate ? props.responseMappingTemplate.renderTemplate() : undefined,
    });
    this.resolver.addDependsOn(props.api.schema);
    if (props.dataSource) {
      this.resolver.addDependsOn(props.dataSource.ds);
    }
    this.arn = this.resolver.attrResolverArn;
  }
}