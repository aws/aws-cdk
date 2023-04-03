export declare enum JsonSchemaVersion {
    /**
     * In API Gateway models are defined using the JSON schema draft 4.
     * @see https://tools.ietf.org/html/draft-zyp-json-schema-04
     */
    DRAFT4 = "http://json-schema.org/draft-04/schema#",
    DRAFT7 = "http://json-schema.org/draft-07/schema#"
}
export declare enum JsonSchemaType {
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
    readonly schema?: JsonSchemaVersion;
    readonly id?: string;
    readonly ref?: string;
    readonly type?: JsonSchemaType | JsonSchemaType[];
    readonly title?: string;
    readonly description?: string;
    readonly 'enum'?: any[];
    /**
     * The default value if you use an enum.
     *
     * @default - not set
     */
    readonly default?: any;
    readonly format?: string;
    readonly definitions?: {
        [name: string]: JsonSchema;
    };
    readonly multipleOf?: number;
    readonly maximum?: number;
    readonly exclusiveMaximum?: boolean;
    readonly minimum?: number;
    readonly exclusiveMinimum?: boolean;
    readonly maxLength?: number;
    readonly minLength?: number;
    readonly pattern?: string;
    readonly items?: JsonSchema | JsonSchema[];
    readonly additionalItems?: JsonSchema[];
    readonly maxItems?: number;
    readonly minItems?: number;
    readonly uniqueItems?: boolean;
    readonly contains?: JsonSchema | JsonSchema[];
    readonly maxProperties?: number;
    readonly minProperties?: number;
    readonly required?: string[];
    readonly properties?: {
        [name: string]: JsonSchema;
    };
    readonly additionalProperties?: JsonSchema | boolean;
    readonly patternProperties?: {
        [name: string]: JsonSchema;
    };
    readonly dependencies?: {
        [name: string]: JsonSchema | string[];
    };
    readonly propertyNames?: JsonSchema;
    readonly allOf?: JsonSchema[];
    readonly anyOf?: JsonSchema[];
    readonly oneOf?: JsonSchema[];
    readonly not?: JsonSchema;
}
