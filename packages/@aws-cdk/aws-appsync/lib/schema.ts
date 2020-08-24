import { readFileSync } from 'fs';
import { Lazy } from '@aws-cdk/core';
import { CfnGraphQLSchema } from './appsync.generated';
import { GraphQLApi } from './graphqlapi';
import { IIntermediateType } from './schema-base';
import { InterfaceType, IntermediateTypeProps, ObjectTypeProps, ObjectType } from './schema-intermediate';

/**
 * The Schema for a GraphQL Api
 */
export abstract class Schema {
  /**
   * Generate a Schema code-first
   *
   * @returns `SchemaCode` with mutable schema defintion
   */
  public static fromCode(): SchemaCode {
    return new SchemaCode();
  }
  /**
   * Generate a Schema from file
   *
   * @returns `SchemaFile` with immutable schema defintion
   * @param filePath the file path of the schema file
   */
  public static fromFile(filePath: string): SchemaFile {
    return new SchemaFile(filePath);
  }

  protected schema?: CfnGraphQLSchema;

  /**
   * Called when the GraphQL Api is initialized to allow this object to bind
   * to the stack.
   *
   * @param api The binding GraphQL Api
   */
  public abstract bind(api: GraphQLApi): CfnGraphQLSchema;

  /**
   * Escape hatch to append to Schema as desired. Will always result
   * in a newline.
   *
   * @param addition the addition to add to schema
   * @param delimiter the delimiter between schema and addition
   * @default - ''
   *
   * @experimental
   */
  public abstract appendToSchema(addition: string, delimiter?: string): void;

  /**
   * Add type to the schema
   *
   * @param type the intermediate type to add to the schema
   *
   * @experimental
   */
  public abstract addType(type: IIntermediateType): Schema;

  /**
   * Add an object type to the schema, if SchemaCode
   *
   * @param name the name of the object type
   * @param props the definition
   *
   * @experimental
   */
  public abstract addObjectType(name: string, props: ObjectTypeProps): ObjectType;

  /**
   * Add an interface type to the schema
   *
   * @param name the name of the interface type
   * @param props the definition
   *
   * @experimental
   */
  public abstract addInterfaceType(name: string, props: IntermediateTypeProps): InterfaceType;
}

/**
 * GraphQL Schema that is mutable through code-first approach
 */
export class SchemaCode extends Schema {
  private definition: string;
  constructor() {
    super();
    this.definition = '';
  }

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
   * Escape hatch to append to Schema as desired. Will always result
   * in a newline.
   *
   * @param addition the addition to add to schema
   * @param delimiter the delimiter between schema and addition
   * @default - ''
   *
   * @experimental
   */
  public appendToSchema(addition: string, delimiter?: string): void {
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
  public addType(type: IIntermediateType): Schema {
    this.appendToSchema(Lazy.stringValue({ produce: () => type.toString() }));
    return this;
  }

  /**
   * Add an object type to the schema
   *
   * @param name the name of the object type
   * @param props the definition
   *
   * @experimental
   */
  public addObjectType(name: string, props: ObjectTypeProps): ObjectType {
    const type = new ObjectType(name, {
      ...props,
    });
    this.addType(type);
    return type;
  }

  /**
   * Add an interface type to the schema
   *
   * @param name the name of the interface type
   * @param props the definition
   *
   * @experimental
   */
  public addInterfaceType(name: string, props: IntermediateTypeProps): InterfaceType {
    const type = new InterfaceType(name, {
      ...props,
    });
    this.addType(type);;
    return type;
  }
}

/**
 * GraphQL Schema that is declared through a schema-first approach
 */
export class SchemaFile extends Schema {
  private filePath: string;
  constructor(filePath: string) {
    super();
    this.filePath = filePath;
  }

  public bind(api: GraphQLApi): CfnGraphQLSchema {
    if (!this.schema) {
      this.schema = new CfnGraphQLSchema(api, 'Schema', {
        apiId: api.apiId,
        definition: readFileSync(this.filePath).toString('UTF-8'),
      });
    }
    return this.schema;
  }

  public appendToSchema(_addition: string, _delimiter?: string): void {
    throw new Error('API cannot append to schema because schema definition mode is not configured as CODE.');
  }
  public addType(_type: IIntermediateType): Schema {
    throw new Error('API cannot add type because schema definition mode is not configured as CODE.');
  }
  public addObjectType(_name: string, _props: ObjectTypeProps): ObjectType {
    throw new Error('API cannot add object type because schema definition mode is not configured as CODE.');
  }
  public addInterfaceType(_name: string, _props: IntermediateTypeProps): InterfaceType {
    throw new Error('API cannot add interface type because schema definition mode is not configured as CODE.');
  }
}