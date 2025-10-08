import { Resource } from 'aws-cdk-lib';
import { GatewayTargetProtocolType, IGatewayTarget } from './target';
import { IGateway } from '../gateway';
import { IGatewayCredentialProvider } from '../outbound-auth/credential-provider';
import * as iam from 'aws-cdk-lib/aws-iam';

/******************************************************************************
 *                                Base Class
 *****************************************************************************/

export abstract class GatewayTargetBase extends Resource implements IGatewayTarget {
  public abstract readonly targetArn: string;
  public abstract readonly targetId: string;
  public abstract readonly name: string;
  public abstract readonly description?: string;
  public abstract readonly gateway: IGateway;
  public abstract readonly credentialProviders: IGatewayCredentialProvider[];
  public abstract readonly status?: string;
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
      throw new Error('Gateway target name cannot be empty');
    }

    if (name.length > 50) {
      throw new Error(`Gateway target name cannot exceed 50 characters. Current length: ${name.length}/100`);
    }

    // Check if name contains only valid characters: a-z, A-Z, 0-9, and -
    const validNamePattern = /^[a-zA-Z0-9-]+$/;
    if (!validNamePattern.test(name)) {
      throw new Error(
        `Gateway target name can only contain letters (a-z, A-Z), numbers (0-9), and hyphens (-). Invalid name: "${name}"`,
      );
    }
  }
}
