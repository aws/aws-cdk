import type { ApiKeyCredentialLocation, ApiKeyCredentialProviderOptions } from './api-key';
import { ApiKeyCredentialProviderConfiguration } from './api-key';
import type { GatewayIamRoleCredentialProviderProps } from './iam-role';
import { GatewayIamRoleCredentialProviderConfig } from './iam-role';
import type { OAuthConfiguration } from './oauth';
import { OAuthCredentialProviderConfiguration } from './oauth';
import type { CfnGatewayTarget } from '../../../../aws-bedrockagentcore';
import type { Grant } from '../../../../aws-iam';
import type { IResolvable } from '../../../../core';
import type { IApiKeyCredentialProvider } from '../../identity/api-key-credential-provider';
import type { IOAuth2CredentialProvider } from '../../identity/oauth2-credential-provider';
import type { IGateway } from '../gateway-base';

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
   * Grant the gateway's execution role the permissions needed for outbound authentication.
   * @param gateway The gateway whose role needs outbound auth permissions [disable-awslint:prefer-ref-interface]
   */
  grantNeededPermissionsToRole(gateway: IGateway): Grant | undefined;
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
  public static fromApiKeyIdentityArn(props: ApiKeyCredentialProviderOptions): ICredentialProviderConfig {
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
   * Create an IAM role credential provider.
   *
   * The gateway authenticates outbound requests using its own execution role (SigV4).
   * Provide `service` and optionally `region` to explicitly choose the SigV4 signing
   * service / region instead of relying on the gateway's inference from the target
   * endpoint. Useful for cross-region calls and for targets where the service can't be
   * inferred from the URL. Explicit `service` / `region` is only supported for MCP Server
   * and OpenAPI targets; other target types must use the bare `fromIamRole()`.
   */
  public static fromIamRole(props?: GatewayIamRoleCredentialProviderProps): ICredentialProviderConfig {
    return new GatewayIamRoleCredentialProviderConfig(props);
  }
}
