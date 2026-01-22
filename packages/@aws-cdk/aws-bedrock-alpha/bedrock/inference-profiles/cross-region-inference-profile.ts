import { Arn, ArnFormat, Aws } from 'aws-cdk-lib';
import { Grant, IGrantable } from 'aws-cdk-lib/aws-iam';
import { RegionInfo } from 'aws-cdk-lib/region-info';
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
   * Global cross-region Inference Identifier.
   * Routes requests to any supported commercial AWS Region.
   */
  GLOBAL = 'global',
  /**
   * Cross-region Inference Identifier for the European area.
   * According to the model chosen, this might include:
   * - Frankfurt (`eu-central-1`)
   * - Ireland (`eu-west-1`)
   * - Paris (`eu-west-3`)
   * - London (`eu-west-2`)
   * - Stockholm (`eu-north-1`)
   * - Milan (`eu-south-1`)
   * - Spain (`eu-south-2`)
   * - Zurich (`eu-central-2`)
   */
  EU = 'eu',
  /**
   * Cross-region Inference Identifier for the United States area.
   * According to the model chosen, this might include:
   * - N. Virginia (`us-east-1`)
   * - Ohio (`us-east-2`)
   * - Oregon (`us-west-2`)
   */
  US = 'us',
  /**
   * Cross-region Inference Identifier for the US GovCloud area.
   * According to the model chosen, this might include:
   * - GovCloud US-East (`us-gov-east-1`)
   * - GovCloud US-West (`us-gov-west-1`)
   */
  US_GOV = 'us-gov',
  /**
   * Cross-region Inference Identifier for the Asia-Pacific area.
   * According to the model chosen, this might include:
   * - Tokyo (`ap-northeast-1`)
   * - Seoul (`ap-northeast-2`)
   * - Osaka (`ap-northeast-3`)
   * - Mumbai (`ap-south-1`)
   * - Hyderabad (`ap-south-2`)
   * - Singapore (`ap-southeast-1`)
   * - Sydney (`ap-southeast-2`)
   * - Jakarta (`ap-southeast-3`)
   * - Melbourne (`ap-southeast-4`)
   * - Malaysia (`ap-southeast-5`)
   * - Thailand (`ap-southeast-7`)
   * - Taipei (`ap-east-2`)
   * - Middle East (UAE) (`me-central-1`)
   *
   * **Note**: This geoRegion includes the Middle East (UAE) region (`me-central-1`)
   * in addition to Asia-Pacific regions. Users with data residency requirements
   * should be aware that requests may be routed to the UAE region.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-support.html
   */
  APAC = 'apac',
  /**
   * Cross-region Inference Identifier for the Japan area.
   * According to the model chosen, this might include:
   * - Tokyo (`ap-northeast-1`)
   * - Osaka (`ap-northeast-3`)
   */
  JP = 'jp',
  /**
   * Cross-region Inference Identifier for the Australia area.
   * According to the model chosen, this might include:
   * - Sydney (`ap-southeast-2`)
   * - Melbourne (`ap-southeast-4`)
   */
  AU = 'au',
}

/**
 * Mapping of AWS regions to their corresponding geographic areas for cross-region inference.
 * This mapping is used to determine which cross-region inference profile to use based on the current region in prompt router.
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

  /**
   * The geographic region for this cross-region inference profile.
   */
  private readonly geoRegion: CrossRegionInferenceProfileRegion;

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
    this.geoRegion = props.geoRegion;
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
   * - Use the inference profile itself across all regions in the geoRegion
   *
   * **Important**: This grants permissions across ALL regions within the configured
   * geoRegion. See grantProfileUsage() for details on which regions are included
   * for each geoRegion type.
   * [disable-awslint:no-grants]
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
   * **Important**: This method grants permissions across ALL regions within the
   * configured geoRegion, not just the current deployment region. For example:
   * - US geoRegion: Grants access to us-east-1, us-east-2, us-west-1, us-west-2
   * - EU geoRegion: Grants access to eu-central-1, eu-west-1, eu-west-2, eu-west-3, eu-north-1, etc.
   * - APAC geoRegion: Grants access to ap-* regions and me-central-1 (Middle East UAE)
   * - GLOBAL geoRegion: Grants access to all commercial AWS regions (wildcard)
   *
   * This is required because cross-region inference profiles dynamically route
   * requests to any region within the geoRegion based on availability and demand.
   * Users with strict regional compliance requirements should be aware of this scope.
   *
   * Note: This does not grant permissions to use the underlying model directly.
   * For comprehensive permissions, use grantInvoke() instead.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/geographic-cross-region-inference.html#geographic-cris-iam-setup
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantProfileUsage(grantee: IGrantable): Grant {
    const resourceArns = this.getRegionsForGeoArea().map(region =>
      Arn.format({
        partition: Aws.PARTITION,
        service: 'bedrock',
        account: Aws.ACCOUNT_ID,
        region: region,
        resource: 'inference-profile',
        resourceName: this.inferenceProfileId,
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      }),
    );

    return Grant.addToPrincipal({
      grantee: grantee,
      actions: ['bedrock:GetInferenceProfile', 'bedrock:InvokeModel*'],
      resourceArns: resourceArns,
    });
  }

  /**
   * Returns the list of AWS regions for the configured geographic area.
   * Uses RegionInfo to dynamically determine regions based on the geoRegion prefix.
   *
   * @returns Array of region names for the geoRegion, or ['*'] as fallback for unknown geoRegions
   */
  private getRegionsForGeoArea(): string[] {
    const prefixMappings: Record<CrossRegionInferenceProfileRegion, string[]> = {
      [CrossRegionInferenceProfileRegion.EU]: ['eu-'],
      [CrossRegionInferenceProfileRegion.US]: ['us-'],
      [CrossRegionInferenceProfileRegion.APAC]: ['ap-', 'me-'],
      [CrossRegionInferenceProfileRegion.GLOBAL]: ['*'],
      [CrossRegionInferenceProfileRegion.US_GOV]: ['us-gov-'],
      [CrossRegionInferenceProfileRegion.JP]: ['ap-northeast-1', 'ap-northeast-3'],
      [CrossRegionInferenceProfileRegion.AU]: ['ap-southeast-2', 'ap-southeast-4'],
    };

    const prefixes = prefixMappings[this.geoRegion];
    if (!prefixes) {
      return ['*']; // Fallback to wildcard for unknown geoRegions
    }

    // For GLOBAL geoRegion, return wildcard
    if (this.geoRegion === CrossRegionInferenceProfileRegion.GLOBAL) {
      return ['*'];
    }

    // For JP and AU, the prefixes are exact region names
    if (this.geoRegion === CrossRegionInferenceProfileRegion.JP ||
        this.geoRegion === CrossRegionInferenceProfileRegion.AU) {
      return prefixes;
    }

    // For US_GOV, filter by aws-us-gov partition
    if (this.geoRegion === CrossRegionInferenceProfileRegion.US_GOV) {
      return RegionInfo.regions
        .filter(r => r.partition === 'aws-us-gov')
        .map(r => r.name);
    }

    // For other geoRegions, filter by prefix and standard partition
    return RegionInfo.regions
      .filter(r => r.partition === 'aws') // Standard partition only
      .map(r => r.name)
      .filter(name => prefixes.some(prefix => name.startsWith(prefix)));
  }
}
