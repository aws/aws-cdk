import { Resource, IResource, Lazy, Fn } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnFunctionConfiguration } from './appsync.generated';
import { BaseDataSource } from './data-source';
import { IGraphqlApi } from './graphqlapi-base';
import { MappingTemplate } from './mapping-template';

/**
 * the base properties for AppSync Functions
 */
export interface BaseAppsyncFunctionProps {
  /**
   * the name of the AppSync Function
   */
  readonly name: string;
  /**
   * the description for this AppSync Function
   *
   * @default - no description
   */
  readonly description?: string;
  /**
   * the request mapping template for the AppSync Function
   *
   * @default - no request mapping template
   */
  readonly requestMappingTemplate?: MappingTemplate;
  /**
   * the response mapping template for the AppSync Function
   *
   * @default - no response mapping template
   */
  readonly responseMappingTemplate?: MappingTemplate;
}

/**
 * the CDK properties for AppSync Functions
 */
export interface AppsyncFunctionProps extends BaseAppsyncFunctionProps {
  /**
   * the GraphQL Api linked to this AppSync Function
   */
  readonly api: IGraphqlApi;
  /**
   * the data source linked to this AppSync Function
   */
  readonly dataSource: BaseDataSource;
}

/**
 * The attributes for imported AppSync Functions
 */
export interface AppsyncFunctionAttributes {
  /**
   * the ARN of the AppSync function
   */
  readonly functionArn: string;
}

/**
 * Interface for AppSync Functions
 */
export interface IAppsyncFunction extends IResource {
  /**
   * the name of this AppSync Function
   *
   * @attribute
   */
  readonly functionId: string;
  /**
   * the ARN of the AppSync function
   *
   * @attribute
   */
  readonly functionArn: string;
}

/**
 * AppSync Functions are local functions that perform certain operations
 * onto a backend data source. Developers can compose operations (Functions)
 * and execute them in sequence with Pipeline Resolvers.
 *
 * @resource AWS::AppSync::FunctionConfiguration
 */
export class AppsyncFunction extends Resource implements IAppsyncFunction {
  /**
   * Import Appsync Function from arn
   */
  public static fromAppsyncFunctionAttributes(scope: Construct, id: string, attrs: AppsyncFunctionAttributes): IAppsyncFunction {
    class Import extends Resource {
      public readonly functionId = Lazy.stringValue({
        produce: () => Fn.select(3, Fn.split('/', attrs.functionArn)),
      });
      public readonly functionArn = attrs.functionArn;
      constructor (s: Construct, i: string) {
        super(s, i);
      }
    }
    return new Import(scope, id);
  }

  /**
   * the name of this AppSync Function
   *
   * @attribute Name
   */
  public readonly functionName: string;
  /**
   * the ARN of the AppSync function
   *
   * @attribute
   */
  public readonly functionArn: string;
  /**
   * the ID of the AppSync function
   *
   * @attribute
   */
  public readonly functionId: string;
  /**
   * the data source of this AppSync Function
   *
   * @attribute DataSourceName
   */
  public readonly dataSource: BaseDataSource;

  private readonly function: CfnFunctionConfiguration;

  public constructor(scope: Construct, id: string, props: AppsyncFunctionProps) {
    super(scope, id);
    this.function = new CfnFunctionConfiguration(this, 'Resource', {
      name: props.name,
      description: props.description,
      apiId: props.api.apiId,
      dataSourceName: props.dataSource.name,
      functionVersion: '2018-05-29',
      requestMappingTemplate: props.requestMappingTemplate?.renderTemplate(),
      responseMappingTemplate: props.responseMappingTemplate?.renderTemplate(),
    });
    this.functionName = this.function.attrName;
    this.functionArn = this.function.attrFunctionArn;
    this.functionId = this.function.attrFunctionId;
    this.dataSource = props.dataSource;

    this.function.addDependsOn(this.dataSource.ds);
    props.api.addSchemaDependency(this.function);
  }
}