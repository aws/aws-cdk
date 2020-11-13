import * as core from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IChannel } from './channel';
import { CfnStreamKey } from './ivs.generated';

/**
 * Represents an IVS Stream Key
 */
export interface IStreamKey extends core.IResource {
  /**
   * The stream-key ARN. For example: arn:aws:ivs:us-west-2:123456789012:stream-key/g1H2I3j4k5L6
   *
   * @attribute
   */
  readonly streamKeyArn: string;
}

/**
 * Reference to a new or existing IVS Stream Key
 */
abstract class StreamKeyBase extends core.Resource implements IStreamKey {
  // these stay abstract at this level
  public abstract readonly streamKeyArn: string;
}

/**
 * Properties for creating a new Stream Key
 */
export interface StreamKeyProps {
  /**
   * Channel ARN for the stream.
   */
  readonly channel: IChannel;
}

/**
  A new IVS Stream Key
*/
export class StreamKey extends StreamKeyBase {
  public readonly streamKeyArn: string;

  /**
  * The stream-key value. For example: sk_us-west-2_abcdABCDefgh_567890abcdef
  *
  * @attribute
  */
  public readonly value: string;

  constructor(scope: Construct, id: string, props: StreamKeyProps) {
    super(scope, id, {});

    // The astute among you may notice that this regex differs from the documentation
    // This is because the documentation is wrong :)
    let channelArnRegex = /^arn:aws:ivs:[a-z0-9-]+:[0-9]+:channel\/[a-zA-Z0-9-]+$/;

    // I feel like there's probably a more CDK centric way of checking the validity of an arn, please let me know if so
    if (!core.Token.isUnresolved(props.channel.channelArn) && !channelArnRegex.test(props.channel.channelArn)) {
      throw new Error('channelArn is of an unexpected format: ' +
        `got: '${props.channel.channelArn}'`);
    }

    const resource = new CfnStreamKey(this, 'Resource', {
      channelArn: props.channel.channelArn,
    });

    this.streamKeyArn = resource.attrArn;
    this.value = resource.attrValue;
  }
}