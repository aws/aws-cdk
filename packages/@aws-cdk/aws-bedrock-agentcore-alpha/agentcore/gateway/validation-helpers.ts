import { Token } from 'aws-cdk-lib';

/**
 * Error thrown when validation fails
 * @internal
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
interface IntervalValidation {
  fieldName: string;
  minLength: number;
  maxLength: number;
}

interface StringLengthValidation extends IntervalValidation {
  value: string;
}

/**
 * Validates the length of a string field against minimum and maximum constraints.
 * @param value - The string value to validate
 * @param fieldName - Name of the field being validated (for error messages)
 * @param minLength - Minimum allowed length (defaults to 0)
 * @param maxLength - Maximum allowed length
 * @returns true if validation passes
 * @throws Error if validation fails with current length information
 * @internal
 */
export function validateStringField(params: StringLengthValidation): string[] {
  const errors: string[] = [];

  // Handle null/undefined values
  if (params.value == null) {
    return errors; // Skip validation for null/undefined values
  }

  // Skip validation if value is an unresolved token
  if (Token.isUnresolved(params.value)) {
    return errors;
  }

  // Now safe to access .length since we know it's not a token
  const currentLength = params.value.length;

  if (params.value.length > params.maxLength) {
    errors.push(
      `The field ${params.fieldName} is ${currentLength} characters long but must be less than or equal to ${params.maxLength} characters`,
    );
  }

  if (params.value.length < params.minLength) {
    errors.push(
      `The field ${params.fieldName} is ${currentLength} characters long but must be at least ${params.minLength} characters`,
    );
  }

  return errors;
}

/**
 * Validates a string field against a regex pattern.
 * @param value - The string value to validate
 * @param fieldName - Name of the field being validated (for error messages)
 * @param pattern - Regular expression pattern to test against
 * @param customMessage - Optional custom error message
 * @returns true if validation passes
 * @throws Error if validation fails with detailed message
 * @internal
 */
export function validateFieldPattern(
  value: string,
  fieldName: string,
  pattern: RegExp,
  customMessage?: string,
): string[] {
  const errors: string[] = [];

  // Handle null/undefined values
  if (value == null) {
    return errors; // Skip validation for null/undefined values
  }

  // Evaluate only if it is not an unresolved Token
  if (!Token.isUnresolved(value)) {
    // Verify type
    if (typeof value !== 'string') {
      errors.push(`Expected string for ${fieldName}, got ${typeof value}`);
      return errors; // Return early if value is not a string
    }
    // Validate specified regex
    if (!(pattern instanceof RegExp)) {
      errors.push('Pattern must be a valid regular expression');
      return errors; // Return early if pattern is not a RegExp
    }

    // Pattern validation (only if value is string and pattern is RegExp)
    if (!pattern.test(value)) {
      const defaultMessage = `The field ${fieldName} with value "${value}" does not match the required pattern ${pattern}`;
      errors.push(customMessage || defaultMessage);
    }
  }

  return errors;
}

/**
 * @internal
 */
export type ValidationFn<T> = (param: T) => string[];

/**
 * OpenAPI schema validation parameters
 * @internal
 */
export interface OpenApiSchemaValidationParams {
  /**
   * The OpenAPI schema to validate (as a string)
   */
  schema: string;

  /**
   * Optional name for the schema (for error messages)
   */
  schemaName?: string;
}

/**
 * Parses OpenAPI schema JSON and validates format
 * @internal
 */
