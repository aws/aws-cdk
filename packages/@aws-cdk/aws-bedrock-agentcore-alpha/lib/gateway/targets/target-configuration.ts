import * as fs from 'fs';
import { Token } from 'aws-cdk-lib';
import type { IRestApi } from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { IFunction } from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';
import type { IGateway } from '../gateway-base';
import { validateOpenApiSchema, validateFieldPattern, validateStringField, ValidationError } from '../validation-helpers';
import type { ApiSchema } from './schema/api-schema';
import { AssetApiSchema } from './schema/api-schema';
import type { ToolSchema } from './schema/tool-schema';
import { McpTargetType } from './target-base';

/******************************************************************************
 *                          Interface
 *****************************************************************************/

/**
 * Configuration returned by binding a target configuration
 */
export interface TargetConfigurationConfig {
  /**
   * Indicates that the configuration has been successfully bound
   */
  readonly bound: boolean;
}

/**
 * Base interface for target configurations
 */
export interface ITargetConfiguration {
  /**
   * The target type
   */
  readonly targetType: McpTargetType;

  /**
   * Binds the configuration to a construct scope
   * Sets up permissions and dependencies
   */
  bind(scope: Construct, gateway: IGateway): TargetConfigurationConfig;

  /**
   * Renders the configuration as CloudFormation properties
   * @internal
   */
  _render(): any;
}

/******************************************************************************
 *                     MCP Target Configuration Base
 *****************************************************************************/

/**
 * Abstract base class for MCP target configurations
 * Provides common functionality for all MCP target types
 */
export abstract class McpTargetConfiguration implements ITargetConfiguration {
  /**
   * The target type
   */
  public abstract readonly targetType: McpTargetType;

  /**
   * Binds the configuration to a construct scope
   * Sets up permissions and dependencies
   */
  public abstract bind(scope: Construct, gateway: IGateway): TargetConfigurationConfig;

  /**
   * Renders the MCP-specific configuration
   */
  protected abstract renderMcpConfiguration(): any;

  /**
   * Renders the configuration as CloudFormation properties
   * @internal
   */
  public _render(): any {
    return {
      mcp: this.renderMcpConfiguration(),
    };
  }
}

/******************************************************************************
 *                     Lambda Target Configuration
 *****************************************************************************/

/**
 * Configuration for Lambda-based MCP targets
 *
 * This configuration wraps a Lambda function as MCP tools,
 * allowing the gateway to invoke the function to provide tool capabilities.
 */
export class LambdaTargetConfiguration extends McpTargetConfiguration {
  /**
   * Create a Lambda target configuration
   *
   * @param lambdaFunction The Lambda function to invoke
   * @param toolSchema The schema defining the tools
   * @returns A new LambdaTargetConfiguration instance
   */
  public static create(
    lambdaFunction: IFunction,
    toolSchema: ToolSchema,
  ): LambdaTargetConfiguration {
    return new LambdaTargetConfiguration(lambdaFunction, toolSchema);
  }

  public readonly targetType = McpTargetType.LAMBDA;

  /**
   * The Lambda function that implements the MCP server logic
   */
  public readonly lambdaFunction: IFunction;

  /**
   * The tool schema that defines the available tools
   */
  public readonly toolSchema: ToolSchema;

  constructor(lambdaFunction: IFunction, toolSchema: ToolSchema) {
    super();
    this.lambdaFunction = lambdaFunction;
    this.toolSchema = toolSchema;
  }

  /**
   * Binds this configuration to a construct scope
   * Sets up necessary permissions for the gateway to invoke the Lambda function
   *
   * @param scope The construct scope
   * @param gateway The gateway that will use this target
   */
  public bind(scope: Construct, gateway: IGateway): TargetConfigurationConfig {
    // Bind the tool schema
    this.toolSchema.bind(scope);
    // Grant permissions to gateway role
    this.toolSchema.grantPermissionsToRole(gateway.role);
    this.lambdaFunction.grantInvoke(gateway.role);

    return { bound: true };
  }

