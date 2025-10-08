/******************************************************************************
 *                                 IAM Role
 *****************************************************************************/

import { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import { CredentialProviderType, IGatewayCredentialProvider } from './credential-provider';

/**
 * Gateway IAM Role credential provider configuration implementation
 */
export class GatewayIamRoleCredentialProvider implements IGatewayCredentialProvider {
  public readonly credentialProviderType = CredentialProviderType.GATEWAY_IAM_ROLE;

  constructor() {}

  render(): any {
    return {
      CredentialProviderType: this.credentialProviderType,
    };
  }

  grantNeededPermissionsToRole(role: IRole): Grant | undefined {
    if (role) {
    }
    return undefined;
  }
}
