import type { IResource } from 'aws-cdk-lib';
import { Resource } from 'aws-cdk-lib';
import type { GatewayTargetReference, IGatewayTargetRef } from 'aws-cdk-lib/aws-bedrockagentcore';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { IGateway } from '../gateway-base';
import type { ICredentialProviderConfig } from '../outbound-auth/credential-provider';

/******************************************************************************
 *                                 ENUM
 *****************************************************************************/
/**
 * Protocol types supported by gateway targets
 */
export enum GatewayTargetProtocolType {
  /** Model Context Protocol type */
  MCP = 'MCP',
}

/**
 * MCP target types
 */
export enum McpTargetType {
  /** OpenAPI schema target type */
  OPENAPI_SCHEMA = 'OPENAPI_SCHEMA',
  /** Smithy model target type */
  SMITHY_MODEL = 'SMITHY_MODEL',
  /** Lambda function target type */
  LAMBDA = 'LAMBDA',
  /** MCP server target type */
  MCP_SERVER = 'MCP_SERVER',
  /** API Gateway target type */
  API_GATEWAY = 'API_GATEWAY',
}

/******************************************************************************
 *                                Interface
 *****************************************************************************/

/**
 * Interface for GatewayTarget resources
 *
 * Represents a target that hosts tools for the gateway.
 * Targets can be Lambda functions, OpenAPI schemas, or Smithy models.
 */
export interface IGatewayTarget extends IResource, IGatewayTargetRef {
  /**
   * The ARN of the gateway target resource
   * @attribute
   */
  readonly targetArn: string;

  /**
   * The id of the gateway target
   * @attribute
   */
  readonly targetId: string;

  /**
   * The name of the gateway target
   */
  readonly name: string;

  /**
   * The description of the gateway target
   */
  readonly description?: string;

  /**
   * The gateway that this target belongs to
   */
  readonly gateway: IGateway;

  /**
   * The target protocol
   */
  readonly targetProtocolType: GatewayTargetProtocolType;

  /**
   * The credential provider configuration for the target
   */
  readonly credentialProviderConfigurations: ICredentialProviderConfig[] | undefined;

  /**
   * The status of the gateway target
   * @attribute
   */
  readonly status?: string;

  /**
   * The status reasons for the gateway target
   * @attribute
   */
  readonly statusReasons?: string[];

  /**
   * Timestamp when the gateway target was created
   * @attribute
   */
  readonly createdAt?: string;

  /**
   * Timestamp when the gateway target was last updated
   * @attribute
   */
  readonly updatedAt?: string;

  /**
   * Grants IAM actions to the IAM Principal
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grants `Get` and `List` actions on the Gateway Target
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grants `Create`, `Update`, and `Delete` actions on the Gateway Target
   */
  grantManage(grantee: iam.IGrantable): iam.Grant;
}

/**
 * Interface for MCP gateway targets
 *
 * Extends the base gateway target interface with MCP-specific properties.
 * MCP targets expose tools using the Model Context Protocol.
 */
export interface IMcpGatewayTarget extends IGatewayTarget {
  /**
   * The type of target (Lambda, OpenAPI, or Smithy)
   */
  readonly targetType: McpTargetType;
}

/******************************************************************************
 *                                Base Class
 *****************************************************************************/
/**
 * Base class for gateway target implementations
 *
 * Provides common functionality for all gateway target types including
 * permission management and property definitions.
 */
export abstract class GatewayTargetBase extends Resource implements IGatewayTarget {
  public abstract readonly targetArn: string;
  public abstract readonly targetId: string;
  public abstract readonly name: string;
  public abstract readonly description?: string;
  public abstract readonly gateway: IGateway;
  public abstract readonly credentialProviderConfigurations: ICredentialProviderConfig[] | undefined;
  public abstract readonly status?: string;
  public abstract readonly statusReasons?: string[];
  public abstract readonly createdAt?: string;
  public abstract readonly updatedAt?: string;
  public abstract readonly targetProtocolType: GatewayTargetProtocolType;

  /**
   * A reference to a GatewayTarget resource.
   */
  public get gatewayTargetRef(): GatewayTargetReference {
    return {
      gatewayIdentifier: this.gateway.gatewayRef.gatewayIdentifier,
      targetId: this.targetId,
    };
  }

  /**
   * Grants IAM actions to the IAM Principal
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal to grant permissions to
   * @param actions The IAM actions to grant
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      resourceArns: [this.targetArn],
      actions: actions,
    });
  }

  /**
   * Grants `Get` and `List` actions on the Gateway Target
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal to grant read permissions to
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    const resourceSpecificGrant = this.grant(grantee, 'bedrock-agentcore:GetGatewayTarget');

    const allResourceGrant = iam.Grant.addToPrincipal({
      grantee: grantee,
      resourceArns: ['*'],
      actions: ['bedrock-agentcore:ListGatewayTargets'],
    });
    // Return combined grant
    return resourceSpecificGrant.combine(allResourceGrant);
  }

  /**
   * Grants `Create`, `Update`, and `Delete` actions on the Gateway Target
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal to grant manage permissions to
   */
  public grantManage(grantee: iam.IGrantable): iam.Grant {
    return this.grant(
      grantee,
      'bedrock-agentcore:CreateGatewayTarget',
      'bedrock-agentcore:UpdateGatewayTarget',
      'bedrock-agentcore:DeleteGatewayTarget',
    );
  }
}