  /**
   * Renders the MCP-specific configuration
   */
  protected renderMcpConfiguration(): any {
    return {
      lambda: {
        lambdaArn: this.lambdaFunction.functionArn,
        toolSchema: this.toolSchema._render(),
      },
    };
  }
}

/******************************************************************************
 *                     OpenAPI Target Configuration
 *****************************************************************************/

/**
 * Configuration for OpenAPI-based MCP targets
 *
 * This configuration exposes an OpenAPI/REST API as MCP tools,
 * allowing the gateway to transform API operations into tool calls.
 */
export class OpenApiTargetConfiguration extends McpTargetConfiguration {
  /**
   * Create an OpenAPI target configuration
   *
   * @param apiSchema The OpenAPI schema
   * @param validateSchema Whether to validate the OpenAPI schema (only applies to inline schemas)
   * @returns A new OpenApiTargetConfiguration instance
   */
  public static create(apiSchema: ApiSchema, validateSchema?: boolean): OpenApiTargetConfiguration {
    return new OpenApiTargetConfiguration(apiSchema, validateSchema);
  }

  public readonly targetType = McpTargetType.OPENAPI_SCHEMA;

  /**
   * The OpenAPI schema that defines the API
   */
  public readonly apiSchema: ApiSchema;

  /**
   * Whether to validate the OpenAPI schema
   */
  private readonly shouldValidateSchema: boolean;

  constructor(apiSchema: ApiSchema, validateSchema?: boolean) {
    super();
    this.apiSchema = apiSchema;
    this.shouldValidateSchema = validateSchema ?? true;
  }

  /**
   * Binds this configuration to a construct scope
   * Sets up necessary permissions for the gateway to access the API schema
   *
   * @param scope The construct scope
   * @param gateway The gateway that will use this target
   */
  public bind(scope: Construct, gateway: IGateway): TargetConfigurationConfig {
    if (this.shouldValidateSchema) {
      // For inline schemas
      if (this.apiSchema.inlineSchema) {
        const errors = validateOpenApiSchema({
          schema: this.apiSchema.inlineSchema,
          schemaName: 'OpenAPI schema for target',
        });
        if (errors.length > 0) {
          throw new ValidationError(`OpenAPI schema validation failed:\n${errors.join('\n')}`);
        }
      } else if (this.apiSchema instanceof AssetApiSchema) {
        // For asset schemas (local files)
        try {
          const schemaContent = fs.readFileSync(this.apiSchema._getFilePath(), 'utf-8');
          const errors = validateOpenApiSchema({
            schema: schemaContent,
            schemaName: `OpenAPI schema from file ${this.apiSchema._getFilePath()}`,
          });
          if (errors.length > 0) {
            throw new ValidationError(`OpenAPI schema validation failed:\n${errors.join('\n')}`);
          }
        } catch (e) {
          if (e instanceof ValidationError) {
            throw e;
          }
          throw new ValidationError(
            `Failed to read OpenAPI schema from ${this.apiSchema._getFilePath()}: ${e instanceof Error ? e.message : String(e)}`,
          );
        }
      }
      // S3 schemas cannot be validated at synthesis time
    }

    // Bind the API schema
    this.apiSchema.bind(scope);
    // Grant permissions to gateway role if schema is in S3
    this.apiSchema.grantPermissionsToRole(gateway.role);

    return { bound: true };
  }

  /**
   * Renders the MCP-specific configuration
   */
  protected renderMcpConfiguration(): any {
    return {
      openApiSchema: this.apiSchema._render(),
    };
  }
}

/******************************************************************************
 *                     Smithy Target Configuration
 *****************************************************************************/

/**
 * Configuration for Smithy-based MCP targets
 *
 * This configuration exposes a Smithy-modeled API as MCP tools,
 * allowing the gateway to transform Smithy operations into tool calls.
 */
