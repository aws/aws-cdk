import type { IResource } from 'aws-cdk-lib';
import { RemovalPolicy, Resource, Stack, ArnFormat, Lazy, Names, Fn, Duration, ValidationError, CfnResource, Token } from 'aws-cdk-lib';
import type { MetricOptions } from 'aws-cdk-lib/aws-cloudwatch';
import { Metric, Unit } from 'aws-cdk-lib/aws-cloudwatch';
import type { PolicyStatement, AddToResourcePolicyResult } from 'aws-cdk-lib/aws-iam';
import { CfnChannel } from 'aws-cdk-lib/aws-mediapackagev2';
import type { IChannelRef, ChannelReference } from 'aws-cdk-lib/aws-mediapackagev2';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { OriginEndpointOptions } from '.';
import { ChannelPolicy, OriginEndpoint } from '.';
import type { IChannelGroup } from './group';
import { ChannelGrants } from './mediapackagev2-grants.generated';
import { renderTags } from './shared-helpers';

/**
 * The input type will be an immutable field which will be used to define whether the channel will allow CMAF ingest or HLS ingest.
 */
export enum InputType {
  /**
   * The DASH-IF CMAF Ingest specification (which defines CMAF segments with
   * optional DASH manifests).
   */
  CMAF='CMAF',
  /**
   * The HLS streaming specification (which defines M3U8 manifests and TS segments).
   */
  HLS='HLS',
}

/**
 * Represents a MediaPackage V2 Channel
 */
export interface IChannel extends IResource, IChannelRef {
  /**
   * The name that describes the channel group. The name is the primary identifier for the channel group.
   *
   * @attribute
   */
  readonly channelGroupName: string;

  /**
   * The name that describes the channel. The name is the primary identifier for the channel.
   *
   * @attribute
   */
  readonly channelName: string;

  /**
   * The Amazon Resource Name (ARN) associated with the resource.
   *
   * @attribute
   */
  readonly channelArn: string;

  /**
   * The channel group this channel belongs to.
   * Only available when the channel was created in the same stack.
   * Undefined for imported channels.
   *
   * @attribute
   */
  readonly channelGroup?: IChannelGroup;

  /**
   * Grants IAM resource policy to the role used to write to MediaPackage V2 Channel.
   */
  readonly grants: ChannelGrants;

  /**
   * Add Origin Endpoint for this Channel.
   */
  addOriginEndpoint(id: string, options: OriginEndpointOptions): OriginEndpoint;

  /**
   * Configure channel policy.
   *
   * You can only add 1 ChannelPolicy to a Channel.
   * If you have already defined one, function will append the policy already created.
   */
  addToResourcePolicy(statement: PolicyStatement): AddToResourcePolicyResult;

  /**
   * Create a CloudWatch metric.
   *
   * @param metricName name of the metric
   * @param props metric options.
   */
  metric(metricName: string, props?: MetricOptions): Metric;

  /**
   * Returns Metric for Ingress Bytes
   *
   * @default - sum over 60 seconds
   */
  metricIngressBytes(options?: MetricOptions): Metric;

  /**
   * Returns Metric for Egress Bytes
   *
   * @default - sum over 60 seconds
   */
  metricEgressBytes(options?: MetricOptions): Metric;

  /**
   * Returns Metric for Ingress response time
   *
   * @default - average over 60 seconds
   */
  metricIngressResponseTime(options?: MetricOptions): Metric;

  /**
   * Returns Metric for Egress Response time
   *
   * @default - average over 60 seconds
   */
  metricEgressResponseTime(options?: MetricOptions): Metric;

  /**
   * Returns Metric for Ingress Request Count
   *
   * @default - sum over 60 seconds
   */
  metricIngressRequestCount(options?: MetricOptions): Metric;

  /**
   * Returns Metric for Egress Request Count
   *
   * @default - sum over 60 seconds
   */
  metricEgressRequestCount(options?: MetricOptions): Metric;
}

/**
 * Ingest Endpoint options
 */
export enum IngestEndpoint {
  /**
   * First ingest endpoint
   */
  ENDPOINT_1=1,
  /**
   * Second ingest endpoint
   */
  ENDPOINT_2=2,
}

/**
 * Input Switch Configuration
 */
