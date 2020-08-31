import { readFileSync } from 'fs';
import { Lazy } from '@aws-cdk/core';
import { CfnGraphQLSchema } from './appsync.generated';
import { GraphQLApi } from './graphqlapi';
import { SchemaMode, shapeAddition } from './private';
import { IIntermediateType } from './schema-base';
import { ResolvableField } from './schema-field';
import { ObjectType } from './schema-intermediate';

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

  private query?: ObjectType;

  private mutation?: ObjectType;

  private subscription?: ObjectType;

  private schema?: CfnGraphQLSchema;

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
        definition: Lazy.stringValue({ produce: () => `${this.declareSchema()}${this.definition}` }),
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
   * Add a query field to the schema's Query. If one isn't set by
   * the user, CDK will create an Object Type called 'Query'. For example,
   *
   * type Query {
   *   fieldName: Field.returnType
   * }
   *
   * @param fieldName the name of the query
   * @param field the resolvable field to for this query
   */
  public addQuery(fieldName: string, field: ResolvableField): ObjectType {
    if (this.mode !== SchemaMode.CODE) {
      throw new Error(`Unable to add query. Schema definition mode must be ${SchemaMode.CODE} Received: ${this.mode}`);
    }
    if (!this.query) {
      this.query = new ObjectType('Query', { definition: {} });
      this.addType(this.query);
    };
    this.query.addField({ fieldName, field });
    return this.query;
  }

  /**
   * Add a mutation field to the schema's Mutation. If one isn't set by
   * the user, CDK will create an Object Type called 'Mutation'. For example,
   *
   * type Mutation {
   *   fieldName: Field.returnType
   * }
   *
   * @param fieldName the name of the Mutation
   * @param field the resolvable field to for this Mutation
   */
  public addMutation(fieldName: string, field: ResolvableField): ObjectType {
    if (this.mode !== SchemaMode.CODE) {
      throw new Error(`Unable to add mutation. Schema definition mode must be ${SchemaMode.CODE} Received: ${this.mode}`);
    }
    if (!this.mutation) {
      this.mutation = new ObjectType('Mutation', { definition: {} });
      this.addType(this.mutation);
    };
    this.mutation.addField({ fieldName, field });
    return this.mutation;
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

  /**
   * Set the root types of this schema if they are defined.
   *
   * For example:
   * schema {
   *   query: Query
   *   mutation: Mutation
   *   subscription: Subscription
   * }
   */
  private declareSchema(): string {
    if (!this.query && !this.mutation && !this.subscription) {
      return '';
    }
    type root = 'mutation' | 'query' | 'subscription';
    const list: root[] = ['query', 'mutation', 'subscription'];
    return shapeAddition({
      prefix: 'schema',
      fields: list.map((key: root) => this[key] ? `${key}: ${this[key]?.name}` : '')
        .filter((field) => field != ''),
    }) + '\n';
  }
}