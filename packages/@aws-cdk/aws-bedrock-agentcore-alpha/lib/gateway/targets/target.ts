import { Lazy, Token, Names } from 'aws-cdk-lib';
import type { IRestApi } from 'aws-cdk-lib/aws-apigateway';
import * as bedrockagentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { IFunction } from 'aws-cdk-lib/aws-lambda';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { IGateway } from '../gateway-base';
import { GATEWAY_SYNC_PERMS } from '../perms';
import type { ApiSchema } from './schema/api-schema';
import type { ToolSchema } from './schema/tool-schema';
import type { IGatewayTarget, IMcpGatewayTarget } from './target-base';
import { GatewayTargetBase, GatewayTargetProtocolType, McpTargetType } from './target-base';
import type { ApiGatewayToolConfiguration, ITargetConfiguration, MetadataConfiguration } from './target-configuration';
import { ApiGatewayTargetConfiguration, LambdaTargetConfiguration, McpServerTargetConfiguration, OpenApiTargetConfiguration, SmithyTargetConfiguration } from './target-configuration';
import type { ICredentialProviderConfig } from '../outbound-auth/credential-provider';
import { GatewayCredentialProvider } from '../outbound-auth/credential-provider';
import { validateStringField, validateFieldPattern, ValidationError } from '../validation-helpers';

/******************************************************************************
 *                                Props
 *****************************************************************************/

/**
 * Common properties for all Gateway Target types
 */
export interface GatewayTargetCommonProps {
  /**
   * The name of the gateway target
   * The name must be unique within the gateway
   * Pattern: ^([0-9a-zA-Z][-]?){1,100}$
   * @default - auto generate
   */
  readonly gatewayTargetName?: string;

  /**
   * Optional description for the gateway target
   * The description can have up to 200 characters
   * @default - No description
   */
  readonly description?: string;
}

/**
 * Properties for creating a Gateway Target resource
 */
export interface GatewayTargetProps extends GatewayTargetCommonProps {
  /**
   * The gateway this target belongs to
   */
  readonly gateway: IGateway;

  /**
   * The target configuration (Lambda, OpenAPI, or Smithy)
   * Use one of the configuration helper classes:
   * - LambdaTargetConfiguration.create()
   * - OpenApiTargetConfiguration.create()
   * - SmithyTargetConfiguration.create()
   */
  readonly targetConfiguration: ITargetConfiguration;

  /**
   * Credential providers for authentication
   * @default - [GatewayCredentialProvider.fromIamRole()]
   */
  readonly credentialProviderConfigurations?: ICredentialProviderConfig[];
}

/**
 * Properties for creating a Lambda-based Gateway Target
 * Convenience interface for the most common use case
 */
export interface GatewayTargetLambdaProps extends GatewayTargetCommonProps {
  /**
   * The gateway this target belongs to
   */
  readonly gateway: IGateway;

  /**
   * The Lambda function to associate with this target
   */
  readonly lambdaFunction: IFunction;

  /**
   * The tool schema defining the available tools
   */
  readonly toolSchema: ToolSchema;

  /**
   * Credential providers for authentication
   * Lambda targets only support IAM role authentication
   * @default - [GatewayCredentialProvider.fromIamRole()]
   */
  readonly credentialProviderConfigurations?: ICredentialProviderConfig[];
}

/**
 * Properties for creating an OpenAPI-based Gateway Target
 */
export interface GatewayTargetOpenApiProps extends GatewayTargetCommonProps {
  /**
   * The gateway this target belongs to
   */
  readonly gateway: IGateway;

  /**
   * The OpenAPI schema defining the API
   */
  readonly apiSchema: ApiSchema;

  /**
   * Whether to validate the OpenAPI schema (only applies to inline schemas)
   * Note: Validation is only performed for inline schemas during CDK synthesis.
   * S3 and asset-based schemas cannot be validated at synthesis time.
   * @default true
   */
  readonly validateOpenApiSchema?: boolean;

  /**
   * Credential providers for authentication
   * OpenAPI targets support API key and OAuth authentication (not IAM)
   * @default - If not provided, defaults to IAM role which will fail at runtime
   */
  readonly credentialProviderConfigurations?: ICredentialProviderConfig[];
}

