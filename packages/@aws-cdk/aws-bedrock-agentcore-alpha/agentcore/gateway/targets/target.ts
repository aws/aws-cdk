import { IResource } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IGateway } from '../gateway';
import { IGatewayCredentialProvider } from '../outbound-auth/credential-provider';

/******************************************************************************
 *                                 ENUM
 *****************************************************************************/
export enum GatewayTargetProtocolType {
  MCP = 'MCP',
}

export enum McpTargetType {
  OPENAPI_SCHEMA = 'OPENAPI_SCHEMA',
  SMITHY_MODEL = 'SMITHY_MODEL',
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
   * @example "arn:aws:bedrock-agentcore:eu-central-1:249522321342:gateway/gateway_6647g-vko61CBXCd/target/target_1234567890"
   */
  readonly targetArn: string;

  /**
   * The id of the gateway target
   * @example "target_1234567890"
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
  readonly credentialProviders: IGatewayCredentialProvider[];

  /**
   * The status of the gateway target
   */
  readonly status?: string;

  /**
   * Timestamp when the gateway target was created
   */
  readonly createdAt?: string;

  /**
   * Timestamp when the gateway target was last updated
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
 *                                Props
 *****************************************************************************/

/**
 * Properties for creating a GatewayTarget resource
 */
export interface McpGatewayTargetCommonProps {
  /**
   * The name of the gateway target
   * Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen)
   * The name must be unique within the gateway
   */
  readonly name: string;

  /**
   * Optional description for the gateway target
   * Valid characters are a-z, A-Z, 0-9, _ (underscore), - (hyphen) and spaces
   * The description can have up to 200 characters
   * @default - No description
   */
  readonly description?: string;
}
