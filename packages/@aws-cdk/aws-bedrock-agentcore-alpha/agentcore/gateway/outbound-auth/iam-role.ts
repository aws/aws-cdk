/******************************************************************************
 *                                 IAM Role
 *****************************************************************************/

import { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import { CredentialProviderType, IGatewayCredentialProvider } from './credential-provider';
import { CfnGatewayTarget } from 'aws-cdk-lib/aws-bedrockagentcore';

/**
 * Gateway IAM Role credential provider configuration implementation
 */
export class GatewayIamRoleCredentialProvider implements IGatewayCredentialProvider {
  public readonly credentialProviderType = CredentialProviderType.GATEWAY_IAM_ROLE;

  constructor() {}

  render(): CfnGatewayTarget.CredentialProviderConfigurationProperty {
    return {
      credentialProviderType: this.credentialProviderType,
    };
  }

  grantNeededPermissionsToRole(role: IRole): Grant | undefined {
    if (role) {
    }
    return undefined;
  }
}
