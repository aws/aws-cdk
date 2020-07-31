import { ITable } from '@aws-cdk/aws-dynamodb';
import { IFunction } from '@aws-cdk/aws-lambda';
import { CfnResource, IResource, Resource } from '@aws-cdk/core';
import { DynamoDbDataSource, HttpDataSource, LambdaDataSource, NoneDataSource } from './data-source';

/**
 * Optional configuration for data sources
 */
export interface DataSourceOptions {
  /**
   * The name of the data source
   *
   * @default - '<DataSourceType>CDKDefault'
   */
  readonly name?: string;

  /**
   * The description of the data source
   *
   * @default - undefined
   */
  readonly description?: string;
}

/**
 * Interface for GraphQL
 */
export interface IGraphQLApi extends IResource {

  /**
   * an unique AWS AppSync GraphQL API identifier
   * i.e. 'lxz775lwdrgcndgz3nurvac7oa'
   *
   * @attribute
   */
  readonly apiId: string;

  /**
   * the ARN of the API
   *
   * @attribute
   */
  readonly arn: string;

  /**
   * add a new dummy data source to this API. Useful for pipeline resolvers
   * and for backend changes that don't require a data source.
   *
   * @param options The optional configuration for this data source
   * @default name - 'NoneCDKDefault'
   * description - undefined
   */
  addNoneDataSource(options?: DataSourceOptions): NoneDataSource;

  /**
   * add a new DynamoDB data source to this API
   *
   * @param table The DynamoDB table backing this data source
   * @param options The optional configuration for this data source
   * @default name - 'DynamoDbCDKDefault'
   * description - undefined
   */
  addDynamoDbDataSource(table: ITable, options?: DataSourceOptions): DynamoDbDataSource;

  /**
   * add a new http data source to this API
   *
   * @param endpoint The http endpoint
   * @param options The optional configuration for this data source
   * @default name - 'HttpCDKDefault'
   * description - undefined
   */
  addHttpDataSource(endpoint: string, options?: DataSourceOptions): HttpDataSource;

  /**
   * add a new Lambda data source to this API
   *
   * @param lambdaFunction The Lambda function to call to interact with this data source
   * @param options The optional configuration for this data source
   * @default name - 'LambdaCDKDefault'
   * description - undefined
   */
  addLambdaDataSource(lambdaFunction: IFunction, options?: DataSourceOptions): LambdaDataSource;

  /**
   * Add schema dependency if not imported
   *
   * @param construct the dependee
   */
  addSchemaDependency(construct: CfnResource): boolean;
}

/**
 * Base Class for GraphQL API
 */
export abstract class GraphQLApiBase extends Resource implements IGraphQLApi {

  /**
   * an unique AWS AppSync GraphQL API identifier
   * i.e. 'lxz775lwdrgcndgz3nurvac7oa'
   */
  public abstract readonly apiId: string;

  /**
   * the ARN of the API
   */
  public abstract readonly arn: string;

  /**
   * add a new none data source to this API. Useful for pipeline resolvers
   * and for backend changes that don't require a data source.
   *
   * @param options The optional configuration for this data source
   * @default name - 'NoneCDKDefault'
   * description - undefined
   */
  public addNoneDataSource(options?: DataSourceOptions): NoneDataSource {
    const name = options?.name ?? 'NoneCDKDefault';
    return new NoneDataSource(this, name, {
      api: this,
      name: name,
      description: options?.description,
    });
  }

  /**
   * add a new DynamoDB data source to this API
   *
   * @param table The DynamoDB table backing this data source
   * @param options The optional configuration for this data source
   * @default name - 'TableCDKDefault'
   * description - undefined
   */
  public addDynamoDbDataSource(table: ITable, options?: DataSourceOptions): DynamoDbDataSource {
    const name = options?.name ?? 'TableCDKDefault';
    return new DynamoDbDataSource(this, name, {
      api: this,
      table,
      name,
      description: options?.description,
    });
  }

  /**
   * add a new http data source to this API
   *
   * @param endpoint The http endpoint
   * @param options The optional configuration for this data source
   * @default name - 'HttpCDKDefault'
   * description - undefined
   */
  public addHttpDataSource(endpoint: string, options?: DataSourceOptions): HttpDataSource {
    const name = options?.name ?? 'HttpCDKDefault';
    return new HttpDataSource(this, name, {
      api: this,
      endpoint,
      name,
      description: options?.description,
    });
  }

  /**
   * add a new Lambda data source to this API
   *
   * @param lambdaFunction The Lambda function to call to interact with this data source
   * @param options The optional configuration for this data source
   * @default name - 'LambdaCDKDefault'
   * description - undefined
   */
  public addLambdaDataSource(lambdaFunction: IFunction, options?: DataSourceOptions): LambdaDataSource {
    const name = options?.name ?? 'LambdaCDKDefault';
    return new LambdaDataSource(this, name, {
      api: this,
      lambdaFunction,
      name,
      description: options?.description,
    });
  }

  /**
   * Add schema dependency if not imported
   *
   * @param construct the dependee
   */
  public addSchemaDependency(construct: CfnResource): boolean {
    construct;
    return false;
  }
}