import { CredentialProviderType, ICredentialProvider } from './credential-provider';
/******************************************************************************
 *                                OAuth
 *****************************************************************************/

/**
 * OAuth configuration
 */
export interface OAuthConfiguration {
  /**
   * The OAuth identity Arn.
   * Required: Yes
   */
  readonly providerArn: string;

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
  /**
   * Custom parameters for the OAuth flow
   * @default - No custom parameters
   */
  readonly customParameters?: Record<string, string>;
}

/**
 * OAuth credential provider configuration implementation
 */
export class OAuthCredentialProviderConfiguration implements ICredentialProvider {
  public readonly credentialProviderType = CredentialProviderType.OAUTH;
  /**
   * The ARN of the OAuth provider
   */
  public readonly providerArn: string;
  /**
   * The OAuth scopes to request
   */
  public readonly scopes: string[];
  /**
   * Custom parameters for the OAuth flow
   */
  public readonly customParameters?: Record<string, string>;

  constructor(configuration: OAuthConfiguration) {
    this.providerArn = configuration.providerArn;
    this.scopes = configuration.scopes;
    this.customParameters = configuration.customParameters;
  }

  // Set this permission explicitly
  // grantNeededPermissionsToRole(role: IRole): Grant | undefined {
  //   return this.oauthClient.grantRead(role);
  // }

  /**
   * @internal
   */
  _render(): any {
    return {
      credentialProviderType: this.credentialProviderType,
      credentialProvider: {
        oauthCredentialProvider: {
          providerArn: this.providerArn,
          scopes: this.scopes,
          customParameters: this.customParameters,
        },
      },
    };
  }
}
