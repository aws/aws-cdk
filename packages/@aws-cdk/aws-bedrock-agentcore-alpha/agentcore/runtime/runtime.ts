/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { Duration, Stack, Annotations, Token, Arn, ArnFormat, Lazy } from 'aws-cdk-lib';
import * as bedrockagentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
import { RuntimePerms } from './perms';
import { AgentRuntimeArtifact } from './runtime-artifact';
import { RuntimeBase, IBedrockAgentRuntime, AgentRuntimeAttributes } from './runtime-base';
import { RuntimeEndpoint } from './runtime-endpoint';
import {
  NetworkConfiguration,
  NetworkMode,
  ProtocolType,
  AuthorizerConfigurationRuntime,
  AuthenticationMode,
} from './types';
import { validateStringField, validateFieldPattern, ValidationError } from './validation-helpers';

/******************************************************************************
 *                                Props
 *****************************************************************************/

/**
 * Properties for creating a Bedrock Agent Core Runtime resource
 */
export interface RuntimeProps {
  /**
   * The name of the agent runtime
   * Valid characters are a-z, A-Z, 0-9, _ (underscore)
   * Must start with a letter and can be up to 48 characters long
   * Pattern: ^[a-zA-Z][a-zA-Z0-9_]{0,47}$
   */
  readonly agentRuntimeName: string;

  /**
   * The artifact configuration for the agent runtime
   * Contains the container configuration with ECR URI
   */
  readonly agentRuntimeArtifact: AgentRuntimeArtifact;

  /**
   * The IAM role that provides permissions for the agent runtime
   * If not provided, a role will be created automatically
   * @default - A new role will be created
   */
  readonly executionRole?: iam.IRole;

  /**
   * Network configuration for the agent runtime
   * @default - { networkMode: NetworkMode.PUBLIC }
   */
  readonly networkConfiguration?: NetworkConfiguration;

  /**
   * Optional description for the agent runtime
   * @default - No description
   */
  readonly description?: string;

  /**
   * Protocol configuration for the agent runtime
   * @default - ProtocolType.HTTP
   */
  readonly protocolConfiguration?: ProtocolType;

  /**
   * Environment variables for the agent runtime
   * - Maximum 50 environment variables
   * - Key: Must be 1-100 characters, start with letter or underscore, contain only letters, numbers, and underscores
   * - Value: Must be 0-2048 characters (per CloudFormation specification)
   * @default - No environment variables
   */
  readonly environmentVariables?: { [key: string]: string };

  /**
   * Authorizer configuration for the agent runtime
   * Supports IAM, Cognito, JWT, and OAuth authentication modes
   * @default - IAM authentication
   */
  readonly authorizerConfiguration?: AuthorizerConfigurationRuntime;

  /**
   * Tags for the agent runtime
   * A list of key:value pairs of tags to apply to this Runtime resource
   * @default {} - no tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Options for adding an endpoint to the runtime
 */
export interface AddEndpointOptions {
  /**
   * Description for the endpoint
   * @default - No description
   */
  readonly description?: string;
  /**
   * Override the runtime version for this endpoint
   * @default - Uses the runtime's version
   */
  readonly version?: string;
}

/**
 * Network configuration update options
 */
export interface NetworkConfigurationUpdate {
  readonly securityGroups?: ec2.ISecurityGroup[];
  readonly subnets?: ec2.SubnetSelection;
}

/******************************************************************************
 *                                Class
 *****************************************************************************/

/**
 * Bedrock Agent Core Runtime
 * Enables running containerized agents with specific network configurations,
 * security settings, and runtime artifacts.
 *
 * @resource AWS::BedrockAgentCore::Runtime
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime.html
 */
@propertyInjectable
export class Runtime extends RuntimeBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-agentcore-alpha.Runtime';

