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

import { Arn, ArnFormat, Aws } from 'aws-cdk-lib';
import { Grant, IGrantable } from 'aws-cdk-lib/aws-iam';
import { BedrockFoundationModel, IInvokable } from '../models';
import { IInferenceProfile, InferenceProfileType } from './common';

export enum CrossRegionInferenceProfileRegion {
  /**
   * Cross-region Inference Identifier for the European area.
   * According to the model chosen, this might include:
   * - Frankfurt (`eu-central-1`)
   * - Ireland (`eu-west-1`)
   * - Paris (`eu-west-3`)
   */
  EU = 'eu',
  /**
   * Cross-region Inference Identifier for the United States area.
   * According to the model chosen, this might include:
   * - N. Virginia (`us-east-1`)
   * - Oregon (`us-west-2`)
   * - Ohio (`us-east-2`)
   */
  US = 'us',
  /**
   * Cross-region Inference Identifier for the Asia-Pacific area.
   * According to the model chosen, this might include:
   * - Tokyo (`ap-northeast-1`)
   * - Seoul (`ap-northeast-2`)
   * - Mumbai (`ap-south-1`)
   * - Singapore (`ap-southeast-1`)
   * - Sydney (`ap-southeast-2`)
   */
  APAC = 'apac',
}

export const REGION_TO_GEO_AREA: { [key: string]: CrossRegionInferenceProfileRegion } = {
  // US Regions
  'us-east-1': CrossRegionInferenceProfileRegion.US, // N. Virginia
  'us-east-2': CrossRegionInferenceProfileRegion.US, // Ohio
  'us-west-2': CrossRegionInferenceProfileRegion.US, // Oregon

  // EU Regions
  'eu-central-1': CrossRegionInferenceProfileRegion.EU, // Frankfurt
  'eu-west-1': CrossRegionInferenceProfileRegion.EU, // Ireland
  'eu-west-3': CrossRegionInferenceProfileRegion.EU, // Paris

  // APAC Regions
  'ap-northeast-1': CrossRegionInferenceProfileRegion.APAC, // Tokyo
  'ap-northeast-2': CrossRegionInferenceProfileRegion.APAC, // Seoul
  'ap-south-1': CrossRegionInferenceProfileRegion.APAC, // Mumbai
  'ap-southeast-1': CrossRegionInferenceProfileRegion.APAC, // Singapore
  'ap-southeast-2': CrossRegionInferenceProfileRegion.APAC, // Sydney
};

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
export interface CrossRegionInferenceProfileProps {
  /**
   * The geographic region where the traffic is going to be distributed. Routing
   * factors in user traffic, demand and utilization of resources.
   */
  readonly geoRegion: CrossRegionInferenceProfileRegion;
  /**
   * A model supporting cross-region inference.
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference-support.html
   */
  readonly model: BedrockFoundationModel;
}

/******************************************************************************
 *                        NEW CONSTRUCT DEFINITION
 *****************************************************************************/
/**
 * Cross-region inference enables you to seamlessly manage unplanned traffic
 * bursts by utilizing compute across different AWS Regions. With cross-region
 * inference, you can distribute traffic across multiple AWS Regions, enabling
 * higher throughput and enhanced resilience during periods of peak demands.
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html
 */
export class CrossRegionInferenceProfile implements IInvokable, IInferenceProfile {
  public static fromConfig(config: CrossRegionInferenceProfileProps): CrossRegionInferenceProfile {
    return new CrossRegionInferenceProfile(config);
  }
  /**
   * @example 'us.anthropic.claude-3-5-sonnet-20240620-v1:0'
   */
  public readonly inferenceProfileId: string;
  /**
   * @example 'arn:aws:bedrock:us-east-1:123456789012:inference-profile/us.anthropic.claude-3-5-sonnet-20240620-v1:0'
   */
  public readonly inferenceProfileArn: string;
  /**
   * @example InferenceProfileType.SYSTEM_DEFINED
   */
  public readonly type: InferenceProfileType;
  /**
   * The underlying model supporting cross-region inference.
   */
  public readonly inferenceProfileModel: BedrockFoundationModel;
  /** This equals to the inferenceProfileArn property, useful just to implement IInvokable interface*/
  public readonly invokableArn: string;

  private constructor(props: CrossRegionInferenceProfileProps) {
    if (!props.model.supportsCrossRegion) {
      throw new Error(`Model ${props.model.modelId} does not support cross-region inference`);
    }
    this.type = InferenceProfileType.SYSTEM_DEFINED;
    this.inferenceProfileModel = props.model;
    this.inferenceProfileId = `${props.geoRegion}.${props.model.modelId}`;
    this.inferenceProfileArn = Arn.format({
      partition: Aws.PARTITION,
      service: 'bedrock',
      account: Aws.ACCOUNT_ID,
      region: Aws.REGION,
      resource: 'inference-profile',
      resourceName: this.inferenceProfileId,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
    // Needed to Implement IInvokable
    this.invokableArn = this.inferenceProfileArn;
  }

  /**
   * Gives the appropriate policies to invoke and use the Foundation Model.
   */
  public grantInvoke(grantee: IGrantable): Grant {
    // for CRIS, we need to provide permissions to invoke the model in all regions
    // where the inference profile can route requests
    this.inferenceProfileModel.grantInvokeAllRegions(grantee);
    // and we need to provide permissions to invoke the inference profile itself
    return this.grantProfileUsage(grantee);
  }

  /**
   * Grants appropriate permissions to use the cross-region inference profile.
   * Does not grant permissions to use the model in the profile.
   */
  grantProfileUsage(grantee: IGrantable): Grant {
    const grant = Grant.addToPrincipal({
      grantee: grantee,
      actions: ['bedrock:GetInferenceProfile', 'bedrock:InvokeModel*'],
      resourceArns: [this.inferenceProfileArn],
    });
    return grant;
  }
}