function parseOpenApiJson(schema: string, schemaName: string, errors: string[]): any | null {
  try {
    return JSON.parse(schema);
  } catch (e) {
    errors.push(`${schemaName} must be in JSON format. YAML is not supported. Error: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}

/**
 * Validates OpenAPI version (3.0.x or 3.1.x)
 * @internal
 */
function validateOpenApiVersion(schemaObj: any, schemaName: string, errors: string[]): void {
  if (!schemaObj.openapi) {
    errors.push(`${schemaName} must include an 'openapi' field specifying the version`);
  } else {
    const version = schemaObj.openapi;
    if (typeof version !== 'string') {
      errors.push(`${schemaName} 'openapi' field must be a string`);
    } else if (!version.startsWith('3.0.') && !version.startsWith('3.1.')) {
      errors.push(`${schemaName} version ${version} is not supported. Only OpenAPI 3.0.x and 3.1.x are supported`);
    }
  }
}

/**
 * Validates server URLs
 * @internal
 */
function validateServerUrls(schemaObj: any, schemaName: string, errors: string[]): void {
  if (!schemaObj.servers || !Array.isArray(schemaObj.servers) || schemaObj.servers.length === 0) {
    errors.push(`${schemaName} must include at least one server with a valid URL`);
  } else {
    schemaObj.servers.forEach((server: any, index: number) => {
      if (!server.url || typeof server.url !== 'string') {
        errors.push(`${schemaName} server[${index}] must have a valid URL`);
      } else {
        // Check if URL contains a protocol separator
        if (!server.url.includes('://')) {
          errors.push(`${schemaName} server[${index}] URL must contain a protocol (e.g., http:// or https://)`);
        } else {
          // Check if it starts with http or https (case-insensitive)
          // Allow template variables like {protocol}://
          const protocolEnd = server.url.indexOf('://');
          const protocol = server.url.substring(0, protocolEnd);

          // If protocol doesn't contain template variables, validate it
          if (!protocol.includes('{')) {
            if (protocol.toLowerCase() !== 'http' && protocol.toLowerCase() !== 'https') {
              errors.push(`${schemaName} server[${index}] URL must use HTTP or HTTPS protocol`);
            }
          }
          // If protocol contains template variables, skip validation (will be validated at runtime)
        }
      }
    });
  }
}

/**
 * Validates paths and operations
 * @internal
 */
function validatePathsAndOperations(schemaObj: any, schemaName: string, errors: string[]): void {
  if (!schemaObj.paths || typeof schemaObj.paths !== 'object') {
    errors.push(`${schemaName} must include a 'paths' object`);
  } else {
    const operationsMissingId: string[] = [];
    const unsupportedMediaTypes = new Set<string>();
    const pathsWithComplexSerializers: string[] = [];

    Object.entries(schemaObj.paths).forEach(([path, pathItem]: [string, any]) => {
      // Check for complex path parameter serializers
      if (path.includes('{;') || path.includes('{?') || path.includes('{*}')) {
        pathsWithComplexSerializers.push(path);
      }

      if (pathItem && typeof pathItem === 'object') {
        // Check each HTTP method
        const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];
        httpMethods.forEach(method => {
          if (pathItem[method]) {
            const operation = pathItem[method];

            // Check for operationId (REQUIRED)
            if (!operation.operationId) {
              operationsMissingId.push(`${method.toUpperCase()} ${path}`);
            }

            // Check request body media types
            if (operation.requestBody?.content) {
              Object.keys(operation.requestBody.content).forEach(mediaType => {
                if (mediaType !== 'application/json' &&
                    mediaType !== 'application/xml' &&
                    mediaType !== 'multipart/form-data' &&
                    mediaType !== 'application/x-www-form-urlencoded') {
                  unsupportedMediaTypes.add(mediaType);
                }
              });
            }

            // Check response media types
            if (operation.responses) {
              Object.values(operation.responses).forEach((response: any) => {
                if (response.content) {
                  Object.keys(response.content).forEach(mediaType => {
                    if (mediaType !== 'application/json' &&
                        mediaType !== 'application/xml') {
                      unsupportedMediaTypes.add(mediaType);
                    }
                  });
                }
              });
            }

            // Check for complex parameter serializers
            if (operation.parameters) {
              operation.parameters.forEach((param: any, idx: number) => {
                if (param.style && ['matrix', 'label', 'deepObject'].includes(param.style)) {
                  errors.push(`${schemaName} ${method.toUpperCase()} ${path} parameter[${idx}] uses unsupported serialization style: ${param.style}`);
                }
              });
            }
          }
        });
      }
    });

    if (operationsMissingId.length > 0) {
      errors.push(`${schemaName} operations must include 'operationId' field. Missing in: ${operationsMissingId.join(', ')}`);
    }

    if (pathsWithComplexSerializers.length > 0) {
      errors.push(`${schemaName} contains unsupported complex path parameter serializers in: ${pathsWithComplexSerializers.join(', ')}`);
    }

    if (unsupportedMediaTypes.size > 0) {
      const mediaTypesList = Array.from(unsupportedMediaTypes).join(', ');
      errors.push(`${schemaName} uses unsupported media types: ${mediaTypesList}. Only application/json, application/xml, multipart/form-data, and application/x-www-form-urlencoded are supported`);
    }
  }
}