export interface InputSwitchConfiguration {
  /**
   * When true, AWS Elemental MediaPackage performs input switching based on the MQCS.
   *
   * This setting is valid only when InputType is CMAF.
   *
   * @default false
   */
  readonly mqcsInputSwitching?: boolean;
  /**
   * For CMAF inputs, indicates which input MediaPackage should prefer when both inputs have equal MQCS scores.
   * Select 1 to prefer the first ingest endpoint, or 2 to prefer the second ingest endpoint.
   * If you don't specify a preferred input, MediaPackage uses its default switching behavior when MQCS scores are equal.
   *
   * @default - MediaPackage uses its default switching behavior
   */
  readonly preferredInput?: IngestEndpoint;
}

/**
 * The settings for what common media server data (CMSD) headers AWS Elemental MediaPackage includes in responses to the CDN.
 */
export class HeadersCMSD {
  /**
   * Media Quality Confidence Score
   */
  public static readonly MQCS = new HeadersCMSD('mqcs');

  /**
   * Escape hatch for new CMSD headers not yet supported by the construct.
   */
  public static of(value: string): HeadersCMSD {
    return new HeadersCMSD(value);
  }

  private constructor(
    /**
     * The string value of the CMSD header
     */
    public readonly value: string) {}
}

/**
 * Properties for CMAF input configuration
 */
export interface CmafInputProps {
  /**
   * The configuration for input switching based on the media quality confidence score (MQCS) as provided from AWS Elemental MediaLive.
   *
   * @default No customized input switch configuration added
   */
  readonly inputSwitchConfiguration?: InputSwitchConfiguration;

  /**
   * The settings for what common media server data (CMSD) headers AWS Elemental MediaPackage includes in responses to the CDN.
   *
   * @default none
   */
  readonly outputHeaders?: HeadersCMSD[];
}

/**
 * Input configuration for a MediaPackage V2 Channel
 *
 * Use the static factory methods to create instances:
 * - InputConfiguration.hls() for HLS input
 * - InputConfiguration.cmaf() for CMAF input with optional CMAF-specific features
 */
export class InputConfiguration {
  /**
   * Create an HLS input configuration
   */
  public static hls(): InputConfiguration {
    return new InputConfiguration(InputType.HLS, undefined, undefined);
  }

  /**
   * Create a CMAF input configuration
   *
   * @param props CMAF-specific configuration including input switching and output headers
   */
  public static cmaf(props?: CmafInputProps): InputConfiguration {
    return new InputConfiguration(
      InputType.CMAF,
      props?.inputSwitchConfiguration,
      props?.outputHeaders,
    );
  }

  private constructor(
    /**
     * The input type (HLS or CMAF)
     */
    public readonly inputType: InputType,
    /**
     * Input switch configuration (CMAF only)
     */
    public readonly inputSwitchConfiguration?: InputSwitchConfiguration,
    /**
     * Output headers configuration (CMAF only)
     */
    public readonly outputHeaders?: HeadersCMSD[],
  ) {}
}

/**
 * Configuration options for an AWS Elemental MediaPackage V2 Channel.
 *
 * Used when creating a channel via `ChannelGroup.addChannel()`.
 */
export interface ChannelOptions {
  /**
   * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group.
   *
   * @default autogenerated
   */
  readonly channelName?: string;

  /**
   * Input configuration for the channel.
   * Use InputConfiguration.hls() or InputConfiguration.cmaf() to create the configuration.
   *
   * @default InputConfiguration.cmaf()
   */
  readonly input?: InputConfiguration;

  /**
   * Enter any descriptive text that helps you to identify the channel.
   *
   * @default no description
   */
  readonly description?: string;

  /**
   * Tags to add to the Channel
   *
   * @default No tagging
   */
  readonly tags?: { [key: string]: string };

  /**
   * Policy to apply when the channel is removed from the stack
   *
   * Even though MediaPackage ChannelGroups, Channels and OriginEndpoints are technically stateful,
   * their contents are transient and it is common to add and remove these while rearchitecting your application.
   * The default is therefore `DESTROY`. Change it to `RETAIN` if the content (in a lookback window) are so
   * valuable that accidentally losing it would be unacceptable.
   *
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Properties to set on a Channel.
 */
export interface ChannelProps extends ChannelOptions {
  /**
   * Channel Group to add this Channel to.
   */
  readonly channelGroup: IChannelGroup;
}

/**
 * Represents a Channel defined outside of this stack.
 */
export interface ChannelAttributes {
  /**
   * The name that describes the channel.
   *
   * @attribute
   */
  readonly channelName: string;

