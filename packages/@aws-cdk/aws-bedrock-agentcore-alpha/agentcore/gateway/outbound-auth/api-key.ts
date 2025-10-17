import { CredentialProviderType, ICredentialProvider } from './credential-provider';

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
   * The arn of the API key identity provider.
   */
  readonly providerArn: string;

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
export class ApiKeyCredentialProviderConfiguration implements ICredentialProvider {
  public readonly credentialProviderType = CredentialProviderType.API_KEY;
  /**
   * The ARN of the API key provider
   */
  public readonly providerArn: string;
  /**
   * The location configuration for the API key credential
   */
  public readonly credentialLocation: ApiKeyCredentialLocation;

  constructor(configuration: ApiKeyCredentialProviderProps) {
    this.providerArn = configuration.providerArn;
    this.credentialLocation = configuration.credentialLocation ?? ApiKeyCredentialLocation.header();
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

  // Set this permission explicitly
  // grantNeededPermissionsToRole(role: IRole): Grant | undefined {
  //   return this.provider.grantRead(role);
  // }
}
