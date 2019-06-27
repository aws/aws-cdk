import { format as formatUrl } from 'url';
import jsonSchema = require('./json-schema');

const ALLOWED_METHODS = [ 'ANY', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT' ];

export function validateHttpMethod(method: string, messagePrefix: string = '') {
  if (!ALLOWED_METHODS.includes(method)) {
    throw new Error(`${messagePrefix}Invalid HTTP method "${method}". Allowed methods: ${ALLOWED_METHODS.join(',')}`);
  }
}

export function parseMethodOptionsPath(originalPath: string): { resourcePath: string, httpMethod: string } {
  if (!originalPath.startsWith('/')) {
    throw new Error(`Method options path must start with '/': ${originalPath}`);
  }

  const path = originalPath.substr(1); // trim trailing '/'

  const components = path.split('/');

  if (components.length < 2) {
    throw new Error(`Method options path must include at least two components: /{resource}/{method} (i.e. /foo/bar/GET): ${path}`);
  }

  const httpMethod = components.pop()!.toUpperCase(); // last component is an HTTP method
  if (httpMethod !== '*') {
    validateHttpMethod(httpMethod, `${originalPath}: `);
  }

  let resourcePath = '/~1' + components.join('~1');
  if (components.length === 1 && components[0] === '*') {
    resourcePath = '/*';
  } else if (components.length === 1 && components[0] === '') {
    resourcePath = '/';
  }

  return {
    httpMethod,
    resourcePath
  };
}

export function parseAwsApiCall(path?: string, action?: string, actionParams?: { [key: string]: string }): { apiType: string, apiValue: string } {
  if (actionParams && !action) {
    throw new Error(`"actionParams" requires that "action" will be set`);
  }

  if (path && action) {
    throw new Error(`"path" and "action" are mutually exclusive (path="${path}", action="${action}")`);
  }

  if (path) {
    return {
      apiType: 'path',
      apiValue: path
    };
  }

  if (action) {
    if (actionParams) {
      action += '&' + formatUrl({ query: actionParams }).substr(1);
    }

    return {
      apiType: 'action',
      apiValue: action
    };
  }

  throw new Error(`Either "path" or "action" are required`);
}

export function validateInteger(property: number | undefined, messagePrefix: string) {
  if (property && !Number.isInteger(property)) {
    throw new Error(`${messagePrefix} should be an integer`);
  }
}

export class JsonSchemaMapper {
  /**
   * Transforms naming of some properties to prefix with a $, where needed
   * according to the JSON schema spec
   * @param schema The JsonSchema object to transform for CloudFormation output
   */
  public static toCfnJsonSchema(schema: jsonSchema.JsonSchema): any {
    const result = JsonSchemaMapper._toCfnJsonSchema(schema);
    if (! ("$schema" in result)) {
      result.$schema = jsonSchema.JsonSchemaVersion.DRAFT4;
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
