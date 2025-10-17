
/******************************************************************************
 *                                 IAM Role
 *****************************************************************************/

import { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import { CredentialProviderType, ICredentialProvider } from './credential-provider';

/**
 * Gateway IAM Role credential provider configuration implementation
 */
export class GatewayIamRoleCredentialProvider implements ICredentialProvider {
  public readonly credentialProviderType = CredentialProviderType.GATEWAY_IAM_ROLE;

  constructor() {}

  /**
   * @internal
   */
  _render(): any {
    return {
      credentialProviderType: this.credentialProviderType,
    };
  }

  /**
   * Grant needed permissions to the provided role
   * @param role The role to grant permissions to
   * @returns Grant object or undefined
   */
  grantNeededPermissionsToRole(role: IRole): Grant | undefined {
    if (role) {
    }
    return undefined;
  }
}
