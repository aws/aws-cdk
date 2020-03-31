/**
 * Defines the version of the JSON Schema to use
 */
export enum JsonSchemaVersion {
  /**
   * In API Gateway models are defined using the JSON schema draft 4.
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-04
   */
  DRAFT4 = 'http://json-schema.org/draft-04/schema#',

  /**
   * JSON schema Draft 7.
   *
   * In API Gateway models are defined using the JSON schema draft 4.
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-07
   */
  DRAFT7 = 'http://json-schema.org/draft-07/schema#'
}

/**
 * Defines a type in a JSON Schema
 */
export enum JsonSchemaType {
  /**
   * This type only allows null values
   */
  NULL = "null",

  /**
   * Boolean property
   */
  BOOLEAN = "boolean",

  /**
   * Object property, will have properties defined
   */
  OBJECT = "object",

  /**
   * Array object, will have an item type defined
   */
  ARRAY = "array",

  /**
   * Number property
   */
  NUMBER = "number",

  /**
   * Integer property (inherited from Number with extra constraints)
   */
  INTEGER = "integer",

  /**
   * String property
   */
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
  /**
   * Defines the version for this schema
   *
   * @default - JSON Schema version 4 will be used
   */
  readonly schema?: JsonSchemaVersion;

  /**
   * Defined an identifier for this schema
   *
   * @default - no identifier used
   */
  readonly id?: string;

  /**
   * Defines this schema as a reference to another schema
   *
   * @default - no references
   */
  readonly ref?: string;

  // Common properties
  /**
   * Type of the element being described
   *
   * @default - untyped element (or leverages ref)
   */
  readonly type?: JsonSchemaType | JsonSchemaType[];

  /**
   * Title of this schema
   *
   * @default - untitled schema
   */
  readonly title?: string;

  /**
   * Description of this schema
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * This schema is an enumeration
   *
   * @default - no values
   */
  readonly 'enum'?: any[];

  /**
   * Format constraint on this element
   *
   * @default - no format constraint
   */
  readonly format?: string;

  /**
   * Contains the definitions of the properties
   *
   * @default - no definitions
   */
  readonly definitions?: { [name: string]: JsonSchema };

  // Number or Integer
  /**
   * Forces this number to be a multiple of a this property
   *
   * @default - no constraint
   */
  readonly multipleOf?: number;
  /**
   * Upper bound (included) for this number
   *
   * @default - no constraint
   */
  readonly maximum?: number;
  /**
   * Upper bound (excluded) for this number
   *
   * @default - no constraint
   */
  readonly exclusiveMaximum?: boolean;
  /**
   * Lower bound (included) for this number
   *
   * @default - no constraint
   */
  readonly minimum?: number;
  /**
   * Lower bound (excluded) for this number
   *
   * @default - no constraint
   */
  readonly exclusiveMinimum?: boolean;

  // String
  /**
   * Maximum string length
   *
   * @default - no constraint
   */
  readonly maxLength?: number;
  /**
   * Minimum string length
   *
   * @default - no constraint
   */
  readonly minLength?: number;
  /**
   * String pattern to be enforced
   *
   * @default - no constraint
   */
  readonly pattern?: string;

  // Array
  /**
   * Defines the types for the elements of this array
   *
   * @default - no constraint
   */
  readonly items?: JsonSchema | JsonSchema[];
  /**
   * Defines additional item types for this array
   *
   * @default - no constraint
   */
  readonly additionalItems?: JsonSchema[];
  /**
   * Maximum number of items in this array
   *
   * @default - no constraint
   */
  readonly maxItems?: number;
  /**
   * Minimum number of items in this array
   *
   * @default - no constraint
   */
  readonly minItems?: number;
  /**
   * Items in this array must be unique
   *
   * @default - no constraint
   */
  readonly uniqueItems?: boolean;
  /**
   * Validates that the array contains specific items
   *
   * @default - no constraint
   */
  readonly contains?: JsonSchema | JsonSchema[];