export class SmithyTargetConfiguration extends McpTargetConfiguration {
  /**
   * Create a Smithy target configuration
   *
   * @param smithyModel The Smithy model schema
   * @returns A new SmithyTargetConfiguration instance
   */
  public static create(smithyModel: ApiSchema): SmithyTargetConfiguration {
    return new SmithyTargetConfiguration(smithyModel);
  }

  public readonly targetType = McpTargetType.SMITHY_MODEL;

  /**
   * The Smithy model that defines the API
   */
  public readonly smithyModel: ApiSchema;

  constructor(smithyModel: ApiSchema) {
    super();
    this.smithyModel = smithyModel;
  }

  /**
   * Binds this configuration to a construct scope
   * Sets up necessary permissions for the gateway to access the Smithy model
   *
   * @param scope The construct scope
   * @param gateway The gateway that will use this target
   */
  public bind(scope: Construct, gateway: IGateway): TargetConfigurationConfig {
    // Bind the Smithy model
    this.smithyModel.bind(scope);
    // Grant permissions to gateway role if schema is in S3
    this.smithyModel.grantPermissionsToRole(gateway.role);

    return { bound: true };
  }

  /**
   * Renders the MCP-specific configuration
   */
  protected renderMcpConfiguration(): any {
    return {
      smithyModel: this.smithyModel._render(),
    };
  }
}

/******************************************************************************
 *                     MCP Server Target Configuration
 *****************************************************************************/

/**
 * Configuration for MCP Server-based targets
 *
 * MCP (Model Context Protocol) servers provide tools, data access, and custom
 * functions for AI agents. When you configure an MCP server as a gateway target,
 * the gateway automatically discovers and indexes available tools through
 * synchronization.
 */
export class McpServerTargetConfiguration extends McpTargetConfiguration {
  /**
   * Create an MCP server target configuration
   *
   * @param endpoint The HTTPS endpoint URL of the MCP server
   * @returns A new McpServerTargetConfiguration instance
   */
  public static create(endpoint: string): McpServerTargetConfiguration {
    return new McpServerTargetConfiguration(endpoint);
  }

  public readonly targetType = McpTargetType.MCP_SERVER;

  /**
   * The HTTPS endpoint URL of the MCP server
   */
  public readonly endpoint: string;

  constructor(endpoint: string) {
    super();
    this.endpoint = endpoint;
    this.validateEndpoint(endpoint);
  }

  /**
   * Binds this configuration to a construct scope
   * No additional permissions are needed for MCP server targets
   *
   * @param _scope The construct scope
   * @param _gateway The gateway that will use this target
   */
  public bind(_scope: Construct, _gateway: IGateway): TargetConfigurationConfig {
    // MCP server targets don't require additional permissions setup
    // Authentication is handled through credential provider configurations
    return { bound: true };
  }

  /**
   * Renders the MCP-specific configuration
   */
  protected renderMcpConfiguration(): any {
    return {
      mcpServer: {
        endpoint: this.endpoint,
      },
    };
  }

  /**
   * Validates the MCP server endpoint
   * - Must use HTTPS protocol
   * - Should be properly URL encoded
   *
   * @param endpoint The endpoint URL to validate
   * @throws ValidationError if the endpoint is invalid
   * @internal
   */
  private validateEndpoint(endpoint: string): void {
    if (Token.isUnresolved(endpoint)) {
      return;
    }

    const errors = validateFieldPattern(
      endpoint,
      'MCP server endpoint',
      /^https:\/\/.+/,
      'MCP server endpoint must use HTTPS protocol (e.g., https://my-server.example.com). Ensure the URL is properly encoded.',
    );

    if (errors.length > 0) {
      throw new ValidationError(errors.join('\n'));
    }

    // Additional helpful validation for common URL encoding issues
    if (endpoint.includes(' ') || endpoint.includes('<') || endpoint.includes('>')) {
      throw new ValidationError(
        'MCP server endpoint contains characters that should be URL-encoded. ' +
        'Please ensure the URL is properly encoded before passing to the construct.',
      );
    }
  }
}

