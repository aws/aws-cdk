/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

export enum OAuthProviderType {
  // ----------------- DEFAULT OAuth --------------------------------
  // Default OAuth providers are partially pre-configured.
  // You only need to specify a client ID and a secret for these pre-defined providers
  GOOGLE_OAUTH2 = 'GoogleOauth2',
  GITHUB_OAUTH2 = 'GithubOauth2',
  SLACK_OAUTH2 = 'SlackOauth2',
  SALESFORCE_OAUTH2 = 'SalesforceOauth2',
  MICROSOFT_OAUTH2 = 'MicrosoftOauth2',
  // LinkedIn missing from API
  // ----------------- Custom OAuth --------------------------------
  // Custom OAuth providers use either a Discovery URL (automatically fetch configuration details)
  // or you manually specify the server metadata
  CUSTOM_OAUTH2 = 'CustomOauth2',
}

/**
 * OAuth2 Authorization Server Metadata interface for when you need to configure
 * a custom OAuth2 provider and you do not use the Discovery URL, but rather specify
 * all details manually.
 */
export interface Oauth2AuthorizationServerMetadata {
  /**
   * The authorization endpoint URL for the OAuth2 authorization server.
   *
   * @example "https://auth.example.com/oauth2/identity"
   */
  readonly authorizationEndpoint: string;

  /**
   * The token endpoint URL for the OAuth2 authorization server.
   * @example "https://auth.example.com/oauth2/token"
   */
  readonly tokenEndpoint: string;

  /**
   * The issuer URL for the OAuth2 authorization server.
   * @example "https://auth.example.com"
   */
  readonly issuer: string;

  /**
   * The OAuth 2.0 response types supported by the authorization server.
   * @example ["code", "token"]
   */
  readonly responseTypes?: string[];
}

/**
 * OAuth2 Discovery interface for for when you need to configure a custom OAuth2
 * provider and you want clients to dynamically discover using the Discovery URL.
 */
export interface Oauth2Discovery {
  /**
   * The authorization server metadata for the OAuth2 provider.
   */
  readonly authorizationServerMetadata?: Oauth2AuthorizationServerMetadata;

  /**
   * The discovery URL for the OAuth2 provider.
   * @example "https://accounts.example.com/.well-known/openid-configuration"
   */
  readonly discoveryUrl?: string;
}

/**
 * Base interface for OAuth2 provider configuration.
 */
export interface BaseOauth2ProviderConfig {
  /**
   * The client ID for the OAuth2 provider.
   */
  readonly clientId: string;

  /**
   * The client secret for the OAuth2 provider.
   */
  readonly clientSecret: string;
}

/**
 * Custom OAuth2 provider configuration interface.
 */
export interface CustomOauth2ProviderConfig extends BaseOauth2ProviderConfig {
  /**
   * The OAuth2 discovery information for the custom provider.
   */
  readonly oauthDiscovery: Oauth2Discovery;
}

/**
 * Abstract base class for all OAuth provider types.
 */
export abstract class OAuthProviderConfig {
  /**
   * The string value of the OAuth provider type.
   */
  public readonly value: string;
  public readonly clientId: string;
  public readonly clientSecret: string;

  /**
   * Constructor for OAuth provider type.
   */
  protected constructor(value: string, config: BaseOauth2ProviderConfig) {
    this.value = value;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
  }

  /**
   * Returns the string representation of the OAuth provider type.
   * @returns The string value of the OAuth provider type.
   */
  toString(): string {
    return this.value;
  }
}

/**
 * Google OAuth2 provider.
 */
export class GoogleOauth2Config extends OAuthProviderConfig {
  constructor(config: BaseOauth2ProviderConfig) {
    super(OAuthProviderType.GOOGLE_OAUTH2, config);
  }
}

/**
 * GitHub OAuth2 provider.
 */
export class GithubOauth2Config extends OAuthProviderConfig {
  constructor(config: BaseOauth2ProviderConfig) {
    super(OAuthProviderType.GITHUB_OAUTH2, config);
  }
}

/**
 * Slack OAuth2 provider.
 */
export class SlackOauth2Config extends OAuthProviderConfig {
  constructor(config: BaseOauth2ProviderConfig) {
    super(OAuthProviderType.SLACK_OAUTH2, config);
  }
}

/**
 * Salesforce OAuth2 provider.
 */
export class SalesforceOauth2Config extends OAuthProviderConfig {
  constructor(config: BaseOauth2ProviderConfig) {
    super(OAuthProviderType.SALESFORCE_OAUTH2, config);
  }
}

/**
 * Microsoft OAuth2 provider.
 */
export class MicrosoftOauth2Config extends OAuthProviderConfig {
  constructor(config: BaseOauth2ProviderConfig) {
    super(OAuthProviderType.MICROSOFT_OAUTH2, config);
  }
}

/**
 * Custom OAuth2 provider.
 */
export class CustomOauth2Config extends OAuthProviderConfig {
  public readonly oauthDiscovery: Oauth2Discovery;

  constructor(config: CustomOauth2ProviderConfig) {
    super(OAuthProviderType.CUSTOM_OAUTH2, config);
    this.oauthDiscovery = config.oauthDiscovery;
  }
}
