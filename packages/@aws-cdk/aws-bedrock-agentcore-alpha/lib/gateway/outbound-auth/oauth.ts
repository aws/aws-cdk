import { ArnFormat, Stack } from 'aws-cdk-lib';
import { Grant } from 'aws-cdk-lib/aws-iam';
import type { ICredentialProviderConfig } from './credential-provider';
import { CredentialProviderType } from './credential-provider';
import type { IGateway } from '../gateway-base';
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
   * Grant the needed permissions to the gateway role for OAuth authentication.
   *
   * Produces three scoped IAM statements:
   * 1. `GetWorkloadAccessToken` on the workload identity directory ARNs
   * 2. `GetResourceOauth2Token` on the credential provider ARN
   * 3. Secrets Manager read on all secrets in the account (the L1 `ClientSecretArn` attribute
   *    is an object, not a string, so CloudFormation cannot resolve it as an IAM resource ARN)
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
    const identityWildcardArn = `${directoryArn}/workload-identity/${gateway.name}-*`;

    const workloadIdentityGrant = Grant.addToPrincipal({
      grantee: gateway.role,
      actions: [...GATEWAY_WORKLOAD_IDENTITY_PERMS],
      resourceArns: [directoryArn, identityWildcardArn],
      scope: gateway,
    });
    const oauthGrant = Grant.addToPrincipal({
      grantee: gateway.role,
      actions: [...GATEWAY_OAUTH_PERMS],
      resourceArns: [this.providerArn],
      scope: gateway,
    });
    // The CFN attribute `ClientSecretArn` is typed as an object `{ SecretArn: string }`.
    // CloudFormation `Fn::GetAtt` cannot extract the nested string, so we use a wildcard.
    const secretWildcardArn = stack.formatArn({
      service: 'secretsmanager',
      resource: 'secret',
      resourceName: '*',
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
    const secretGrant = Grant.addToPrincipal({
      grantee: gateway.role,
      actions: [...GATEWAY_SECRETS_PERMS],
      resourceArns: [secretWildcardArn],
      scope: gateway,
    });
    return workloadIdentityGrant.combine(oauthGrant).combine(secretGrant);
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
