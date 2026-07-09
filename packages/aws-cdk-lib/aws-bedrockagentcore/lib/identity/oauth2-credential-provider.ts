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

import type { Construct } from 'constructs';
import { buildIdentityResourceArns, grantCredentialSecret, grantReadWithList, TOKEN_VAULT_OAUTH2_PARENT_RESOURCES, WORKLOAD_IDENTITY_USE_RESOURCES } from './grant-helpers';
import { OAuth2CredentialProviderIdentityPerms, TOKEN_VAULT_CREDENTIAL_SECRET_READ_PERMS, TOKEN_VAULT_CREDENTIAL_SECRET_WRITE_PERMS } from './perms';
import {
  throwIfInvalid,
  validateCredentialProviderName,
  validateCredentialProviderTags,
} from './validation-helpers';
import type {
  CfnOAuth2CredentialProviderProps,
  IOAuth2CredentialProviderRef,
  OAuth2CredentialProviderReference,
} from '../../../aws-bedrockagentcore';
import { CfnOAuth2CredentialProvider } from '../../../aws-bedrockagentcore';
import * as iam from '../../../aws-iam';
import type { IResource, ResourceProps, SecretValue } from '../../../core';
import { Lazy, Names, Resource, Token, ValidationError } from '../../../core';
import { lit } from '../../../core/lib/helpers-internal';
import { addConstructMetadata, MethodMetadata } from '../../../core/lib/metadata-resource';
import { propertyInjectable } from '../../../core/lib/prop-injectable';

/******************************************************************************
 *                                 Enums
 *****************************************************************************/

/**
 * Built-in OAuth2 vendors supported by `AWS::BedrockAgentCore::OAuth2CredentialProvider`.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-bedrockagentcore-oauth2credentialprovider.html
 */
export class OAuth2CredentialProviderVendor {
  /** Google OAuth2. */
  public static readonly GOOGLE = new OAuth2CredentialProviderVendor('GoogleOauth2');
  /** GitHub OAuth2. */
  public static readonly GITHUB = new OAuth2CredentialProviderVendor('GithubOauth2');
  /** Slack OAuth2. */
  public static readonly SLACK = new OAuth2CredentialProviderVendor('SlackOauth2');
  /** Salesforce OAuth2. */
  public static readonly SALESFORCE = new OAuth2CredentialProviderVendor('SalesforceOauth2');
  /** Microsoft OAuth2. */
  public static readonly MICROSOFT = new OAuth2CredentialProviderVendor('MicrosoftOauth2');
  /** Custom OAuth2. */
  public static readonly CUSTOM = new OAuth2CredentialProviderVendor('CustomOauth2');
  /** Atlassian OAuth2. */
  public static readonly ATLASSIAN = new OAuth2CredentialProviderVendor('AtlassianOauth2');
  /** LinkedIn OAuth2. */
  public static readonly LINKEDIN = new OAuth2CredentialProviderVendor('LinkedinOauth2');
  /** X (Twitter) OAuth2. */
  public static readonly X = new OAuth2CredentialProviderVendor('XOauth2');
  /** Okta OAuth2. */
  public static readonly OKTA = new OAuth2CredentialProviderVendor('OktaOauth2');
  /** OneLogin OAuth2. */
  public static readonly ONE_LOGIN = new OAuth2CredentialProviderVendor('OneLoginOauth2');
  /** PingOne OAuth2. */
  public static readonly PING_ONE = new OAuth2CredentialProviderVendor('PingOneOauth2');
  /** Facebook OAuth2. */
  public static readonly FACEBOOK = new OAuth2CredentialProviderVendor('FacebookOauth2');
  /** Yandex OAuth2. */
  public static readonly YANDEX = new OAuth2CredentialProviderVendor('YandexOauth2');
  /** Reddit OAuth2. */
  public static readonly REDDIT = new OAuth2CredentialProviderVendor('RedditOauth2');
  /** Zoom OAuth2. */
  public static readonly ZOOM = new OAuth2CredentialProviderVendor('ZoomOauth2');
  /** Twitch OAuth2. */
  public static readonly TWITCH = new OAuth2CredentialProviderVendor('TwitchOauth2');
  /** Spotify OAuth2. */
  public static readonly SPOTIFY = new OAuth2CredentialProviderVendor('SpotifyOauth2');
  /** Dropbox OAuth2. */
  public static readonly DROPBOX = new OAuth2CredentialProviderVendor('DropboxOauth2');
  /** Notion OAuth2. */
  public static readonly NOTION = new OAuth2CredentialProviderVendor('NotionOauth2');
  /** HubSpot OAuth2. */
  public static readonly HUBSPOT = new OAuth2CredentialProviderVendor('HubspotOauth2');
  /** CyberArk OAuth2. */
  public static readonly CYBER_ARK = new OAuth2CredentialProviderVendor('CyberArkOauth2');
  /** FusionAuth OAuth2. */
  public static readonly FUSION_AUTH = new OAuth2CredentialProviderVendor('FusionAuthOauth2');
  /** Auth0 OAuth2. */
  public static readonly AUTH0 = new OAuth2CredentialProviderVendor('Auth0Oauth2');
  /** Amazon Cognito OAuth2. */
  public static readonly COGNITO = new OAuth2CredentialProviderVendor('CognitoOauth2');