/**
 * Properties for creating a Smithy-based Gateway Target
 */
export interface GatewayTargetSmithyProps extends GatewayTargetCommonProps {
  /**
   * The gateway this target belongs to
   */
  readonly gateway: IGateway;

  /**
   * The Smithy model defining the API
   */
  readonly smithyModel: ApiSchema;

  /**
   * Credential providers for authentication
   * Smithy targets only support IAM role authentication
   * @default - [GatewayCredentialProvider.fromIamRole()]
   */
  readonly credentialProviderConfigurations?: ICredentialProviderConfig[];
}

/**
 * Properties for creating an MCP Server-based Gateway Target
 */
export interface GatewayTargetMcpServerProps extends GatewayTargetCommonProps {
  /**
   * The gateway this target belongs to
   */
  readonly gateway: IGateway;

  /**
   * The HTTPS endpoint URL of the MCP server
   *
   * The endpoint must:
   * - Use HTTPS protocol
   * - Be properly URL-encoded
   * - Point to an MCP server that implements tool capabilities
   */
  readonly endpoint: string;

  /**
   * Credential providers for authentication
   */
  readonly credentialProviderConfigurations: ICredentialProviderConfig[];
}

/**
 * Properties for creating an API Gateway-based Gateway Target
 */
export interface GatewayTargetApiGatewayProps extends GatewayTargetCommonProps {
  /**
   * The gateway this target belongs to
   * [disable-awslint:prefer-ref-interface]
   */
  readonly gateway: IGateway;

  /**
   * The REST API to integrate with
   * Must be in the same account and region as the gateway
   * [disable-awslint:prefer-ref-interface]
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
   * Credential providers for authentication
   * API Gateway targets support IAM and API key authentication
   * @default - Empty array (service handles IAM automatically)
   */
  readonly credentialProviderConfigurations?: ICredentialProviderConfig[];

  /**
   * Metadata configuration for passing headers and query parameters
   * Allows you to pass additional context through headers and query parameters
   * @default - No metadata configuration
   */
  readonly metadataConfiguration?: MetadataConfiguration;
}

/**
 * Attributes for importing an existing Gateway Target
 */
export interface GatewayTargetAttributes {
  /**
   * The ARN of the gateway target
   */
  readonly targetArn: string;

  /**
   * The ID of the gateway target
   */
  readonly targetId: string;

  /**
   * The name of the gateway target
   */
  readonly gatewayTargetName: string;

  /**
   * The gateway this target belongs to
   */
  readonly gateway: IGateway;

  /**
   * Optional status of the target
   * @default - No status
   */
  readonly status?: string;

  /**
   * Optional creation timestamp
   * @default - No creation timestamp
   */
  readonly createdAt?: string;

  /**
   * Optional last update timestamp
   * @default - No update timestamp
   */
  readonly updatedAt?: string;
}

/******************************************************************************
 *                                Class
 *****************************************************************************/

/**
 *
 * Defines tools that your gateway will host. Supports multiple target types:
 * - Lambda: Wraps a Lambda function as MCP tools
 * - OpenAPI: Exposes an OpenAPI/REST API as MCP tools
 * - Smithy: Exposes a Smithy-modeled API as MCP tools
 *
 * @resource AWS::BedrockAgentCore::GatewayTarget
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building-adding-targets.html
 */
@propertyInjectable
export class GatewayTarget extends GatewayTargetBase implements IMcpGatewayTarget {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-agentcore-alpha.GatewayTarget';
  /**
   * Import an existing Gateway Target using its attributes
   * This allows you to reference a Gateway Target that was created outside of CDK
   *
   * @param scope The construct scope
   * @param id The construct id
   * @param attrs The attributes of the existing Gateway Target
   * @returns An IGatewayTarget instance representing the imported target
   */
  public static fromGatewayTargetAttributes(
    scope: Construct,
    id: string,
    attrs: GatewayTargetAttributes,
  ): IGatewayTarget {
    class ImportedGatewayTarget extends GatewayTargetBase {
      public readonly targetArn = attrs.targetArn;
      public readonly targetId = attrs.targetId;
      public readonly name = attrs.gatewayTargetName;
      public readonly description = attrs.status;
      public readonly gateway = attrs.gateway;
      public readonly credentialProviderConfigurations = [];
      public readonly targetProtocolType = GatewayTargetProtocolType.MCP;
      public readonly status = attrs.status;
      public readonly statusReasons = undefined;
      public readonly createdAt = attrs.createdAt;
      public readonly updatedAt = attrs.updatedAt;

      constructor(s: Construct, i: string) {
        super(s, i);
      }
    }
    return new ImportedGatewayTarget(scope, id);
  }

