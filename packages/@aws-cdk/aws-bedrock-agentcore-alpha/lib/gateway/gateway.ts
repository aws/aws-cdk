import { Stack, Token, Lazy, Names } from 'aws-cdk-lib';
import type { IRestApi } from 'aws-cdk-lib/aws-apigateway';
import * as bedrockagentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import type * as kms from 'aws-cdk-lib/aws-kms';
import type { IFunction } from 'aws-cdk-lib/aws-lambda';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
// Internal imports
import type { GatewayExceptionLevel, IGateway } from './gateway-base';
import { GatewayBase } from './gateway-base';
import type { IGatewayAuthorizerConfig } from './inbound-auth/authorizer';
import { GatewayAuthorizer } from './inbound-auth/authorizer';
import type { IInterceptor, InterceptorBindConfig } from './interceptor';
import { InterceptionPoint } from './interceptor';
import type { ICredentialProviderConfig } from './outbound-auth/credential-provider';
import { GATEWAY_ASSUME_ROLE, GATEWAY_KMS_KEY_PERMS } from './perms';
import type { IGatewayProtocolConfig } from './protocol';
import { McpGatewaySearchType, McpProtocolConfiguration, MCPProtocolVersion } from './protocol';
import type { ApiSchema } from './targets/schema/api-schema';
import type { ToolSchema } from './targets/schema/tool-schema';
import { GatewayTarget } from './targets/target';
import type { ApiGatewayToolConfiguration, MetadataConfiguration } from './targets/target-configuration';
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
   * @default - auto generate
   */
  readonly gatewayTargetName?: string;

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
  readonly credentialProviderConfigurations?: ICredentialProviderConfig[];
}

/**
 * Options for adding an OpenAPI target to a gateway
 */
export interface AddOpenApiTargetOptions {
  /**
   * The name of the gateway target
   * Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen)
   * @default - auto generate
   */
  readonly gatewayTargetName?: string;

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
  readonly credentialProviderConfigurations?: ICredentialProviderConfig[];
}

/**
 * Options for adding a Smithy target to a gateway
 */
export interface AddSmithyTargetOptions {
  /**
   * The name of the gateway target
   * Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen)
   * @default - auto generate
   */
  readonly gatewayTargetName?: string;

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
  readonly credentialProviderConfigurations?: ICredentialProviderConfig[];
}

/**
 * Options for adding an MCP Server target to a gateway
 */
export interface AddMcpServerTargetOptions {
  /**
   * The name of the gateway target
   * Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen)
   * @default - auto generate
   */
  readonly gatewayTargetName?: string;

  /**
   * Optional description for the gateway target
   * @default - No description
   */
  readonly description?: string;

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
   *
   * MCP servers require explicit authentication configuration.
   * OAuth2 is strongly recommended over NoAuth.
   */
  readonly credentialProviderConfigurations: ICredentialProviderConfig[];
}

/**
 * Options for adding an API Gateway target to a gateway
 */
export interface AddApiGatewayTargetOptions {
  /**
   * The name of the gateway target
   * Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen)
   * @default - auto generate
   */
  readonly gatewayTargetName?: string;

  /**
   * Optional description for the gateway target
   * @default - No description
   */
  readonly description?: string;

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
 * Properties for defining a Gateway
 */
export interface GatewayProps {
  /**
   * The name of the gateway
   * Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen)
   * The name must be unique within your account
   * @default - auto generate
   */
  readonly gatewayName?: string;

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
  readonly protocolConfiguration?: IGatewayProtocolConfig;

  /**
   * The authorizer configuration for the gateway
   * @default - A default authorizer will be created using Cognito
   */
  readonly authorizerConfiguration?: IGatewayAuthorizerConfig;

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

