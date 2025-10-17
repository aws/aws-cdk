import { Lazy, Token } from 'aws-cdk-lib';
import * as bedrockagentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
import { IGateway } from '../gateway-base';
import { ApiSchema } from './schema/api-schema';
import { ToolSchema } from './schema/tool-schema';
import { GatewayTargetBase, GatewayTargetProtocolType, IGatewayTarget, IMcpGatewayTarget, McpTargetType } from './target-base';
import { ITargetConfiguration, LambdaTargetConfiguration, OpenApiTargetConfiguration, SmithyTargetConfiguration } from './target-configuration';
import { GatewayCredentialProvider, ICredentialProvider } from '../outbound-auth/credential-provider';
import { validateStringField, validateFieldPattern, ValidationError } from '../validation-helpers';

/******************************************************************************
 *                                Props
 *****************************************************************************/

/**
 * Common properties for all Gateway Target types
 */
export interface McpGatewayTargetCommonProps {
  /**
   * The name of the gateway target
   * The name must be unique within the gateway
   * Pattern: ^([0-9a-zA-Z][-]?){1,100}$
   */
  readonly targetName: string;

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
export interface GatewayTargetProps extends McpGatewayTargetCommonProps {
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
   * @default - [GatewayCredentialProvider.iamRole()]
   */
  readonly credentialProviderConfigurations?: ICredentialProvider[];
}

/**
 * Properties for creating a Lambda-based Gateway Target
 * Convenience interface for the most common use case
 */
export interface GatewayTargetLambdaProps extends McpGatewayTargetCommonProps {
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
   * @default - [GatewayCredentialProvider.iamRole()]
   */
  readonly credentialProviderConfigurations?: ICredentialProvider[];
}

/**
 * Properties for creating an OpenAPI-based Gateway Target
 */
export interface GatewayTargetOpenApiProps extends McpGatewayTargetCommonProps {
  /**
   * The gateway this target belongs to
   */
  readonly gateway: IGateway;

  /**
   * The OpenAPI schema defining the API
   */
  readonly apiSchema: ApiSchema;

  /**
   * Credential providers for authentication
   * @default - [GatewayCredentialProvider.iamRole()]
   */
  readonly credentialProviderConfigurations?: ICredentialProvider[];
}

/**
 * Properties for creating a Smithy-based Gateway Target
 */
export interface GatewayTargetSmithyProps extends McpGatewayTargetCommonProps {
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
   * @default - [GatewayCredentialProvider.iamRole()]
   */
  readonly credentialProviderConfigurations?: ICredentialProvider[];
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
  readonly targetName: string;

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
      public readonly name = attrs.targetName;
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
      targetName: props.targetName,
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
      targetName: props.targetName,
      description: props.description,
      credentialProviderConfigurations: props.credentialProviderConfigurations,
      targetConfiguration: OpenApiTargetConfiguration.create(props.apiSchema),
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
      targetName: props.targetName,
      description: props.description,
      credentialProviderConfigurations: props.credentialProviderConfigurations,
      targetConfiguration: SmithyTargetConfiguration.create(props.smithyModel),
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
  public readonly credentialProviderConfigurations: ICredentialProvider[];

  /**
   * The protocol type (always MCP for now)
   */
  public readonly targetProtocolType = GatewayTargetProtocolType.MCP;

  /**
   * The specific MCP target type (Lambda, OpenAPI, or Smithy)
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
    super(scope, id);

    // Validate and assign properties
    this.name = props.targetName;
    this.validateGatewayTargetName(this.name);

    this.description = props.description;
    if (this.description) {
      this.validateDescription(this.description);
    }

    this.gateway = props.gateway;
    this.targetConfiguration = props.targetConfiguration;
    this.targetType = this.targetConfiguration.targetType;

    // Default credential providers to IAM role if not provided
    this.credentialProviderConfigurations = props.credentialProviderConfigurations ?? [
      GatewayCredentialProvider.iamRole(),
    ];

    // Bind the target configuration
    // This sets up permissions and dependencies
    this.targetConfiguration.bind(this, this.gateway);

    // Create the L1 construct using Lazy evaluation
    const cfnProps: bedrockagentcore.CfnGatewayTargetProps = {
      gatewayIdentifier: this.gateway.gatewayId,
      name: this.name,
      description: this.description,
      credentialProviderConfigurations: Lazy.any({
        produce: () => this.credentialProviderConfigurations.map(provider => provider._render()),
      }),

      targetConfiguration: Lazy.any({
        produce: () => this.targetConfiguration._render(),
      }),
    };

    this.targetResource = new bedrockagentcore.CfnGatewayTarget(
      this,
      'Resource',
      cfnProps,
    );

    // Grant credential provider permissions and apply them before resource creation
    // for (const provider of this.credentialProviderConfigurations) {
    //   provider
    //     .grantNeededPermissionsToRole(this.gateway.role)
    //     ?.applyBefore(this.targetResource);
    // }

    // Assign attributes from L1 construct
    this.targetId = this.targetResource.attrTargetId;
    this.targetArn = this.targetResource.ref;
    this.status = this.targetResource.attrStatus;
    this.statusReasons = this.targetResource.attrStatusReasons;
    this.createdAt = this.targetResource.attrCreatedAt;
    this.updatedAt = this.targetResource.attrUpdatedAt;
  }

  /**
   * Validates the gateway target name format
   * Pattern: ^([0-9a-zA-Z][-]?){1,100}$
   * Max length: 100 characters
   * @param targetName The gateway target name to validate
   * @throws Error if the name is invalid
   */
  protected validateGatewayTargetName(targetName: string): void {
    // Skip validation if the name contains CDK tokens (unresolved values)
    if (Token.isUnresolved(targetName)) {
      return;
    }

    // Validate length
    const lengthErrors = validateStringField({
      value: targetName,
      fieldName: 'Gateway target name',
      minLength: 1,
      maxLength: 100,
    });

    // Validate pattern
    const patternErrors = validateFieldPattern(
      targetName,
      'Gateway target name',
      /^([0-9a-zA-Z][-]?){1,100}$/,
      'Gateway target name must contain only alphanumeric characters and hyphens, with hyphens only between characters',
    );

    // Combine and throw if any errors
    const allErrors = [...lengthErrors, ...patternErrors];
    if (allErrors.length > 0) {
      throw new ValidationError(allErrors.join('\n'));
    }
  }

  /**
   * Validates the description format
   * Must be between 1 and 200 characters
   * @throws Error if validation fails
   */
  private validateDescription(description: string): void {
    // Skip validation if the description contains CDK tokens (unresolved values)
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
