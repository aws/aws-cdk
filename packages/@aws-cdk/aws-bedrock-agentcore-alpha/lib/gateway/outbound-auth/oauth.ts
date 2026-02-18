import type { IRole } from 'aws-cdk-lib/aws-iam';
import { Grant, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import type { ICredentialProviderConfig } from './credential-provider';
import { CredentialProviderType } from './credential-provider';
import { GATEWAY_OAUTH_PERMS, GATEWAY_WORKLOAD_IDENTITY_PERMS, GATEWAY_SECRETS_PERMS } from '../perms';

/******************************************************************************
 *                                OAuth
 *****************************************************************************/

/**
 * OAuth configuration
 */
export interface OAuthConfiguration {
  /**
   * The OAuth credential provider ARN.
   * This is returned when creating the OAuth credential provider via Console or API.
   * Format: arn:aws:bedrock-agentcore:region:account:token-vault/id/oauth2credentialprovider/name
   * Required: Yes
   */
  readonly providerArn: string;

  /**
   * The ARN of the Secrets Manager secret containing OAuth credentials (client ID and secret).
   * This is returned when creating the OAuth credential provider via Console or API.
   * Format: arn:aws:secretsmanager:region:account:secret:name
   * Required: Yes
   */
  readonly secretArn: string;

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
 * Can be used with OpenAPI targets
 * @internal
 */
export class OAuthCredentialProviderConfiguration implements ICredentialProviderConfig {
  public readonly credentialProviderType = CredentialProviderType.OAUTH;
  /**
   * The ARN of the OAuth provider
   */
  public readonly providerArn: string;
  /**
   * The ARN of the Secrets Manager secret
   */
  public readonly secretArn: string;
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
    this.secretArn = configuration.secretArn;
    this.scopes = configuration.scopes;
    this.customParameters = configuration.customParameters;
  }

  /**
   * Grant the needed permissions to the role for OAuth authentication
   */
  grantNeededPermissionsToRole(role: IRole): Grant | undefined {
    const statements = [
      new PolicyStatement({
        actions: [
          ...GATEWAY_OAUTH_PERMS,
          ...GATEWAY_WORKLOAD_IDENTITY_PERMS,
        ],
        resources: [this.providerArn],
      }),
      new PolicyStatement({
        actions: GATEWAY_SECRETS_PERMS,
        resources: [this.secretArn],
      }),
    ];

    return Grant.addToPrincipal({
      grantee: role,
      actions: statements.flatMap(s => s.actions),
      resourceArns: statements.flatMap(s => s.resources),
    });
  }

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