  /**
   * Import an existing Agent Runtime using attributes
   * This allows you to reference an Agent Runtime that was created outside of CDK
   *
   * @param scope The construct scope
   * @param id The construct id
   * @param attrs The attributes of the existing Agent Runtime
   * @returns An IBedrockAgentRuntime instance representing the imported runtime
   */
  public static fromAgentRuntimeAttributes(
    scope: Construct,
    id: string,
    attrs: AgentRuntimeAttributes,
  ): IBedrockAgentRuntime {
    class ImportedBedrockAgentRuntime extends RuntimeBase {
      public readonly agentRuntimeArn = attrs.agentRuntimeArn;
      public readonly agentRuntimeId = attrs.agentRuntimeId;
      public readonly agentRuntimeName = attrs.agentRuntimeName;
      public readonly role = attrs.role;
      public readonly agentRuntimeVersion = attrs.agentRuntimeVersion;
      public readonly agentStatus: string | undefined = undefined;
      public readonly description = attrs.description;
      public readonly createdAt: string | undefined = undefined;
      public readonly lastUpdatedAt: string | undefined = undefined;
      public readonly grantPrincipal: iam.IPrincipal = attrs.role;
    }

    return new ImportedBedrockAgentRuntime(scope, id);
  }

  public readonly agentRuntimeArn: string;
  public readonly agentRuntimeId: string;
  public readonly agentRuntimeName: string;
  public readonly role: iam.IRole;
  public readonly agentRuntimeVersion?: string;
  public readonly agentStatus?: string;
  public readonly description?: string;
  public readonly createdAt?: string;
  public readonly lastUpdatedAt?: string;
  public readonly grantPrincipal: iam.IPrincipal;
  private readonly runtimeResource: bedrockagentcore.CfnRuntime;
  public readonly agentRuntimeArtifact: AgentRuntimeArtifact;
  private readonly networkConfiguration: NetworkConfiguration;
  private readonly protocolConfiguration: ProtocolType;
  private authorizerConfig?: AuthorizerConfigurationRuntime;

  constructor(scope: Construct, id: string, props: RuntimeProps) {
    super(scope, id);

    // CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.agentRuntimeName = props.agentRuntimeName;
    this.validateRuntimeName();

    this.description = props.description;
    if (this.description) {
      this.validateDescription();
    }

    if (props.environmentVariables) {
      this.validateEnvironmentVariables(props.environmentVariables);
    }

    if (props.tags) {
      this.validateTags(props.tags);
    }

    if (props.executionRole) {
      this.role = props.executionRole;
      if (!Token.isUnresolved(props.executionRole.roleArn)) {
        this.validateRoleArn(props.executionRole.roleArn);
      }
    } else {
      this.role = this.createExecutionRole();
    }

    this.grantPrincipal = this.role;

    this.agentRuntimeArtifact = props.agentRuntimeArtifact;

    this.networkConfiguration = props.networkConfiguration ?? {
      networkMode: NetworkMode.PUBLIC,
    };
    this.protocolConfiguration = props.protocolConfiguration ?? ProtocolType.HTTP;
    this.authorizerConfig = props.authorizerConfiguration;

    const cfnProps: bedrockagentcore.CfnRuntimeProps = {
      agentRuntimeName: this.agentRuntimeName,
      roleArn: this.role.roleArn,
      agentRuntimeArtifact: Lazy.any({
        produce: () => this.renderAgentRuntimeArtifact(),
      }),
      networkConfiguration: Lazy.any({
        produce: () => this.renderNetworkConfiguration(),
      }),
      protocolConfiguration: Lazy.string({
        produce: () => this.renderProtocolConfiguration(),
      }),
      description: props.description,
      environmentVariables: Lazy.any({
        produce: () => this.renderEnvironmentVariables(props.environmentVariables),
      }),
      authorizerConfiguration: Lazy.any({
        produce: () => this.renderAuthorizerConfiguration(),
      }),
      tags: props.tags ?? {},
    };

    this.runtimeResource = new bedrockagentcore.CfnRuntime(this, 'Resource', cfnProps);

    // Add dependency on the role (for both custom and auto-created roles)
    // This ensures the Runtime waits for the role and all its policies (including ECR permissions) to be created
    this.runtimeResource.node.addDependency(this.role);

    this.agentRuntimeId = this.runtimeResource.attrAgentRuntimeId;
    this.agentRuntimeArn = this.runtimeResource.attrAgentRuntimeArn;
    this.agentStatus = this.runtimeResource.attrStatus;
    this.agentRuntimeVersion = this.runtimeResource.attrAgentRuntimeVersion;
    this.createdAt = this.runtimeResource.attrCreatedAt;
    this.lastUpdatedAt = this.runtimeResource.attrLastUpdatedAt;
  }

