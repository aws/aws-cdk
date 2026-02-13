export enum JsonSchemaVersion {
  /**
   * In API Gateway models are defined using the JSON schema draft 4.
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-04
   */
  DRAFT4 = 'http://json-schema.org/draft-04/schema#',
  DRAFT7 = 'http://json-schema.org/draft-07/schema#',
}

export enum JsonSchemaType {
  NULL = 'null',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  NUMBER = 'number',
  INTEGER = 'integer',
  STRING = 'string',
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
  readonly schema?: JsonSchemaVersion | undefined;
  readonly id?: string | undefined;
  readonly ref?: string | undefined;

  // Common properties
  readonly type?: JsonSchemaType | JsonSchemaType[] | undefined;
  readonly title?: string | undefined;
  readonly description?: string | undefined;
  readonly enum?: any[] | undefined;
  /**
   * The default value if you use an enum.
   *
   * @default - not set
   */
  readonly default?: any | undefined;
  readonly format?: string | undefined;
  readonly definitions?: { [name: string]: JsonSchema } | undefined;

  // Number or Integer
  readonly multipleOf?: number | undefined;
  readonly maximum?: number | undefined;
  readonly exclusiveMaximum?: boolean | undefined;
  readonly minimum?: number | undefined;
  readonly exclusiveMinimum?: boolean | undefined;

  // String
  readonly maxLength?: number | undefined;
  readonly minLength?: number | undefined;
  readonly pattern?: string | undefined;

  // Array
  readonly items?: JsonSchema | JsonSchema[] | undefined;
  readonly additionalItems?: JsonSchema | boolean | undefined;
  readonly maxItems?: number | undefined;
  readonly minItems?: number | undefined;
  readonly uniqueItems?: boolean | undefined;
  readonly contains?: JsonSchema | JsonSchema[] | undefined;

  // Object
  readonly maxProperties?: number | undefined;
  readonly minProperties?: number | undefined;
  readonly required?: string[] | undefined;
  readonly properties?: { [name: string]: JsonSchema } | undefined;
  readonly additionalProperties?: JsonSchema | boolean | undefined;
  readonly patternProperties?: { [name: string]: JsonSchema } | undefined;
  readonly dependencies?: { [name: string]: JsonSchema | string[] } | undefined;
  readonly propertyNames?: JsonSchema | undefined;

  // Conditional
  readonly allOf?: JsonSchema[] | undefined;
  readonly anyOf?: JsonSchema[] | undefined;
  readonly oneOf?: JsonSchema[] | undefined;
  readonly not?: JsonSchema | undefined;
}
