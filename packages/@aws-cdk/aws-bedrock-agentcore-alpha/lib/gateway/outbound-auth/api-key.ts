import type { IRole } from 'aws-cdk-lib/aws-iam';
import { Grant, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import type { ICredentialProviderConfig } from './credential-provider';
import { CredentialProviderType } from './credential-provider';
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
 * API Key configuration
 */
export interface ApiKeyCredentialProviderProps {
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

  constructor(configuration: ApiKeyCredentialProviderProps) {
    this.providerArn = configuration.providerArn;
    this.secretArn = configuration.secretArn;
    this.credentialLocation = configuration.credentialLocation ?? ApiKeyCredentialLocation.header();
  }

  /**
   * Grant the needed permissions to the role for API key authentication
   */
  grantNeededPermissionsToRole(role: IRole): Grant | undefined {
    const statements = [
      new PolicyStatement({
        actions: [
          ...GATEWAY_API_KEY_PERMS,
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