  /**
   * Create a Lambda-based MCP target
   * Convenience method for creating a target that wraps a Lambda function
   *
   * @param scope The construct scope
   * @param id The construct id
   * @param props The properties for the Lambda target
   * @returns A new GatewayTarget instance
   */
  public static forLambda(
    scope: Construct,
    id: string,
    props: GatewayTargetLambdaProps,
  ): GatewayTarget {
    return new GatewayTarget(scope, id, {
      gateway: props.gateway,
      gatewayTargetName: props.gatewayTargetName,
      description: props.description,
      credentialProviderConfigurations: props.credentialProviderConfigurations,
      targetConfiguration: LambdaTargetConfiguration.create(
        props.lambdaFunction,
        props.toolSchema,
      ),
    });
  }

  /**
   * Create an OpenAPI-based MCP target
   * Convenience method for creating a target that exposes an OpenAPI/REST API
   *
   * @param scope The construct scope
   * @param id The construct id
   * @param props The properties for the OpenAPI target
   * @returns A new GatewayTarget instance
   *
   */
  public static forOpenApi(
    scope: Construct,
    id: string,
    props: GatewayTargetOpenApiProps,
  ): GatewayTarget {
    return new GatewayTarget(scope, id, {
      gateway: props.gateway,
      gatewayTargetName: props.gatewayTargetName,
      description: props.description,
      credentialProviderConfigurations: props.credentialProviderConfigurations,
      targetConfiguration: OpenApiTargetConfiguration.create(props.apiSchema, props.validateOpenApiSchema),
    });
  }

  /**
   * Create a Smithy-based MCP target
   * Convenience method for creating a target that exposes a Smithy-modeled API
   *
   * @param scope The construct scope
   * @param id The construct id
   * @param props The properties for the Smithy target
   * @returns A new GatewayTarget instance
   */
  public static forSmithy(
    scope: Construct,
    id: string,
    props: GatewayTargetSmithyProps,
  ): GatewayTarget {
    return new GatewayTarget(scope, id, {
      gateway: props.gateway,
      gatewayTargetName: props.gatewayTargetName,
      description: props.description,
      credentialProviderConfigurations: props.credentialProviderConfigurations,
      targetConfiguration: SmithyTargetConfiguration.create(props.smithyModel),
    });
  }

  /**
   * Create an MCP Server-based target
   * Convenience method for creating a target that connects to an external MCP server
   *
   * @param scope The construct scope
   * @param id The construct id
   * @param props The properties for the MCP server target
   * @returns A new GatewayTarget instance
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html
   */
  public static forMcpServer(
    scope: Construct,
    id: string,
    props: GatewayTargetMcpServerProps,
  ): GatewayTarget {
    return new GatewayTarget(scope, id, {
      gateway: props.gateway,
      gatewayTargetName: props.gatewayTargetName,
      description: props.description,
      credentialProviderConfigurations: props.credentialProviderConfigurations,
      targetConfiguration: McpServerTargetConfiguration.create(props.endpoint),
    });
  }

  /**
   * Create an API Gateway-based target
   * Convenience method for creating a target that connects to an API Gateway REST API
   *
   * @param scope The construct scope
   * @param id The construct id
   * @param props The properties for the API Gateway target
   * @returns A new GatewayTarget instance
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-api-gateway.html
   */
  public static forApiGateway(
    scope: Construct,
    id: string,
    props: GatewayTargetApiGatewayProps,
  ): GatewayTarget {
    return new GatewayTarget(scope, id, {
      gateway: props.gateway,
      gatewayTargetName: props.gatewayTargetName,
      description: props.description,
      credentialProviderConfigurations: props.credentialProviderConfigurations,
      targetConfiguration: ApiGatewayTargetConfiguration.create({
        restApi: props.restApi,
        stage: props.stage,
        apiGatewayToolConfiguration: props.apiGatewayToolConfiguration,
        metadataConfiguration: props.metadataConfiguration,
      }),
    });
  }

