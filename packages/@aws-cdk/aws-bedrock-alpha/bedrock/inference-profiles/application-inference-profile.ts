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

import { CfnTag, Arn, ArnFormat } from 'aws-cdk-lib';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { Grant, IGrantable } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { IInferenceProfile, InferenceProfileBase, InferenceProfileType } from './common';
import { IInvokable } from '../models';

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a ApplicationInferenceProfile.
 */
export interface ApplicationInferenceProfileProps {
  /**
   * Description of the inference profile.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-bedrock-applicationinferenceprofile.html#cfn-bedrock-applicationinferenceprofile-description
   */
  readonly description?: string;
  /**
   * The name of the inference profile.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-bedrock-applicationinferenceprofile.html#cfn-bedrock-applicationinferenceprofile-inferenceprofilename
   */
  readonly inferenceProfileName: string;
  /**
   * To create an application inference profile for one Region, specify a foundation model.
   * Usage and costs for requests made to that Region with that model will be tracked.
   *
   * To create an application inference profile for multiple Regions,
   * specify a cross region (system-defined) inference profile.
   * The inference profile will route requests to the Regions defined in
   * the cross region (system-defined) inference profile that you choose.
   * Usage and costs for requests made to the Regions in the inference profile will be tracked.
   */
  readonly modelSource: IInvokable;
  /**
   * A list of tags associated with the inference profile.
   * */
  readonly tags?: CfnTag[];
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
export interface ApplicationInferenceProfileAttributes {
  /**
   * The ARN of the application inference profile.
   */
  readonly inferenceProfileArn: string;
  /**
   * The ID or Amazon Resource Name (ARN) of the inference profile.
   */
  readonly inferenceProfileIdentifier: string;
}

/******************************************************************************
 *                        NEW CONSTRUCT DEFINITION
 *****************************************************************************/
/**
 * Class to create a ApplicationInferenceProfile with CDK.
 * These are inference profiles created by users (user defined).
 * This helps to track costs and model usage.
 * @resource AWS::Bedrock::ApplicationInferenceProfile
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-create.html
 */
export class ApplicationInferenceProfile extends InferenceProfileBase implements IInvokable {
  /**
   * Import a ApplicationInferenceProfile given its attributes
   */
  public static fromApplicationInferenceProfileAttributes(
    scope: Construct,
    id: string,
    attrs: ApplicationInferenceProfileAttributes,
  ): IInferenceProfile {
    class Import extends InferenceProfileBase {
      public readonly inferenceProfileArn = attrs.inferenceProfileArn;
      public readonly inferenceProfileId = Arn.split(attrs.inferenceProfileArn, ArnFormat.SLASH_RESOURCE_NAME)
        .resourceName!;
      public readonly type = InferenceProfileType.APPLICATION;
    }

    return new Import(scope, id);
  }
  /**
   * Import a low-level L1 Cfn ApplicationInferenceProfile
   */
  public static fromCfnApplicationInferenceProfile(
    CfnApplicationInferenceProfile: bedrock.CfnApplicationInferenceProfile,
  ): IInferenceProfile {
    return new (class extends InferenceProfileBase {
      public readonly inferenceProfileArn = CfnApplicationInferenceProfile.attrInferenceProfileArn;
      public readonly inferenceProfileId = CfnApplicationInferenceProfile.attrInferenceProfileId;
      public readonly type = InferenceProfileType.APPLICATION;
    })(CfnApplicationInferenceProfile, '@FromCfnApplicationInferenceProfile');
  }
  /**
   * The name of the application inference profile.
   */
  public readonly inferenceProfileName: string;
  /**
   * The ARN of the application application inference profile.
   */
  public readonly inferenceProfileArn: string;
  /**
   * The unique identifier of the application inference profile.
   */
  public readonly inferenceProfileId: string;
  /**
   * The underlying model/cross-region model used by the application inference profile.
   */
  public readonly inferenceProfileModel: IInvokable;
  /**
   * The status of the application inference profile. ACTIVE means that the inference profile is ready to be used.
   */
  public readonly status: string;
  /**
   * The type of the inference profile. The following types are possible:
   * SYSTEM_DEFINED – The inference profile is defined by Amazon Bedrock.
   * You can route inference requests across regions with these inference profiles.
   * APPLICATION – The inference profile was created by a user.
   * This type of inference profile can track metrics and costs when invoking the model in it.
   * The inference profile may route requests to one or multiple regions.
   */
  public readonly type: InferenceProfileType;
  /**
   * Time Stamp for ApplicationInferenceProfile creation.
   */
  public readonly createdAt: string;
  /**
   * Time Stamp for ApplicationInferenceProfile update.
   */
  public readonly updatedAt: string;
  /**
   * This equals to the inferenceProfileArn property, useful just to implement IInvokable interface.
   */
  public readonly invokableArn: string;
  /**
   * Instance of CfnApplicationInferenceProfile.
   */
  private readonly _resource: bedrock.CfnApplicationInferenceProfile;

  constructor(scope: Construct, id: string, props: ApplicationInferenceProfileProps) {
    super(scope, id);

    this.inferenceProfileModel = props.modelSource;
    this.inferenceProfileName = props.inferenceProfileName;
    this.type = InferenceProfileType.APPLICATION;

    // L1 instantiation
    this._resource = new bedrock.CfnApplicationInferenceProfile(this, id, {
      description: props.description,
      inferenceProfileName: props.inferenceProfileName,
      modelSource: {
        copyFrom: props.modelSource.invokableArn,
      },
      tags: props.tags,
    });

    // build attributes
    this.inferenceProfileArn = this._resource.attrInferenceProfileArn;
    this.inferenceProfileId = this._resource.attrInferenceProfileId;
    this.status = this._resource.attrStatus;
    this.type = this._resource.attrType as InferenceProfileType;
    this.createdAt = this._resource.attrCreatedAt;
    this.updatedAt = this._resource.attrUpdatedAt;

    // Needed to Implement IInvokable
    this.invokableArn = this.inferenceProfileArn;
  }

  /**
   * Gives the appropriate policies to invoke and use the application inference profile.
   */
  public grantInvoke(grantee: IGrantable): Grant {
    // This method ensures the appropriate permissions are given
    // to use either the inference profile or the vanilla FM
    this.inferenceProfileModel.grantInvoke(grantee);

    // plus we add permissions to now invoke the application inference profile itself.

    return this.grantProfileUsage(grantee);
  }

  /**
   * Grants appropriate permissions to use the application inference profile (AIP).
   * Does not grant permissions to use the model/cross-region profile in the AIP.
   */
  grantProfileUsage(grantee: IGrantable): Grant {
    const grant = Grant.addToPrincipal({
      grantee: grantee,
      actions: ['bedrock:GetInferenceProfile', 'bedrock:InvokeModel'],
      resourceArns: [this.inferenceProfileArn],
    });
    return grant;
  }
}
