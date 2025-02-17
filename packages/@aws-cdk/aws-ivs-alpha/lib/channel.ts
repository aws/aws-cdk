import * as core from 'aws-cdk-lib/core';
import { Lazy, Names } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnChannel } from 'aws-cdk-lib/aws-ivs';
import { StreamKey } from './stream-key';
import { IRecordingConfiguration } from './recording-configuration';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * Represents an IVS Channel
 */
export interface IChannel extends core.IResource {
  /**
   * The channel ARN. For example: arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh
   *
   * @attribute
   */
  readonly channelArn: string;

  /**
   * Adds a stream key for this IVS Channel.
   * @param id construct ID
   */
  addStreamKey(id: string): StreamKey;
}

/**
 * Reference to a new or existing IVS Channel
 */
abstract class ChannelBase extends core.Resource implements IChannel {
  public abstract readonly channelArn: string;

  public addStreamKey(id: string): StreamKey {
    return new StreamKey(this, id, {
      channel: this,
    });
  }
}

/**
 * Container Format
 */
export enum ContainerFormat {
  /**
   * Use MPEG-TS.
   */
  TS = 'TS',

  /**
   * Use fMP4.
   */
  FRAGMENTED_MP4 = 'FRAGMENTED_MP4',
}

/**
 * Channel latency mode
 */
export enum LatencyMode {
  /**
   * Use LOW to minimize broadcaster-to-viewer latency for interactive broadcasts.
   */
  LOW = 'LOW',

  /**
   * Use NORMAL for broadcasts that do not require viewer interaction.
   */
  NORMAL = 'NORMAL',
}

/**
 * The channel type, which determines the allowable resolution and bitrate.
 * If you exceed the allowable resolution or bitrate, the stream probably will disconnect immediately.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html
 */
export enum ChannelType {
  /**
   * Multiple qualities are generated from the original input, to automatically give viewers the best experience for their devices and network conditions.
   * Transcoding allows higher playback quality across a range of download speeds. Resolution can be up to 1080p and bitrate can be up to 8.5 Mbps.
   * Audio is transcoded only for renditions 360p and below; above that, audio is passed through.
   */
  STANDARD = 'STANDARD',

  /**
   * Delivers the original input to viewers. The viewer’s video-quality choice is limited to the original input.
   */
  BASIC = 'BASIC',

  /**
   * Multiple qualities are generated from the original input, to automatically give viewers the best experience for their devices and network conditions.
   * Input resolution can be up to 1080p and bitrate can be up to 8.5 Mbps; output is capped at SD quality (480p).
   * Audio for all renditions is transcoded, and an audio-only rendition is available.
   */
  ADVANCED_SD = 'ADVANCED_SD',

  /**
   * Multiple qualities are generated from the original input, to automatically give viewers the best experience for their devices and network conditions.
   * Input resolution can be up to 1080p and bitrate can be up to 8.5 Mbps; output is capped at HD quality (720p).
   * Audio for all renditions is transcoded, and an audio-only rendition is available.
   */
  ADVANCED_HD = 'ADVANCED_HD',
}

/**
 * An optional transcode preset for the channel. This is selectable only for ADVANCED_HD and ADVANCED_SD channel types.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html
 */
export enum Preset {
  /**
   * Use a lower bitrate than STANDARD for each quality level. Use it if you have low download bandwidth and/or simple video content (e.g., talking heads).
   */
  CONSTRAINED_BANDWIDTH_DELIVERY = 'CONSTRAINED_BANDWIDTH_DELIVERY',

  /**
   * Use a higher bitrate for each quality level. Use it if you have high download bandwidth and/or complex video content (e.g., flashes and quick scene changes).
   */
  HIGHER_BANDWIDTH_DELIVERY = 'HIGHER_BANDWIDTH_DELIVERY',

}

/**
 * Properties for creating a new Channel
 */
export interface ChannelProps {
  /**
   * Whether the channel is authorized.
   *
   * If you wish to make an authorized channel, you will need to ensure that
   * a PlaybackKeyPair has been uploaded to your account as this is used to
   * validate the signed JWT that is required for authorization
   *
   * @default false
   */
  readonly authorized?: boolean;

  /**
   * Indicates which content-packaging format is used (MPEG-TS or fMP4).
   *
   * If `multitrackInputConfiguration` is specified, only fMP4 can be used.
   * Otherwise, `containerFormat` may be set to `ContainerFormat.TS` or `ContainerFormat.FRAGMENTED_MP4`.
   *
   * @default - `ContainerFormat.FRAGMENTED_MP4` is automatically set when the `multitrackInputConfiguration` is specified. If not specified, it remains undefined and uses the IVS default setting (TS).
   */
  readonly containerFormat?: ContainerFormat;

  /**
   * Whether the channel allows insecure RTMP ingest.
   *
   * @default false
   */
  readonly insecureIngest?: boolean;

  /**
   * Channel latency mode.
   *
   * @default LatencyMode.LOW
   */
  readonly latencyMode?: LatencyMode;

  /**
   * A name for the channel.
   *
   * @default Automatically generated name
   */
  readonly channelName?: string;

  /**
   * Object specifying multitrack input configuration.
   * You must specify `multitrackInputConfiguration` if you want to use MultiTrack Video.
   *
   * `multitrackInputConfiguration` is only supported for `ChannelType.STANDARD`.
   *
   * @default undefined - IVS default setting is not use MultiTrack Video.
   * @see https://docs.aws.amazon.com/ivs/latest/LowLatencyUserGuide/multitrack-video.html
   */
  readonly multitrackInputConfiguration?: MultitrackInputConfiguration;