  /**
   * Use a custom OAuth2 vendor not yet defined in this class.
   * @param value The vendor string value
   */
  public static of(value: string): OAuth2CredentialProviderVendor {
    return new OAuth2CredentialProviderVendor(value);
  }

  /** The vendor string value. */
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /** Returns the string value. */
  public toString(): string {
    return this.value;
  }
}

/******************************************************************************
 *                                Interface
 *****************************************************************************/

/**
 * An OAuth2 credential provider registered in AgentCore Token Vault.
 */
export interface IOAuth2CredentialProvider extends IResource, iam.IGrantable, IOAuth2CredentialProviderRef {
  /**
   * The ARN of this credential provider.
   * @attribute
   */
  readonly credentialProviderArn: string;

  /**
   * OAuth2 vendor string passed to CloudFormation.
   */
  readonly credentialProviderVendor: string;

  /**
   * Callback URL for the OAuth2 authorization flow.
   * @attribute
   */
  readonly callbackUrl?: string;

  /**
   * The ARN of the Secrets Manager secret for the OAuth2 client credentials.
   *
   * May be undefined for resources imported without this attribute.
   *
   * @attribute
   */
  readonly clientSecretArn?: string;

  /**
   * Timestamp when the credential provider was created.
   * @attribute
   */
  readonly createdTime?: string;

  /**
   * Timestamp when the credential provider was last updated.
   * @attribute
   */
  readonly lastUpdatedTime?: string;

  /**
   * Grants IAM actions to the IAM principal.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant `GetOauth2CredentialProvider` and `ListOauth2CredentialProviders`, scoped to this
   * provider and parent resources required by the Bedrock AgentCore authorization model.
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant control plane permissions to manage this provider.
   */
  grantAdmin(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant permission to retrieve OAuth tokens (`GetResourceOauth2Token`, `CompleteResourceTokenAuth`).
   */
  grantUse(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant read, admin, and token retrieval permissions.
   */
  grantFullAccess(grantee: iam.IGrantable): iam.Grant;

  /**
   * ARNs and OAuth scopes for gateway targets (`GatewayCredentialProvider.fromOauthIdentity` or `fromOauthIdentityArn`).
   */
  bindForGatewayOAuthTarget(scopes: string[], customParameters?: { [key: string]: string }): GatewayOAuth2IdentityBinding;
}

/**
 * Provider ARN, secret ARN, and OAuth scopes for wiring a Token Vault OAuth2 identity into a gateway target.
 */
export interface GatewayOAuth2IdentityBinding {
  /**
   * OAuth2 credential provider ARN.
   */
  readonly providerArn: string;

  /**
   * Secrets Manager secret ARN for OAuth2 client credentials.
   */
  readonly secretArn: string;

  /**
   * OAuth scopes to request when invoking through the gateway.
   */
  readonly scopes: string[];

  /**
   * Optional custom parameters for the OAuth flow.
   *
   * @default - no custom parameters
   */
  readonly customParameters?: { [key: string]: string };
}

/**
 * Shared properties for OAuth2 credential providers created via {@link OAuth2CredentialProvider} factory methods.
 */
export interface OAuth2CredentialProviderBaseProps {
  /**
   * Name of the credential provider.
   *
   * @default a name generated by CDK
   */
  readonly oAuth2CredentialProviderName?: string;

  /**
   * Tags for this credential provider.
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * OAuth2 client identifier and secret registered with the identity provider (all vendors).
 */
export interface OAuth2ClientCredentials {
  /** OAuth2 client identifier. */
  readonly clientId: string;
  /**
   * OAuth2 client secret.
   *
   * **NOTE:** The client secret will be included in the CloudFormation template as part of synthesis.
   * The service stores the secret in Secrets Manager after creation, but the value is visible
   * in the template and deployment history. Use `SecretValue.unsafePlainText()` to explicitly
   * acknowledge plaintext, or pass a reference from another construct to avoid embedding the
   * literal value.
   */
  readonly clientSecret: SecretValue;
}

/**
 * Naming, tags, and client credentials shared by every {@link OAuth2CredentialProvider} factory.
 */
export interface OAuth2CredentialProviderFactoryBaseProps extends OAuth2CredentialProviderBaseProps, OAuth2ClientCredentials {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingSlack}.
 */
export interface SlackOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingGithub}.
 */
export interface GithubOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingGoogle}.
 */
export interface GoogleOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingSalesforce}.
 */
