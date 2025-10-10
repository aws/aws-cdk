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

import { IResource, Resource } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

/**
 * The type of identity
 */
export enum IdentityType {
  /**
   * The identity type is an OAuth provider.
   */
  OAUTH = 'OAUTH',

  /**
   * The identity type is an API key.
   */
  API_KEY = 'API_KEY',
}

export interface IIdentity extends IResource {
  /**
   * The identity type.
   */
  readonly identityType: IdentityType;
  /**
   * Grant the given principal identity permissions to perform actions on this identity.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant the given principal identity permissions to read this identity.
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;
}

/******************************************************************************
 *                       COMMON PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Common properties for creating any type of new Knowledge Base.
 */
export interface CommonIdentityProps {
  /**
   * The name of the identity.
   */
  readonly name: string;
}

/******************************************************************************
 *                          COMMON ATTRS FOR IMPORTS
 *****************************************************************************/

export interface CommonIdentityAttributes {
  /**
   * The ARN of the identity.
   */
  readonly credentialProviderArn: string; // also called credential provider ARN
  /**
   * The name of the identity.
   */
  readonly name: string;
}

/******************************************************************************
 *                              ABSTRACT CLASS
 *****************************************************************************/
/**
 * Abstract class for all identity types.
 */
export abstract class IdentityBase extends Resource implements IIdentity {
  public abstract readonly identityType: IdentityType;
  public abstract readonly name: string;
  public abstract readonly credentialProviderArn: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      resourceArns: [this.credentialProviderArn],
      actions,
    });
  }

  /**
   * Grant the given principal identity permissions to read this identity.
   * Must be implemented by concrete identity classes.
   */
  public abstract grantRead(grantee: iam.IGrantable): iam.Grant;
}

/******************************************************************************
 *                              COMMON METHODS
 *****************************************************************************/
