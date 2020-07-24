import { ITable } from '@aws-cdk/aws-dynamodb';
import { IFunction } from '@aws-cdk/aws-lambda';
import { CfnResource, IResource, Resource } from '@aws-cdk/core';
import { DynamoDbDataSource, HttpDataSource, LambdaDataSource, NoneDataSource } from './data-source';
/**
 * Interface for GraphQL
 */
export interface IGraphQLApi extends IResource {
  /**
   * the id of the GraphQL API
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
   * add a new dummy data source to this API
   * @param name The name of the data source
   * @param description The description of the data source
   */
  addNoneDataSource(name: string, description: string): NoneDataSource;

  /**
   * add a new DynamoDB data source to this API
   * @param name The name of the data source
   * @param description The description of the data source
   * @param table The DynamoDB table backing this data source [disable-awslint:ref-via-interface]
   */
  addDynamoDbDataSource( name: string, description: string, table: ITable ): DynamoDbDataSource;

  /**
   * add a new http data source to this API
   * @param name The name of the data source
   * @param description The description of the data source
   * @param endpoint The http endpoint
   */
  addHttpDataSource(name: string, description: string, endpoint: string): HttpDataSource;

  /**
   * add a new Lambda data source to this API
   * @param name The name of the data source
   * @param description The description of the data source
   * @param lambdaFunction The Lambda function to call to interact with this data source
   */
  addLambdaDataSource( name: string, description: string, lambdaFunction: IFunction ): LambdaDataSource;

  /**
   * Add schema dependency if not imported
   * @param construct the construct that has a dependency
   */
  addSchemaDependency( construct: CfnResource ): boolean;
}

/**
 * Base Class for GraphQL API
 */
export abstract class GraphQLApiBase extends Resource implements IGraphQLApi {
  /**
   * the id of the GraphQL API
   */
  public abstract readonly apiId: string;
  /**
   * the ARN of the API
   */
  public abstract readonly arn: string;

  /**
   * add a new dummy data source to this API
   * @param name The name of the data source
   * @param description The description of the data source
   */
  public addNoneDataSource(name: string, description: string): NoneDataSource {
    return new NoneDataSource(this, `${name}DS`, {
      api: this,
      description,
      name,
    });
  }

  /**
   * add a new DynamoDB data source to this API
   * @param name The name of the data source
   * @param description The description of the data source
   * @param table The DynamoDB table backing this data source [disable-awslint:ref-via-interface]
   */
  public addDynamoDbDataSource(
    name: string,
    description: string,
    table: ITable,
  ): DynamoDbDataSource {
    return new DynamoDbDataSource(this, `${name}DS`, {
      api: this,
      description,
      name,
      table,
    });
  }

  /**
   * add a new http data source to this API
   * @param name The name of the data source
   * @param description The description of the data source
   * @param endpoint The http endpoint
   */
  public addHttpDataSource(name: string, description: string, endpoint: string): HttpDataSource {
    return new HttpDataSource(this, `${name}DS`, {
      api: this,
      description,
      endpoint,
      name,
    });
  }

  /**
   * add a new Lambda data source to this API
   * @param name The name of the data source
   * @param description The description of the data source
   * @param lambdaFunction The Lambda function to call to interact with this data source
   */
  public addLambdaDataSource( name: string, description: string, lambdaFunction: IFunction ): LambdaDataSource {
    return new LambdaDataSource(this, `${name}DS`, {
      api: this,
      description,
      name,
      lambdaFunction,
    });
  }

  /**
   * Add schema dependency if not imported
   * @param construct the construct that has a dependency
   */
  public addSchemaDependency( construct: CfnResource ): boolean {
    construct;
    return false;
  }
}