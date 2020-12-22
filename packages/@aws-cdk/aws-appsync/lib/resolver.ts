import { Construct } from 'constructs';
import { IAppsyncFunction } from './appsync-function';
import { CfnResolver } from './appsync.generated';
import { BaseDataSource } from './data-source';
import { IGraphqlApi } from './graphqlapi-base';
import { MappingTemplate } from './mapping-template';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';

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
export class Resolver extends CoreConstruct {
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

    if (pipelineConfig && props.dataSource) {
      throw new Error(`Pipeline Resolver cannot have data source. Received: ${props.dataSource.name}`);
    }

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