/******************************************************************************
 *                     API Gateway Target Configuration
 *****************************************************************************/

/**
 * HTTP methods supported by API Gateway
 */
export enum ApiGatewayHttpMethod {
  /** GET method */
  GET = 'GET',
  /** POST method */
  POST = 'POST',
  /** PUT method */
  PUT = 'PUT',
  /** DELETE method */
  DELETE = 'DELETE',
  /** PATCH method */
  PATCH = 'PATCH',
  /** HEAD method */
  HEAD = 'HEAD',
  /** OPTIONS method */
  OPTIONS = 'OPTIONS',
}

/**
 * Configuration for filtering API Gateway tools
 *
 * Tool filters allow you to select REST API operations using path and method combinations.
 * Each filter supports two path matching strategies:
 * - **Explicit paths**: Matches a single specific path, such as `/pets/{petId}`
 * - **Wildcard paths**: Matches all paths starting with the specified prefix, such as `/pets/*`
 */
export interface ApiGatewayToolFilter {
  /**
   * The resource path to filter
   * Can be an explicit path (e.g., `/pets/{petId}`) or a wildcard path (e.g., `/pets/*`)
   * Must start with a forward slash
   */
  readonly filterPath: string;

  /**
   * List of HTTP methods to include for this path
   * Each filter specifies both a path and a list of HTTP methods
   * Multiple filters can overlap and duplicates are automatically de-duplicated
   */
  readonly methods: ApiGatewayHttpMethod[];
}

/**
 * Configuration for overriding API Gateway tool metadata
 *
 * Tool overrides allow you to customize the tool name or description for specific operations
 * after filtering. Each override must specify an explicit path and a single HTTP method.
 * The override must match an operation that exists in your API and must correspond to one
 * of the operations resolved by your filters.
 */
export interface ApiGatewayToolOverride {
  /**
   * The explicit resource path (no wildcards)
   * Must match an operation that exists in your API
   */
  readonly path: string;

  /**
   * The HTTP method for this override
   * Must be a single method (no wildcards)
   */
  readonly method: ApiGatewayHttpMethod;

  /**
   * The custom tool name
   * If not provided, the operationId from the OpenAPI definition will be used
   */
  readonly name: string;

  /**
   * Optional custom description for the tool
   * @default - No custom description
   */
  readonly description?: string;
}

/**
 * Configuration for passing metadata (headers and query parameters) to the API Gateway target
 */
export interface MetadataConfiguration {
  /**
   * List of query parameter names to pass through to the target
   *
   * Constraints:
   * - Array must contain 1-10 items
   * - Each parameter name must be 1-40 characters
   * - Cannot be an empty array
   *
   * @default - No query parameters are passed through
   */
  readonly allowedQueryParameters?: string[];

  /**
   * List of request header names to pass through to the target
   *
   * Constraints:
   * - Array must contain 1-10 items
   * - Each header name must be 1-100 characters
   * - Cannot be an empty array
   *
   * @default - No request headers are passed through
   */
  readonly allowedRequestHeaders?: string[];

  /**
   * List of response header names to pass through from the target
   *
   * Constraints:
   * - Array must contain 1-10 items
   * - Each header name must be 1-100 characters
   * - Cannot be an empty array
   *
   * @default - No response headers are passed through
   */
  readonly allowedResponseHeaders?: string[];
}

/**
 * Configuration for API Gateway tools
 *
 * The API Gateway tool configuration defines which operations from your REST API
 * are exposed as tools. It requires a list of tool filters to select operations
 * to expose, and optionally accepts tool overrides to customize tool metadata.
 */
export interface ApiGatewayToolConfiguration {
  /**
   * List of tool filters to select operations
   * At least one filter is required
   */
  readonly toolFilters: ApiGatewayToolFilter[];

