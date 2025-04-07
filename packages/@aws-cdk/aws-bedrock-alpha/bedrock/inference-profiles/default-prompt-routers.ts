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
import { IGrantable, Grant } from 'aws-cdk-lib/aws-iam';
import {
  CrossRegionInferenceProfile,
  REGION_TO_GEO_AREA,
} from './cross-region-inference-profile';
import { BedrockFoundationModel, IInvokable } from './../models';

export interface IPromptRouter {
  /**
   * The ARN of the prompt router.
   */
  readonly promptRouterArn: string;
  /**
   * The Id of the prompt router.
   */
  readonly promptRouterId: string;
  /**
   * The foundation models / profiles this router will route to.
   */
  readonly routingEndpoints: IInvokable[];
}

export interface PromptRouterProps {
  /**
   * Prompt Router Id
   */
  readonly promptRouterId: string;
  /**
   * The foundation models this router will route to.
   */
  readonly routingModels: BedrockFoundationModel[];
}

/**
 * Represents identifiers for default prompt routers in Bedrock
 */
export class DefaultPromptRouterIdentifier {
  /**
   * Anthropic Claude V1 router configuration
   */
  public static readonly ANTHROPIC_CLAUDE_V1 = new DefaultPromptRouterIdentifier({
    promptRouterId: 'anthropic.claude:1',
    routingModels: [
      BedrockFoundationModel.ANTHROPIC_CLAUDE_HAIKU_V1_0,
      BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
    ],
  });

  /**
   * Meta Llama 3.1 router configuration
   */
  public static readonly META_LLAMA_3_1 = new DefaultPromptRouterIdentifier({
    promptRouterId: 'meta.llama:1',
    routingModels: [
      BedrockFoundationModel.META_LLAMA_3_1_8B_INSTRUCT_V1,
      BedrockFoundationModel.META_LLAMA_3_1_70B_INSTRUCT_V1,
    ],
  });

  public readonly promptRouterId: string;
  public readonly routingModels: BedrockFoundationModel[];
  private constructor(props: PromptRouterProps) {
    (this.promptRouterId = props.promptRouterId), (this.routingModels = props.routingModels);
  }
}

export class PromptRouter implements IInvokable, IPromptRouter {
  public static fromDefaultId(defaultRouter: DefaultPromptRouterIdentifier, region: string) {
    return new PromptRouter(defaultRouter, region);
  }
  public readonly promptRouterArn: string;
  public readonly promptRouterId: string;
  public readonly invokableArn: string;
  public readonly routingEndpoints: IInvokable[];

  constructor(props: PromptRouterProps, region: string) {
    this.promptRouterId = props.promptRouterId;
    this.promptRouterArn = Arn.format({
      partition: Aws.PARTITION,
      service: 'bedrock',
      region: region,
      account: Aws.ACCOUNT_ID,
      resource: 'default-prompt-router',
      resourceName: this.promptRouterId,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
    // needed to implement IInvokable
    this.invokableArn = this.promptRouterArn;

    // build inference profiles from routing endpoints
    this.routingEndpoints = props.routingModels.flatMap(model => {
      return CrossRegionInferenceProfile.fromConfig({
        model: model,
        geoRegion: REGION_TO_GEO_AREA[region],
      });
    });
  }

  grantInvoke(grantee: IGrantable): Grant {
    // Grant invoke on every model of the router
    this.routingEndpoints.forEach(model => {
      model.grantInvoke(grantee);
    });
    // Grant invoke to the prompt router
    return Grant.addToPrincipal({
      grantee,
      actions: ['bedrock:GetPromptRouter', 'bedrock:InvokeModel'],
      resourceArns: [this.promptRouterArn],
    });
  }
}
