import type { IResolvable } from 'aws-cdk-lib';
import type { CfnGatewayTarget } from 'aws-cdk-lib/aws-bedrockagentcore';
import type { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import type { ApiKeyCredentialLocation, ApiKeyCredentialProviderProps } from './api-key';
import { ApiKeyCredentialProviderConfiguration } from './api-key';
import { GatewayIamRoleCredentialProviderConfig } from './iam-role';
import type { OAuthConfiguration } from './oauth';
import { OAuthCredentialProviderConfiguration } from './oauth';
import type { IApiKeyCredentialProvider } from '../../identity/api-key-credential-provider';
import type { IOAuth2CredentialProvider } from '../../identity/oauth2-credential-provider';

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
 * Optional gateway settings when binding an {@link IApiKeyCredentialProvider} to a target.
 */
export interface FromApiKeyIdentityOptions {
  /**
   * Where to place the API key on outbound requests.
   *
   * @default header `Authorization` with `Bearer ` prefix
   */
  readonly credentialLocation?: ApiKeyCredentialLocation;
}

/**
 * OAuth scopes (and optional custom parameters) when binding an {@link IOAuth2CredentialProvider} to a gateway target.
 */
export interface FromOauthIdentityOptions {
  /**
   * OAuth scopes the gateway should request for this target.
   */
  readonly scopes: string[];

  /**
   * Additional OAuth parameters for the provider.
   *
   * @default - none
   */
  readonly customParameters?: { [key: string]: string };
}

/**
 * Factory class for creating different Gateway Credential Providers
 */
export abstract class GatewayCredentialProvider {
  /**
   * Create an API key outbound auth configuration from a Token Vault {@link IApiKeyCredentialProvider} construct.
   *
   * Prefer this over {@link GatewayCredentialProvider.fromApiKeyIdentityArn} when the provider is defined in CDK.
   */
  public static fromApiKeyIdentity(
    provider: IApiKeyCredentialProvider,
    options: FromApiKeyIdentityOptions = {},
  ): ICredentialProviderConfig {
    const binding = provider.bindForGatewayApiKeyTarget();
    return new ApiKeyCredentialProviderConfiguration({
      providerArn: binding.providerArn,
      secretArn: binding.secretArn,
      credentialLocation: options.credentialLocation,
    });
  }

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
   * Create an OAuth outbound auth configuration from a Token Vault {@link IOAuth2CredentialProvider} construct.
   *
   * Prefer this over {@link GatewayCredentialProvider.fromOauthIdentityArn} when the provider is defined in CDK.
   */
  public static fromOauthIdentity(
    provider: IOAuth2CredentialProvider,
    options: FromOauthIdentityOptions,
  ): ICredentialProviderConfig {
    const binding = provider.bindForGatewayOAuthTarget(options.scopes, options.customParameters);
    return new OAuthCredentialProviderConfiguration({
      providerArn: binding.providerArn,
      secretArn: binding.secretArn,
      scopes: binding.scopes,
      customParameters: binding.customParameters,
    });
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