  /**
   * Optional list of tool overrides to customize tool metadata
   * Each override must correspond to an operation selected by the filters
   * @default - No tool overrides
   */
  readonly toolOverrides?: ApiGatewayToolOverride[];
}

/**
 * Properties for creating an API Gateway target configuration
 */
export interface ApiGatewayTargetConfigurationProps {
  /**
   * The REST API to integrate with
   * Must be in the same account and region as the gateway
   */
  readonly restApi: IRestApi;

  /**
   * The stage name of the REST API
   * @default - Uses the deployment stage from the RestApi (restApi.deploymentStage.stageName)
   */
  readonly stage?: string;

  /**
   * Tool configuration defining which operations to expose
   */
  readonly apiGatewayToolConfiguration: ApiGatewayToolConfiguration;

  /**
   * Metadata configuration for passing headers and query parameters
   * Allows you to pass additional context through headers and query parameters
   * @default - No metadata configuration
   */
  readonly metadataConfiguration?: MetadataConfiguration;
}

/**
 * Configuration for API Gateway-based MCP targets
 *
 * This configuration connects your gateway to an Amazon API Gateway REST API stage.
 * The gateway translates incoming MCP requests into HTTP requests to your REST API
 * and handles response formatting.
 *
 * Key considerations:
 * - API must be in the same account and region as the gateway
 * - Only REST APIs are supported (no HTTP or WebSocket APIs)
 * - API must use a public endpoint type
 * - Methods with both AWS_IAM authorization and API key requirements are not supported
 * - Proxy resources (e.g., `/pets/{proxy+}`) are not supported
 */
export class ApiGatewayTargetConfiguration extends McpTargetConfiguration {
  /**
   * Create an API Gateway target configuration
   *
   * @param props The configuration properties
   * @returns A new ApiGatewayTargetConfiguration instance
   */
  public static create(props: ApiGatewayTargetConfigurationProps): ApiGatewayTargetConfiguration {
    return new ApiGatewayTargetConfiguration(props);
  }

  public readonly targetType = McpTargetType.API_GATEWAY;

  /**
   * The REST API reference
   */
  private readonly _restApi: IRestApi;

  /**
   * The ID of the REST API
   */
  public readonly restApiId: string;

  /**
   * The stage name of the REST API
   */
  public readonly stage: string;

  /**
   * Tool configuration for the API Gateway target
   */
  public readonly apiGatewayToolConfiguration: ApiGatewayToolConfiguration;

  /**
   * Metadata configuration for the API Gateway target
   */
  public readonly metadataConfiguration?: MetadataConfiguration;

  constructor(props: ApiGatewayTargetConfigurationProps) {
    super();
    this._restApi = props.restApi;
    this.restApiId = props.restApi.restApiId;
    this.stage = props.stage ?? props.restApi.deploymentStage.stageName;
    this.apiGatewayToolConfiguration = props.apiGatewayToolConfiguration;
    this.metadataConfiguration = props.metadataConfiguration;

    this.validateConfiguration();
  }

