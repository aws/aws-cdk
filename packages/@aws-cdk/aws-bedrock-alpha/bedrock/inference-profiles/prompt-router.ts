import { Arn, ArnFormat, Aws } from 'aws-cdk-lib';
import { IGrantable, Grant } from 'aws-cdk-lib/aws-iam';
import { BedrockFoundationModel, IBedrockInvokable } from '../models';
import {
  CrossRegionInferenceProfile,
  REGION_TO_GEO_AREA,
} from './cross-region-inference-profile';

/**
 * Represents a Prompt Router, which provides intelligent routing between different models.
 */
export interface IPromptRouter {
  /**
   * The ARN of the prompt router.
   * @attribute
   */
  readonly promptRouterArn: string;

  /**
   * The ID of the prompt router.
   * @attribute
   */
  readonly promptRouterId: string;

  /**
   * The foundation models / profiles this router will route to.
   */
  readonly routingEndpoints: IBedrockInvokable[];
}

/**
 * Properties for configuring a Prompt Router.
 */
export interface PromptRouterProps {
  /**
   * Prompt Router ID that identifies the routing configuration.
   */
  readonly promptRouterId: string;

  /**
   * The foundation models this router will route to.
   * The router will intelligently select between these models based on the request.
   */
  readonly routingModels: BedrockFoundationModel[];
}

/**
 * Represents identifiers for default prompt routers in Bedrock.
 * These are pre-configured routers provided by AWS that route between
 * different models in the same family for optimal performance and cost.
 */
export class DefaultPromptRouterIdentifier {
  /**
   * Anthropic Claude V1 router configuration.
   * Routes between Claude Haiku and Claude 3.5 Sonnet models for optimal
   * balance between performance and cost.
   */
  public static readonly ANTHROPIC_CLAUDE_V1 = new DefaultPromptRouterIdentifier({
    promptRouterId: 'anthropic.claude:1',
    routingModels: [
      BedrockFoundationModel.ANTHROPIC_CLAUDE_HAIKU_V1_0,
      BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
    ],
  });

  /**
   * Meta Llama 3.1 router configuration.
   * Routes between different sizes of Llama 3.1 models (8B and 70B)
   * for optimal performance based on request complexity.
   */
  public static readonly META_LLAMA_3_1 = new DefaultPromptRouterIdentifier({
    promptRouterId: 'meta.llama:1',
    routingModels: [
      BedrockFoundationModel.META_LLAMA_3_1_8B_INSTRUCT_V1,
      BedrockFoundationModel.META_LLAMA_3_1_70B_INSTRUCT_V1,
    ],
  });

  /**
   * The unique identifier for this prompt router.
   */
  public readonly promptRouterId: string;

  /**
   * The foundation models that this router can route between.
   */
  public readonly routingModels: BedrockFoundationModel[];

  private constructor(props: PromptRouterProps) {
    this.promptRouterId = props.promptRouterId;
    this.routingModels = props.routingModels;
  }
}

/**
 * Amazon Bedrock intelligent prompt routing provides a single serverless endpoint
 * for efficiently routing requests between different foundational models within
 * the same model family. It can help you optimize for response quality and cost.
 *
 * Intelligent prompt routing predicts the performance of each model for each request,
 * and dynamically routes each request to the model that it predicts is most likely
 * to give the desired response at the lowest cost.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-routing.html
 */
export class PromptRouter implements IBedrockInvokable, IPromptRouter {
  /**
   * Creates a PromptRouter from a default router identifier.
   *
   * @param defaultRouter - The default router configuration to use
   * @param region - The AWS region where the router will be used
   * @returns A new PromptRouter instance configured with the default settings
   */
  public static fromDefaultId(defaultRouter: DefaultPromptRouterIdentifier, region: string): PromptRouter {
    return new PromptRouter(defaultRouter, region);
  }

  /**
   * The ARN of the prompt router.
   * @attribute
   */
  public readonly promptRouterArn: string;

  /**
   * The ID of the prompt router.
   * @attribute
   */
  public readonly promptRouterId: string;

  /**
   * The ARN used for invoking this prompt router.
   * This equals to the promptRouterArn property, useful for implementing IBedrockInvokable interface.
   */
  public readonly invokableArn: string;

  /**
   * The inference endpoints (cross-region profiles) that this router will route to.
   * These are created automatically based on the routing models and region.
   */
  public readonly routingEndpoints: IBedrockInvokable[];

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

    // Needed to implement IBedrockInvokable
    this.invokableArn = this.promptRouterArn;

    // Build inference profiles from routing endpoints
    // Each routing model is wrapped in a cross-region inference profile
    // to enable routing across regions for better availability
    this.routingEndpoints = props.routingModels.flatMap(model => {
      const geoRegion = REGION_TO_GEO_AREA[region];
      if (geoRegion) {
        return CrossRegionInferenceProfile.fromConfig({
          model: model,
          geoRegion: geoRegion,
        });
      } else {
        // For unknown regions, fall back to using the model directly
        return model;
      }
    });
  }

  /**
   * Grants the necessary permissions to invoke this prompt router and all its routing endpoints.
   * This method grants permissions to:
   * - Get prompt router details (bedrock:GetPromptRouter)
   * - Invoke models through the router (bedrock:InvokeModel)
   * - Use all underlying models and cross-region profiles
   *
   * @param grantee - The IAM principal to grant permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantInvoke(grantee: IGrantable): Grant {
    // Grant invoke permissions on every model endpoint of the router
    this.routingEndpoints.forEach(model => {
      model.grantInvoke(grantee);
    });

    // Grant invoke permissions to the prompt router itself
    return Grant.addToPrincipal({
      grantee,
      actions: ['bedrock:GetPromptRouter', 'bedrock:InvokeModel'],
      resourceArns: [this.promptRouterArn],
    });
  }
}