  /**
   * Interceptor configurations for the gateway
   *
   * Interceptors allow you to run custom code during each gateway invocation:
   * - REQUEST interceptors execute before the gateway calls the target
   * - RESPONSE interceptors execute after the target responds
   *
   * A gateway can have at most one REQUEST interceptor and one RESPONSE interceptor.
   *
   * @default - No interceptors
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors.html
   */
  readonly interceptorConfigurations?: IInterceptor[];
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
      public readonly protocolConfiguration: IGatewayProtocolConfig;
      public readonly authorizerConfiguration: IGatewayAuthorizerConfig;
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
        this.authorizerConfiguration = GatewayAuthorizer.usingAwsIam();
      }
    }
    return new ImportedGateway(scope, id);
  }

  /**
   * The ARN of the gateway
   * @attribute
   */
  public readonly gatewayArn: string;

  /**
   * The unique identifier of the gateway
   * @attribute
   */
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
  public readonly protocolConfiguration: IGatewayProtocolConfig;

  /**
   * The authorizer configuration for the gateway
   */
  public readonly authorizerConfiguration: IGatewayAuthorizerConfig;

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

  /**
   * The URL endpoint for the gateway
   * @attribute
   */
  public readonly gatewayUrl?: string;

  /**
   * The status of the gateway
   * @attribute
   */
  public readonly status?: string;

  /**
   * The status reasons for the gateway
   * @attribute
   */
  public readonly statusReason?: string[];

  /**
   * Timestamp when the gateway was created
   * @attribute
   */
  public readonly createdAt?: string;

  /**
   * Timestamp when the gateway was last updated
   * @attribute
   */
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

  /**
   * The REQUEST interceptor configuration
   * @internal
   */
  private requestInterceptorConfig?: InterceptorBindConfig;

  /**
   * The RESPONSE interceptor configuration
   * @internal
   */
  private responseInterceptorConfig?: InterceptorBindConfig;

  /**
   * The Cognito User Pool Domain created for the gateway (if using default Cognito authorizer)
   */
  public userPoolDomain?: cognito.IUserPoolDomain;

  /**
   * The Cognito Resource Server created for the gateway (if using default Cognito authorizer)
   */
  public resourceServer?: cognito.IUserPoolResourceServer;

  /**
   * The OAuth2 token endpoint URL for client credentials flow.
   * Only available when using the default Cognito authorizer.
   */
  public readonly tokenEndpointUrl?: string;

  /**
   * The OAuth2 scope strings for client credentials flow.
   * Only available when using the default Cognito authorizer.
   */
  public readonly oauthScopes?: string[];

  constructor(scope: Construct, id: string, props: GatewayProps = {}) {
    super(scope, id, {
      // Maximum name length of 48 characters is chosen instead of 100 characters that mentioned in documentation below,
      // due to failure in CF deployment when more than 48 characters used
      // @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-bedrockagentcore-gateway.html#cfn-bedrockagentcore-gateway-name
      physicalName: props.gatewayName ??
        Lazy.string({
          produce: () => Names.uniqueResourceName(this, { maxLength: 48 }),
        }),
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    // ------------------------------------------------------
    // Assignments
    // ------------------------------------------------------

    this.name = this.physicalName;
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
    if (props.authorizerConfiguration) {
      this.authorizerConfiguration = props.authorizerConfiguration;
    } else {
      const defaultCognitoAuth = this.createDefaultCognitoAuthorizerConfig();
      this.authorizerConfiguration = defaultCognitoAuth.authorizerConfig;
      this.tokenEndpointUrl = defaultCognitoAuth.tokenEndpointUrl;
      this.oauthScopes = defaultCognitoAuth.oauthScopes;
    }
    this.exceptionLevel = props.exceptionLevel;

    this.tags = props.tags ?? {};

    // Initialize interceptors from props
    if (props.interceptorConfigurations) {
      this.validateAndInitializeInterceptors(props.interceptorConfigurations);
    }

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    const _resource = new bedrockagentcore.CfnGateway(this, 'Resource', {
      authorizerConfiguration: this.authorizerConfiguration._render(),
      authorizerType: this.authorizerConfiguration.authorizerType,
      description: this.description,
      exceptionLevel: this.exceptionLevel,
      interceptorConfigurations: Lazy.any({
        produce: () => this.renderInterceptorConfigurations(),
      }),
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
  @MethodMetadata()
  public addLambdaTarget(
    id: string,
    props: AddLambdaTargetOptions,
  ): GatewayTarget {
    // Lambda invoke permissions are automatically granted in LambdaTargetConfiguration.bind()
    // Build target props, conditionally including credentials if array has items
    const targetProps: any = {
      gatewayTargetName: props.gatewayTargetName,
      description: props.description,
      gateway: this,
      lambdaFunction: props.lambdaFunction,
      toolSchema: props.toolSchema,
      ...(props.credentialProviderConfigurations && props.credentialProviderConfigurations.length > 0
        ? { credentialProviderConfigurations: props.credentialProviderConfigurations }
        : {}),
    };

    const target = GatewayTarget.forLambda(this, id, targetProps);

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
  @MethodMetadata()
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
  @MethodMetadata()
  public addSmithyTarget(
    id: string,
    props: AddSmithyTargetOptions,
  ): GatewayTarget {
    // Build target props, conditionally including credentials if array has items
    const targetProps: any = {
      gatewayTargetName: props.gatewayTargetName,
      description: props.description,
      gateway: this,
      smithyModel: props.smithyModel,
      ...(props.credentialProviderConfigurations && props.credentialProviderConfigurations.length > 0
        ? { credentialProviderConfigurations: props.credentialProviderConfigurations }
        : {}),
    };

    const target = GatewayTarget.forSmithy(this, id, targetProps);

    return target;
  }

  /**
   * Add an MCP server target to this gateway
   * This is a convenience method that creates a GatewayTarget associated with this gateway
   *
   * @param id The construct id for the target
   * @param props Properties for the MCP server target
   * @returns The created GatewayTarget
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html
   */
  @MethodMetadata()
  public addMcpServerTarget(
    id: string,
    props: AddMcpServerTargetOptions,
  ): GatewayTarget {
    // Build target props, conditionally including credentials if array has items
    const targetProps: any = {
      gatewayTargetName: props.gatewayTargetName,
      description: props.description,
      gateway: this,
      endpoint: props.endpoint,
      ...(props.credentialProviderConfigurations && props.credentialProviderConfigurations.length > 0
        ? { credentialProviderConfigurations: props.credentialProviderConfigurations }
        : {}),
    };

    const target = GatewayTarget.forMcpServer(this, id, targetProps);

    return target;
  }

  /**
   * Add an API Gateway target to this gateway
   * This is a convenience method that creates a GatewayTarget associated with this gateway
   *
   * @param id The construct id for the target
   * @param props Properties for the API Gateway target
   * @returns The created GatewayTarget
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-api-gateway.html
   */
  @MethodMetadata()
  public addApiGatewayTarget(
    id: string,
    props: AddApiGatewayTargetOptions,
  ): GatewayTarget {
    // API Gateway targets require explicit credential configuration or defaults to IAM
    // GetExport and execute-api:Invoke permissions are automatically granted in ApiGatewayTargetConfiguration.bind()
    const target = GatewayTarget.forApiGateway(this, id, {
      gatewayTargetName: props.gatewayTargetName,
      description: props.description,
      gateway: this,
      restApi: props.restApi,
      stage: props.stage,
      apiGatewayToolConfiguration: props.apiGatewayToolConfiguration,
      credentialProviderConfigurations: props.credentialProviderConfigurations,
      metadataConfiguration: props.metadataConfiguration,
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
   * @internal
   */
  private createGatewayRole(): iam.Role {
    const role = new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      description: `Service role for Bedrock AgentCore Gateway ${this.name}`,
    });

    const region = Stack.of(this).region;
    const account = Stack.of(this).account;
    const partition = Stack.of(this).partition;

    // This restricts role assumption to the specific gateway resource only in this account,
    // preventing other accounts from assuming this role.
    // See:https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-prerequisites-permissions.html#gateway-service-role-permissions
    role.assumeRolePolicy?.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com')],
        actions: GATEWAY_ASSUME_ROLE,
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
        actions: GATEWAY_KMS_KEY_PERMS,
        resources: [this.kmsKey.keyArn],
      }));
    }
    return role;
  }

  /**
   * Validates the gateway name format
   * Pattern: ^([0-9a-zA-Z][-]?){1,48}$
   * Max length: 48 characters
   * @param name The gateway name to validate
   * @throws Error if the name is invalid
   * @internal
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
      /^([0-9a-zA-Z][-]?){1,48}$/,
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
   * @internal
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
   * Provisions a Cognito User Pool and configures M2M (machine-to-machine) JWT authentication
   * using OAuth 2.0 client credentials grant flow
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-cognito.html
   * @internal
   */
  private createDefaultCognitoAuthorizerConfig(): {
    authorizerConfig: IGatewayAuthorizerConfig;
    tokenEndpointUrl: string;
    oauthScopes: string[];
  } {
    const userPool = new cognito.UserPool(this, 'UserPool', {
      signInCaseSensitive: false,
    });

    const resourceServer = userPool.addResourceServer('ResourceServer', {
      identifier: Names.uniqueResourceName(this, { maxLength: 256, separator: '-' }),
      scopes: [
        {
          scopeName: 'read',
          scopeDescription: 'Read access to gateway tools',
        },
        {
          scopeName: 'write',
          scopeDescription: 'Write access to gateway tools',
        },
      ],
    });

    const oauthScopes = [
      cognito.OAuthScope.resourceServer(resourceServer, {
        scopeName: 'read',
        scopeDescription: 'Read access to gateway tools',
      }),
      cognito.OAuthScope.resourceServer(resourceServer, {
        scopeName: 'write',
        scopeDescription: 'Write access to gateway tools',
      }),
    ];

    const userPoolClient = userPool.addClient('DefaultClient', {
      generateSecret: true,
      oAuth: {
        flows: {
          clientCredentials: true,
        },
        scopes: oauthScopes,
      },
    });

    // Create Cognito Domain for OAuth2 token endpoint
    // Use uniqueResourceName to generate a unique domain prefix toLowerCase() is required because the hash portion is uppercase
    const domainPrefix = Names.uniqueResourceName(this, {
      maxLength: 63, // Cognito domain prefix max length
      separator: '-',
    }).toLowerCase();

    const userPoolDomain = userPool.addDomain('Domain', {
      cognitoDomain: {
        domainPrefix: domainPrefix,
      },
    });

    this.userPool = userPool;
    this.userPoolClient = userPoolClient;
    this.userPoolDomain = userPoolDomain;
    this.resourceServer = resourceServer;

    return {
      authorizerConfig: GatewayAuthorizer.usingCognito({
        userPool: userPool,
        allowedClients: [userPoolClient],
      }),
      tokenEndpointUrl: `https://${userPoolDomain.domainName}.auth.${Stack.of(this).region}.amazoncognito.com/oauth2/token`,
      oauthScopes: oauthScopes.map(scope => scope.scopeName),
    };
  }

  /**
   * Creates a default MCP protocol configuration for the gateway
   * Provides sensible defaults for MCP protocol settings
   * @internal
   */
  private createDefaultMcpProtocolConfiguration(): IGatewayProtocolConfig {
    return new McpProtocolConfiguration({
      supportedVersions: [MCPProtocolVersion.MCP_2025_03_26],
      searchType: McpGatewaySearchType.SEMANTIC,
      instructions: 'Default gateway to connect to external MCP tools',
    });
  }

  /**
   * Add an interceptor to this gateway
   *
   * Interceptors allow you to run custom code at specific points in the gateway request/response flow:
   * - REQUEST interceptors execute before the gateway calls the target
   * - RESPONSE interceptors execute after the target responds
   *
   * A gateway can have at most one REQUEST interceptor and one RESPONSE interceptor.
   * @param interceptor The interceptor to add (use LambdaInterceptor factory methods)
   * @throws Error if an interceptor of the same type already exists
   */
  @MethodMetadata()
  public addInterceptor(interceptor: IInterceptor): void {
    const interceptionPoint = interceptor.interceptionPoint;

    if (interceptionPoint === InterceptionPoint.REQUEST) {
      if (this.requestInterceptorConfig) {
        throw new ValidationError(
          'Gateway already has a REQUEST interceptor configured. A gateway can have at most one REQUEST interceptor.',
        );
      }
      this.requestInterceptorConfig = interceptor.bind(this, this);
    } else if (interceptionPoint === InterceptionPoint.RESPONSE) {
      if (this.responseInterceptorConfig) {
        throw new ValidationError(
          'Gateway already has a RESPONSE interceptor configured. A gateway can have at most one RESPONSE interceptor.',
        );
      }
      this.responseInterceptorConfig = interceptor.bind(this, this);
    }
  }

  /**
   * Validates and initializes interceptors from the provided configurations
   * @internal
   */
  private validateAndInitializeInterceptors(interceptors: IInterceptor[]): void {
    const requestCount = interceptors.filter(i => i.interceptionPoint === InterceptionPoint.REQUEST).length;
    const responseCount = interceptors.filter(i => i.interceptionPoint === InterceptionPoint.RESPONSE).length;

    if (requestCount > 1) {
      throw new ValidationError(
        `Gateway can have at most one REQUEST interceptor. Found ${requestCount} REQUEST interceptors.`,
      );
    }

    if (responseCount > 1) {
      throw new ValidationError(
        `Gateway can have at most one RESPONSE interceptor. Found ${responseCount} RESPONSE interceptors.`,
      );
    }

    for (const interceptor of interceptors) {
      this.addInterceptor(interceptor);
    }
  }

  /**
   * Renders the interceptor configurations for CloudFormation
   * Returns undefined if no interceptors are configured
   * @internal
   */
  private renderInterceptorConfigurations(): any[] | undefined {
    const configs: any[] = [];

    if (this.requestInterceptorConfig) {
      configs.push(this.requestInterceptorConfig.configuration);
    }

    if (this.responseInterceptorConfig) {
      configs.push(this.responseInterceptorConfig.configuration);
    }

    return configs.length > 0 ? configs : undefined;
  }
}
