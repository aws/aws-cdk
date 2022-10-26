import { readFileSync } from 'fs';
import { IGraphqlApi } from './graphqlapi-base';

/**
  * Configuration for bound graphql schema
  *
  * Returned from ISchema.bind allowing late binding of schemas to graphqlapi-base
  */
export interface ISchemaConfig {
  /**
    * The ID of the api the schema is bound to
    */
  apiId: string;

  /**
    * The schema definition string
    */
  definition: string;
}

/**
  * Interface for implementing your own schema
  *
  * Useful for providing schema's from sources other than assets
  */
export interface ISchema {
  /**
    * Binds a schema string to a GraphQlApi
    *
    * @returns ISchemaConfig with apiId and schema definition string
    * @param api the api to bind the schema to
    */
  bind(api: IGraphqlApi): ISchemaConfig;
}

/**
 * The options for configuring a schema from an existing file
 */
export interface SchemaProps {
  /**
   * The file path for the schema. When this option is
   * configured, then the schema will be generated from an
   * existing file from disk.
   */
  readonly filePath: string,
};

/**
 * The Schema for a GraphQL Api
 *
 * If no options are configured, schema will be generated
 * code-first.
 */
export class SchemaFile implements ISchema {
  /**
   * Generate a Schema from file
   *
   * @returns `SchemaAsset` with immutable schema defintion
   * @param filePath the file path of the schema file
   */
  public static fromAsset(filePath: string): SchemaFile {
    return new SchemaFile({ filePath });
  }

  /**
   * The definition for this schema
   */
  public definition: string;

  public constructor(options: SchemaProps) {
    this.definition = readFileSync(options.filePath).toString('utf-8');
  }

  /**
   * Called when the GraphQL Api is initialized to allow this object to bind
   * to the stack.
   *
   * @param api The binding GraphQL Api
   */
  public bind(api: IGraphqlApi): ISchemaConfig {
    return {
      apiId: api.apiId,
      definition: this.definition,
    };
  }
}
