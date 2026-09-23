import type { ICredentialProviderConfig } from './credential-provider';
import { CredentialProviderType } from './credential-provider';
import { Grant } from '../../../../aws-iam';
import { Annotations, ArnFormat, Stack, Token } from '../../../../core';
import type { IGateway } from '../gateway-base';
import { GATEWAY_API_KEY_PERMS, GATEWAY_WORKLOAD_IDENTITY_PERMS, GATEWAY_SECRETS_PERMS } from '../perms';

/******************************************************************************
 *                                 API KEY
 *****************************************************************************/
/**
 * API Key additional configuration
 */
export interface ApiKeyAdditionalConfiguration {

  /**
   * The name of the credential parameter for the API key.
   * This parameter name is used when sending the API key to the target endpoint.
   *
   * Length Constraints: Minimum length of 1. Maximum length of 64.
   * @default - 'Authorization' for HEADER, 'api_key' for QUERY_PARAMETER
   */
  readonly credentialParameterName?: string;

  /**
   * The prefix for the API key credential.
   * This prefix is added to the API key when sending it to the target endpoint.
   *
   * Length Constraints: Minimum length of 1. Maximum length of 64.
   * @default - 'Bearer ' for HEADER, no prefix for QUERY_PARAMETER
   */
  readonly credentialPrefix?: string;
}

/**
 * API Key credential location type
 * @internal
 */
export enum ApiKeyCredentialLocationType {
  HEADER = 'HEADER',
  QUERY_PARAMETER = 'QUERY_PARAMETER',
}

/**
 * API Key location within the request
 */
export class ApiKeyCredentialLocation {
  /**
   * Create a header-based API key credential location
   * @param config - Optional configuration for the credential location
   * @returns ApiKeyCredentialLocation configured for header placement
   */
  public static header(config?: ApiKeyAdditionalConfiguration) {
    return new ApiKeyCredentialLocation(
      ApiKeyCredentialLocationType.HEADER,
      config?.credentialParameterName ?? 'Authorization',
      config?.credentialPrefix ?? 'Bearer ',
    );
  }

  /**
   * Create a query parameter-based API key credential location
   * @param config - Optional configuration for the credential location
   * @returns ApiKeyCredentialLocation configured for query parameter placement
   */
  public static queryParameter(config?: ApiKeyAdditionalConfiguration) {
    return new ApiKeyCredentialLocation(
      ApiKeyCredentialLocationType.QUERY_PARAMETER,
      config?.credentialParameterName ?? 'api_key',
      config?.credentialPrefix,
    );
  }

  /**
   * The name of the credential parameter
   */
  public readonly credentialParameterName: string;
  /**
   * The prefix for the credential value
   */
  public readonly credentialPrefix?: string;
  /**
   * The type of credential location (HEADER or QUERY_PARAMETER)
   */
  public readonly credentialLocationType: string;

  private constructor(
    credentialLocationType: string,
    credentialParameterName: string,
    credentialPrefix?: string,
  ) {
    this.credentialLocationType = credentialLocationType;
    this.credentialParameterName = credentialParameterName;
    this.credentialPrefix = credentialPrefix;
  }
}

/**
 * API key credential provider ARNs for gateway outbound auth (Token Vault identity).
 *
 * Pass this to {@link GatewayCredentialProvider.fromApiKeyIdentityArn} or to {@link ApiKeyCredentialProviderConfiguration}.
 */
export interface ApiKeyCredentialProviderOptions {
  /**
   * The API key credential provider ARN.
   * This is returned when creating the API key credential provider via Console or API.
   * Format: arn:aws:bedrock-agentcore:region:account:token-vault/id/apikeycredentialprovider/name
   */
  readonly providerArn: string;

  /**
   * The ARN of the Secrets Manager secret containing the API key.
   * This is returned when creating the API key credential provider via Console or API.
   * Format: arn:aws:secretsmanager:region:account:secret:name
   */
  readonly secretArn: string;

  /**
   * The location of the API key credential.
   * This field specifies where in the request the API key should be placed.
   *
   * @default - HEADER
   */
  readonly credentialLocation?: ApiKeyCredentialLocation;
}

/**
 * API Key credential provider configuration implementation
 * Can be used with OpenAPI targets
 * @internal
 */
export class ApiKeyCredentialProviderConfiguration implements ICredentialProviderConfig {
  public readonly credentialProviderType = CredentialProviderType.API_KEY;
  /**
   * The ARN of the API key provider
   */
  public readonly providerArn: string;
  /**
   * The ARN of the Secrets Manager secret
   */
  public readonly secretArn: string;
  /**
   * The location configuration for the API key credential
   */
  public readonly credentialLocation: ApiKeyCredentialLocation;

  constructor(configuration: ApiKeyCredentialProviderOptions) {
    this.providerArn = configuration.providerArn;
    this.secretArn = configuration.secretArn;
    this.credentialLocation = configuration.credentialLocation ?? ApiKeyCredentialLocation.header();
  }

  /**
   * Grant the needed permissions to the gateway role for API key authentication.
   *
   * Produces three scoped IAM statements matching the console-generated policy:
   * 1. `GetWorkloadAccessToken` on the workload identity directory ARNs
   * 2. `GetResourceApiKey` on the token vault, credential provider, directory, and identity ARNs
   * 3. `secretsmanager:GetSecretValue` on the specific credential secret ARN
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

    const workloadIdentityGrant = Grant.addToPrincipal({
      grantee: gateway.role,
      actions: [...GATEWAY_WORKLOAD_IDENTITY_PERMS],
      resourceArns: [directoryArn, identityWildcardArn],
    });
    const apiKeyGrant = Grant.addToPrincipal({
      grantee: gateway.role,
      actions: [...GATEWAY_API_KEY_PERMS],
      resourceArns: [tokenVaultArn, this.providerArn, directoryArn, identityWildcardArn],
    });
    // The CFN attribute ApiKeySecretArn is an object { SecretArn: string }, not a
    // plain string, so the Token resolves to an object which cannot be placed in
    // IAM Resource fields. When the caller supplies a literal ARN string (e.g. via
    // fromApiKeyIdentityArn) we can scope tightly; otherwise fall back to a
    // service-managed prefix wildcard.
    let secretResourceArns: string[];
    if (Token.isUnresolved(this.secretArn)) {
      Annotations.of(gateway).addWarningV2(
        'aws-cdk-lib.aws-bedrockagentcore:wildcardSecretArnGrant',
        'The secret ARN is an unresolved token. Granting access using a wildcard prefix (bedrock-agentcore-identity!*). ' +
        'To scope the grant to a specific secret, supply a literal secret ARN via fromApiKeyIdentityArn.',
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
    return workloadIdentityGrant.combine(apiKeyGrant).combine(secretGrant);
  }

  /**
   * @internal
   */
  _render(): any {
    return {
      credentialProviderType: this.credentialProviderType,
      credentialProvider: {
        apiKeyCredentialProvider: {
          providerArn: this.providerArn,
          credentialLocation: this.credentialLocation.credentialLocationType,
          credentialParameterName: this.credentialLocation.credentialParameterName,
          credentialPrefix: this.credentialLocation.credentialPrefix,
        },
      },
    };
  }
}
