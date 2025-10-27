import { IResolvable } from 'aws-cdk-lib';
import { CfnGatewayTarget } from 'aws-cdk-lib/aws-bedrockagentcore';
import { ApiKeyCredentialProviderConfiguration, ApiKeyCredentialProviderProps } from './api-key';
import { GatewayIamRoleCredentialProvider } from './iam-role';
import { OAuthConfiguration, OAuthCredentialProviderConfiguration } from './oauth';
import { Grant, IRole } from 'aws-cdk-lib/aws-iam';

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
export interface ICredentialProvider {
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
   * Grant the role the permissions
   */
  grantNeededPermissionsToRole(role: IRole): Grant | undefined;
}

/**
 * Marker interface for credential providers that can be used with Lambda targets
 * Lambda targets only support IAM role authentication
 */
export interface ILambdaCredentialProvider extends ICredentialProvider {}

/**
 * Marker interface for credential providers that can be used with OpenAPI targets
 * OpenAPI targets support API key and OAuth authentication
 */
export interface IOpenApiCredentialProvider extends ICredentialProvider {}

/**
 * Marker interface for credential providers that can be used with Smithy targets
 * Smithy targets only support IAM role authentication
 */
export interface ISmithyCredentialProvider extends ICredentialProvider {}

/**
 * Interface for IAM role credential providers
 * IAM role providers can be used with both Lambda and Smithy targets
 * This interface is needed for JSII compliance (intersection types can't be used as return types)
 */
export interface IIamRoleCredentialProvider extends ILambdaCredentialProvider, ISmithyCredentialProvider {}

/**
 * Factory class for creating different Gateway Credential Providers
 */
export abstract class GatewayCredentialProvider {
  /**
   * Create an API key credential provider from Identity ARN
   * Use this method when you have the Identity ARN as a string
   * @param props - The configuration properties for the API key credential provider
   * @returns IOpenApiCredentialProvider configured for API key authentication
   */
  public static fromApiKeyIdentityArn(props: ApiKeyCredentialProviderProps): IOpenApiCredentialProvider {
    return new ApiKeyCredentialProviderConfiguration(props);
  }

  /**
   * Create an OAuth credential provider from Identity ARN
   * Use this method when you have the Identity ARN as a string
   * @param props - The configuration properties for the OAuth credential provider
   * @returns IOpenApiCredentialProvider configured for OAuth authentication
   */
  public static fromOauthIdentityArn(props: OAuthConfiguration): IOpenApiCredentialProvider {
    return new OAuthCredentialProviderConfiguration(props);
  }

  /**
   * Create an IAM role credential provider
   * @returns IIamRoleCredentialProvider configured for IAM role authentication
   */
  public static fromIamRole(): IIamRoleCredentialProvider {
    return new GatewayIamRoleCredentialProvider();
  }
}
