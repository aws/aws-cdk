import { readFileSync } from 'fs';
import { Lazy } from '@aws-cdk/core';
import { CfnGraphQLSchema } from './appsync.generated';
import { GraphQLApi } from './graphqlapi';
import { SchemaMode } from './private';
import { IIntermediateType } from './schema-base';

/**
 * The options for configuring a schema
 *
 * If no options are specified, then the schema will
 * be generated code-first.
 */
export interface SchemaOptions {
  /**
   * The file path for the schema. When this option is
   * configured, then the schema will be generated from an
   * existing file from disk.
   *
   * @default - schema not configured through disk asset
   */
  readonly filePath?: string,
};

/**
 * The Schema for a GraphQL Api
 *
 * If no options are configured, schema will be generated
 * code-first.
 */
export class Schema {
  /**
   * Generate a Schema from file
   *
   * @returns `SchemaAsset` with immutable schema defintion
   * @param filePath the file path of the schema file
   */
  public static fromAsset(filePath: string): Schema {
    return new Schema({ filePath });
  }

  /**
   * The definition for this schema
   */
  public definition: string;

  protected schema?: CfnGraphQLSchema;

  private mode: SchemaMode;

  public constructor(options?: SchemaOptions) {
    if (options?.filePath) {
      this.mode = SchemaMode.FILE;
      this.definition = readFileSync(options.filePath).toString('utf-8');
    } else {
      this.mode = SchemaMode.CODE;
      this.definition = '';
    }
  }

  /**
   * Called when the GraphQL Api is initialized to allow this object to bind
   * to the stack.
   *
   * @param api The binding GraphQL Api
   */
  public bind(api: GraphQLApi): CfnGraphQLSchema {
    if (!this.schema) {
      this.schema = new CfnGraphQLSchema(api, 'Schema', {
        apiId: api.apiId,
        definition: Lazy.stringValue({ produce: () => this.definition }),
      });
    }
    return this.schema;
  }

  /**
   * Escape hatch to add to Schema as desired. Will always result
   * in a newline.
   *
   * @param addition the addition to add to schema
   * @param delimiter the delimiter between schema and addition
   * @default - ''
   *
   * @experimental
   */
  public addToSchema(addition: string, delimiter?: string): void {
    if (this.mode !== SchemaMode.CODE) {
      throw new Error('API cannot append to schema because schema definition mode is not configured as CODE.');
    }
    const sep = delimiter ?? '';
    this.definition = `${this.definition}${sep}${addition}\n`;
  }

  /**
   * Add type to the schema
   *
   * @param type the intermediate type to add to the schema
   *
   * @experimental
   */
  public addType(type: IIntermediateType): IIntermediateType {
    if (this.mode !== SchemaMode.CODE) {
      throw new Error('API cannot add type because schema definition mode is not configured as CODE.');
    }
    this.addToSchema(Lazy.stringValue({ produce: () => type.toString() }));
    return type;
  }
}