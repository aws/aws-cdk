import { Aws, Stack, Token } from 'aws-cdk-lib';
import * as bedrockagentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
// Internal imports
import { GatewayBase, GatewayExceptionLevel, IGateway } from './gateway-base';
import { GatewayAuthorizer, IGatewayAuthorizer } from './inbound-auth/authorizer';
import { ICredentialProvider } from './outbound-auth/credential-provider';
import { GatewayPerms } from './perms';
import { IGatewayProtocol, McpGatewaySearchType, McpProtocolConfiguration, MCPProtocolVersion } from './protocol';
import { ApiSchema } from './targets/schema/api-schema';
import { ToolSchema } from './targets/schema/tool-schema';
import { GatewayTarget } from './targets/target';
import { validateStringField, validateFieldPattern, ValidationError } from './validation-helpers';

/******************************************************************************
 *                                Props
 *****************************************************************************/

/**
 * Options for adding a Lambda target to a gateway
 */
export interface AddLambdaTargetOptions {
  /**
   * The name of the gateway target
   * Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen)
   */
  readonly gatewayTargetName: string;

  /**
   * Optional description for the gateway target
   * @default - No description
   */
  readonly description?: string;

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
 * Options for adding an OpenAPI target to a gateway
 */
export interface AddOpenApiTargetOptions {
  /**
   * The name of the gateway target
   * Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen)
   */
  readonly gatewayTargetName: string;

  /**
   * Optional description for the gateway target
   * @default - No description
   */
  readonly description?: string;

  /**
   * The OpenAPI schema defining the API
   */
  readonly apiSchema: ApiSchema;

  /**
   * Whether to validate the OpenAPI schema or not
   * Note: Validation is only performed for inline and asset-based schema and  during CDK synthesis.
   * S3 schemas cannot be validated at synthesis time.
   * @default true
   */
  readonly validateOpenApiSchema?: boolean;

  /**
   * Credential providers for authentication
   * @default - [GatewayCredentialProvider.iamRole()]
   */
  readonly credentialProviderConfigurations?: ICredentialProvider[];
}

/**
 * Options for adding a Smithy target to a gateway
 */
export interface AddSmithyTargetOptions {
  /**
   * The name of the gateway target
   * Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen)
   */
  readonly gatewayTargetName: string;

  /**
   * Optional description for the gateway target
   * @default - No description
   */
  readonly description?: string;

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
 * Properties for defining a Gateway
 */
export interface GatewayProps {
  /**
   * The name of the gateway
   * Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen)
   * The name must be unique within your account
   */
  readonly gatewayName: string;

  /**
   * Optional description for the gateway
   * Valid characters are a-z, A-Z, 0-9, _ (underscore), - (hyphen) and spaces
   * The description can have up to 200 characters
   * @default - No description
   */
  readonly description?: string;

  /**
   * The protocol configuration for the gateway
   * @default - A default protocol configuration will be created using MCP with following params
   *  supportedVersions: [MCPProtocolVersion.MCP_2025_03_26],
   *  searchType: McpGatewaySearchType.SEMANTIC,
   *  instructions: "Default gateway to connect to external MCP tools",
   */
  readonly protocolConfiguration?: IGatewayProtocol;

  /**
   * The authorizer configuration for the gateway
   * @default - A default authorizer will be created using Cognito
   */
  readonly authorizerConfiguration?: IGatewayAuthorizer;

  /**
   * The verbosity of exception messages
   * Use DEBUG mode to see granular exception messages from a Gateway
   * @default - Exception messages are sanitized for presentation to end users
   */
  readonly exceptionLevel?: GatewayExceptionLevel;

  /**
   * The AWS KMS key used to encrypt data associated with the gateway
   * @default - No encryption
   */
  readonly kmsKey?: kms.IKey;

  /**
   * The IAM role that provides permissions for the gateway to access AWS services
   * @default - A new role will be created
   */
  readonly role?: iam.IRole;

  /**
   * Tags for the gateway
   * A list of key:value pairs of tags to apply to this Gateway resource
   * @default - No tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Attributes for importing an existing Gateway
 */
export interface GatewayAttributes {
  /**
   * The ARN of the gateway
   */
  readonly gatewayArn: string;

