import * as core from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnChannel } from './ivs.generated';

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
}

/**
 * Reference to a new or existing IVS Channel
 */
abstract class ChannelBase extends core.Resource implements IChannel {
  // these stay abstract at this level
  public abstract readonly channelArn: string;
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
   * Whether the channel is authorized. Default: false
   *
   * @default false
   */
  readonly authorized?: boolean;

  /**
   * Whether the channel is authorized. Default: false
   *
   * @default LatencyMode.LOW
   */
  readonly latencyMode?: LatencyMode;

  /**
   * Channel name.
   *
   * @default Empty String
   */
  readonly name?: string;

  /**
   * The channel type, which determines the allowable resolution and bitrate.
   * If you exceed the allowable resolution or bitrate, the stream probably will disconnect immediately
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
    super(scope, id, {});

    if (props.name !== undefined && !core.Token.isUnresolved(props.name) && !/^[a-zA-Z0-9-_]*$/.test(props.name)) {
      throw new Error('name must contain only numbers, letters, hyphens and underscores, ' +
        `got: '${props.name}'`);
    }

    const resource = new CfnChannel(this, 'Resource', {
      authorized: props.authorized,
      latencyMode: props.latencyMode,
      name: props.name,
      type: props.type,
    });

    this.channelArn = resource.attrArn;
    this.channelIngestEndpoint = resource.attrIngestEndpoint;
    this.channelPlaybackUrl = resource.attrPlaybackUrl;
  }
}