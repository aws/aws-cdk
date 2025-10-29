import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as fs from 'fs';
import { IGateway } from '../gateway-base';
import { ApiSchema, AssetApiSchema } from './schema/api-schema';
import { ToolSchema } from './schema/tool-schema';
import { McpTargetType } from './target-base';
import { validateOpenApiSchema, ValidationError } from '../validation-helpers';

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