  /**
   * The ID of the gateway
   */
  readonly gatewayId: string;

  /**
   * The name of the gateway
   */
  readonly gatewayName: string;

  /**
   * The IAM role that provides permissions for the gateway
   */
  readonly role: iam.IRole;
}

/******************************************************************************
 *                                Class
 *****************************************************************************/
/**
 * Gateway resource for AWS Bedrock Agent Core.
 * Serves as an integration point between your agent and external services.
 *
 * @resource AWS::BedrockAgentCore::Gateway
 * @see https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGateway.html
 */
@propertyInjectable
export class Gateway extends GatewayBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-agentcore-alpha.Gateway';
  /**
   * Import an existing Gateway using its attributes
   *
   * @param scope The construct scope
   * @param id The construct id
   * @param attrs The attributes of the existing Gateway
   * @returns An IGateway instance representing the imported gateway
   */
  public static fromGatewayAttributes(
    scope: Construct,
    id: string,
    attrs: GatewayAttributes,
  ): IGateway {
    class ImportedGateway extends GatewayBase {
      public readonly gatewayArn = attrs.gatewayArn;
      public readonly gatewayId = attrs.gatewayId;
      public readonly name = attrs.gatewayName;
      public readonly description = undefined;
      public readonly protocolConfiguration: IGatewayProtocol;
      public readonly authorizerConfiguration: IGatewayAuthorizer;
      public readonly exceptionLevel = undefined;
      public readonly kmsKey = undefined;
      public readonly role = attrs.role;
      public readonly gatewayUrl = undefined;
      public readonly status = undefined;
      public readonly statusReason = undefined;
      public readonly createdAt = undefined;
      public readonly updatedAt = undefined;

      constructor(s: Construct, i: string) {
        super(s, i);
        // Create placeholder protocol and authorizer configurations
        this.protocolConfiguration = new McpProtocolConfiguration({
          supportedVersions: [MCPProtocolVersion.MCP_2025_03_26],
          searchType: McpGatewaySearchType.SEMANTIC,
          instructions: 'Imported gateway',
        });
        this.authorizerConfiguration = GatewayAuthorizer.awsIam;
      }
    }
    return new ImportedGateway(scope, id);
  }

  /**
   * Import an existing Gateway using its ARN
   *
   * @param scope The construct scope
   * @param id The construct id
   * @param gatewayArn The ARN of the existing Gateway
   * @returns An IGateway instance representing the imported gateway
   */
  public static fromGatewayArn(
    scope: Construct,
    id: string,
    gatewayArn: string,
  ): IGateway {
    // Parse the ARN to extract gateway ID and name
    // ARN format: arn:aws:bedrock-agentcore:region:account:gateway/gateway-id
    const arnParts = gatewayArn.split(':');
    const resourceParts = arnParts[arnParts.length - 1].split('/');
    const gatewayId = resourceParts[1] || 'unknown';

    // Create a minimal role for the imported gateway
    const role = iam.Role.fromRoleArn(scope, `${id}Role`,
      `arn:${Aws.PARTITION}:iam::${arnParts[4]}:role/service-role/AmazonBedrockAgentCoreGatewayServiceRole`);

    return this.fromGatewayAttributes(scope, id, {
      gatewayArn,
      gatewayId,
      gatewayName: gatewayId, // Use ID as name for imported resources
      role,
    });
  }

  /** @attribute */
  public readonly gatewayArn: string;

  /** @attribute */
  public readonly gatewayId: string;

  /**
   * The name of the gateway
   */
  public readonly name: string;

  /**
   * The description of the gateway
   */
  public readonly description?: string;

  /**
   * The protocol configuration for the gateway
   */
  public readonly protocolConfiguration: IGatewayProtocol;

  /**
   * The authorizer configuration for the gateway
   */
  public readonly authorizerConfiguration: IGatewayAuthorizer;

  /**
   * The exception level for the gateway
   */
  public readonly exceptionLevel?: GatewayExceptionLevel;

  /**
   * The KMS key used for encryption
   */
  public readonly kmsKey?: kms.IKey;

  /**
   * The IAM role for the gateway
   */
  public readonly role: iam.IRole;