export interface SalesforceOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingMicrosoft}.
 */
export interface MicrosoftOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
  /**
   * Microsoft Entra ID tenant ID.
   *
   * @default - service default tenant resolution
   */
  readonly tenantId?: string;
}

/**
 * Props for {@link OAuth2CredentialProvider.usingAtlassian}.
 */
export interface AtlassianOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingLinkedin}.
 */
export interface LinkedinOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingFacebook}.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-facebook.html
 */
export interface FacebookOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingX}.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-x.html
 */
export interface XOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingYandex}.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-yandex.html
 */
export interface YandexOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingReddit}.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-reddit.html
 */
export interface RedditOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingZoom}.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-zoom.html
 */
export interface ZoomOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingTwitch}.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-twitch.html
 */
export interface TwitchOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingSpotify}.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-spotify.html
 */
export interface SpotifyOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingDropbox}.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-dropbox.html
 */
export interface DropboxOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingNotion}.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-notion.html
 */
export interface NotionOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Props for {@link OAuth2CredentialProvider.usingHubspot}.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-hubspot.html
 */
export interface HubspotOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
}

/**
 * Optional tenant OAuth endpoints for IdPs that use CloudFormation `IncludedOauth2ProviderConfig`
 * with issuer and/or endpoints per the IdP’s outbound documentation.
 */
export interface IncludedOauth2TenantEndpoints {
  /**
   * OAuth2 authorization endpoint for your tenant.
   *
   * @default - not specified; use when your IdP requires an explicit endpoint
   */
  readonly authorizationEndpoint?: string;
  /**
   * Token issuer URL for your tenant (often the IdP base or issuer URI).
   *
   * @default - not specified; use when your IdP requires an explicit issuer
   */
  readonly issuer?: string;
  /**
   * OAuth2 token endpoint for your tenant.
   *
   * @default - not specified; use when your IdP requires an explicit endpoint
   */
  readonly tokenEndpoint?: string;
}

/**
 * Props for `IncludedOauth2ProviderConfig` IdPs whose [outbound documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idps.html)
 * requires `issuer`, `authorizationEndpoint`, and/or `tokenEndpoint` (for example Okta, Auth0, Amazon Cognito, OneLogin,
 * PingOne, CyberArk, FusionAuth).
 */
export interface IncludedOauth2TenantCredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps, IncludedOauth2TenantEndpoints {
}

/**
 * Static OAuth2 authorization server metadata for custom credential providers.
 *
 * @see https://www.rfc-editor.org/rfc/rfc8414
 */
export interface OAuth2AuthorizationServerMetadata {
  /**
   * The authorization endpoint URL.
   */
  readonly authorizationEndpoint: string;

  /**
   * The issuer URL for the OAuth2 authorization server.
   */
  readonly issuer: string;

  /**
   * The token endpoint URL.
   */
  readonly tokenEndpoint: string;

  /**
   * The supported response types.
   *
   * @default - not specified
   */
  readonly responseTypes?: string[];
}

/**
 * Props for {@link OAuth2CredentialProvider.usingCustom}.
 *
 * Set exactly one of {@link discoveryUrl} (OIDC discovery document) or {@link authorizationServerMetadata}
 * (static OAuth2 server metadata). Do not pass both.
 */
export interface CustomOAuth2CredentialProviderProps extends OAuth2CredentialProviderFactoryBaseProps {
  /**
   * OIDC/OAuth2 discovery document URL for dynamic integration with the identity provider.
   *
   * @default - not used when {@link authorizationServerMetadata} is set
   */
  readonly discoveryUrl?: string;
  /**
   * Authorization server metadata (issuer, authorization and token endpoints) when not using a discovery URL.
   *
   * @default - not used when {@link discoveryUrl} is set
   */
  readonly authorizationServerMetadata?: OAuth2AuthorizationServerMetadata;
}

/**
 * Low-level properties when you need full control (prefer {@link OAuth2CredentialProvider.usingSlack} and other factories).
 */
export interface OAuth2CredentialProviderProps {
  /**
   * Name of the credential provider.
   *
   * @default a name generated by CDK
   */
  readonly oAuth2CredentialProviderName?: string;

  /**
   * OAuth2 vendor string for CloudFormation `CredentialProviderVendor`.
   */
  readonly credentialProviderVendor: string;

  /**
   * OAuth2 provider configuration passed through to `Oauth2ProviderConfigInput`.
   */
  readonly oauth2ProviderConfigInput: CfnOAuth2CredentialProvider.Oauth2ProviderConfigInputProperty;