  /**
   * Renders the artifact configuration for CloudFormation
   * @internal
   */
  private renderAgentRuntimeArtifact(): any {
    const containerUri = this.agentRuntimeArtifact.bind(this, this).containerUri;
    this.validateContainerUri(containerUri);

    return {
      containerConfiguration: {
        containerUri: containerUri,
      },
    };
  }

  /**
   * Renders the network configuration for CloudFormation
   * @internal
   */
  private renderNetworkConfiguration(): any {
    return {
      networkMode: this.networkConfiguration.networkMode,
    };
  }

  /**
   * Renders the protocol configuration for CloudFormation
   * @internal
   */
  private renderProtocolConfiguration(): string {
    return this.protocolConfiguration;
  }

  /**
   * Renders the environment variables for CloudFormation
   * @internal
   */
  private renderEnvironmentVariables(envVars?: { [key: string]: string }): any {
    if (!envVars || Object.keys(envVars).length === 0) {
      return undefined;
    }
    return envVars;
  }

  /**
   * Renders the authorizer configuration for CloudFormation
   * @internal
   */
  private renderAuthorizerConfiguration(): any {
    if (!this.authorizerConfig) {
      return undefined;
    }
    return this.formatAuthorizerConfiguration(this.authorizerConfig);
  }

  /**
   * Creates an execution role for the agent runtime with proper permissions
   * Based on: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html
   */
  private createExecutionRole(): iam.Role {
    const role = new iam.Role(this, 'ExecutionRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      description: 'Execution role for Bedrock Agent Core Runtime',
      maxSessionDuration: Duration.hours(8),
    });

    const region = Stack.of(this).region;
    const account = Stack.of(this).account;

    // ECR Image Access - scoped to account repositories
    role.addToPolicy(new iam.PolicyStatement({
      sid: 'ECRImageAccess',
      effect: iam.Effect.ALLOW,
      actions: RuntimePerms.ECR_IMAGE_ACTIONS,
      resources: [`arn:${Stack.of(this).partition}:ecr:${region}:${account}:repository/*`],
    }));

    // ECR Token Access - must be * for authorization token
    role.addToPolicy(new iam.PolicyStatement({
      sid: 'ECRTokenAccess',
      effect: iam.Effect.ALLOW,
      actions: RuntimePerms.ECR_TOKEN_ACTIONS,
      resources: ['*'],
    }));

    // CloudWatch Logs - Log Group operations
    role.addToPolicy(new iam.PolicyStatement({
      sid: 'LogGroupAccess',
      effect: iam.Effect.ALLOW,
      actions: RuntimePerms.LOGS_GROUP_ACTIONS,
      resources: [`arn:${Stack.of(this).partition}:logs:${region}:${account}:log-group:/aws/bedrock-agentcore/runtimes/*`],
    }));

    // CloudWatch Logs - Describe all log groups
    role.addToPolicy(new iam.PolicyStatement({
      sid: 'DescribeLogGroups',
      effect: iam.Effect.ALLOW,
      actions: RuntimePerms.LOGS_DESCRIBE_ACTIONS,
      resources: [`arn:${Stack.of(this).partition}:logs:${region}:${account}:log-group:*`],
    }));

    // CloudWatch Logs - Log Stream operations
    role.addToPolicy(new iam.PolicyStatement({
      sid: 'LogStreamAccess',
      effect: iam.Effect.ALLOW,
      actions: RuntimePerms.LOGS_STREAM_ACTIONS,
      resources: [`arn:${Stack.of(this).partition}:logs:${region}:${account}:log-group:/aws/bedrock-agentcore/runtimes/*:log-stream:*`],
    }));

    // X-Ray Tracing - must be * for tracing
    role.addToPolicy(new iam.PolicyStatement({
      sid: 'XRayAccess',
      effect: iam.Effect.ALLOW,
      actions: RuntimePerms.XRAY_ACTIONS,
      resources: ['*'],
    }));