  // Object
  /**
   * Maximum number of properties in this object
   *
   * @default - no constraint
   */
  readonly maxProperties?: number;
  /**
   * Minimum number of properties in this object
   *
   * @default - no constraint
   */
  readonly minProperties?: number;
  /**
   * Required properties
   *
   * @default - no constraint
   */
  readonly required?: string[];
  /**
   * Type definitions for the properties of the object
   *
   * @default - no constraint
   */
  readonly properties?: { [name: string]: JsonSchema };
  /**
   * Allows additional properties
   *
   * @default - no constraint
   */
  readonly additionalProperties?: boolean;
  /**
   * Validated patterns for additional properties
   *
   * @default - no constraint
   */
  readonly patternProperties?: { [name: string]: JsonSchema };
  /**
   * Defines dependencies for this element
   *
   * @default - no constraint
   */
  readonly dependencies?: { [name: string]: JsonSchema | string[] };
  /**
   * If the instance is an object, this keyword validates if every
   * property name in the instance validates against the provided schema.
   *
   * Note the property name that the schema is testing will always be a string.
   *
   * @default - no constraint
   */
  readonly propertyNames?: JsonSchema;

  // Conditional
  /**
   * An instance validates successfully against this keyword if it validates successfully against
   * all schemas defined by this keyword's value.
   *
   * @default - no constraint
   */
  readonly allOf?: JsonSchema[];
  /**
   * An instance validates successfully against this keyword if it validates successfully against
   * at least one schema defined by this keyword's value.
   *
   * @default - no constraint
   */
  readonly anyOf?: JsonSchema[];
  /**
   * An instance validates successfully against this keyword if it validates successfully against
   * exactly one schema defined by this keyword's value.
   *
   * @default - no constraint
   */
  readonly oneOf?: JsonSchema[];
  /**
   * An instance is valid against this keyword if it fails to validate successfully against the
   * schema defined by this keyword.
   *
   * @default - no constraint
   */
  readonly not?: JsonSchema;
}

/**
 * Utility class for Json Mapping
 */
export class JsonSchemaMapper {
  /**
   * Transforms naming of some properties to prefix with a $, where needed
   * according to the JSON schema spec
   * @param schema The JsonSchema object to transform for CloudFormation output
   */
  public static toCfnJsonSchema(schema: JsonSchema): any {
    const result = JsonSchemaMapper._toCfnJsonSchema(schema);
    if (! ("$schema" in result)) {
      result.$schema = JsonSchemaVersion.DRAFT4;
    }
    return result;
  }

  private static readonly SchemaPropsWithPrefix: { [key: string]: string } = {
    schema: '$schema',
    ref: '$ref',
    id: '$id'
  };
  // The value indicates whether direct children should be key-mapped.
  private static readonly SchemaPropsWithUserDefinedChildren: { [key: string]: boolean } = {
    definitions: true,
    properties: true,
    patternProperties: true,
    dependencies: true,
  };

  private static _toCfnJsonSchema(schema: any, preserveKeys = false): any {
    if (schema == null || typeof schema !== 'object') {
      return schema;
    }
    if (Array.isArray(schema)) {
      return schema.map(entry => JsonSchemaMapper._toCfnJsonSchema(entry));
    }
    return Object.assign({}, ...Object.entries(schema).map(([key, value]) => {
      const mapKey = !preserveKeys && (key in JsonSchemaMapper.SchemaPropsWithPrefix);
      const newKey = mapKey ? JsonSchemaMapper.SchemaPropsWithPrefix[key] : key;
      // If keys were preserved, don't consider SchemaPropsWithUserDefinedChildren for those keys (they are user-defined!)
      const newValue = JsonSchemaMapper._toCfnJsonSchema(value, !preserveKeys && JsonSchemaMapper.SchemaPropsWithUserDefinedChildren[key]);
      return { [newKey]: newValue };
    }));
  }
}