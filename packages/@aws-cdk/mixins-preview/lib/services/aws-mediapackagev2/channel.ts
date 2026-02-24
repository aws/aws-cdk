import type { IConstruct } from 'constructs';
import { CfnChannel, CfnChannelPolicy } from 'aws-cdk-lib/aws-mediapackagev2';
import { PolicyDocument } from 'aws-cdk-lib/aws-iam';
import type { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { UnscopedValidationError } from 'aws-cdk-lib/core';
import { Mixin } from '../../core';

/**
 * The preferred ingest endpoint when both inputs have equal MQCS scores.
 */
export enum PreferredInput {
  /** Prefer the first ingest endpoint */
  INPUT_1 = 1,
  /** Prefer the second ingest endpoint */
  INPUT_2 = 2,
}

/**
 * Properties for configuring MQCS-based input switching on a MediaPackageV2 channel.
 *
 * Input switching uses the Media Quality Confidence Score (MQCS) from
 * AWS Elemental MediaLive to automatically switch between redundant inputs
 * based on media quality. This feature requires CMAF input type.
 */
export interface ChannelInputSwitchingProps {
  /**
   * The preferred ingest endpoint when both inputs have equal MQCS scores.
   *
   * @default - MediaPackage default switching behavior
   */
  readonly preferredInput?: PreferredInput;

  /**
   * Whether to include the MQCS in CMSD response headers sent to the CDN.
   *
   * When enabled, downstream systems can use the MQCS data for their own
   * quality-aware decisions (e.g., logging, analytics, or further switching).
   *
   * @default false
   */
  readonly publishMqcs?: boolean;
}

/**
 * Configures MQCS-based input switching on a MediaPackageV2 channel.
 *
 * This mixin enables automatic input switching based on the Media Quality
 * Confidence Score (MQCS) provided by AWS Elemental MediaLive. It also
 * optionally publishes MQCS data in CMSD response headers for downstream
 * CDN consumption.
 *
 * This feature is only valid for channels using CMAF input type.
 *
 * @mixin true
 */
export class ChannelInputSwitching extends Mixin {
  private readonly props: ChannelInputSwitchingProps;

  constructor(props: ChannelInputSwitchingProps = {}) {
    super();
    this.props = props;
  }

  public supports(construct: IConstruct): construct is CfnChannel {
    return CfnChannel.isCfnChannel(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) {
      return;
    }

    construct.inputSwitchConfiguration = {
      mqcsInputSwitching: true,
      preferredInput: this.props.preferredInput,
    };

    if (this.props.publishMqcs !== undefined) {
      construct.outputHeaderConfiguration = {
        publishMqcs: this.props.publishMqcs,
      };
    }
  }
}

/**
 * Properties for attaching a resource-based policy to a MediaPackageV2 channel.
 */
export interface ChannelPolicyProps {
  /**
   * The IAM policy document to attach to the channel.
   *
   * This policy controls which principals can perform actions on the channel,
   * such as ingesting content from cross-account encoders.
   *
   * Exactly one of `policy` or `statements` must be provided.
   *
   * @default - a new empty PolicyDocument is created if `statements` are provided
   */
  readonly policy?: PolicyDocument;

  /**
   * IAM policy statements to add to the channel policy.
   *
   * Convenience alternative to providing a full `PolicyDocument`.
   * Exactly one of `policy` or `statements` must be provided.
   *
   * @default - use `policy` instead
   */
  readonly statements?: PolicyStatement[];
}

/**
 * Attaches an IAM resource-based policy to a MediaPackageV2 channel.
 *
 * Creates a child `CfnChannelPolicy` resource on the target channel,
 * controlling which principals can perform actions such as content ingest.
 *
 * @mixin true
 */
export class ChannelPolicy extends Mixin {
  private readonly policyDocument: PolicyDocument;

  constructor(props: ChannelPolicyProps) {
    super();

    if (props.policy && props.statements) {
      throw new UnscopedValidationError('Specify either \'policy\' or \'statements\', but not both.');
    }
    if (!props.policy && !props.statements) {
      throw new UnscopedValidationError('One of \'policy\' or \'statements\' is required.');
    }

    if (props.policy) {
      this.policyDocument = props.policy;
    } else {
      this.policyDocument = new PolicyDocument({
        statements: props.statements,
      });
    }
  }

  public supports(construct: IConstruct): construct is CfnChannel {
    return CfnChannel.isCfnChannel(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) {
      return;
    }

    new CfnChannelPolicy(construct, 'Policy', {
      channelGroupName: construct.channelGroupName,
      channelName: construct.channelName,
      policy: this.policyDocument,
    });
  }
}