    // CloudWatch Metrics - scoped to bedrock-agentcore namespace
    role.addToPolicy(new iam.PolicyStatement({
      sid: 'CloudWatchMetrics',
      effect: iam.Effect.ALLOW,
      actions: RuntimePerms.CLOUDWATCH_METRICS_ACTIONS,
      resources: ['*'],
      conditions: {
        StringEquals: {
          'cloudwatch:namespace': RuntimePerms.CLOUDWATCH_NAMESPACE,
        },
      },
    }));

    // Bedrock AgentCore Workload Identity Access
    // Note: The agent name will be determined at runtime, so we use a wildcard pattern
    role.addToPolicy(new iam.PolicyStatement({
      sid: 'GetAgentAccessToken',
      effect: iam.Effect.ALLOW,
      actions: RuntimePerms.WORKLOAD_IDENTITY_ACTIONS,
      resources: [
        `arn:${Stack.of(this).partition}:bedrock-agentcore:${region}:${account}:workload-identity-directory/default`,
        `arn:${Stack.of(this).partition}:bedrock-agentcore:${region}:${account}:workload-identity-directory/default/workload-identity/*`,
      ],
    }));

    // Note: Bedrock model invocation permissions are NOT included by default.
    // Users should grant these permissions  explicitly using model IBedrockInvokable interface