  /**
   * The ARN of the gateway target
   * @attribute
   */
  public readonly targetArn;

  /**
   * The unique identifier of the gateway target
   * @attribute
   */
  public readonly targetId;

  /**
   * The name of the gateway target
   */
  public readonly name;

  /**
   * Optional description for the gateway target
   */
  public readonly description;

  /**
   * The gateway this target belongs to
   */
  public readonly gateway;

  /**
   * The credential providers for this target
   */
  public readonly credentialProviderConfigurations: ICredentialProviderConfig[] | undefined;

  /**
   * The protocol type (always MCP for now)
   */
  public readonly targetProtocolType = GatewayTargetProtocolType.MCP;

  /**
   * The specific MCP target type (Lambda, OpenAPI, Smithy, or MCP Server)
   */
  public readonly targetType: McpTargetType;

  /**
   * The status of the gateway target
   * @attribute
   */
  public readonly status?;

  /**
   * The status reasons for the gateway target
   * @attribute
   */
  public readonly statusReasons?: string[];

  /**
   * Timestamp when the gateway target was created
   * @attribute
   */
  public readonly createdAt?;

  /**
   * Timestamp when the gateway target was last updated
   * @attribute
   */
  public readonly updatedAt?;

  private readonly targetResource: bedrockagentcore.CfnGatewayTarget;
  private readonly targetConfiguration: ITargetConfiguration;

