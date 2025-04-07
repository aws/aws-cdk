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
import { Grant, IGrantable } from 'aws-cdk-lib/aws-iam';

/** These are the values used by the API when using aws bedrock get-inference-profile --inference-profile-identifier XXXXXXX */
export enum InferenceProfileType {
  /**
   * An inference profile that is created by AWS. These are profiles such as cross-region
   * which help you distributed traffic across a geographic region.
   */
  SYSTEM_DEFINED = 'SYSTEM_DEFINED',
  /**
   * An inference profile that is user-created. These are profiles that help
   * you track costs or metrics.
   */
  APPLICATION = 'APPLICATION',
}

/******************************************************************************
 *                              COMMON
 *****************************************************************************/
/**
 * Represents a ApplicationInferenceProfile, either created with CDK or imported.
 */
export interface IInferenceProfile {
  /**
   * The ARN of the application inference profile.
   */
  readonly inferenceProfileArn: string;
  /**
   * The unique identifier of the inference profile.
   */
  readonly inferenceProfileId: string;
  /**
   * The type of inference profile.
   */
  readonly type: InferenceProfileType;

  /**
   * Grants appropriate permissions to use the inference profile.
   */
  grantProfileUsage(grantee: IGrantable): Grant;
}

/**
 * Abstract base class for a ApplicationInferenceProfile.
 * Contains methods and attributes valid for ApplicationInferenceProfiles either created with CDK or imported.
 */
export abstract class InferenceProfileBase extends Resource implements IInferenceProfile, IResource {
  /**
   * The ARN of the application inference profile.
   */
  public abstract readonly inferenceProfileArn: string;
  /**
   * The unique identifier of the inference profile.
   */
  public abstract readonly inferenceProfileId: string;
  /**
   * The ID or Amazon Resource Name (ARN) of the inference profile.
   */
  public abstract readonly type: InferenceProfileType;

  /**
   * Grants appropriate permissions to use the cross-region inference profile.
   * Does not grant permissions to use the model in the profile.
   */
  grantProfileUsage(grantee: IGrantable): Grant {
    const grant = Grant.addToPrincipal({
      grantee: grantee,
      actions: ['bedrock:GetInferenceProfile', 'bedrock:ListInferenceProfiles'],
      resourceArns: [this.inferenceProfileArn],
      scope: this,
    });
    return grant;
  }
}