    return role;
  }

  /**
   * Validates the container URI format
   */
  private validateContainerUri(uri: string): void {
    // Skip validation if the URI contains CDK tokens (unresolved values)
    if (Token.isUnresolved(uri)) {
      // Add a warning that validation will be skipped for token-based URIs
      Annotations.of(this).addInfo(
        'Container URI validation skipped as it contains unresolved CDK tokens. ' +
        'The URI will be validated at deployment time.',
      );
      return;
    }

    // Only validate if the URI is a concrete string (not a token)
    const pattern = /^\d{12}\.dkr\.ecr\.([a-z0-9-]+)\.amazonaws\.com\/((?:[a-z0-9]+(?:[._-][a-z0-9]+)*\/)*[a-z0-9]+(?:[._-][a-z0-9]+)*)([:@]\S+)$/;
    if (!pattern.test(uri)) {
      throw new ValidationError(
        `Invalid container URI format: ${uri}. Must be a valid ECR URI (e.g., 123456789012.dkr.ecr.us-west-2.amazonaws.com/my-agent:latest)`,
      );
    }
  }

  /**
   * Validates the runtime name format
   * Pattern: ^[a-zA-Z][a-zA-Z0-9_]{0,47}$
   * @throws Error if validation fails
   */
  private validateRuntimeName(): void {
    // Skip validation if the name contains CDK tokens (unresolved values)
    if (Token.isUnresolved(this.agentRuntimeName)) {
      return;
    }

    // Validate length
    const lengthErrors = validateStringField({
      value: this.agentRuntimeName,
      fieldName: 'Runtime name',
      minLength: 1,
      maxLength: 48,
    });

    // Validate pattern
    const patternErrors = validateFieldPattern(
      this.agentRuntimeName,
      'Runtime name',
      /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/,
      'Runtime name must start with a letter and contain only letters, numbers, and underscores',
    );

    // Combine and throw if any errors
    const allErrors = [...lengthErrors, ...patternErrors];
    if (allErrors.length > 0) {
      throw new ValidationError(allErrors.join('\n'));
    }
  }

  /**
   * Validates the description format
   * Must be between 1 and 1200 characters (per CloudFormation specification)
   * @throws Error if validation fails
   */
  private validateDescription(): void {
    // Skip validation if the description contains CDK tokens (unresolved values)
    if (Token.isUnresolved(this.description)) {
      return;
    }

    if (this.description) {
      const errors = validateStringField({
        value: this.description,
        fieldName: 'Description',
        minLength: 1,
        maxLength: 1200,
      });

      if (errors.length > 0) {
        throw new ValidationError(errors.join('\n'));
      }
    }
  }

  /**
   * Validates environment variables
   * - Maximum 50 entries
   * - Key: 1-100 characters
   * - Value: 0-2048 characters (per CloudFormation specification)
   * @throws Error if validation fails
   */
  private validateEnvironmentVariables(envVars: { [key: string]: string }): void {
    const entries = Object.entries(envVars);

    // Validate number of entries (0-50)
    if (entries.length > 50) {
      throw new ValidationError(
        `Too many environment variables: ${entries.length}. Maximum allowed is 50`,
      );
    }

    for (const [key, value] of entries) {
      // Skip validation if key or value contains CDK tokens
      if (Token.isUnresolved(key) || Token.isUnresolved(value)) {
        continue;
      }

      // Validate key length
      const lengthErrors = validateStringField({
        value: key,
        fieldName: `Environment variable key '${key}'`,
        minLength: 1,
        maxLength: 100,
      });

      // Validate key pattern
      const patternErrors = validateFieldPattern(
        key,
        `Environment variable key '${key}'`,
        /^[a-zA-Z_][a-zA-Z0-9_]*$/,
        `Environment variable key '${key}' must start with a letter or underscore and contain only letters, numbers, and underscores`,
      );

      // Combine and throw if any errors
      const allErrors = [...lengthErrors, ...patternErrors];
      if (allErrors.length > 0) {
        throw new ValidationError(allErrors.join('\n'));
      }

      // Validate value length (0-2048 characters per CloudFormation)
      if (value.length > 2048) {
        throw new ValidationError(
          `Invalid environment variable value length for key '${key}': ${value.length} characters. ` +
          'Values must not exceed 2048 characters',
        );
      }
    }
  }

  /**
   * Validates the tags format
   * @param tags The tags object to validate
   * @throws Error if validation fails
   */
  private validateTags(tags: { [key: string]: string }): void {
    // Validate each tag key and value
    for (const [key, value] of Object.entries(tags)) {
      // Skip validation if key or value contains CDK tokens
      if (Token.isUnresolved(key) || Token.isUnresolved(value)) {
        continue;
      }

      // Validate tag key length
      const keyLengthErrors = validateStringField({
        value: key,
        fieldName: `Tag key "${key}"`,
        minLength: 1,
        maxLength: 256,
      });

      // Validate tag key pattern
      const keyPatternErrors = validateFieldPattern(
        key,
        `Tag key "${key}"`,
        /^[a-zA-Z0-9\s._:/=+@-]*$/,
        `Tag key "${key}" can only contain letters (a-z, A-Z), numbers (0-9), spaces, and special characters (._:/=+@-)`,
      );

      // Combine key errors and throw if any
      const keyErrors = [...keyLengthErrors, ...keyPatternErrors];
      if (keyErrors.length > 0) {
        throw new ValidationError(keyErrors.join('\n'));
      }

      if (value === undefined || value === null) {
        throw new ValidationError(`Tag value for key "${key}" cannot be null or undefined`);
      }

      // Validate tag value length
      const valueLengthErrors = validateStringField({
        value: value,
        fieldName: `Tag value for key "${key}"`,
        minLength: 0,
        maxLength: 256,
      });

      // Validate tag value pattern
      const valuePatternErrors = validateFieldPattern(
        value,
        `Tag value for key "${key}"`,
        /^[a-zA-Z0-9\s._:/=+@-]*$/,
        `Tag value for key "${key}" can only contain letters (a-z, A-Z), numbers (0-9), spaces, and special characters (._:/=+@-)`,
      );

      // Combine value errors and throw if any
      const valueErrors = [...valueLengthErrors, ...valuePatternErrors];
      if (valueErrors.length > 0) {
        throw new ValidationError(valueErrors.join('\n'));
      }
    }
  }

  /**
   * Formats authorizer configuration
   * Handles different authentication modes and converts them to the appropriate format
   * CloudFormation expects PascalCase property names
   */
  private formatAuthorizerConfiguration(config: AuthorizerConfigurationRuntime): any {
    // if customJWTAuthorizer is provided without mode
    if (config.customJWTAuthorizer && !config.mode) {
      return {
        CustomJWTAuthorizer: {
          DiscoveryUrl: config.customJWTAuthorizer.discoveryUrl,
          AllowedAudience: config.customJWTAuthorizer.allowedAudience,
          AllowedClients: config.customJWTAuthorizer.allowedClients,
        },
      };
    }

    // Get the authentication mode (default to IAM)
    const mode = config.mode ?? AuthenticationMode.IAM;

    switch (mode) {
      case AuthenticationMode.IAM:
        // For IAM authentication, return undefined to let AWS service use default
        return undefined;

      case AuthenticationMode.JWT:
        if (!config.customJWTAuthorizer) {
          throw new ValidationError('customJWTAuthorizer configuration is required when mode is JWT');
        }
        return {
          CustomJWTAuthorizer: {
            DiscoveryUrl: config.customJWTAuthorizer.discoveryUrl,
            AllowedAudience: config.customJWTAuthorizer.allowedAudience,
            AllowedClients: config.customJWTAuthorizer.allowedClients,
          },
        };

      case AuthenticationMode.COGNITO:
        if (!config.cognitoAuthorizer) {
          throw new ValidationError('cognitoAuthorizer configuration is required when mode is COGNITO');
        }
        // Convert Cognito config to JWT format
        const region = config.cognitoAuthorizer.region ?? Stack.of(this).region;
        const discoveryUrl = `https://cognito-idp.${region}.amazonaws.com/${config.cognitoAuthorizer.userPoolId}/.well-known/openid-configuration`;

        // Validate discovery URL format
        if (!discoveryUrl.endsWith('/.well-known/openid-configuration')) {
          throw new ValidationError('Invalid Cognito discovery URL format');
        }

        const jwtConfig: any = {
          DiscoveryUrl: discoveryUrl,
        };

        if (config.cognitoAuthorizer.clientId) {
          jwtConfig.AllowedClients = [config.cognitoAuthorizer.clientId];
        }

        return {
          CustomJWTAuthorizer: jwtConfig,
        };

      case AuthenticationMode.OAUTH:
        if (!config.oauthAuthorizer) {
          throw new ValidationError('oauthAuthorizer configuration is required when mode is OAUTH');
        }

        // Validate discovery URL format
        if (!config.oauthAuthorizer.discoveryUrl.endsWith('/.well-known/openid-configuration')) {
          throw new ValidationError('OAuth discovery URL must end with /.well-known/openid-configuration');
        }

        return {
          CustomJWTAuthorizer: {
            DiscoveryUrl: config.oauthAuthorizer.discoveryUrl,
            AllowedClients: [config.oauthAuthorizer.clientId],
            // Note: OAuth scopes are typically validated at the OAuth provider level
            // The runtime validates the token, not the scopes
          },
        };

      default:
        throw new ValidationError(`Unsupported authentication mode: ${mode}`);
    }
  }

  /**
   * Configure Cognito authentication for this runtime instance
   * This will override any existing authentication configuration
   *
   * @param userPoolId The Cognito User Pool ID (e.g., 'us-west-2_ABC123')
   * @param clientId Optional Cognito App Client ID. If not provided, accepts any valid client from the user pool
   * @param region Optional AWS region (defaults to stack region)
   */
  public configureCognitoAuth(
    userPoolId: string,
    clientId?: string,
    region?: string,
  ): void {
    this.authorizerConfig = {
      mode: AuthenticationMode.COGNITO,
      cognitoAuthorizer: {
        userPoolId,
        clientId,
        region,
      },
    };

    const formattedAuth = this.formatAuthorizerConfiguration(this.authorizerConfig);
    if (formattedAuth) {
      this.runtimeResource.authorizerConfiguration = formattedAuth;
    }
  }

  /**
   * Configure JWT authentication for this runtime instance
   * This will override any existing authentication configuration
   *
   * @param discoveryUrl The OIDC discovery URL (must end with /.well-known/openid-configuration)
   * @param allowedClients Array of allowed client IDs
   * @param allowedAudience Optional array of allowed audiences
   */
  public configureJWTAuth(
    discoveryUrl: string,
    allowedClients: string[],
    allowedAudience?: string[],
  ): void {
    this.authorizerConfig = {
      mode: AuthenticationMode.JWT,
      customJWTAuthorizer: {
        discoveryUrl,
        allowedClients,
        allowedAudience,
      },
    };

    const formattedAuth = this.formatAuthorizerConfiguration(this.authorizerConfig);
    if (formattedAuth) {
      this.runtimeResource.authorizerConfiguration = formattedAuth;
    }
  }

  /**
   * Validates the IAM role ARN format and structure
   * @throws Error if validation fails
   */
  private validateRoleArn(roleArn: string): void {
    // Validate basic ARN format for IAM roles
    const arnPattern = /^arn:[a-z\-]+:iam::\d{12}:role\/[a-zA-Z0-9+=,.@\-_\/]+$/;
    if (!arnPattern.test(roleArn)) {
      throw new ValidationError(`Invalid IAM role ARN format: ${roleArn}. ` +
  'Expected format: arn:<partition>:iam::<account-id>:role/<role-name> or arn:<partition>:iam::<account-id>:role/<path>/<role-name>');
    }

    // Parse the ARN components using CDK's Arn.split()
    // Use SLASH_RESOURCE_NAME format for IAM roles (which use format: role/role-name or role/path/to/role-name)
    const arnComponents = Arn.split(roleArn, ArnFormat.SLASH_RESOURCE_NAME);

    if (arnComponents.service !== 'iam') {
      throw new ValidationError(`Invalid service in ARN: ${arnComponents.service}. Expected 'iam' for IAM role ARN.`);
    }

    const accountId = arnComponents.account;
    if (!accountId || !/^\d{12}$/.test(accountId)) {
      throw new ValidationError(`Invalid AWS account ID in role ARN: ${accountId}. Must be a 12-digit number.`);
    }

    // Extract role name from resource
    // For IAM roles, resource will be "role" and resourceName will be the role name (with optional path)
    const resource = arnComponents.resource;
    const resourceName = arnComponents.resourceName;

    if (resource !== 'role') {
      throw new ValidationError(`Invalid resource type in ARN: ${resource}. Expected 'role' for IAM role ARN.`);
    }

    if (!resourceName) {
      throw new ValidationError('Role name is missing in the ARN');
    } else {
      const rolePathParts = resourceName.split('/');
      const roleName = rolePathParts[rolePathParts.length - 1];

      if (roleName.length > 64) {
        throw new ValidationError(`Role name exceeds maximum length of 64 characters: ${roleName}`);
      }
    }

    const stackAccount = Stack.of(this).account;
    if (!Token.isUnresolved(stackAccount) && accountId !== stackAccount) {
      Annotations.of(this).addWarning(
        `IAM role is from a different account (${accountId}) than the stack account (${stackAccount}). ` +
        'Ensure cross-account permissions are properly configured.',
      );
    }

    // Validate the region (IAM is global, so region should be empty)
    const region = arnComponents.region;
    const stackRegion = Stack.of(this).region;
    if (region && region !== '' && region !== stackRegion && !Token.isUnresolved(stackRegion)) {
      Annotations.of(this).addWarning(
        `IAM role ARN contains a region (${region}) that doesn't match the stack region (${stackRegion}). ` +
        'IAM is a global service, so this might be intentional.',
      );
    }
  }

  /**
   * Add an endpoint to this runtime
   * This is a convenience method that creates a RuntimeEndpoint associated with this runtime
   *
   * @param endpointName The name of the endpoint
   * @param options Optional configuration for the endpoint
   * @returns The created RuntimeEndpoint
   */
  public addEndpoint(
    endpointName: string,
    options?: AddEndpointOptions,
  ): RuntimeEndpoint {
    // Create the endpoint (security configuration is no longer supported)
    const endpoint = new RuntimeEndpoint(this, `Endpoint${endpointName}`, {
      endpointName: endpointName,
      agentRuntimeId: this.agentRuntimeId,
      agentRuntimeVersion: options?.version ?? this.agentRuntimeVersion ?? '1',
      description: options?.description,
    });

    // Add dependency: endpoint must wait for runtime to be created
    endpoint.node.addDependency(this.runtimeResource);

    return endpoint;
  }
}
