export enum JsonSchemaVersion {
  DRAFT4 = 'http://json-schema.org/draft-04/schema#',
  DRAFT7 = 'http://json-schema.org/draft-07/schema#'
}

export enum JsonSchemaType {
  NULL = "null",
  BOOLEAN = "boolean",
  OBJECT = "object",
  ARRAY = "array",
  NUMBER = "number",
  INTEGER = "integer",
  STRING = "string"
}

/**
 * Represents a JSON schema definition of the structure of a
 * REST API model. Copied from npm module jsonschema.
 *
 * @see http://json-schema.org/
 * @see https://github.com/tdegrunt/jsonschema
 */
export interface JsonSchema {
  // Special keywords
  readonly schema?: JsonSchemaVersion | string;
  readonly id?: string;
  readonly ref?: string;

  // Common properties
  readonly type?: JsonSchemaType | JsonSchemaType[];
  readonly title?: string;
  readonly description?: string;
  readonly 'enum'?: any[];
  readonly format?: string;
  readonly definitions?: { [name: string]: JsonSchema };

  // Number or Integer
  readonly multipleOf?: number;
  readonly maximum?: number;
  readonly exclusiveMaximum?: boolean;
  readonly minimum?: number;
  readonly exclusiveMinimum?: boolean;

  // String
  readonly maxLength?: number;
  readonly minLength?: number;
  readonly pattern?: string;

  // Array
  readonly items?: JsonSchema | JsonSchema[];
  readonly additionalItems?: JsonSchema[];
  readonly maxItems?: number;
  readonly minItems?: number;
  readonly uniqueItems?: boolean;
  readonly contains?: JsonSchema | JsonSchema[];

  // Object
  readonly maxProperties?: number;
  readonly minProperties?: number;
  readonly required?: string[];
  readonly properties?: { [name: string]: JsonSchema };
  readonly additionalProperties?: JsonSchema;
  readonly patternProperties?: { [name: string]: JsonSchema };
  readonly dependencies?: { [name: string]: JsonSchema | string[] };
  readonly propertyNames?: JsonSchema;

  // Conditional
  readonly allOf?: JsonSchema[];
  readonly anyOf?: JsonSchema[];
  readonly oneOf?: JsonSchema[];
  readonly not?: JsonSchema;
}

export class JsonSchemaMapper {
  /**
   * Transforms naming of some properties to prefix with a $, where needed
   * according to the JSON schema spec
   * @param schema The JsonSchema object to transform for CloudFormation output
   */
  public static toCfnJsonSchema(schema: JsonSchema): any {
    const result = JsonSchemaMapper._toCfnJsonSchema(schema);
    if (! ("$schema" in result)) {
      result.$schema = JsonSchemaVersion.DRAFT7;
    }
    return result;
  }

  private static readonly SchemaPropsWithPrefix: { [key: string]: string } = {
    schema: '$schema',
    ref: '$ref',
    id: '$id'
  };
  private static readonly SubSchemaProps: { [key: string]: boolean } = {
    definitions: true,
    items: true,
    additionalItems: true,
    contains: true,
    properties: true,
    additionalProperties: true,
    patternProperties: true,
    dependencies: true,
    propertyNames: true
  };

  private static _toCfnJsonSchema(schema: any): any {
    if (schema === null || schema === undefined) {
      return schema;
    }
    if ((typeof(schema) === "string") || (typeof(schema) === "boolean") || (typeof(schema) === "number")) {
      return schema;
    }
    if (Array.isArray(schema)) {
      return schema.map((entry) => JsonSchemaMapper._toCfnJsonSchema(entry));
    }
    if (typeof(schema) === "object") {
      return Object.assign({}, ...Object.entries(schema).map((entry) => {
        const key = entry[0];
        const newKey = (key in JsonSchemaMapper.SchemaPropsWithPrefix) ? JsonSchemaMapper.SchemaPropsWithPrefix[key] : key;
        const value = (key in JsonSchemaMapper.SubSchemaProps) ? JsonSchemaMapper._toCfnJsonSchema(entry[1]) : entry[1];
        return { [newKey]: value };
      }));
    }
    return schema;
  }
}