  /**
   * The name that describes the channel group.
   *
   * @attribute
   */
  readonly channelGroupName: string;
}

/**
 * A new or imported Channel.
 */
abstract class ChannelBase extends Resource implements IChannel {
  /**
   * Creates a Channel construct that represents an external (imported) Channel.
   */
  public static fromChannelAttributes(scope: Construct, id: string, attrs: ChannelAttributes): IChannel {
    class Import extends ChannelBase implements IChannel {
      public policy?: ChannelPolicy = undefined;
      public readonly channelGroupName = attrs.channelGroupName;
      public readonly channelName = attrs.channelName;
      protected autoCreatePolicy = false;
      public readonly channelArn = Stack.of(this).formatArn({
        service: 'mediapackagev2',
        resource: `channelGroup/${attrs.channelGroupName}/channel`,
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
        resourceName: this.channelName,
      });
    }

    return new Import(scope, id);
  }

  public abstract readonly channelGroupName: string;
  public abstract readonly channelName: string;
  public abstract readonly channelArn: string;

  /**
   * A reference to this Channel resource
   */
  public get channelRef(): ChannelReference {
    return {
      channelArn: this.channelArn,
    };
  }

  /**
   * The resource policy associated with this channel.
   *
   * If `autoCreatePolicy` is true, a `ChannelPolicy` will be created upon the
   * first call to addToResourcePolicy(s).
   */
  public abstract policy?: ChannelPolicy;

  /**
   * Indicates if a channel resource policy should automatically created upon
   * the first call to `addToResourcePolicy`.
   */
  protected abstract autoCreatePolicy: boolean;

  /**
   * Collection of grant methods for this channel
   */
  public readonly grants = ChannelGrants.fromChannel(this);

  /**
   * Add Origin Endpoint for this Channel.
   */
  public addOriginEndpoint(id: string, options: OriginEndpointOptions): OriginEndpoint {
    return new OriginEndpoint(this, id, {
      channel: this,
      ...options,
    });
  }

  /**
   * Configure channel policy.
   *
   * You can only add 1 ChannelPolicy to a Channel.
   * If you have already defined one, function will append the policy already created.
   */
  public addToResourcePolicy(statement: PolicyStatement): AddToResourcePolicyResult {
    if (!this.policy && this.autoCreatePolicy) {
      this.policy = new ChannelPolicy(this, 'Policy', {
        channel: this,
      });
    }

    if (this.policy) {
      this.policy.document.addStatements(statement);
      return { statementAdded: true, policyDependable: this.policy };
    }

    return { statementAdded: false };
  }

  /**
   * Create a CloudWatch metric.
   *
   * @param metricName name of the metric
   * @param options metric options.
   */
  public metric(metricName: string, options?: MetricOptions): Metric {
    return new Metric({
      metricName,
      namespace: 'AWS/MediaPackage',
      dimensionsMap: {
        ChannelGroup: this.channelGroupName,
        Channel: this.channelName,
      },
      ...options,
    }).attachTo(this);
  }

  /**
   * Returns Metric for Ingress Bytes
   *
   * @default - sum over 60 seconds
   */
  public metricIngressBytes(options?: MetricOptions): Metric {
    return this.metric('IngressBytes', {
      statistic: 'sum',
      period: Duration.seconds(60),
      unit: Unit.BYTES,
      ...options,
    });
  }

  /**
   * Returns Metric for Egress Bytes
   *
   * @default - sum over 60 seconds
   */
  public metricEgressBytes(options?: MetricOptions): Metric {
    return this.metric('EgressBytes', {
      statistic: 'sum',
      period: Duration.seconds(60),
      unit: Unit.BYTES,
      ...options,
    });
  }

  /**
   * Returns Metric for Ingress response time
   *
   * @default - average over 60 seconds
   */
  public metricIngressResponseTime(options?: MetricOptions): Metric {
    return this.metric('IngressResponseTime', {
      statistic: 'avg',
      period: Duration.seconds(60),
      unit: Unit.MILLISECONDS,
      ...options,
    });
  }

  /**
   * Returns Metric for Egress Response time
   *
   * @default - average over 60 seconds
   */
  public metricEgressResponseTime(options?: MetricOptions): Metric {
    return this.metric('EgressResponseTime', {
      statistic: 'avg',
      period: Duration.seconds(60),
      unit: Unit.MILLISECONDS,
      ...options,
    });
  }

