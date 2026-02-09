
/******************************************************************************
 *                                 IAM Role
 *****************************************************************************/

import type { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import type { ICredentialProviderConfig } from './credential-provider';
import { CredentialProviderType } from './credential-provider';

/**
 * Gateway IAM Role credential provider configuration implementation
 * Can be used with Lambda and Smithy targets
 * @internal
 */
export class GatewayIamRoleCredentialProviderConfig implements ICredentialProviderConfig {
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
   * No-op for IAM role authentication - no additional permissions are required.
   * When using IAM role authentication for outbound calls, the gateway uses its own execution
   * role to authenticate with the target endpoint. Unlike API Key and OAuth credential providers
   * which require permissions to access external credential stores (Secrets Manager, Token Vault),
   * IAM role authentication leverages AWS IAM's native authentication without additional resources.
   * @param role The gateway's execution role (unused - no credential provider permissions needed)
   * @returns undefined - no additional credential provider permissions to grant
   */
  grantNeededPermissionsToRole(role: IRole): Grant | undefined {
    if (role) {
    }
    return undefined;
  }
}
