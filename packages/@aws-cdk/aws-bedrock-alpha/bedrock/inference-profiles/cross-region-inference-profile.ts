import { Arn, ArnFormat, Aws } from 'aws-cdk-lib';
import { Grant, IGrantable } from 'aws-cdk-lib/aws-iam';
import { BedrockFoundationModel, IBedrockInvokable } from '../models';
import { IInferenceProfile, InferenceProfileType } from './inference-profile';

/**
 * Error thrown when cross-region inference profile validation fails.
 */
class CrossRegionInferenceProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CrossRegionInferenceProfileError';
  }
}

/**
 * Geographic regions supported for cross-region inference profiles.
 * These regions help distribute traffic across multiple AWS regions for better
 * throughput and resilience during peak demands.
 */
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

/**
 * Mapping of AWS regions to their corresponding geographic areas for cross-region inference.
 * This mapping is used to determine which cross-region inference profile to use based on the current region.
 */
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
/**
 * Properties for creating a Cross-Region Inference Profile.
 */
export interface CrossRegionInferenceProfileProps {
  /**
   * The geographic region where the traffic is going to be distributed. Routing
   * factors in user traffic, demand and utilization of resources.
   */
  readonly geoRegion: CrossRegionInferenceProfileRegion;
  /**
   * A foundation model supporting cross-region inference.
   * The model must have cross-region support enabled.
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
 *
 * This construct represents a system-defined inference profile that routes
 * requests across multiple regions based on availability and demand.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html
 */
export class CrossRegionInferenceProfile implements IBedrockInvokable, IInferenceProfile {
  /**
   * Creates a Cross-Region Inference Profile from the provided configuration.
   *
   * @param config - Configuration for the cross-region inference profile
   * @returns A new CrossRegionInferenceProfile instance
   * @throws ValidationError if the model doesn't support cross-region inference
   */
  public static fromConfig(config: CrossRegionInferenceProfileProps): CrossRegionInferenceProfile {
    return new CrossRegionInferenceProfile(config);
  }

  /**
   * The unique identifier of the inference profile.
   * Format: {geoRegion}.{modelId}
   */
  public readonly inferenceProfileId: string;

  /**
   * The ARN of the inference profile.
   * @attribute
   */
  public readonly inferenceProfileArn: string;

  /**
   * The type of inference profile. Always SYSTEM_DEFINED for cross-region profiles.
   */
  public readonly type: InferenceProfileType;

  /**
   * The underlying foundation model supporting cross-region inference.
   */
  public readonly inferenceProfileModel: BedrockFoundationModel;

  /**
   * The ARN used for invoking this inference profile.
   * This equals to the inferenceProfileArn property, useful for implementing IBedrockInvokable interface.
   */
  public readonly invokableArn: string;

  private constructor(props: CrossRegionInferenceProfileProps) {
    // Validate required properties
    if (!props.geoRegion) {
      throw new CrossRegionInferenceProfileError('geoRegion is required');
    }

    if (!props.model) {
      throw new CrossRegionInferenceProfileError('model is required');
    }

    // Validate that the model supports cross-region inference
    if (!props.model.supportsCrossRegion) {
      throw new CrossRegionInferenceProfileError(`Model ${props.model.modelId} does not support cross-region inference`);
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
    this.invokableArn = this.inferenceProfileArn;
  }

  /**
   * Gives the appropriate policies to invoke and use the Foundation Model.
   * For cross-region inference profiles, this method grants permissions to:
   * - Invoke the model in all regions where the inference profile can route requests
   * - Use the inference profile itself
   *
   * @param grantee - The IAM principal to grant permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantInvoke(grantee: IGrantable): Grant {
    // For cross-region inference profiles, we need to provide permissions to invoke the model in all regions
    // where the inference profile can route requests
    this.inferenceProfileModel.grantInvokeAllRegions(grantee);

    // And we need to provide permissions to invoke the inference profile itself
    return this.grantProfileUsage(grantee);
  }

  /**
   * Grants appropriate permissions to use the cross-region inference profile.
   * This method adds the necessary IAM permissions to allow the grantee to:
   * - Get inference profile details (bedrock:GetInferenceProfile)
   * - Invoke the model through the inference profile (bedrock:InvokeModel*)
   *
   * Note: This does not grant permissions to use the underlying model directly.
   * For comprehensive permissions, use grantInvoke() instead.
   *
   * @param grantee - The IAM principal to grant permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantProfileUsage(grantee: IGrantable): Grant {
    return Grant.addToPrincipal({
      grantee: grantee,
      actions: ['bedrock:GetInferenceProfile', 'bedrock:InvokeModel*'],
      resourceArns: [this.inferenceProfileArn],
    });
  }
}