  /** @attribute */
  public readonly gatewayUrl?: string;

  /** @attribute */
  public readonly status?: string;

  /** @attribute */
  public readonly statusReason?: string[];

  /** @attribute */
  public readonly createdAt?: string;

  /** @attribute */
  public readonly updatedAt?: string;

  /**
   * Tags applied to the gateway
   */
  public readonly tags?: { [key: string]: string };

  /**
   * The Cognito User Pool created for the gateway (if using default Cognito authorizer)
   */
  public userPool?: cognito.IUserPool;

  /**
   * The Cognito User Pool Client created for the gateway (if using default Cognito authorizer)
   */
  public userPoolClient?: cognito.IUserPoolClient;

  constructor(scope: Construct, id: string, props: GatewayProps) {
    super(scope, id);
    // ------------------------------------------------------
    // Assignments
    // ------------------------------------------------------

    this.name = props.gatewayName;
    this.validateGatewayName(this.name);

    this.description = props.description;
    if (this.description) {
      this.validateDescription(this.description);
    }

    this.kmsKey = props.kmsKey;
    this.role = props.role ?? this.createGatewayRole();

    if (this.kmsKey && this.role) {
      this.kmsKey.grantEncryptDecrypt(this.role);
    }

    this.protocolConfiguration = props.protocolConfiguration ?? this.createDefaultMcpProtocolConfiguration();
    this.authorizerConfiguration = props.authorizerConfiguration ?? this.createDefaultCognitoAuthorizer();
    this.exceptionLevel = props.exceptionLevel;

    this.tags = props.tags ?? {};

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    const _resource = new bedrockagentcore.CfnGateway(this, 'Resource', {
      authorizerConfiguration: this.authorizerConfiguration._render(),
      authorizerType: this.authorizerConfiguration.authorizerType,
      description: this.description,
      exceptionLevel: this.exceptionLevel,
      kmsKeyArn: this.kmsKey?.keyArn,
      name: this.name,
      protocolConfiguration: this.protocolConfiguration._render(),
      protocolType: this.protocolConfiguration.protocolType,
      roleArn: this.role?.roleArn,
      tags: this.tags,
    });

    this.gatewayId = _resource.attrGatewayIdentifier;
    this.gatewayArn = _resource.attrGatewayArn;
    this.gatewayUrl = _resource.attrGatewayUrl;
    this.status = _resource.attrStatus;
    this.createdAt = _resource.attrCreatedAt;
    this.updatedAt = _resource.attrUpdatedAt;
    this.statusReason = _resource.attrStatusReasons;
  }

  /**
   * Add a Lambda target to this gateway
   * This is a convenience method that creates a GatewayTarget associated with this gateway
   *
   * @param id The construct id for the target
   * @param props Properties for the Lambda target
   * @returns The created GatewayTarget
   */
  public addLambdaTarget(
    id: string,
    props: AddLambdaTargetOptions,
  ): GatewayTarget {
    // Lambda invoke permissions are automatically granted in LambdaTargetConfiguration.bind()
    const target = GatewayTarget.forLambda(this, id, {
      gatewayTargetName: props.gatewayTargetName,
      description: props.description,
      gateway: this,
      lambdaFunction: props.lambdaFunction,
      toolSchema: props.toolSchema,
      credentialProviderConfigurations: props.credentialProviderConfigurations,
    });

    return target;
  }

  /**
   * Add an OpenAPI target to this gateway
   * This is a convenience method that creates a GatewayTarget associated with this gateway
   *
   * @param id The construct id for the target
   * @param props Properties for the OpenAPI target
   * @returns The created GatewayTarget
   */
  public addOpenApiTarget(
    id: string,
    props: AddOpenApiTargetOptions,
  ): GatewayTarget {
    const target = GatewayTarget.forOpenApi(this, id, {
      gatewayTargetName: props.gatewayTargetName,
      description: props.description,
      gateway: this,
      apiSchema: props.apiSchema,
      validateOpenApiSchema: props.validateOpenApiSchema,
      credentialProviderConfigurations: props.credentialProviderConfigurations,
    });

    return target;
  }

