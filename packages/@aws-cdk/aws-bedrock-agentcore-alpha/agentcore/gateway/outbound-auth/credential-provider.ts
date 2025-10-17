import { IResolvable } from 'aws-cdk-lib';
import { CfnGatewayTarget } from 'aws-cdk-lib/aws-bedrockagentcore';
import { ApiKeyCredentialProviderConfiguration, ApiKeyCredentialProviderProps } from './api-key';
import { GatewayIamRoleCredentialProvider } from './iam-role';
import { OAuthConfiguration, OAuthCredentialProviderConfiguration } from './oauth';

/******************************************************************************
 *                                 Enums
 *****************************************************************************/
/**
 * Credential provider types supported by gateway target
 */
export enum CredentialProviderType {
  /**
   * Gateway IAM role credential provider.
   * This uses the Gateway's execution role to
   * authenticate with AWS services.
   */
  GATEWAY_IAM_ROLE = 'GATEWAY_IAM_ROLE',

  /**
   * OAuth credential provider
   */
  OAUTH = 'OAUTH',

  /**
   * API Key credential provider
   */
  API_KEY = 'API_KEY',
}

/******************************************************************************
 *                       Credential Provider
 *****************************************************************************/

/**
 * Abstract interface for gateway credential provider configuration
 */
export interface ICredentialProvider {
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
   * changed provider from ApiKeyIdentity to string, will set this permission explicitly
   */
  // grantNeededPermissionsToRole(role: IRole): Grant | undefined;
}

/**
 * Factory class for creating different Gateway Credential Providers
 */
export abstract class GatewayCredentialProvider {
  /**
   * Create an OAuth credential provider
   * @param props - Configuration for the OAuth provider
   * @returns ICredentialProvider configured for OAuth authentication
   */
  public static oauth(props: OAuthConfiguration): OAuthCredentialProviderConfiguration {
    return new OAuthCredentialProviderConfiguration(props);
  }

  /**
   * Create an API key credential provider
   * @param props - Configuration for the API key provider
   * @returns ICredentialProvider configured for API key authentication
   */
  public static apiKey(props: ApiKeyCredentialProviderProps): ApiKeyCredentialProviderConfiguration {
    return new ApiKeyCredentialProviderConfiguration(props);
  }

  /**
   * Create an IAM role credential provider
   * @returns ICredentialProvider configured for IAM role authentication
   */
  public static iamRole(): GatewayIamRoleCredentialProvider {
    return new GatewayIamRoleCredentialProvider();
  }
}
