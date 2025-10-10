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

import * as path from 'path';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import * as customResources from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { IdentityType, IdentityBase, CommonIdentityProps, CommonIdentityAttributes, IIdentity } from './identity';
import { CustomOauth2Config, OAuthProviderConfig, OAuthProviderType } from './oauth-provider';
import { IdentityPerms } from './perms';
import { IdentityValidation } from './validation';

/**
 * Represents an OAuth Identity, either created with CDK or imported.
 */
export interface IOAuthIdentity extends IIdentity {
  /**
   * The Amazon Resource Name (ARN) of the client secret in AWS Secrets Manager.
   */
  readonly clientSecretArn: string;
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating an OAuth Identity.
 */
export interface OAuthIdentityProps extends CommonIdentityProps {
  /**
   * The OAuth provider configuration.
   */
  readonly oauthProvider: OAuthProviderConfig;
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Properties for importing an API key identity outside of this stack
 */
export interface OAuthIdentityAttributes extends CommonIdentityAttributes {
  /**
   * The Amazon Resource Name (ARN) of the client secret in AWS Secrets Manager.
   */
  readonly clientSecretArn: string;
}

/******************************************************************************
 *                              ABSTRACT CLASS
 *****************************************************************************/
export abstract class OAuthIdentityBase extends IdentityBase {
  public abstract readonly clientSecretArn: string;
  public abstract readonly credentialProviderArn: string;
  public readonly identityType: IdentityType = IdentityType.OAUTH;
}

/******************************************************************************
 *                        		  CONSTRUCT
 *****************************************************************************/
export class OAuthIdentity extends OAuthIdentityBase {
  // ------------------------------------------------------
  // Import Methods
  // ------------------------------------------------------
  public static fromOAuthIdentityAttributes(
    scope: Construct,
    id: string,
    attrs: OAuthIdentityAttributes,
  ): IOAuthIdentity {
    class Import extends OAuthIdentityBase {
      public readonly clientSecretArn = attrs.clientSecretArn;
      public readonly credentialProviderArn = attrs.credentialProviderArn;
      public readonly name = attrs.name;

      public grantRead(grantee: iam.IGrantable): iam.Grant {
        const grant = this.grant(grantee, ...IdentityPerms.OAUTH.READ_PERMS);
        if (this.clientSecretArn) {
          grant.combine(
            iam.Grant.addToPrincipal({
              grantee,
              resourceArns: [this.clientSecretArn],
              actions: IdentityPerms.GET_SECRET_PERMS,
            }),
          );
        }
        return grant;
      }
    }

    return new Import(scope, id);
  }

  // ------------------------------------------------------
  // Attributes
  // ------------------------------------------------------
  public readonly clientSecretArn: string;
  public readonly credentialProviderArn: string;
  public readonly name: string;
  public readonly identityType: IdentityType = IdentityType.OAUTH;

