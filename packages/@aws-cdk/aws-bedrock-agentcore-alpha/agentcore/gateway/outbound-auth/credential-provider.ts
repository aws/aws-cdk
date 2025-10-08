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

import { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import { OAuthConfiguration, OAuthCredentialProvider } from './oauth';
import { ApiKeyCredentialProvider, ApiKeyCredentialProviderProps } from './api-key';
import { GatewayIamRoleCredentialProvider } from './iam-role';
import { CfnGatewayTarget } from 'aws-cdk-lib/aws-bedrockagentcore';

/******************************************************************************
 *                                 Enums
 *****************************************************************************/
/**
 * Credential provider types supported by gateway target
 */
export enum CredentialProviderType {
  /**
   * Gateway IAM role credential provider.
   * This uses the Gateway's execution role to
   * authenticate with AWS services.
   */
  GATEWAY_IAM_ROLE = 'GATEWAY_IAM_ROLE',

  /**
   * OAuth credential provider
   */
  OAUTH = 'OAUTH',

  /**
   * API Key credential provider
   */
  API_KEY = 'API_KEY',
}

/******************************************************************************
 *                       Credential Provider
 *****************************************************************************/

/**
 * Abstract interface for gateway credential provider configuration
 */
export interface IGatewayCredentialProvider {
  /**
   * The credential provider type
   */
  readonly credentialProviderType: CredentialProviderType;

  /**
   * Renders as CFN Property
   */
  render(): CfnGatewayTarget.CredentialProviderConfigurationProperty;

  /**
   * Grant the role the permissions
   */
  grantNeededPermissionsToRole(role: IRole): Grant | undefined;
}

/**
 * Factory class for creating different Gateway Credential Providers
 */
export abstract class GatewayCredentialProvider {
  public static oauth(props: OAuthConfiguration): OAuthCredentialProvider {
    return new OAuthCredentialProvider(props);
  }

  public static apiKey(props: ApiKeyCredentialProviderProps): ApiKeyCredentialProvider {
    return new ApiKeyCredentialProvider(props);
  }

  public static iamRole(): GatewayIamRoleCredentialProvider {
    return new GatewayIamRoleCredentialProvider();
  }
}