/**
 * Recursive helper to check for unsupported schema composition (oneOf, anyOf, allOf)
 * @internal
 */
function checkSchemaComposition(obj: any, schemaName: string, errors: string[], path: string = ''): void {
  if (!obj || typeof obj !== 'object') return;

  // Check current level for unsupported keywords
  if ('oneOf' in obj) {
    errors.push(`${schemaName} contains unsupported 'oneOf' schema composition at ${path || 'root'}`);
  }
  if ('anyOf' in obj) {
    errors.push(`${schemaName} contains unsupported 'anyOf' schema composition at ${path || 'root'}`);
  }
  if ('allOf' in obj) {
    errors.push(`${schemaName} contains unsupported 'allOf' schema composition at ${path || 'root'}`);
  }

  // Recursively check nested objects
  Object.entries(obj).forEach(([key, value]) => {
    if (key !== 'oneOf' && key !== 'anyOf' && key !== 'allOf' && value && typeof value === 'object') {
      const newPath = path ? `${path}.${key}` : key;
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          checkSchemaComposition(item, schemaName, errors, `${newPath}[${index}]`);
        });
      } else {
        checkSchemaComposition(value, schemaName, errors, newPath);
      }
    }
  });
}

/**
 * Validates schema composition (checks for unsupported oneOf, anyOf, allOf)
 * @internal
 */
function validateSchemaComposition(schemaObj: any, schemaName: string, errors: string[]): void {
  // Check components/definitions for unsupported schema composition
  if (schemaObj.components?.schemas) {
    checkSchemaComposition(schemaObj.components.schemas, schemaName, errors, 'components.schemas');
  }
  if (schemaObj.definitions) {
    checkSchemaComposition(schemaObj.definitions, schemaName, errors, 'definitions');
  }

  // Check paths for unsupported schema composition
  if (schemaObj.paths) {
    checkSchemaComposition(schemaObj.paths, schemaName, errors, 'paths');
  }
}

/**
 * Validates security schemes
 * @internal
 */
function validateSecuritySchemes(schemaObj: any, schemaName: string, errors: string[]): void {
  if (schemaObj.security && Array.isArray(schemaObj.security) && schemaObj.security.length > 0) {
    errors.push(`${schemaName} contains security schemes at the OpenAPI specification level. Authentication must be configured using the Gateway's outbound authorization configuration instead`);
  }
}

/**
 * Validates callbacks and webhooks
 * @internal
 */
function validateCallbacksAndWebhooks(schemaObj: any, schemaName: string, errors: string[]): void {
  // Check for callbacks in operations
  if (schemaObj.paths) {
    Object.entries(schemaObj.paths).forEach(([path, pathItem]: [string, any]) => {
      if (pathItem && typeof pathItem === 'object') {
        Object.values(pathItem).forEach((operation: any) => {
          if (operation && typeof operation === 'object') {
            if (operation.callbacks) {
              errors.push(`${schemaName} contains unsupported 'callbacks' in path ${path}`);
            }
          }
        });
      }
    });
  }

  // Check for webhooks
  if (schemaObj.webhooks) {
    errors.push(`${schemaName} contains unsupported 'webhooks'`);
  }
}

/**
 * Validates an OpenAPI schema against Gateway requirements
 * Based on AWS documentation: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-schema-openapi.html
 *
 * @param params - The validation parameters
 * @returns Array of validation error messages (empty if valid)
 * @internal
 */
export function validateOpenApiSchema(params: OpenApiSchemaValidationParams): string[] {
  const errors: string[] = [];
  const { schema, schemaName = 'OpenAPI schema' } = params;

  if (Token.isUnresolved(schema)) {
    return errors;
  }
  const schemaObj = parseOpenApiJson(schema, schemaName, errors);
  if (!schemaObj) return errors;

  validateOpenApiVersion(schemaObj, schemaName, errors);
  validateServerUrls(schemaObj, schemaName, errors);
  validatePathsAndOperations(schemaObj, schemaName, errors);
  validateSchemaComposition(schemaObj, schemaName, errors);
  validateSecuritySchemes(schemaObj, schemaName, errors);
  validateCallbacksAndWebhooks(schemaObj, schemaName, errors);

  return errors;
}