  constructor(scope: Construct, id: string, props: GatewayTargetProps) {
    super(scope, id, {
      // Maximum name length of 100 characters
      // @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-bedrockagentcore-gatewaytarget.html#cfn-bedrockagentcore-gatewaytarget-name
      physicalName: props.gatewayTargetName ??
        Lazy.string({
          produce: () => Names.uniqueResourceName(this, { maxLength: 100 }),
        }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Validate and assign properties
    this.name = this.physicalName;
    this.validateGatewayTargetName(this.name);

    this.description = props.description;
    if (this.description) {
      this.validateDescription(this.description);
    }

    this.gateway = props.gateway;
    this.targetConfiguration = props.targetConfiguration;
    this.targetType = this.targetConfiguration.targetType;

    // Get target-specific credential configurations
    this.credentialProviderConfigurations = this._getTargetSpecificCredentials(
      props.credentialProviderConfigurations,
    );

    // Bind the target configuration
    // This sets up permissions and dependencies
    this.targetConfiguration.bind(this, this.gateway);

    // Create the L1 construct
    const cfnProps: bedrockagentcore.CfnGatewayTargetProps = {
      gatewayIdentifier: this.gateway.gatewayId,
      name: this.name,
      description: this.description,
      credentialProviderConfigurations: Lazy.any({
        produce: () => this._renderCredentialProviderConfigurations(),
      }),

      targetConfiguration: Lazy.any({
        produce: () => this.targetConfiguration._render(),
      }),

      // Add metadata configuration for API Gateway targets
      metadataConfiguration: this.targetType === McpTargetType.API_GATEWAY &&
        (this.targetConfiguration as ApiGatewayTargetConfiguration).metadataConfiguration
        ? {
          allowedQueryParameters: (this.targetConfiguration as ApiGatewayTargetConfiguration).metadataConfiguration!.allowedQueryParameters,
          allowedRequestHeaders: (this.targetConfiguration as ApiGatewayTargetConfiguration).metadataConfiguration!.allowedRequestHeaders,
          allowedResponseHeaders: (this.targetConfiguration as ApiGatewayTargetConfiguration).metadataConfiguration!.allowedResponseHeaders,
        }
        : undefined,
    };

    this.targetResource = new bedrockagentcore.CfnGatewayTarget(
      this,
      'Resource',
      cfnProps,
    );

    if (this.credentialProviderConfigurations) {
      for (const provider of this.credentialProviderConfigurations) {
        provider
          .grantNeededPermissionsToRole(this.gateway.role)
          ?.applyBefore(this.targetResource);
      }
    }

    this.targetId = this.targetResource.attrTargetId;
    this.targetArn = this.targetResource.ref;
    this.status = this.targetResource.attrStatus;
    this.statusReasons = this.targetResource.attrStatusReasons;
    this.createdAt = this.targetResource.attrCreatedAt;
    this.updatedAt = this.targetResource.attrUpdatedAt;
  }

  /**
   * Grants permission to synchronize this gateway's targets
   *
   * This method grants the `SynchronizeGatewayTargets` permission, which is primarily
   * needed for MCP Server targets when you need to refresh the tool catalog after the
   * MCP server's tools have changed.
   *
   * [disable-awslint:no-grants]
   */
  @MethodMetadata()
  public grantSync(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: GATEWAY_SYNC_PERMS,
      resourceArns: [this.gateway.gatewayArn],
    });
  }

  /**
   * Determines the credential provider configurations based on target type
   *
   * - Lambda & Smithy: Default to IAM role if not provided
   * - MCP Server: Return undefined if not provided (service handles NoAuth)
   * - OpenAPI & API Gateway: Return as-is (must be explicitly provided, service handles automatically)
   *
   * @param providedCredentials The credentials from props
   * @returns The credential configurations to use, or undefined
   * @internal
   */
  private _getTargetSpecificCredentials(
    providedCredentials: ICredentialProviderConfig[] | undefined,
  ): ICredentialProviderConfig[] | undefined {
    if (providedCredentials && providedCredentials.length > 0) {
      return providedCredentials;
    }
    // Apply target-specific defaults when not provided
    switch (this.targetType) {
      case McpTargetType.LAMBDA:
      case McpTargetType.SMITHY_MODEL:
        return [GatewayCredentialProvider.fromIamRole()];

      case McpTargetType.MCP_SERVER:
        // Return empty array, - service handles NoAuth automatically
        return undefined;

      case McpTargetType.OPENAPI_SCHEMA:
      case McpTargetType.API_GATEWAY:
        // No default - must be explicitly provided, service handles automatically
        return undefined;

      default:
        return [GatewayCredentialProvider.fromIamRole()];
    }
  }

  /**
   * Renders credential provider configurations for CloudFormation
   * @internal
   */
  private _renderCredentialProviderConfigurations(): any {
    return this.credentialProviderConfigurations?.map(provider => provider._render());
  }

  /**
   * Validates the gateway target name format
   * Pattern: ^([0-9a-zA-Z][-]?){1,100}$
   * Max length: 100 characters
   * @param gatewayTargetName The gateway target name to validate
   * @throws Error if the name is invalid
   * @internal
   */
  private validateGatewayTargetName(gatewayTargetName: string): void {
    if (Token.isUnresolved(gatewayTargetName)) {
      return;
    }

    const lengthErrors = validateStringField({
      value: gatewayTargetName,
      fieldName: 'Gateway target name',
      minLength: 1,
      maxLength: 100,
    });

    const patternErrors = validateFieldPattern(
      gatewayTargetName,
      'Gateway target name',
      /^([0-9a-zA-Z][-]?){1,100}$/,
      'Gateway target name must contain only alphanumeric characters and hyphens, with hyphens only between characters',
    );

    const allErrors = [...lengthErrors, ...patternErrors];
    if (allErrors.length > 0) {
      throw new ValidationError(allErrors.join('\n'));
    }
  }

  /**
   * Validates the description format
   * Must be between 1 and 200 characters
   * @throws Error if validation fails
   * @internal
   */
  private validateDescription(description: string): void {
    if (Token.isUnresolved(description)) {
      return;
    }

    const errors = validateStringField({
      value: description,
      fieldName: 'Gateway target description',
      minLength: 1,
      maxLength: 200,
    });

    if (errors.length > 0) {
      throw new ValidationError(errors.join('\n'));
    }
  }
}
