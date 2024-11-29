import { FoundationModelIdentifier } from './foundation-model';
import { Grant, IGrantable } from '../../aws-iam';
import { ArnFormat, Aws, Arn, Token } from '../../core';

/**
 * The profile identifiers for the Bedrock cross region inference profiles.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference-support.html
 */
export class CrossRegionInferenceProfileIdentifier {
  /** Cross region inference profile identifier "us.anthropic.claude-3-haiku-20240307-v1:0". */
  public static readonly US_ANTHROPIC_CLAUDE_3_HAIKU_20240307_V1_0 =
  new CrossRegionInferenceProfileIdentifier(
    'us.anthropic.claude-3-haiku-20240307-v1:0',
  );

  /** Cross region inference profile identifier "us.anthropic.claude-3-opus-20240229-v1:0". */
  public static readonly US_ANTHROPIC_CLAUDE_3_OPUS_20240229_V1_0 =
  new CrossRegionInferenceProfileIdentifier(
    'us.anthropic.claude-3-opus-20240229-v1:0',
  );

  /** Cross region inference profile identifier "us.anthropic.claude-3-sonnet-20240229-v1:0". */
  public static readonly US_ANTHROPIC_CLAUDE_3_SONNET_20240229_V1_0 =
  new CrossRegionInferenceProfileIdentifier(
    'us.anthropic.claude-3-sonnet-20240229-v1:0',
  );

  /** Cross region inference profile identifier "us.anthropic.claude-3-5-sonnet-20240620-v1:0". */
  public static readonly US_ANTHROPIC_CLAUDE_3_5_SONNET_20240620_V1_0 =
  new CrossRegionInferenceProfileIdentifier(
    'us.anthropic.claude-3-5-sonnet-20240620-v1:0',
  );

  /** Cross region inference profile identifier "us.meta.llama3-2-11b-instruct-v1:0". */
  public static readonly US_META_LLAMA_3_2_11B_INSTRUCT_V1_0 =
  new CrossRegionInferenceProfileIdentifier(
    'us.meta.llama3-2-11b-instruct-v1:0',
  );

  /** Cross region inference profile identifier "us.meta.llama3-2-90b-instruct-v1:0". */
  public static readonly US_META_LLAMA_3_2_90B_INSTRUCT_V1_0 =
  new CrossRegionInferenceProfileIdentifier(
    'us.meta.llama3-2-90b-instruct-v1:0',
  );

  /** Cross region inference profile identifier "us.meta.llama3-2-3b-instruct-v1:0". */
  public static readonly US_META_LLAMA_3_2_3B_INSTRUCT_V1_0 =
  new CrossRegionInferenceProfileIdentifier(
    'us.meta.llama3-2-3b-instruct-v1:0',
  );

  /** Cross region inference profile identifier "us.meta.llama3-2-1b-instruct-v1:0". */
  public static readonly US_META_LLAMA_3_2_1B_INSTRUCT_V1_0 =
  new CrossRegionInferenceProfileIdentifier(
    'us.meta.llama3-2-1b-instruct-v1:0',
  );

  /** Cross region inference profile identifier "eu.anthropic.claude-3-haiku-20240307-v1:0". */
  public static readonly EU_ANTHROPIC_CLAUDE_3_HAIKU_20240307_V1_0 =
  new CrossRegionInferenceProfileIdentifier(
    'eu.anthropic.claude-3-haiku-20240307-v1:0',
  );

  /** Cross region inference profile identifier "eu.anthropic.claude-3-sonnet-20240229-v1:0". */
  public static readonly EU_ANTHROPIC_CLAUDE_3_SONNET_20240229_V1_0 =
  new CrossRegionInferenceProfileIdentifier(
    'eu.anthropic.claude-3-sonnet-20240229-v1:0',
  );

  /** Cross region inference profile identifier "eu.anthropic.claude-3-5-sonnet-20240620-v1:0". */
  public static readonly EU_ANTHROPIC_CLAUDE_3_5_SONNET_20240620_V1_0 =
  new CrossRegionInferenceProfileIdentifier(
    'eu.anthropic.claude-3-5-sonnet-20240620-v1:0',
  );

  /** Cross region inference profile identifier "eu.meta.llama3-2-3b-instruct-v1:0". */
  public static readonly EU_META_LLAMA_3_2_3B_INSTRUCT_V1_0 =
  new CrossRegionInferenceProfileIdentifier(
    'eu.meta.llama3-2-3b-instruct-v1:0',
  );

  /** Cross region inference profile identifier "eu.meta.llama3-2-1b-instruct-v1:0". */
  public static readonly EU_META_LLAMA_3_2_1B_INSTRUCT_V1_0 =
  new CrossRegionInferenceProfileIdentifier(
    'eu.meta.llama3-2-1b-instruct-v1:0',
  );

