import { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import { OAuthIdentity } from '../../identity/oauth-identity';
import { CredentialProviderType, IGatewayCredentialProvider } from './credential-provider';
import { CfnGatewayTarget } from 'aws-cdk-lib/aws-bedrockagentcore';

/******************************************************************************
 *                                OAuth
 *****************************************************************************/

/**
 * OAuth configuration
 */
export interface OAuthConfiguration {
  /**
   * The OAuth identity.
   * This identity identifies the OAuth provider.
   *
   * Required: Yes
   */
  readonly provider: OAuthIdentity;

  /**
   * The OAuth scopes for the credential provider.
   * These scopes define the level of access requested from the OAuth provider.
   *
   * Array Members: Minimum number of 0 items. Maximum number of 100 items.
   * Length Constraints: Minimum length of 1. Maximum length of 64.
   * Required: Yes
   */
  readonly scopes: string[];

  /**
   * The custom parameters for the OAuth credential provider.
   * These parameters provide additional configuration for the OAuth authentication process.
   *
   * Map Entries: Maximum number of 10 items.
   * Key Length Constraints: Minimum length of 1. Maximum length of 256.
   * Value Length Constraints: Minimum length of 1. Maximum length of 2048.
   * Required: No
   */
  readonly customParameters?: Record<string, string>;
}

/**
 * OAuth credential provider configuration implementation
 */
export class OAuthCredentialProvider implements IGatewayCredentialProvider {
  public readonly credentialProviderType = CredentialProviderType.OAUTH;
  public readonly oauthClient: OAuthIdentity;
  public readonly scopes: string[];
  public readonly customParameters?: Record<string, string>;

  constructor(configuration: OAuthConfiguration) {
    this.oauthClient = configuration.provider;
    this.scopes = configuration.scopes;
    this.customParameters = configuration.customParameters;
  }

  grantNeededPermissionsToRole(role: IRole): Grant | undefined {
    return this.oauthClient.grantRead(role);
  }

  render(): CfnGatewayTarget.CredentialProviderConfigurationProperty {
    return {
      credentialProviderType: this.credentialProviderType,
      credentialProvider: {
        oauthCredentialProvider: {
          providerArn: this.oauthClient.credentialProviderArn,
          scopes: this.scopes,
          customParameters: this.customParameters,
        },
      },
    };
  }
}
