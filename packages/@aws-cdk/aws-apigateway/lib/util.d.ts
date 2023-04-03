import * as jsonSchema from './json-schema';
export declare const ALL_METHODS: string[];
export declare function validateHttpMethod(method: string, messagePrefix?: string): void;
export declare function parseMethodOptionsPath(originalPath: string): {
    resourcePath: string;
    httpMethod: string;
};
export declare function parseAwsApiCall(path?: string, action?: string, actionParams?: {
    [key: string]: string;
}): {
    apiType: string;
    apiValue: string;
};
export declare function validateInteger(property: number | undefined, messagePrefix: string): void;
export declare function validateDouble(property: number | undefined, messagePrefix: string): void;
export declare class JsonSchemaMapper {
    /**
     * Transforms naming of some properties to prefix with a $, where needed
     * according to the JSON schema spec
     * @param schema The JsonSchema object to transform for CloudFormation output
     */
    static toCfnJsonSchema(schema: jsonSchema.JsonSchema): any;
    private static readonly SchemaPropsWithPrefix;
    private static readonly SchemaPropsWithUserDefinedChildren;
    private static _toCfnJsonSchema;
}