  /**
   * The channel type, which determines the allowable resolution and bitrate.
   * If you exceed the allowable resolution or bitrate, the stream will disconnect immediately
   *
   * @default ChannelType.STANDARD
   */
  readonly type?: ChannelType;

  /**
   * An optional transcode preset for the channel. Can be used for ADVANCED_HD and ADVANCED_SD channel types.
   * When LOW or STANDARD is used, the preset will be overridden and set to none regardless of the value provided.
   *
   * @default - Preset.HIGHER_BANDWIDTH_DELIVERY if channelType is ADVANCED_SD or ADVANCED_HD, none otherwise
   */
  readonly preset?: Preset;

  /**
   * A recording configuration for the channel.
   *
   * @default - recording is disabled
   */
  readonly recordingConfiguration?: IRecordingConfiguration;
}

/**
 * Maximum resolution for multitrack input.
 */
export enum MaximumResolution {
  /**
   * Full HD (1080p)
   */
  FULL_HD = 'FULL_HD',

  /**
   * HD (720p)
   */
  HD = 'HD',

  /**
   * SD (480p)
   */
  SD = 'SD',
}

/**
 * Whether multitrack input is allowed or required.
 */
export enum Policy {
  /**
   * Multitrack input is allowed.
   */
  ALLOW = 'ALLOW',

  /**
   * Multitrack input is required.
   */
  REQUIRE = 'REQUIRE',
}

/**
 * A complex type that specifies multitrack input configuration.
 */
export interface MultitrackInputConfiguration {
  /**
   * Maximum resolution for multitrack input.
   */
  readonly maximumResolution: MaximumResolution;

  /**
   * Indicates whether multitrack input is allowed or required.
   */
  readonly policy: Policy;
}

/**
  A new IVS channel
 */
export class Channel extends ChannelBase {
  /**
   * Import an existing channel
   */
  public static fromChannelArn(scope: Construct, id: string, channelArn: string): IChannel {
    // This will throw an error if the arn cannot be parsed
    let arnComponents = core.Arn.split(channelArn, core.ArnFormat.SLASH_RESOURCE_NAME);

    if (!core.Token.isUnresolved(arnComponents.service) && arnComponents.service !== 'ivs') {
      throw new Error(`Invalid service, expected 'ivs', got '${arnComponents.service}'`);
    }

    if (!core.Token.isUnresolved(arnComponents.resource) && arnComponents.resource !== 'channel') {
      throw new Error(`Invalid resource, expected 'channel', got '${arnComponents.resource}'`);
    }

    class Import extends ChannelBase {
      public readonly channelArn = channelArn;
    }

    return new Import(scope, id);
  }

  public readonly channelArn: string;

  /**
   * Channel ingest endpoint, part of the definition of an ingest server, used when you set up streaming software.
   * For example: a1b2c3d4e5f6.global-contribute.live-video.net
   * @attribute
   */
  public readonly channelIngestEndpoint: string;

  /**
   * Channel playback URL. For example:
   * https://a1b2c3d4e5f6.us-west-2.playback.live-video.net/api/video/v1/us-west-2.123456789012.channel.abcdEFGH.m3u8
   * @attribute
   */
  public readonly channelPlaybackUrl: string;

  constructor(scope: Construct, id: string, props: ChannelProps = {}) {
    super(scope, id, {
      physicalName: props.channelName ?? Lazy.string({
        produce: () => Names.uniqueResourceName(this, { maxLength: 128, allowedSpecialCharacters: '-_' }),
      }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (this.physicalName && !core.Token.isUnresolved(this.physicalName) && !/^[a-zA-Z0-9-_]*$/.test(this.physicalName)) {
      throw new Error(`channelName must contain only numbers, letters, hyphens and underscores, got: '${this.physicalName}'`);
    }

    let preset;

    if (props.type && [ChannelType.STANDARD, ChannelType.BASIC].includes(props.type) && props.preset) {
      preset = '';
    } else {
      preset = props.preset;
    }

    if (props.multitrackInputConfiguration !== undefined) {
      if (props.type !== undefined && props.type !== ChannelType.STANDARD) {
        throw new Error(`\`multitrackInputConfiguration\` is only supported for \`ChannelType.STANDARD\`, got: ${props.type}.`);
      }

      if (props.containerFormat !== undefined && props.containerFormat !== ContainerFormat.FRAGMENTED_MP4) {
        throw new Error(`\`containerFormat\` must be set to \`ContainerFormat.FRAGMENTED_MP4\` when \`multitrackInputConfiguration\` is specified, got: ${props.containerFormat}.`);
      }
    }

    const resource = new CfnChannel(this, 'Resource', {
      authorized: props.authorized,
      insecureIngest: props.insecureIngest,
      latencyMode: props.latencyMode,
      name: this.physicalName,
      type: props.type,
      preset,
      recordingConfigurationArn: props.recordingConfiguration?.recordingConfigurationArn,
      containerFormat: props.containerFormat ??
        (props.multitrackInputConfiguration ? ContainerFormat.FRAGMENTED_MP4 : undefined),
      multitrackInputConfiguration: props.multitrackInputConfiguration ?
        {
          enabled: true,
          maximumResolution: props.multitrackInputConfiguration.maximumResolution,
          policy: props.multitrackInputConfiguration.policy,
        }
        : undefined,
    });

    this.channelArn = resource.attrArn;
    this.channelIngestEndpoint = resource.attrIngestEndpoint;
    this.channelPlaybackUrl = resource.attrPlaybackUrl;
  }
}
