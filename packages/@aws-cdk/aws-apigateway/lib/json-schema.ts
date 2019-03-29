/**
 * Represents a JSON schema definition of the structure of a
 * REST API model. Copied from npm module jsonschema.
 *
 * @see http://json-schema.org/
 * @see https://github.com/tdegrunt/jsonschema
 */
export interface JsonSchema {
  readonly id?: string;
  // Exported as $schema - JSII linting does not like the $
  readonly schema?: string;
  // Exported as $ref - JSII linting does not like the $
  readonly ref?: string;
  readonly title?: string;
  readonly description?: string;
  readonly multipleOf?: number;
  readonly maximum?: number;
  readonly exclusiveMaximum?: boolean;
  readonly minimum?: number;
  readonly exclusiveMinimum?: boolean;
  readonly maxLength?: number;
  readonly minLength?: number;
  readonly pattern?: string;
  readonly additionalItems?: boolean | JsonSchema;
  readonly items?: JsonSchema | JsonSchema[];
  readonly maxItems?: number;
  readonly minItems?: number;
  readonly uniqueItems?: boolean;
  readonly maxProperties?: number;
  readonly minProperties?: number;
  readonly required?: string[];
  readonly additionalProperties?: boolean | JsonSchema;
  readonly definitions?: {
    [name: string]: JsonSchema;
  };
  readonly properties?: {
    [name: string]: JsonSchema;
  };
  readonly patternProperties?: {
    [name: string]: JsonSchema;
  };
  readonly dependencies?: {
    [name: string]: JsonSchema | string[];
  };
  readonly 'enum'?: any[];
  readonly type?: string | string[];
  readonly format?: string;
  readonly allOf?: JsonSchema[];
  readonly anyOf?: JsonSchema[];
  readonly oneOf?: JsonSchema[];
  readonly not?: JsonSchema;
}

export class JsonSchemaMapper {
  /**
   * Transforms naming of some properties to prefix with a $, where needed
   * according to the JSON schema spec
   * @param jsonSchema The JsonSchema object to transform for CloudFormation output
   */
  public static toCfnJsonSchema(jsonSchema: JsonSchema): any {
    let cfnJsonSchema: string = JSON.stringify(jsonSchema);
    JsonSchemaMapper.PropsWithPrefix.forEach(prop => {
      const propKey = `"${prop}":`;
      const propReplace = `"$${prop}":`;
      cfnJsonSchema = cfnJsonSchema.replace(propKey, propReplace);
    });

    return JSON.parse(cfnJsonSchema);
  }

  private static readonly PropsWithPrefix = ['schema', 'ref'];
}