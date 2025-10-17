import { Resource, IResource } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IGateway } from '../gateway-base';
import { ICredentialProvider } from '../outbound-auth/credential-provider';
import { ValidationError } from '../validation-helpers';

/******************************************************************************
 *                                 ENUM
 *****************************************************************************/
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
}

/******************************************************************************
 *                                Interface
 *****************************************************************************/

/**
 * Interface for GatewayTarget resources
 */
export interface IGatewayTarget extends IResource {
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
  readonly credentialProviderConfigurations: ICredentialProvider[];

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
 */
export interface IMcpGatewayTarget extends IGatewayTarget {
  /**
   * The type of target
   */
  readonly targetType: McpTargetType;
}

/******************************************************************************
 *                                Base Class
 *****************************************************************************/

export abstract class GatewayTargetBase extends Resource implements IGatewayTarget {
  public abstract readonly targetArn: string;
  public abstract readonly targetId: string;
  public abstract readonly name: string;
  public abstract readonly description?: string;
  public abstract readonly gateway: IGateway;
  public abstract readonly credentialProviderConfigurations: ICredentialProvider[];
  public abstract readonly status?: string;
  public abstract readonly statusReasons?: string[];
  public abstract readonly createdAt?: string;
  public abstract readonly updatedAt?: string;
  public abstract readonly targetProtocolType: GatewayTargetProtocolType;

  /**
   * Grants IAM actions to the IAM Principal
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
   */
  public grantManage(grantee: iam.IGrantable): iam.Grant {
    return this.grant(
      grantee,
      'bedrock-agentcore:CreateGatewayTarget',
      'bedrock-agentcore:UpdateGatewayTarget',
      'bedrock-agentcore:DeleteGatewayTarget',
    );
  }

  /**
   * Validates the gateway target name format
   * @param name The gateway target name to validate
   * @throws Error if the name is invalid
   */
  protected validateGatewayTargetName(name: string): void {
    if (!name || name.length === 0) {
      throw new ValidationError('Gateway target name cannot be empty');
    }

    if (name.length > 50) {
      throw new ValidationError(`Gateway target name cannot exceed 50 characters. Current length: ${name.length}/100`);
    }

    // Check if name contains only valid characters: a-z, A-Z, 0-9, and -
    const validNamePattern = /^[a-zA-Z0-9-]+$/;
    if (!validNamePattern.test(name)) {
      throw new ValidationError(
        `Gateway target name can only contain letters (a-z, A-Z), numbers (0-9), and hyphens (-). Invalid name: "${name}"`,
      );
    }
  }
}
