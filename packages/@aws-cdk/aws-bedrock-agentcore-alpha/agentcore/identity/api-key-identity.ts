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
import { IdentityPerms } from './perms';
import { IdentityValidation } from './validation';

/**
 * Represents an API Key Identity, either created with CDK or imported.
 */
export interface IApiKeyIdentity extends IIdentity {
  /**
   * The API key secret ARN.
   */
  readonly apiKeySecretArn: string;
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating an API Key Identity.
 */
export interface ApiKeyIdentityProps extends CommonIdentityProps {
  /**
   * The API key credential provider configuration.
   */
  readonly apiKey: string;
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Properties for importing an API key identity outside of this stack
 */
export interface ApiKeyIdentityAttributes extends CommonIdentityAttributes {
  /**
   * The API key ARN.
   */
  readonly apiKeySecretArn: string;
}

/******************************************************************************
 *                              ABSTRACT CLASS
 *****************************************************************************/
export abstract class ApiKeyIdentityBase extends IdentityBase {
  public abstract readonly apiKeySecretArn: string;
  public abstract readonly credentialProviderArn: string;
  public readonly identityType: IdentityType = IdentityType.API_KEY;
}

/******************************************************************************
 *                        		  CONSTRUCT
 *****************************************************************************/
export class ApiKeyIdentity extends ApiKeyIdentityBase {
  // ------------------------------------------------------
  // Import Methods
  // ------------------------------------------------------
  public static fromApiKeyIdentityAttributes(
    scope: Construct,
    id: string,
    attrs: ApiKeyIdentityAttributes,
  ): IApiKeyIdentity {
    class Import extends ApiKeyIdentityBase {
      public readonly apiKeySecretArn = attrs.apiKeySecretArn;
      public readonly credentialProviderArn = attrs.credentialProviderArn;
      public readonly name = attrs.name;

      public grantRead(grantee: iam.IGrantable): iam.Grant {
        const grant = this.grant(grantee, ...IdentityPerms.API_KEY.READ_PERMS);
        if (this.apiKeySecretArn) {
          grant.combine(
            iam.Grant.addToPrincipal({
              grantee,
              resourceArns: [this.apiKeySecretArn],
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
  public readonly apiKeySecretArn: string;
  public readonly credentialProviderArn: string;
  public readonly name: string;
  public readonly identityType: IdentityType = IdentityType.API_KEY;

  constructor(scope: Construct, id: string, props: ApiKeyIdentityProps) {
    super(scope, id);

    // ------------------------------------------------------
    // Set properties or defaults
    // ------------------------------------------------------
    this.name = props.name;
    IdentityValidation.validateIdentityName(this.name, this.identityType);

    IdentityValidation.validateApiKey(props.apiKey);

    // Create Lambda function for custom resource using NodejsFunction
    const identityHandler = new nodejs.NodejsFunction(this, 'IdentityHandler', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler',
      entry: path.join(__dirname, '../../../../lambda/identity/identity-handler.ts'),
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

    const customResource = new customResources.CustomResource(this, 'Resource', {
      serviceToken: resource,
      properties: {
        name: this.name,
        apiKey: props.apiKey,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.credentialProviderArn = customResource.getAtt('credentialProviderArn').toString();
    this.apiKeySecretArn = customResource.getAtt('apiKeySecretArn').toString();
    this.name = customResource.getAtt('name').toString();
  }

  /**
   * Grant the given principal identity permissions to read this API key identity.
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    const grant = this.grant(grantee, ...IdentityPerms.API_KEY.READ_PERMS);
    if (this.apiKeySecretArn) {
      grant.combine(
        iam.Grant.addToPrincipal({
          grantee,
          resourceArns: [this.apiKeySecretArn],
          actions: IdentityPerms.GET_SECRET_PERMS,
        }),
      );
    }
    return grant;
  }
}