  /**
   * Constructor for cross region inference profile identifier
   *
   * @param profileId the profile identifier
   */
  private constructor(public readonly profileId: string) { }
}

/**
 * Bedrock cross region inference profiles.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference-support.html
 */
export class CrossRegionInferenceProfile {
  /** Cross region inference profile "us.anthropic.claude-3-haiku-20240307-v1:0". */
  public static readonly US_ANTHROPIC_CLAUDE_3_HAIKU_20240307_V1_0 =
  new CrossRegionInferenceProfile(
    CrossRegionInferenceProfileIdentifier.US_ANTHROPIC_CLAUDE_3_HAIKU_20240307_V1_0,
    FoundationModelIdentifier.ANTHROPIC_CLAUDE_3_HAIKU_20240307_V1_0,
    ['us-east-1', 'us-west-2'],
  );

  /** Cross region inference profile "us.anthropic.claude-3-opus-20240229-v1:0". */
  public static readonly US_ANTHROPIC_CLAUDE_3_OPUS_20240229_V1_0 =
  new CrossRegionInferenceProfile(
    CrossRegionInferenceProfileIdentifier.US_ANTHROPIC_CLAUDE_3_OPUS_20240229_V1_0,
    FoundationModelIdentifier.ANTHROPIC_CLAUDE_3_OPUS_20240229_V1_0,
    ['us-east-1', 'us-west-2'],
  );

  /** Cross region inference profile "us.anthropic.claude-3-sonnet-20240229-v1:0". */
  public static readonly US_ANTHROPIC_CLAUDE_3_SONNET_20240229_V1_0 =
  new CrossRegionInferenceProfile(
    CrossRegionInferenceProfileIdentifier.US_ANTHROPIC_CLAUDE_3_SONNET_20240229_V1_0,
    FoundationModelIdentifier.ANTHROPIC_CLAUDE_3_SONNET_20240229_V1_0,
    ['us-east-1', 'us-west-2'],
  );

  /** Cross region inference profile "us.anthropic.claude-3-5-sonnet-20240620-v1:0". */
  public static readonly US_ANTHROPIC_CLAUDE_3_5_SONNET_20240620_V1_0 =
  new CrossRegionInferenceProfile(
    CrossRegionInferenceProfileIdentifier.US_ANTHROPIC_CLAUDE_3_5_SONNET_20240620_V1_0,
    FoundationModelIdentifier.ANTHROPIC_CLAUDE_3_5_SONNET_20240620_V1_0,
    ['us-east-1', 'us-west-2'],
  );

  /** Cross region inference profile "us.meta.llama3-2-11b-instruct-v1:0". */
  public static readonly US_META_LLAMA_3_2_11B_INSTRUCT_V1_0 =
  new CrossRegionInferenceProfile(
    CrossRegionInferenceProfileIdentifier.US_META_LLAMA_3_2_11B_INSTRUCT_V1_0,
    FoundationModelIdentifier.META_LLAMA_3_2_11B_INSTRUCT_V1,
    ['us-east-1', 'us-west-2'],
  );

  /** Cross region inference profile "us.meta.llama3-2-90b-instruct-v1:0". */
  public static readonly US_META_LLAMA_3_2_90B_INSTRUCT_V1_0 =
  new CrossRegionInferenceProfile(
    CrossRegionInferenceProfileIdentifier.US_META_LLAMA_3_2_90B_INSTRUCT_V1_0,
    FoundationModelIdentifier.META_LLAMA_3_2_90B_INSTRUCT_V1,
    ['us-east-1', 'us-west-2'],
  );

  /** Cross region inference profile "us.meta.llama3-2-3b-instruct-v1:0". */
  public static readonly US_META_LLAMA_3_2_3B_INSTRUCT_V1_0 =
  new CrossRegionInferenceProfile(
    CrossRegionInferenceProfileIdentifier.US_META_LLAMA_3_2_3B_INSTRUCT_V1_0,
    FoundationModelIdentifier.META_LLAMA_3_2_3B_INSTRUCT_V1,
    ['us-east-1', 'us-west-2'],
  );

  /** Cross region inference profile "us.meta.llama3-2-1b-instruct-v1:0". */
  public static readonly US_META_LLAMA_3_2_1B_INSTRUCT_V1_0 =
  new CrossRegionInferenceProfile(
    CrossRegionInferenceProfileIdentifier.US_META_LLAMA_3_2_1B_INSTRUCT_V1_0,
    FoundationModelIdentifier.META_LLAMA_3_2_1B_INSTRUCT_V1,
    ['us-east-1', 'us-west-2'],
  );

