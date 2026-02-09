import type { IResolvable } from 'aws-cdk-lib';
import type { CfnGatewayTarget } from 'aws-cdk-lib/aws-bedrockagentcore';
import type { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import type { ApiKeyCredentialProviderProps } from './api-key';
import { ApiKeyCredentialProviderConfiguration } from './api-key';
import { GatewayIamRoleCredentialProviderConfig } from './iam-role';
import type { OAuthConfiguration } from './oauth';
import { OAuthCredentialProviderConfiguration } from './oauth';

/******************************************************************************
 *                                 Enums
 *****************************************************************************/
/**
 * Credential provider types supported by gateway target
 */
export enum CredentialProviderType {
  /**
   * API Key authentication
   */
  API_KEY = 'API_KEY',

  /**
   * OAuth authentication
   */
  OAUTH = 'OAUTH',

  /**
   * IAM role authentication
   */
  GATEWAY_IAM_ROLE = 'GATEWAY_IAM_ROLE',
}

/******************************************************************************
 *                       Credential Provider
 *****************************************************************************/

/**
 * Abstract interface for gateway credential provider configuration
 */
export interface ICredentialProviderConfig {
  /**
   * The credential provider type
   */
  readonly credentialProviderType: CredentialProviderType;

  /**
   * Renders as CFN Property
   *  @internal
   */
  _render(): CfnGatewayTarget.CredentialProviderConfigurationProperty | IResolvable;

  /**
   * Grant the role the permissions
   */
  grantNeededPermissionsToRole(role: IRole): Grant | undefined;
}

/**
 * Factory class for creating different Gateway Credential Providers
 */
export abstract class GatewayCredentialProvider {
  /**
   * Create an API key credential provider from Identity ARN
   * Use this method when you have the Identity ARN as a string
   * @param props - The configuration properties for the API key credential provider
   * @returns ICredentialProviderConfig configured for API key authentication
   */
  public static fromApiKeyIdentityArn(props: ApiKeyCredentialProviderProps): ICredentialProviderConfig {
    return new ApiKeyCredentialProviderConfiguration(props);
  }

  /**
   * Create an OAuth credential provider from Identity ARN
   * Use this method when you have the Identity ARN as a string
   * @param props - The configuration properties for the OAuth credential provider
   * @returns ICredentialProviderConfig configured for OAuth authentication
   */
  public static fromOauthIdentityArn(props: OAuthConfiguration): ICredentialProviderConfig {
    return new OAuthCredentialProviderConfiguration(props);
  }

  /**
   * Create an IAM role credential provider
   * @returns IIamRoleCredentialProvider configured for IAM role authentication
   */
  public static fromIamRole(): ICredentialProviderConfig {
    return new GatewayIamRoleCredentialProviderConfig();
  }
}
