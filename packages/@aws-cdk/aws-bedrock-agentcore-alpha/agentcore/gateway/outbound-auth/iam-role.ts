
/******************************************************************************
 *                                 IAM Role
 *****************************************************************************/

import { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import { CredentialProviderType, IIamRoleCredentialProvider } from './credential-provider';

/**
 * Gateway IAM Role credential provider configuration implementation
 * Can be used with Lambda and Smithy targets
 */
export class GatewayIamRoleCredentialProvider implements IIamRoleCredentialProvider {
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