  /**
   * Add a Smithy target to this gateway
   * This is a convenience method that creates a GatewayTarget associated with this gateway
   *
   * @param id The construct id for the target
   * @param props Properties for the Smithy target
   * @returns The created GatewayTarget
   */
  public addSmithyTarget(
    id: string,
    props: AddSmithyTargetOptions,
  ): GatewayTarget {
    const target = GatewayTarget.forSmithy(this, id, {
      gatewayTargetName: props.gatewayTargetName,
      description: props.description,
      gateway: this,
      smithyModel: props.smithyModel,
      credentialProviderConfigurations: props.credentialProviderConfigurations,
    });

    return target;
  }

  /**
   * Creates the service role for the gateway to assume
   *
   * The service role starts with minimal permissions. Additional permissions
   * are added automatically when targets are configured:
   * - KMS encryption: Automatically grants encrypt/decrypt permissions
   *
   * For other target types, manually grant permissions using standard CDK grant methods:
   */
  private createGatewayRole(): iam.Role {
    const role = new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      description: `Service role for Bedrock AgentCore Gateway ${this.name}`,
    });

    const region = Stack.of(this).region;
    const account = Stack.of(this).account;
    const partition = Stack.of(this).partition;

    role.assumeRolePolicy?.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com')],
        actions: GatewayPerms.ASSUME_ROLE,
        conditions: {
          StringEquals: {
            'aws:SourceAccount': account,
          },
          ArnLike: {
            'aws:SourceArn': `arn:${partition}:bedrock-agentcore:${region}:${account}:gateway/${this.name}*`,
          },
        },
      }),
    );

    if (this.kmsKey) {
      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: GatewayPerms.KMS_KEY_PERMS,
        resources: [this.kmsKey.keyArn],
      }));
    }
    return role;
  }

  /**
   * Validates the gateway name format
   * Pattern: ^([0-9a-zA-Z][-]?){1,100}$
   * Max length: 48 characters
   * @param name The gateway name to validate
   * @throws Error if the name is invalid
   */
  private validateGatewayName(name: string): void {
    if (Token.isUnresolved(name)) {
      return;
    }

    const lengthErrors = validateStringField({
      value: name,
      minLength: 1,
      maxLength: 48,
      fieldName: 'Gateway name',
    });

    if (lengthErrors.length > 0) {
      throw new ValidationError(lengthErrors.join('\n'));
    }

    const patternErrors = validateFieldPattern(
      name,
      'Gateway name',
      /^([0-9a-zA-Z][-]?){1,100}$/,
      'Gateway name must contain only alphanumeric characters and hyphens, with hyphens only between characters',
    );

    if (patternErrors.length > 0) {
      throw new ValidationError(patternErrors.join('\n'));
    }
  }

  /**
   * Validates the description format
   * Max length: 200 characters
   * @param description The description to validate
   * @throws Error if validation fails
   */
  private validateDescription(description: string): void {
    if (Token.isUnresolved(description)) {
      return;
    }

    const errors = validateStringField({
      value: description,
      minLength: 1,
      maxLength: 200,
      fieldName: 'Description',
    });

    if (errors.length > 0) {
      throw new ValidationError(errors.join('\n'));
    }
  }

  /**
   * Creates a default Cognito authorizer for the gateway
   * Provisions a Cognito User Pool and configures JWT authentication
   */
  private createDefaultCognitoAuthorizer(): IGatewayAuthorizer {
    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: `${this.name}-gw-userpool`,
      signInCaseSensitive: false,
    });
    const userPoolClient = userPool.addClient('DefaultClient', {
      userPoolClientName: `${this.name}-gw-client`,
    });
    this.userPool = userPool;
    this.userPoolClient = userPoolClient;
    return GatewayAuthorizer.usingCognito({
      userPool: userPool,
      allowedClients: [userPoolClient],
    });
  }

  /**
   * Creates a default MCP protocol configuration for the gateway
   * Provides sensible defaults for MCP protocol settings
   */
  private createDefaultMcpProtocolConfiguration(): IGatewayProtocol {
    return new McpProtocolConfiguration({
      supportedVersions: [MCPProtocolVersion.MCP_2025_03_26],
      searchType: McpGatewaySearchType.SEMANTIC,
      instructions: 'Default gateway to connect to external MCP tools',
    });
  }
}