  /**
   * Returns Metric for Ingress Request Count
   *
   * @default - sum over 60 seconds
   */
  public metricIngressRequestCount(options?: MetricOptions): Metric {
    return this.metric('IngressRequestCount', {
      statistic: 'sum',
      period: Duration.seconds(60),
      unit: Unit.COUNT,
      ...options,
    });
  }

  /**
   * Returns Metric for Egress Request Count
   *
   * @default - sum over 60 seconds
   */
  public metricEgressRequestCount(options?: MetricOptions): Metric {
    return this.metric('EgressRequestCount', {
      statistic: 'sum',
      period: Duration.seconds(60),
      unit: Unit.COUNT,
      ...options,
    });
  }
}

/**
 * Defines an AWS Elemental MediaPackage V2 Channel
 */
@propertyInjectable
export class Channel extends ChannelBase implements IChannel {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-mediapackagev2-alpha.Channel';

  public readonly channelGroupName: string;
  public readonly channelName: string;
  public readonly channelArn: string;
  public readonly channelGroup?: IChannelGroup;

  /**
   * The date and time the channel was created.
   */
  public readonly createdAt: string;

  /**
   * The date and time the channel was modified.
   */
  public readonly modifiedAt: string;

  /**
   * The list of ingest endpoints.
   */
  public readonly ingestEndpointUrls: string[];

  public policy?: ChannelPolicy;
  protected autoCreatePolicy = true;

  constructor(scope: Construct, id: string, props: ChannelProps) {
    super(scope, id, {
      physicalName: props?.channelName ?? Lazy.string({
        produce: () => Names.uniqueResourceName(this, {
          maxLength: 256,
        }),
      }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Validate channelName if provided
    if (props.channelName != null && !Token.isUnresolved(props.channelName)) {
      if (props.channelName.length < 1 || props.channelName.length > 256) {
        throw new ValidationError('ChannelNameLength', 'Channel name must be between 1 and 256 characters in length.', this);
      }
      if (!props.channelName.match(/^[a-zA-Z0-9_-]+$/)) {
        throw new ValidationError('ChannelNamePattern', 'Channel name must only contain alphanumeric characters, hyphens, and underscores.', this);
      }
    }

    // Validate description if provided
    if (props.description && !Token.isUnresolved(props.description) && props.description.length > 1024) {
      throw new ValidationError('ChannelDescriptionLength', 'Channel description must not exceed 1024 characters.', this);
    }

    // Default to CMAF if no input configuration provided
    const inputConfig = props.input ?? InputConfiguration.cmaf();

    const channel = new CfnChannel(this, 'Resource', {
      channelName: this.physicalName,
      channelGroupName: props.channelGroup.channelGroupName,
      inputType: inputConfig.inputType,
      description: props.description,
      inputSwitchConfiguration: inputConfig.inputSwitchConfiguration,
      tags: props?.tags ? renderTags(props.tags) : undefined,
      outputHeaderConfiguration: inputConfig.outputHeaders && inputConfig.outputHeaders.length > 0 ? {
        publishMqcs: inputConfig.outputHeaders?.some(h => h.value === HeadersCMSD.MQCS.value),
      } : undefined,
    });

    this.channelGroup = props.channelGroup;
    this.channelGroupName = channel.channelGroupName;
    this.channelName = channel.channelName;
    this.channelArn = channel.attrArn;
    this.createdAt = channel.attrCreatedAt;
    this.modifiedAt = channel.attrModifiedAt;
    this.ingestEndpointUrls = [Fn.select(0, channel.attrIngestEndpointUrls), Fn.select(1, channel.attrIngestEndpointUrls)];

    channel.applyRemovalPolicy(props?.removalPolicy ?? RemovalPolicy.DESTROY);

    // The channelGroupName is rendered as a literal string (not a CFN Ref), so CloudFormation
    // cannot infer the dependency. We add a direct CfnResource-level DependsOn to guarantee
    // deploy ordering without triggering CDK's subtree-level cycle detection.
    // For imported constructs, defaultChild is undefined (no CFN resource to order against).
    const groupCfn = props.channelGroup.node.defaultChild as CfnResource | undefined;
    if (groupCfn && CfnResource.isCfnResource(groupCfn)) {
      channel.addDependency(groupCfn);
    }
  }
}
