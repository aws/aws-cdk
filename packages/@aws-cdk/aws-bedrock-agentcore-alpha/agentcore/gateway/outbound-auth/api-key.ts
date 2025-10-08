import { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import { ApiKeyIdentity } from '../../identity/api-key-identity';
import { CredentialProviderType, IGatewayCredentialProvider } from './credential-provider';
import { CfnGatewayTarget } from 'aws-cdk-lib/aws-bedrockagentcore';

/******************************************************************************
 *                                 API KEY
 *****************************************************************************/
/**
 * API Key additional configuration
 */
export interface ApiKeyAdditionalConfiguration {
  /**
   * The location of the API key credential.
   * This field specifies where in the request the API key will be placed.
   */
  readonly credentialLocationType: ApiKeyCredentialLocationType;
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

export enum ApiKeyCredentialLocationType {
  HEADER = 'HEADER',
  QUERY_PARAMETER = 'QUERY_PARAMETER',
}

/**
 * API Key location within the request
 */
export class ApiKeyCredentialLocation {
  public static header(config?: ApiKeyAdditionalConfiguration) {
    const params = {
      credentialLocationType: ApiKeyCredentialLocationType.HEADER,
      credentialParameterName: config?.credentialParameterName ?? 'Authorization',
      credentialPrefix: config?.credentialPrefix ?? 'Bearer ',
    };
    return new ApiKeyCredentialLocation(params);
  }

  public static queryParameter(config?: ApiKeyAdditionalConfiguration) {
    const params = {
      credentialLocationType: ApiKeyCredentialLocationType.QUERY_PARAMETER,
      credentialParameterName: config?.credentialParameterName ?? 'api_key',
      credentialPrefix: config?.credentialPrefix,
    };
    return new ApiKeyCredentialLocation(params);
  }

  public readonly credentialLocationType: ApiKeyCredentialLocationType;
  public readonly credentialParameterName: string;
  public readonly credentialPrefix?: string;

  constructor(config: ApiKeyAdditionalConfiguration) {
    this.credentialLocationType = config.credentialLocationType;
    this.credentialParameterName = config.credentialParameterName!;
    this.credentialPrefix = config.credentialPrefix;
  }
}

/**
 * API Key configuration
 */
export interface ApiKeyCredentialProviderProps {
  /**
   * The API key identity.
   * This identity identifies the API key provider.
   */
  readonly provider: ApiKeyIdentity;

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
 */
export class ApiKeyCredentialProvider implements IGatewayCredentialProvider {
  public readonly credentialProviderType = CredentialProviderType.API_KEY;
  public readonly provider: ApiKeyIdentity;
  public readonly credentialLocation: ApiKeyCredentialLocation;

  constructor(configuration: ApiKeyCredentialProviderProps) {
    this.provider = configuration.provider;
    this.credentialLocation = configuration.credentialLocation ?? ApiKeyCredentialLocation.header();
  }

  render(): CfnGatewayTarget.CredentialProviderConfigurationProperty {
    return {
      credentialProviderType: this.credentialProviderType,
      credentialProvider: {
        apiKeyCredentialProvider: {
          providerArn: this.provider.credentialProviderArn,
          credentialLocation: this.credentialLocation.credentialLocationType,
          credentialParameterName: this.credentialLocation.credentialParameterName,
          credentialPrefix: this.credentialLocation.credentialPrefix,
        },
      },
    };
  }

  grantNeededPermissionsToRole(role: IRole): Grant | undefined {
    return this.provider.grantRead(role);
  }
}
