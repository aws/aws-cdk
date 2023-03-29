import * as core from '@aws-cdk/core';
import { Lazy, Names } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnPlaybackKeyPair } from './ivs.generated';

/**
 * Represents an IVS Playback Key Pair
 */
export interface IPlaybackKeyPair extends core.IResource {
  /**
   * Key-pair ARN. For example: arn:aws:ivs:us-west-2:693991300569:playback-key/f99cde61-c2b0-4df3-8941-ca7d38acca1a
   *
   * @attribute
   */
  readonly playbackKeyPairArn: string;
}

/**
 * Reference to a new or existing IVS Playback Key Pair
 */
abstract class PlaybackKeyPairBase extends core.Resource implements IPlaybackKeyPair {
  // these stay abstract at this level
  public abstract readonly playbackKeyPairArn: string;
}

/**
 * Properties for creating a new Playback Key Pair
 */
export interface PlaybackKeyPairProps {
  /**
   * The public portion of a customer-generated key pair.
   */
  readonly publicKeyMaterial: string;

  /**
   * An arbitrary string (a nickname) assigned to a playback key pair that helps the customer identify that resource.
   * The value does not need to be unique.
   *
   * @default Automatically generated name
   */
  readonly playbackKeyPairName?: string;
}

/**
  A new IVS Playback Key Pair
*/
export class PlaybackKeyPair extends PlaybackKeyPairBase {
  public readonly playbackKeyPairArn: string;

  /**
  * Key-pair identifier. For example: 98:0d:1a:a0:19:96:1e:ea:0a:0a:2c:9a:42:19:2b:e7
  *
  * @attribute
  */
  public readonly playbackKeyPairFingerprint: string;

  constructor(scope: Construct, id: string, props: PlaybackKeyPairProps) {
    super(scope, id, {
      physicalName: props.playbackKeyPairName ?? Lazy.string({
        produce: () => Names.uniqueResourceName(this, { maxLength: 128, allowedSpecialCharacters: '-_' }),
      }),
    });

    if (props.playbackKeyPairName && !core.Token.isUnresolved(props.playbackKeyPairName) && !/^[a-zA-Z0-9-_]*$/.test(props.playbackKeyPairName)) {
      throw new Error(`playbackKeyPairName must contain only numbers, letters, hyphens and underscores, got: '${props.playbackKeyPairName}'`);
    }

    const resource = new CfnPlaybackKeyPair(this, 'Resource', {
      publicKeyMaterial: props.publicKeyMaterial,
      name: props.playbackKeyPairName,
    });

    this.playbackKeyPairArn = resource.attrArn;
    this.playbackKeyPairFingerprint = resource.attrFingerprint;
  }
}