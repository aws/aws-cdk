import * as core from '@aws-cdk/core';
import { Lazy, Names } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnChannel } from './ivs.generated';
import { StreamKey } from './stream-key';

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
  Channel latency mode
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
*/
export enum ChannelType {
  /**
   * Multiple qualities are generated from the original input, to automatically give viewers the best experience for
   * their devices and network conditions.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html
   */
  STANDARD = 'STANDARD',

  /**
   * delivers the original input to viewers. The viewer’s video-quality choice is limited to the original input.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html
   */
  BASIC = 'BASIC',
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
   * The channel type, which determines the allowable resolution and bitrate.
   * If you exceed the allowable resolution or bitrate, the stream will disconnect immediately
   *
   * @default ChannelType.STANDARD
   */
  readonly type?: ChannelType;
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

    if (this.physicalName && !core.Token.isUnresolved(this.physicalName) && !/^[a-zA-Z0-9-_]*$/.test(this.physicalName)) {
      throw new Error(`channelName must contain only numbers, letters, hyphens and underscores, got: '${this.physicalName}'`);
    }

    const resource = new CfnChannel(this, 'Resource', {
      authorized: props.authorized,
      latencyMode: props.latencyMode,
      name: this.physicalName,
      type: props.type,
    });

    this.channelArn = resource.attrArn;
    this.channelIngestEndpoint = resource.attrIngestEndpoint;
    this.channelPlaybackUrl = resource.attrPlaybackUrl;
  }
}
