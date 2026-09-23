import type { ICredentialProviderConfig } from './credential-provider';
import { CredentialProviderType } from './credential-provider';
import { Grant } from '../../../../aws-iam';
import { Annotations, ArnFormat, Stack, Token } from '../../../../core';
import type { IGateway } from '../gateway-base';
import { GATEWAY_OAUTH_PERMS, GATEWAY_OAUTH_COMPLETE_AUTH_PERMS, GATEWAY_WORKLOAD_IDENTITY_OAUTH_PERMS, GATEWAY_SECRETS_PERMS } from '../perms';

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
   * Grant the needed permissions to the gateway role for OAuth authentication.
   *
   * Produces four scoped IAM statements matching the console-generated policy:
   * 1. `GetWorkloadAccessToken[ForJWT|ForUserId]` on the workload identity directory ARNs
   * 2. `CompleteResourceTokenAuth` on the token vault, credential provider, directory, and identity ARNs
   * 3. `GetResourceOauth2Token` on the token vault, credential provider, directory, and identity ARNs
   * 4. `secretsmanager:GetSecretValue` on the specific credential secret ARN
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-outbound-auth.html
   */
  grantNeededPermissionsToRole(gateway: IGateway): Grant | undefined {
    const stack = Stack.of(gateway);
    const directoryArn = stack.formatArn({
      service: 'bedrock-agentcore',
      resource: 'workload-identity-directory',
      resourceName: 'default',
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
    const identityWildcardArn = `${directoryArn}/workload-identity/${gateway.gatewayName}-*`;
    const tokenVaultArn = stack.formatArn({
      service: 'bedrock-agentcore',
      resource: 'token-vault',
      resourceName: 'default',
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
    const credentialAndIdentityArns = [tokenVaultArn, this.providerArn, directoryArn, identityWildcardArn];

    const workloadIdentityGrant = Grant.addToPrincipal({
      grantee: gateway.role,
      actions: [...GATEWAY_WORKLOAD_IDENTITY_OAUTH_PERMS],
      resourceArns: [directoryArn, identityWildcardArn],
    });
    const completeAuthGrant = Grant.addToPrincipal({
      grantee: gateway.role,
      actions: [...GATEWAY_OAUTH_COMPLETE_AUTH_PERMS],
      resourceArns: credentialAndIdentityArns,
    });
    const oauthGrant = Grant.addToPrincipal({
      grantee: gateway.role,
      actions: [...GATEWAY_OAUTH_PERMS],
      resourceArns: credentialAndIdentityArns,
    });
    // The CFN attribute ClientSecretArn is an object { SecretArn: string }, not a
    // plain string, so the Token resolves to an object which cannot be placed in
    // IAM Resource fields. When the caller supplies a literal ARN string (e.g. via
    // fromOauthIdentityArn) we can scope tightly; otherwise fall back to a
    // service-managed prefix wildcard.
    let secretResourceArns: string[];
    if (Token.isUnresolved(this.secretArn)) {
      Annotations.of(gateway).addWarningV2(
        'aws-cdk-lib.aws-bedrockagentcore:wildcardSecretArnGrant',
        'The secret ARN is an unresolved token. Granting access using a wildcard prefix (bedrock-agentcore-identity!*). ' +
        'To scope the grant to a specific secret, supply a literal secret ARN via fromOauthIdentityArn.',
      );
      secretResourceArns = [stack.formatArn({
        service: 'secretsmanager',
        resource: 'secret',
        resourceName: 'bedrock-agentcore-identity!*',
        arnFormat: ArnFormat.COLON_RESOURCE_NAME,
      })];
    } else {
      secretResourceArns = [this.secretArn];
    }
    const secretGrant = Grant.addToPrincipal({
      grantee: gateway.role,
      actions: [...GATEWAY_SECRETS_PERMS],
      resourceArns: secretResourceArns,
    });
    return workloadIdentityGrant.combine(completeAuthGrant).combine(oauthGrant).combine(secretGrant);
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