  /** Cross region inference profile "eu.anthropic.claude-3-haiku-20240307-v1:0". */
  public static readonly EU_ANTHROPIC_CLAUDE_3_HAIKU_20240307_V1_0 =
  new CrossRegionInferenceProfile(
    CrossRegionInferenceProfileIdentifier.EU_ANTHROPIC_CLAUDE_3_HAIKU_20240307_V1_0,
    FoundationModelIdentifier.ANTHROPIC_CLAUDE_3_HAIKU_20240307_V1_0,
    ['eu-central-1', 'eu-west-1', 'eu-west-3'],
  );

  /** Cross region inference profile "eu.anthropic.claude-3-sonnet-20240229-v1:0". */
  public static readonly EU_ANTHROPIC_CLAUDE_3_SONNET_20240229_V1_0 =
  new CrossRegionInferenceProfile(
    CrossRegionInferenceProfileIdentifier.EU_ANTHROPIC_CLAUDE_3_SONNET_20240229_V1_0,
    FoundationModelIdentifier.ANTHROPIC_CLAUDE_3_SONNET_20240229_V1_0,
    ['eu-central-1', 'eu-west-1', 'eu-west-3'],
  );

  /** Cross region inference profile "eu.anthropic.claude-3-5-sonnet-20240620-v1:0". */
  public static readonly EU_ANTHROPIC_CLAUDE_3_5_SONNET_20240620_V1_0 =
  new CrossRegionInferenceProfile(
    CrossRegionInferenceProfileIdentifier.EU_ANTHROPIC_CLAUDE_3_5_SONNET_20240620_V1_0,
    FoundationModelIdentifier.ANTHROPIC_CLAUDE_3_5_SONNET_20240620_V1_0,
    ['eu-central-1', 'eu-west-1', 'eu-west-3'],
  );

  /** Cross region inference profile "eu.meta.llama3-2-3b-instruct-v1:0". */
  public static readonly EU_META_LLAMA_3_2_3B_INSTRUCT_V1_0 =
  new CrossRegionInferenceProfile(
    CrossRegionInferenceProfileIdentifier.EU_META_LLAMA_3_2_3B_INSTRUCT_V1_0,
    FoundationModelIdentifier.META_LLAMA_3_2_3B_INSTRUCT_V1,
    ['eu-central-1', 'eu-west-1', 'eu-west-3'],
  );

  /** Cross region inference profile "eu.meta.llama3-2-1b-instruct-v1:0". */
  public static readonly EU_META_LLAMA_3_2_1B_INSTRUCT_V1_0 =
  new CrossRegionInferenceProfile(
    CrossRegionInferenceProfileIdentifier.EU_META_LLAMA_3_2_1B_INSTRUCT_V1_0,
    FoundationModelIdentifier.META_LLAMA_3_2_1B_INSTRUCT_V1,
    ['eu-central-1', 'eu-west-1', 'eu-west-3'],
  );

  /**
   * Constructor for cross region inference profile
   *
   * @param profile the cross region profile identifier
   * @param model   the foundation model identifier
   * @param regions the regions where the profile is available
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference-support.html
   */
  private constructor(
    readonly profile: CrossRegionInferenceProfileIdentifier,
    readonly model: FoundationModelIdentifier,
    readonly regions: string[],
  ) { }

  /**
   * Grant the given principal permission to invoke this profile in the specified region.
   * @param profileRegion the region where the profile is to be invoked
   * @param grantee       the principal to be granted permission
   *
   * @returns result of the grant operation
   *
   * @throws Error if this profile is not available in the specified region
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference-support.html
   */
  public grantInvoke(profileRegion: string, grantee: IGrantable): Grant {
    if (
      !Token.isUnresolved(profileRegion) &&
      !this.regions.includes(profileRegion)
    ) {
      throw new Error(
        `Cross region inference profile ${this.profile.profileId} is only available in ${this.regions}`,
      );
    }
    const partition = Aws.PARTITION;
    const inferenceProfileResourceArn = Arn.format({
      service: 'bedrock',
      resource: `inference-profile/${this.profile.profileId}`,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
      region: profileRegion,
      partition,
      account: Aws.ACCOUNT_ID,
    });
    const modelResourceArns = this.regions.map((region) =>
      Arn.format({
        service: 'bedrock',
        resource: 'foundation-model',
        resourceName: this.model.modelId,
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
        region,
        partition,
        account: '',
      }),
    );
    return Grant.addToPrincipal({
      grantee,
      actions: ['bedrock:InvokeModel'],
      resourceArns: [...modelResourceArns, inferenceProfileResourceArn],
    });
  }
}
