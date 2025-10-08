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

import { CfnGateway } from 'aws-cdk-lib/aws-bedrockagentcore';
import { IUserPoolClient, UserPool } from 'aws-cdk-lib/aws-cognito';

/******************************************************************************
 *                                Authorizer Configuration
 *****************************************************************************/

/**
 * Gateway authorizer type
 */
export enum GatewayAuthorizerType {
  CUSTOM_JWT = 'CUSTOM_JWT',
  AWS_IAM = 'AWS_IAM',
}

/**
 * Abstract interface for gateway authorizer configuration
 */
export interface IGatewayAuthorizer {
  /**
   * The authorizer type
   */
  readonly authorizerType: GatewayAuthorizerType;

  /**
   * The authorizer configuration in CFN format
   * @internal
   */
  _render(): CfnGateway.AuthorizerConfigurationProperty | undefined;
}

/******************************************************************************
 *                                  Custom JWT
 *****************************************************************************/
/**
 * Custom JWT authorizer configuration
 */
export interface CustomJwtConfiguration {
  /**
   * This URL is used to fetch OpenID Connect configuration or authorization server metadata
   * for validating incoming tokens.
   *
   * Pattern: .+/\.well-known/openid-configuration
   * Required: Yes
   */
  readonly discoveryUrl: string;

  /**
   * Represents individual audience values that are validated in the incoming JWT token validation process.
   *
   * @default - No audience validation
   */
  readonly allowedAudience?: string[];

  /**
   * Represents individual client IDs that are validated in the incoming JWT token validation process.
   *
   * @default - No client ID validation
   */
  readonly allowedClients?: string[];
}

/**
 * Custom JWT authorizer configuration implementation
 */
export class CustomJwtAuthorizer implements IGatewayAuthorizer {
  public static fromCognito(props: CognitoAuthorizerProps) {
    return new CustomJwtAuthorizer({
      discoveryUrl: `${props.userPool.userPoolProviderUrl}/.well-known/openid-configuration`,
      allowedClients: props.allowedClients?.flatMap((client) => client.userPoolClientId),
      allowedAudience: props.allowedAudiences,
    });
  }

  public readonly authorizerType = GatewayAuthorizerType.CUSTOM_JWT;
  private readonly discoveryUrl: string;
  private readonly allowedAudience?: string[];
  private readonly allowedClients?: string[];

  constructor(config: CustomJwtConfiguration) {
    this.discoveryUrl = config.discoveryUrl;
    this.allowedAudience = config.allowedAudience;
    this.allowedClients = config.allowedClients;
  }

  /**
   * @internal
   */
  _render(): CfnGateway.AuthorizerConfigurationProperty | undefined {
    return {
      customJwtAuthorizer: {
        discoveryUrl: this.discoveryUrl,
        ...(this.allowedAudience && { allowedAudience: this.allowedAudience }),
        ...(this.allowedClients && { allowedClients: this.allowedClients }),
      },
    };
  }
}

/******************************************************************************
 *                               AWS IAM
 *****************************************************************************/

/**
 * Custom JWT authorizer configuration implementation
 */
export class IamAuthorizer implements IGatewayAuthorizer {
  public readonly authorizerType = GatewayAuthorizerType.AWS_IAM;

  /**
   * @internal
   */
  _render(): CfnGateway.AuthorizerConfigurationProperty | undefined {
    return undefined;
  }
}

/******************************************************************************
 *                               Factory
 *****************************************************************************/

export interface CognitoAuthorizerProps {
  readonly userPool: UserPool;
  readonly allowedClients?: IUserPoolClient[];
  readonly allowedAudiences?: string[];
}
export abstract class GatewayAuthorizer {
  public static awsIam = new IamAuthorizer();

  public static customJwt(configuration: CustomJwtConfiguration): IGatewayAuthorizer {
    // At least one of allowedAudience or allowedClients must be defined for CUSTOM_JWT authorizer
    if (!configuration.allowedAudience && !configuration.allowedClients) {
      throw new Error('At least one of allowedAudience or allowedClients must be defined for CUSTOM_JWT authorizer');
    }
    return new CustomJwtAuthorizer(configuration);
  }

  /**
   * Static method for creating a Cognito authorizer
   */
  public static cognito(props: CognitoAuthorizerProps): IGatewayAuthorizer {
    return CustomJwtAuthorizer.fromCognito(props);
  }
}