  constructor(scope: Construct, id: string, props: OAuthIdentityProps) {
    super(scope, id);

    // ------------------------------------------------------
    // Set properties or defaults
    // ------------------------------------------------------
    this.name = props.name;
    IdentityValidation.validateIdentityName(this.name, this.identityType);

    this.validateOAuthProvider(props.oauthProvider);

    // Create Lambda function for custom resource using NodejsFunction
    const identityHandler = new nodejs.NodejsFunction(this, 'IdentityHandler', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler',
      entry: path.join(__dirname, '../../../../lambda/identity/oauth-handler.ts'),
      timeout: Duration.minutes(5),
      bundling: {
        bundleAwsSDK: true,
      },
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['bedrock-agentcore:*'],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: [
            'secretsmanager:CreateSecret',
            'secretsmanager:DeleteSecret',
            'secretsmanager:GetSecretValue',
            'secretsmanager:PutSecretValue',
            'secretsmanager:UpdateSecret',
            'secretsmanager:TagResource',
            'secretsmanager:UntagResource',
          ],
          resources: ['arn:aws:secretsmanager:*:*:secret:bedrock-agentcore*', 'arn:aws:secretsmanager:*:*:secret:*'],
        }),
        new iam.PolicyStatement({
          actions: ['kms:Decrypt', 'kms:DescribeKey', 'kms:GenerateDataKey'],
          resources: ['*'],
          conditions: {
            StringEquals: {
              'aws:ResourceAccount': '${aws:PrincipalAccount}',
            },
          },
        }),
        new iam.PolicyStatement({
          actions: [
            'iam:GetRole',
            'iam:GetRolePolicy',
            'iam:ListAttachedRolePolicies',
            'iam:ListRolePolicies',
            'iam:ListRoles',
          ],
          resources: ['arn:aws:iam::*:role/*'],
        }),
      ],
    });

    // Create custom resource
    const resource = new cr.Provider(this, 'IdentityProvider', {
      onEventHandler: identityHandler,
    }).serviceToken;

    // Prepare properties for custom resource
    const customResourceProps: any = {
      name: this.name,
      credentialProviderVendor: props.oauthProvider.value,
      clientId: props.oauthProvider.clientId,
      clientSecret: props.oauthProvider.clientSecret,
    };

    // Add OAuth discovery for custom OAuth2 provider
    if (props.oauthProvider.value === OAuthProviderType.CUSTOM_OAUTH2) {
      const customProvider = props.oauthProvider as CustomOauth2Config;
      customResourceProps.oauthDiscovery = customProvider.oauthDiscovery;
    }

    const customResource = new customResources.CustomResource(this, 'Resource', {
      serviceToken: resource,
      properties: customResourceProps,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.credentialProviderArn = customResource.getAtt('credentialProviderArn').toString();
    this.clientSecretArn = customResource.getAtt('clientSecretArn').toString();
    this.name = customResource.getAtt('name').toString();
  }

  /**
   * Validates the OAuth provider format
   * @param oauthProvider The OAuth provider to validate
   * @throws Error if the OAuth provider is invalid
   */
  private validateOAuthProvider(oauthProvider: OAuthProviderConfig): void {
    if (!oauthProvider) {
      throw new Error('OAuth provider cannot be empty');
    }

    IdentityValidation.validateClientId(oauthProvider.clientId);
    IdentityValidation.validateClientSecret(oauthProvider.clientSecret);

    if (oauthProvider.value === OAuthProviderType.CUSTOM_OAUTH2) {
      const customProvider = oauthProvider as CustomOauth2Config;

      // Check if oauthDiscovery exists and has content
      if (!customProvider.oauthDiscovery) {
        throw new Error('OAuth provider discovery configuration cannot be empty');
      }

      // If discoveryUrl is provided, validate its pattern.
      if (customProvider.oauthDiscovery.discoveryUrl !== undefined) {
        const discoveryUrl = customProvider.oauthDiscovery.discoveryUrl;
        if (discoveryUrl === null || discoveryUrl.trim() === '') {
          throw new Error('OAuth provider discovery URL cannot be empty');
        }

        const pattern = /.+\/\.well-known\/openid-configuration/;
        if (!pattern.test(discoveryUrl)) {
          throw new Error(`OAuth provider discovery URL must follow the pattern: ${pattern.source}`);
        }
      } else if (!customProvider.oauthDiscovery.authorizationServerMetadata) {
        // If discoveryUrl is not provided, and authorizationServerMetadata is also not provided,
        // then the custom OAuth2 provider configuration is incomplete, as one of them is required.
        throw new Error(
          'Custom OAuth2 provider configuration must include either a discovery URL or authorization server metadata.',
        );
      }
    }
  }

  /**
   * Grant the given principal identity permissions to read this OAuth identity.
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    const grant = this.grant(grantee, ...IdentityPerms.OAUTH.READ_PERMS);
    if (this.clientSecretArn) {
      grant.combine(
        iam.Grant.addToPrincipal({
          grantee,
          resourceArns: [this.clientSecretArn],
          actions: IdentityPerms.GET_SECRET_PERMS,
        }),
      );
    }
    return grant;
  }
}
