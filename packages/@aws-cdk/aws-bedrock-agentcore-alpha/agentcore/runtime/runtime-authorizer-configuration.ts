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

import { Token } from 'aws-cdk-lib';
import { CfnRuntime } from 'aws-cdk-lib/aws-bedrockagentcore';
import { ValidationError } from './validation-helpers';

/**
 * Abstract base class for runtime authorizer configurations.
 * Provides static factory methods to create different authentication types.
 */
export abstract class RuntimeAuthorizerConfiguration {
  /**
   * Use IAM authentication (default).
   * Requires AWS credentials to sign requests using SigV4.
   *
   * @returns RuntimeAuthorizerConfiguration for IAM authentication
   */
  public static usingIAM(): RuntimeAuthorizerConfiguration {
    return new IamAuthorizerConfiguration();
  }

  /**
   * Use custom JWT authentication.
   * Validates JWT tokens against the specified OIDC provider.
   *
   * @param discoveryUrl The OIDC discovery URL (must end with /.well-known/openid-configuration)
   * @param allowedClients Optional array of allowed client IDs
   * @param allowedAudience Optional array of allowed audiences
   * @returns RuntimeAuthorizerConfiguration for JWT authentication
   */
  public static usingJWT(
    discoveryUrl: string,
    allowedClients?: string[],
    allowedAudience?: string[],
  ): RuntimeAuthorizerConfiguration {
    if (!discoveryUrl.endsWith('/.well-known/openid-configuration')) {
      throw new ValidationError('JWT discovery URL must end with /.well-known/openid-configuration');
    }
    return new JwtAuthorizerConfiguration(discoveryUrl, allowedClients, allowedAudience);
  }

  /**
   * Use AWS Cognito User Pool authentication.
   * Validates Cognito-issued JWT tokens.
   *
   * @param userPoolId The Cognito User Pool ID (e.g., 'us-west-2_ABC123')
   * @param clientId The Cognito App Client ID
   * @param region Optional AWS region where the User Pool is located (defaults to stack region)
   * @param allowedAudience Optional array of allowed audiences
   * @returns RuntimeAuthorizerConfiguration for Cognito authentication
   */
  public static usingCognito(
    userPoolId: string,
    clientId: string,
    region?: string,
    allowedAudience?: string[],
  ): RuntimeAuthorizerConfiguration {
    return new CognitoAuthorizerConfiguration(userPoolId, clientId, region, allowedAudience);
  }

  /**
   * Use OAuth 2.0 authentication.
   * Supports various OAuth providers.
   *
   * @param discoveryUrl The OIDC discovery URL (must end with /.well-known/openid-configuration)
   * @param clientId OAuth client ID
   * @param allowedAudience Optional array of allowed audiences
   * @returns RuntimeAuthorizerConfiguration for OAuth authentication
   */
  public static usingOAuth(
    discoveryUrl: string,
    clientId: string,
    allowedAudience?: string[],
  ): RuntimeAuthorizerConfiguration {
    if (!discoveryUrl.endsWith('/.well-known/openid-configuration')) {
      throw new ValidationError('OAuth discovery URL must end with /.well-known/openid-configuration');
    }
    return new OAuthAuthorizerConfiguration(discoveryUrl, clientId, allowedAudience);
  }

  /**
   * Render the authorizer configuration for CloudFormation
   * @internal
   */
  public abstract _render(): CfnRuntime.AuthorizerConfigurationProperty | undefined;
}

/**
 * IAM authorizer configuration
 */
class IamAuthorizerConfiguration extends RuntimeAuthorizerConfiguration {
  public _render(): undefined {
    // For IAM authentication, return undefined to let AWS service use default
    return undefined;
  }
}

/**
 * JWT authorizer configuration
 */
class JwtAuthorizerConfiguration extends RuntimeAuthorizerConfiguration {
  constructor(
    private readonly discoveryUrl: string,
    private readonly allowedClients?: string[],
    private readonly allowedAudience?: string[],
  ) {
    super();
  }

  public _render(): CfnRuntime.AuthorizerConfigurationProperty {
    return {
      customJwtAuthorizer: {
        discoveryUrl: this.discoveryUrl,
        allowedClients: this.allowedClients,
        allowedAudience: this.allowedAudience,
      },
    };
  }
}

/**
 * Cognito authorizer configuration
 */
class CognitoAuthorizerConfiguration extends RuntimeAuthorizerConfiguration {
  constructor(
    private readonly userPoolId: string,
    private readonly clientId: string,
    private readonly region?: string,
    private readonly allowedAudience?: string[],
  ) {
    super();
  }

  public _render(): CfnRuntime.AuthorizerConfigurationProperty {
    // If region is not provided, use a token that will be resolved to the stack region
    // This will be resolved during synthesis
    const region = this.region ?? Token.asString({ Ref: 'AWS::Region' });
    const discoveryUrl = `https://cognito-idp.${region}.amazonaws.com/${this.userPoolId}/.well-known/openid-configuration`;

    // Use JWT format for Cognito (CloudFormation expects JWT format)
    return {
      customJwtAuthorizer: {
        discoveryUrl: discoveryUrl,
        allowedClients: [this.clientId],
        allowedAudience: this.allowedAudience,
      },
    };
  }
}

/**
 * OAuth authorizer configuration
 */
class OAuthAuthorizerConfiguration extends RuntimeAuthorizerConfiguration {
  constructor(
    private readonly discoveryUrl: string,
    private readonly clientId: string,
    private readonly allowedAudience?: string[],
  ) {
    super();
  }

  public _render(): CfnRuntime.AuthorizerConfigurationProperty {
    // OAuth is also represented as JWT in CloudFormation
    return {
      customJwtAuthorizer: {
        discoveryUrl: this.discoveryUrl,
        allowedClients: [this.clientId],
        allowedAudience: this.allowedAudience,
      },
    };
  }
}