  /**
   * Tags for this credential provider.
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Attributes for importing an existing OAuth2 credential provider.
 */
export interface OAuth2CredentialProviderAttributes {
  /**
   * ARN of the credential provider.
   */
  readonly credentialProviderArn: string;

  /**
   * Vendor string for this provider.
   */
  readonly credentialProviderVendor: string;

  /**
   * ARN of the Secrets Manager secret for OAuth2 client credentials, if known.
   *
   * @default - not set; required for {@link OAuth2CredentialProvider.bindForGatewayOAuthTarget} on imported providers
   */
  readonly clientSecretArn?: string;

  /**
   * Callback URL from the deployed provider, if known.
   *
   * @default - not set
   */
  readonly callbackUrl?: string;

  /**
   * Resource creation time.
   *
   * @default - not set
   */
  readonly createdTime?: string;

  /**
   * Resource last-updated time.
   *
   * @default - not set
   */
  readonly lastUpdatedTime?: string;
}

/**
 * @internal
 */
function oauth2AuthorizationServerMetadataContainsUnresolved(
  meta: OAuth2AuthorizationServerMetadata,
): boolean {
  for (const value of Object.values(meta)) {
    if (typeof value === 'string' && Token.isUnresolved(value)) {
      return true;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string' && Token.isUnresolved(item)) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * @internal
 */
function assertCustomOAuth2DiscoveryXor(scope: Construct, props: CustomOAuth2CredentialProviderProps): void {
  const discoveryUrl = props.discoveryUrl;
  const metadata = props.authorizationServerMetadata;

  const hasDiscoveryUrl = discoveryUrl !== undefined && discoveryUrl !== '';
  const hasMetadata = metadata !== undefined;

  // "Both provided" is always an error, even when values contain Tokens.
  if (hasDiscoveryUrl && hasMetadata) {
    throw new ValidationError(
      lit`CustomOAuth2DiscoveryExclusive`,
      'Provide either discoveryUrl or authorizationServerMetadata for a custom OAuth2 credential provider, not both.',
      scope,
    );
  }

  // Bail out early when either value is a Token — we cannot validate at synth time.
  const discoveryUnresolved = discoveryUrl !== undefined && Token.isUnresolved(discoveryUrl);
  const metadataUnresolved = metadata !== undefined && oauth2AuthorizationServerMetadataContainsUnresolved(metadata);

  if (discoveryUnresolved || metadataUnresolved) {
    return;
  }

  if (!hasDiscoveryUrl && !hasMetadata) {
    throw new ValidationError(
      lit`CustomOAuth2DiscoveryRequired`,
      'Provide either discoveryUrl or authorizationServerMetadata for a custom OAuth2 credential provider.',
      scope,
    );
  }
}

/******************************************************************************
 *                         Abstract base
 *****************************************************************************/

abstract class OAuth2CredentialProviderBase extends Resource implements IOAuth2CredentialProvider {
  public abstract readonly credentialProviderArn: string;
  public abstract readonly credentialProviderVendor: string;
  public abstract readonly callbackUrl?: string;
  public abstract readonly clientSecretArn?: string;
  public abstract readonly createdTime?: string;
  public abstract readonly lastUpdatedTime?: string;
  public readonly grantPrincipal: iam.IPrincipal = new iam.UnknownPrincipal({ resource: this });

  public get oAuth2CredentialProviderRef(): OAuth2CredentialProviderReference {
    return { credentialProviderArn: this.credentialProviderArn };
  }

  constructor(scope: Construct, id: string, props?: ResourceProps) {
    super(scope, id, props);
  }

  /**
   * [disable-awslint:no-grants]
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: buildIdentityResourceArns(this, this.credentialProviderArn, TOKEN_VAULT_OAUTH2_PARENT_RESOURCES),
    });
  }

  /**
   * [disable-awslint:no-grants]
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return grantReadWithList(
      this,
      grantee,
      this.credentialProviderArn,
      OAuth2CredentialProviderIdentityPerms.READ_PERMS,
      OAuth2CredentialProviderIdentityPerms.LIST_PERMS,
      TOKEN_VAULT_OAUTH2_PARENT_RESOURCES,
    );
  }

  /**
   * [disable-awslint:no-grants]
   */
  public grantAdmin(grantee: iam.IGrantable): iam.Grant {
    const bedrock = this.grant(grantee, ...OAuth2CredentialProviderIdentityPerms.ADMIN_PERMS);
    const secret = grantCredentialSecret(
      this,
      grantee,
      this.clientSecretArn,
      [...TOKEN_VAULT_CREDENTIAL_SECRET_WRITE_PERMS],
    );
    return secret ? bedrock.combine(secret) : bedrock;
  }

  /**
   * [disable-awslint:no-grants]
   */
  public grantUse(grantee: iam.IGrantable): iam.Grant {
    const bedrock = iam.Grant.addToPrincipal({
      grantee,
      actions: [...OAuth2CredentialProviderIdentityPerms.USE_PERMS],
      resourceArns: buildIdentityResourceArns(
        this, this.credentialProviderArn, [...TOKEN_VAULT_OAUTH2_PARENT_RESOURCES, ...WORKLOAD_IDENTITY_USE_RESOURCES],
      ),
    });
    const secret = grantCredentialSecret(
      this,
      grantee,
      this.clientSecretArn,
      [...TOKEN_VAULT_CREDENTIAL_SECRET_READ_PERMS],
    );
    return secret ? bedrock.combine(secret) : bedrock;
  }

  /**
   * [disable-awslint:no-grants]
   */
  public grantFullAccess(grantee: iam.IGrantable): iam.Grant {
    const bedrock = iam.Grant.addToPrincipal({
      grantee,
      actions: [...OAuth2CredentialProviderIdentityPerms.FULL_ACCESS_PERMS],
      resourceArns: buildIdentityResourceArns(
        this, this.credentialProviderArn, [...TOKEN_VAULT_OAUTH2_PARENT_RESOURCES, ...WORKLOAD_IDENTITY_USE_RESOURCES],
      ),
    });
    const secret = grantCredentialSecret(
      this,
      grantee,
      this.clientSecretArn,
      [...TOKEN_VAULT_CREDENTIAL_SECRET_READ_PERMS, ...TOKEN_VAULT_CREDENTIAL_SECRET_WRITE_PERMS],
    );
    return secret ? bedrock.combine(secret) : bedrock;
  }

  public abstract bindForGatewayOAuthTarget(
    scopes: string[],
    customParameters?: { [key: string]: string },
  ): GatewayOAuth2IdentityBinding;
}

/**
 * @internal
 */
function newOAuth2WithIncludedClientCredentialsOnly(
  scope: Construct,
  id: string,
  vendor: OAuth2CredentialProviderVendor,
  props: OAuth2CredentialProviderFactoryBaseProps,
): OAuth2CredentialProvider {
  return new OAuth2CredentialProvider(scope, id, {
    oAuth2CredentialProviderName: props.oAuth2CredentialProviderName,
    tags: props.tags,
    credentialProviderVendor: vendor.value,
    oauth2ProviderConfigInput: {
      includedOauth2ProviderConfig: {
        clientId: props.clientId,
        clientSecret: props.clientSecret.unsafeUnwrap(),
      },
    },
  });
}

/**
 * @internal
 */
function newOAuth2WithIncludedTenant(
  scope: Construct,
  id: string,
  vendor: OAuth2CredentialProviderVendor,
  props: IncludedOauth2TenantCredentialProviderProps,
): OAuth2CredentialProvider {
  return new OAuth2CredentialProvider(scope, id, {
    oAuth2CredentialProviderName: props.oAuth2CredentialProviderName,
    tags: props.tags,
    credentialProviderVendor: vendor.value,
    oauth2ProviderConfigInput: {
      includedOauth2ProviderConfig: {
        clientId: props.clientId,
        clientSecret: props.clientSecret.unsafeUnwrap(),
        authorizationEndpoint: props.authorizationEndpoint,
        issuer: props.issuer,
        tokenEndpoint: props.tokenEndpoint,
      },
    },
  });
}

/******************************************************************************
 *                                Class
 *****************************************************************************/

/**
 * L2 construct for `AWS::BedrockAgentCore::OAuth2CredentialProvider`.
 *
 * Prefer the static factories (for example {@link OAuth2CredentialProvider.usingSlack}) so you only pass
 * the OAuth2 settings that apply to that vendor. To attach the identity to a gateway target, use
 * {@link GatewayCredentialProvider.fromOauthIdentity} with this construct, or
 * {@link OAuth2CredentialProvider.bindForGatewayOAuthTarget} with {@link GatewayCredentialProvider.fromOauthIdentityArn}.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-bedrockagentcore-oauth2credentialprovider.html
 * @resource AWS::BedrockAgentCore::OAuth2CredentialProvider
 */
@propertyInjectable
export class OAuth2CredentialProvider extends OAuth2CredentialProviderBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-bedrockagentcore.OAuth2CredentialProvider';

  /**
   * Create a credential provider for Slack OAuth2.
   */
  public static usingSlack(scope: Construct, id: string, props: SlackOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return new OAuth2CredentialProvider(scope, id, {
      oAuth2CredentialProviderName: props.oAuth2CredentialProviderName,
      tags: props.tags,
      credentialProviderVendor: OAuth2CredentialProviderVendor.SLACK.value,
      oauth2ProviderConfigInput: { slackOauth2ProviderConfig: { clientId: props.clientId, clientSecret: props.clientSecret.unsafeUnwrap() } },
    });
  }

  /**
   * Create a credential provider for GitHub OAuth2.
   */
  public static usingGithub(scope: Construct, id: string, props: GithubOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return new OAuth2CredentialProvider(scope, id, {
      oAuth2CredentialProviderName: props.oAuth2CredentialProviderName,
      tags: props.tags,
      credentialProviderVendor: OAuth2CredentialProviderVendor.GITHUB.value,
      oauth2ProviderConfigInput: { githubOauth2ProviderConfig: { clientId: props.clientId, clientSecret: props.clientSecret.unsafeUnwrap() } },
    });
  }

  /**
   * Create a credential provider for Google OAuth2.
   */
  public static usingGoogle(scope: Construct, id: string, props: GoogleOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return new OAuth2CredentialProvider(scope, id, {
      oAuth2CredentialProviderName: props.oAuth2CredentialProviderName,
      tags: props.tags,
      credentialProviderVendor: OAuth2CredentialProviderVendor.GOOGLE.value,
      oauth2ProviderConfigInput: { googleOauth2ProviderConfig: { clientId: props.clientId, clientSecret: props.clientSecret.unsafeUnwrap() } },
    });
  }

  /**
   * Create a credential provider for Salesforce OAuth2.
   */
  public static usingSalesforce(scope: Construct, id: string, props: SalesforceOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return new OAuth2CredentialProvider(scope, id, {
      oAuth2CredentialProviderName: props.oAuth2CredentialProviderName,
      tags: props.tags,
      credentialProviderVendor: OAuth2CredentialProviderVendor.SALESFORCE.value,
      oauth2ProviderConfigInput: { salesforceOauth2ProviderConfig: { clientId: props.clientId, clientSecret: props.clientSecret.unsafeUnwrap() } },
    });
  }

  /**
   * Create a credential provider for Microsoft (Entra ID) OAuth2.
   */
  public static usingMicrosoft(scope: Construct, id: string, props: MicrosoftOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return new OAuth2CredentialProvider(scope, id, {
      oAuth2CredentialProviderName: props.oAuth2CredentialProviderName,
      tags: props.tags,
      credentialProviderVendor: OAuth2CredentialProviderVendor.MICROSOFT.value,
      oauth2ProviderConfigInput: {
        microsoftOauth2ProviderConfig: {
          clientId: props.clientId,
          clientSecret: props.clientSecret.unsafeUnwrap(),
          tenantId: props.tenantId,
        },
      },
    });
  }

  /**
   * Create a credential provider for Atlassian OAuth2.
   */
  public static usingAtlassian(scope: Construct, id: string, props: AtlassianOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return new OAuth2CredentialProvider(scope, id, {
      oAuth2CredentialProviderName: props.oAuth2CredentialProviderName,
      tags: props.tags,
      credentialProviderVendor: OAuth2CredentialProviderVendor.ATLASSIAN.value,
      oauth2ProviderConfigInput: { atlassianOauth2ProviderConfig: { clientId: props.clientId, clientSecret: props.clientSecret.unsafeUnwrap() } },
    });
  }

  /**
   * Create a credential provider for LinkedIn OAuth2.
   */
  public static usingLinkedin(scope: Construct, id: string, props: LinkedinOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return new OAuth2CredentialProvider(scope, id, {
      oAuth2CredentialProviderName: props.oAuth2CredentialProviderName,
      tags: props.tags,
      credentialProviderVendor: OAuth2CredentialProviderVendor.LINKEDIN.value,
      oauth2ProviderConfigInput: { linkedinOauth2ProviderConfig: { clientId: props.clientId, clientSecret: props.clientSecret.unsafeUnwrap() } },
    });
  }

  /**
   * Create a credential provider for Okta OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-okta.html
   */
  public static usingOkta(scope: Construct, id: string, props: IncludedOauth2TenantCredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedTenant(scope, id, OAuth2CredentialProviderVendor.OKTA, props);
  }

  /**
   * Create a credential provider for OneLogin OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-onelogin.html
   */
  public static usingOneLogin(scope: Construct, id: string, props: IncludedOauth2TenantCredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedTenant(scope, id, OAuth2CredentialProviderVendor.ONE_LOGIN, props);
  }

  /**
   * Create a credential provider for PingOne OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-pingidentity.html
   */
  public static usingPingOne(scope: Construct, id: string, props: IncludedOauth2TenantCredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedTenant(scope, id, OAuth2CredentialProviderVendor.PING_ONE, props);
  }

  /**
   * Create a credential provider for X (Twitter) OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-x.html
   */
  public static usingX(scope: Construct, id: string, props: XOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedClientCredentialsOnly(scope, id, OAuth2CredentialProviderVendor.X, props);
  }

  /**
   * Create a credential provider for Facebook OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-facebook.html
   */
  public static usingFacebook(scope: Construct, id: string, props: FacebookOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedClientCredentialsOnly(scope, id, OAuth2CredentialProviderVendor.FACEBOOK, props);
  }

  /**
   * Create a credential provider for Yandex OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-yandex.html
   */
  public static usingYandex(scope: Construct, id: string, props: YandexOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedClientCredentialsOnly(scope, id, OAuth2CredentialProviderVendor.YANDEX, props);
  }

  /**
   * Create a credential provider for Reddit OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-reddit.html
   */
  public static usingReddit(scope: Construct, id: string, props: RedditOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedClientCredentialsOnly(scope, id, OAuth2CredentialProviderVendor.REDDIT, props);
  }

  /**
   * Create a credential provider for Zoom OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-zoom.html
   */
  public static usingZoom(scope: Construct, id: string, props: ZoomOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedClientCredentialsOnly(scope, id, OAuth2CredentialProviderVendor.ZOOM, props);
  }

  /**
   * Create a credential provider for Twitch OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-twitch.html
   */
  public static usingTwitch(scope: Construct, id: string, props: TwitchOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedClientCredentialsOnly(scope, id, OAuth2CredentialProviderVendor.TWITCH, props);
  }

  /**
   * Create a credential provider for Spotify OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-spotify.html
   */
  public static usingSpotify(scope: Construct, id: string, props: SpotifyOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedClientCredentialsOnly(scope, id, OAuth2CredentialProviderVendor.SPOTIFY, props);
  }

  /**
   * Create a credential provider for Dropbox OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-dropbox.html
   */
  public static usingDropbox(scope: Construct, id: string, props: DropboxOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedClientCredentialsOnly(scope, id, OAuth2CredentialProviderVendor.DROPBOX, props);
  }

  /**
   * Create a credential provider for Notion OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-notion.html
   */
  public static usingNotion(scope: Construct, id: string, props: NotionOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedClientCredentialsOnly(scope, id, OAuth2CredentialProviderVendor.NOTION, props);
  }

  /**
   * Create a credential provider for HubSpot OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-hubspot.html
   */
  public static usingHubspot(scope: Construct, id: string, props: HubspotOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedClientCredentialsOnly(scope, id, OAuth2CredentialProviderVendor.HUBSPOT, props);
  }

  /**
   * Create a credential provider for CyberArk OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-cyberark.html
   */
  public static usingCyberArk(scope: Construct, id: string, props: IncludedOauth2TenantCredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedTenant(scope, id, OAuth2CredentialProviderVendor.CYBER_ARK, props);
  }

  /**
   * Create a credential provider for FusionAuth OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-fusionauth.html
   */
  public static usingFusionAuth(scope: Construct, id: string, props: IncludedOauth2TenantCredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedTenant(scope, id, OAuth2CredentialProviderVendor.FUSION_AUTH, props);
  }

  /**
   * Create a credential provider for Auth0 OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-auth0.html
   */
  public static usingAuth0(scope: Construct, id: string, props: IncludedOauth2TenantCredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedTenant(scope, id, OAuth2CredentialProviderVendor.AUTH0, props);
  }

  /**
   * Create a credential provider for Amazon Cognito OAuth2 (`IncludedOauth2ProviderConfig`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-cognito.html
   */
  public static usingCognito(scope: Construct, id: string, props: IncludedOauth2TenantCredentialProviderProps): OAuth2CredentialProvider {
    return newOAuth2WithIncludedTenant(scope, id, OAuth2CredentialProviderVendor.COGNITO, props);
  }

  /**
   * Create a credential provider for a custom OAuth2 authorization server (discovery document or metadata).
   */
  public static usingCustom(scope: Construct, id: string, props: CustomOAuth2CredentialProviderProps): OAuth2CredentialProvider {
    assertCustomOAuth2DiscoveryXor(scope, props);

    const oauthDiscovery: CfnOAuth2CredentialProvider.Oauth2DiscoveryProperty =
      props.discoveryUrl !== undefined
        ? { discoveryUrl: props.discoveryUrl }
        : { authorizationServerMetadata: props.authorizationServerMetadata! };

    return new OAuth2CredentialProvider(scope, id, {
      oAuth2CredentialProviderName: props.oAuth2CredentialProviderName,
      tags: props.tags,
      credentialProviderVendor: OAuth2CredentialProviderVendor.CUSTOM.value,
      oauth2ProviderConfigInput: {
        customOauth2ProviderConfig: {
          clientId: props.clientId,
          clientSecret: props.clientSecret.unsafeUnwrap(),
          oauthDiscovery,
        },
      },
    });
  }

  /**
   * Import an existing OAuth2 credential provider.
   */
  public static fromOAuth2CredentialProviderAttributes(
    scope: Construct,
    id: string,
    attrs: OAuth2CredentialProviderAttributes,
  ): IOAuth2CredentialProvider {
    class Import extends OAuth2CredentialProviderBase {
      public readonly credentialProviderArn = attrs.credentialProviderArn;
      public readonly credentialProviderVendor = attrs.credentialProviderVendor;
      public readonly callbackUrl = attrs.callbackUrl;
      public readonly clientSecretArn = attrs.clientSecretArn;
      public readonly createdTime = attrs.createdTime;
      public readonly lastUpdatedTime = attrs.lastUpdatedTime;

      constructor(s: Construct, i: string) {
        super(s, i);
      }

      public bindForGatewayOAuthTarget(
        scopes: string[],
        customParameters?: { [key: string]: string },
      ): GatewayOAuth2IdentityBinding {
        if (this.clientSecretArn == null || this.clientSecretArn === '') {
          throw new ValidationError(
            lit`MissingOAuth2ClientSecretArn`,
            'clientSecretArn is not available on this OAuth2CredentialProvider (imported providers must pass clientSecretArn in fromOAuth2CredentialProviderAttributes).',
            this,
          );
        }
        return {
          providerArn: this.credentialProviderArn,
          secretArn: this.clientSecretArn,
          scopes,
          customParameters,
        };
      }
    }
    return new Import(scope, id);
  }

  public readonly credentialProviderArn: string;
  public readonly credentialProviderVendor: string;
  /**
   * The name of this OAuth2 credential provider.
   * @attribute
   */
  public readonly oAuth2CredentialProviderName: string;
  public readonly callbackUrl?: string;
  public readonly createdTime?: string;
  public readonly lastUpdatedTime?: string;

  private _clientSecretArn?: string;
  private readonly __resource: CfnOAuth2CredentialProvider;

  public get clientSecretArn(): string | undefined {
    if (this._clientSecretArn === undefined) {
      this._clientSecretArn = Token.asString(this.__resource.attrClientSecretArn);
    }
    return this._clientSecretArn;
  }

  constructor(scope: Construct, id: string, props: OAuth2CredentialProviderProps) {
    super(scope, id, {
      physicalName: props.oAuth2CredentialProviderName
        ?? Lazy.string({ produce: () => Names.uniqueResourceName(this, { maxLength: 128 }) }),
    });

    addConstructMetadata(this, props);

    this.oAuth2CredentialProviderName = this.physicalName;
    this.credentialProviderVendor = props.credentialProviderVendor;

    throwIfInvalid(validateCredentialProviderName, this.oAuth2CredentialProviderName, this);
    throwIfInvalid(validateCredentialProviderTags, props.tags, this);

    const cfnProps: CfnOAuth2CredentialProviderProps = {
      name: this.oAuth2CredentialProviderName,
      credentialProviderVendor: props.credentialProviderVendor,
      oauth2ProviderConfigInput: props.oauth2ProviderConfigInput,
      tags: props.tags && Object.keys(props.tags).length > 0
        ? Object.entries(props.tags).map(([key, value]) => ({ key, value }))
        : undefined,
    };

    this.__resource = new CfnOAuth2CredentialProvider(this, 'Resource', cfnProps);

    this.credentialProviderArn = this.__resource.attrCredentialProviderArn;
    this.callbackUrl = this.__resource.attrCallbackUrl;
    this.createdTime = this.__resource.attrCreatedTime;
    this.lastUpdatedTime = this.__resource.attrLastUpdatedTime;
  }

  /**
   * ARNs and OAuth scopes for {@link GatewayCredentialProvider.fromOauthIdentity} / {@link GatewayCredentialProvider.fromOauthIdentityArn}.
   *
   * @param scopes OAuth scopes the gateway target should request (see vendor documentation).
   * @param customParameters Optional custom parameters for the OAuth flow.
   */
  @MethodMetadata()
  public bindForGatewayOAuthTarget(
    scopes: string[],
    customParameters?: { [key: string]: string },
  ): GatewayOAuth2IdentityBinding {
    const secretArn = this.clientSecretArn;
    if (secretArn == null) {
      throw new ValidationError(
        lit`MissingOAuth2ClientSecretArn`,
        'clientSecretArn is not available — the CloudFormation attribute has not resolved yet.',
        this,
      );
    }
    return {
      providerArn: this.credentialProviderArn,
      secretArn,
      scopes,
      customParameters,
    };
  }
}