  /**
   * Binds this configuration to a construct scope
   * Sets up necessary permissions for the gateway to access the API Gateway
   *
   * @param _scope The construct scope
   * @param gateway The gateway that will use this target
   */
  public bind(_scope: Construct, gateway: IGateway): TargetConfigurationConfig {
    // Grant permission to invoke the API Gateway REST API
    // The gateway role needs this permission to make API calls to the REST API endpoints
    // For more info on granting permission: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-api-gateway.html#gateway-target-api-gateway-outbound

    gateway.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['execute-api:Invoke'],
        resources: [
          this._restApi.arnForExecuteApi('*', '/*', this.stage),
        ],
      }),
    );

    return { bound: true };
  }

  /**
   * Renders the MCP-specific configuration
   */
  protected renderMcpConfiguration(): any {
    return {
      apiGateway: {
        restApiId: this.restApiId,
        stage: this.stage,
        apiGatewayToolConfiguration: {
          toolFilters: this.apiGatewayToolConfiguration.toolFilters.map(filter => ({
            filterPath: filter.filterPath,
            methods: filter.methods,
          })),
          ...(this.apiGatewayToolConfiguration.toolOverrides && {
            toolOverrides: this.apiGatewayToolConfiguration.toolOverrides.map(override => ({
              path: override.path,
              method: override.method,
              name: override.name,
              ...(override.description && { description: override.description }),
            })),
          }),
        },
        ...(this.metadataConfiguration && {
          metadataConfiguration: {
            ...(this.metadataConfiguration.allowedQueryParameters && {
              allowedQueryParameters: this.metadataConfiguration.allowedQueryParameters,
            }),
            ...(this.metadataConfiguration.allowedRequestHeaders && {
              allowedRequestHeaders: this.metadataConfiguration.allowedRequestHeaders,
            }),
            ...(this.metadataConfiguration.allowedResponseHeaders && {
              allowedResponseHeaders: this.metadataConfiguration.allowedResponseHeaders,
            }),
          },
        }),
      },
    };
  }

  /**
   * Validates the configuration
   * @internal
   */
  private validateConfiguration(): void {
    // Validate REST API ID (skip if token)
    if (!Token.isUnresolved(this.restApiId)) {
      const restApiIdErrors = validateStringField({
        value: this.restApiId,
        fieldName: 'REST API ID',
        minLength: 1,
        maxLength: 256,
      });

      if (restApiIdErrors.length > 0) {
        throw new ValidationError(restApiIdErrors.join('\n'));
      }
    }

    // Validate stage name (skip if token)
    if (!Token.isUnresolved(this.stage)) {
      const stageErrors = validateStringField({
        value: this.stage,
        fieldName: 'Stage name',
        minLength: 1,
        maxLength: 128,
      });

      if (stageErrors.length > 0) {
        throw new ValidationError(stageErrors.join('\n'));
      }
    }

    // Validate tool filters
    if (!this.apiGatewayToolConfiguration.toolFilters || this.apiGatewayToolConfiguration.toolFilters.length === 0) {
      throw new ValidationError('At least one tool filter is required for API Gateway target configuration');
    }

    // Validate each tool filter
    for (const filter of this.apiGatewayToolConfiguration.toolFilters) {
      this.validateToolFilter(filter);
    }

    // Validate tool overrides if provided
    if (this.apiGatewayToolConfiguration.toolOverrides) {
      for (const override of this.apiGatewayToolConfiguration.toolOverrides) {
        this.validateToolOverride(override);
      }
    }

    // Validate metadata configuration if provided
    if (this.metadataConfiguration) {
      this.validateMetadataConfiguration(this.metadataConfiguration);
    }
  }

  /**
   * Validates metadata configuration
   * @internal
   */
  private validateMetadataConfiguration(config: MetadataConfiguration): void {
    // Validate allowedQueryParameters
    if (config.allowedQueryParameters !== undefined) {
      this.validateMetadataArray(
        config.allowedQueryParameters,
        'allowedQueryParameters',
        1,
        10,
        1,
        40,
      );
    }

    // Validate allowedRequestHeaders
    if (config.allowedRequestHeaders !== undefined) {
      this.validateMetadataArray(
        config.allowedRequestHeaders,
        'allowedRequestHeaders',
        1,
        10,
        1,
        100,
      );
    }

    // Validate allowedResponseHeaders
    if (config.allowedResponseHeaders !== undefined) {
      this.validateMetadataArray(
        config.allowedResponseHeaders,
        'allowedResponseHeaders',
        1,
        10,
        1,
        100,
      );
    }
  }

  /**
   * Validates a metadata configuration array (query parameters or headers)
   * @param array The array to validate
   * @param fieldName The name of the field for error messages
   * @param minItems Minimum number of items allowed in the array
   * @param maxItems Maximum number of items allowed in the array
   * @param minStringLength Minimum length for each string in the array
   * @param maxStringLength Maximum length for each string in the array
   * @internal
   */
  private validateMetadataArray(
    array: string[],
    fieldName: string,
    minItems: number,
    maxItems: number,
    minStringLength: number,
    maxStringLength: number,
  ): void {
    // Skip validation if the entire array is an unresolved token
    if (Token.isUnresolved(array)) {
      return;
    }

    // Check if array is empty
    if (array.length === 0) {
      throw new ValidationError(
        `${fieldName} cannot be an empty array. It must contain at least ${minItems} item(s)`,
      );
    }

    // Check array size constraints
    if (array.length < minItems) {
      throw new ValidationError(
        `${fieldName} must contain at least ${minItems} item(s). Found ${array.length} item(s)`,
      );
    }

    if (array.length > maxItems) {
      throw new ValidationError(
        `${fieldName} cannot exceed ${maxItems} items. Found ${array.length} items`,
      );
    }

    // Validate each string in the array
    array.forEach((item, index) => {
      if (Token.isUnresolved(item)) {
        return; // Skip validation for unresolved tokens
      }

      const errors = validateStringField({
        value: item,
        fieldName: `${fieldName}[${index}]`,
        minLength: minStringLength,
        maxLength: maxStringLength,
      });

      if (errors.length > 0) {
        throw new ValidationError(errors.join('\n'));
      }
    });
  }

  /**
   * Validates a tool filter
   * @internal
   */
  private validateToolFilter(filter: ApiGatewayToolFilter): void {
    if (Token.isUnresolved(filter.filterPath)) {
      return;
    }

    // Validate filter path
    const pathErrors = validateFieldPattern(
      filter.filterPath,
      'Filter path',
      /^\/[\w\-{}/*]*$/,
      'Filter path must start with a forward slash and contain only alphanumeric characters, hyphens, underscores, curly braces, forward slashes, and asterisks',
    );

    if (pathErrors.length > 0) {
      throw new ValidationError(pathErrors.join('\n'));
    }

    // Validate methods
    if (!filter.methods || filter.methods.length === 0) {
      throw new ValidationError(`At least one HTTP method is required for filter path: ${filter.filterPath}`);
    }
  }

  /**
   * Validates a tool override
   * @internal
   */
  private validateToolOverride(override: ApiGatewayToolOverride): void {
    if (Token.isUnresolved(override.path)) {
      return;
    }

    // Validate that override path is explicit (no wildcards)
    if (override.path.includes('*')) {
      throw new ValidationError(
        `Tool override path cannot contain wildcards. Path: ${override.path}. ` +
        'Tool overrides must specify an explicit path that matches an existing operation in your API.',
      );
    }

    // Validate override path format
    const pathErrors = validateFieldPattern(
      override.path,
      'Override path',
      /^\/[\w\-{}/]*$/,
      'Override path must start with a forward slash and contain only alphanumeric characters, hyphens, underscores, curly braces, and forward slashes',
    );

    if (pathErrors.length > 0) {
      throw new ValidationError(pathErrors.join('\n'));
    }

    // Validate override name
    if (Token.isUnresolved(override.name)) {
      return;
    }

    const nameErrors = validateStringField({
      value: override.name,
      fieldName: 'Override tool name',
      minLength: 1,
      maxLength: 64,
    });

    if (nameErrors.length > 0) {
      throw new ValidationError(nameErrors.join('\n'));
    }

    // Validate override description if provided
    if (override.description && !Token.isUnresolved(override.description)) {
      const descErrors = validateStringField({
        value: override.description,
        fieldName: 'Override description',
        minLength: 1,
        maxLength: 200,
      });

      if (descErrors.length > 0) {
        throw new ValidationError(descErrors.join('\n'));
      }
    }
  }
}
