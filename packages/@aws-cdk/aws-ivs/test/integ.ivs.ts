import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as ivs from '../lib';

class DefaultProperties extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const publicKey = `-----BEGIN PUBLIC KEY-----
MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEHBm/D9UFf1z4czcAFuM7w+tstxxzoLVo
fa1OT0gQjRYsy/YTcrKI5FS7ur3NZIcmiwqerr7dP0wSZjfEMNe82W1zWdkxHJ6Y
73g9gZDxwGdjowZjEOIvAeH2Of6NeDOo
-----END PUBLIC KEY-----`;
    // Generated names are must be valid.
    new ivs.PlaybackKeyPair(this, `PlaybackKeyPair-_${'a'.repeat(128)}`, {
      publicKeyMaterial: publicKey,
    });
    new ivs.Channel(this, `Channel-_${'a'.repeat(128)}`);
  }
}

class AllProperties extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const publicKey = `-----BEGIN PUBLIC KEY-----
MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEs6k8Xf6WyFq3yZXoup8G/gH6DntSATqD
Yfo83eX0GJCKxJ8fr09h9LP9HDGof8/bo66P+SGHeAARGF/O9WPAQVUgSlm/KMFX
EPtPtOm1s0GR9k1ydU5hkI++f9CoZ5lM
-----END PUBLIC KEY-----`;
    const keypair = new ivs.PlaybackKeyPair(this, 'PlaybackKeyPair', {
      publicKeyMaterial: publicKey,
      playbackKeyPairName: 'IVSIntegrationTestPlaybackKeyPair',
    });

    const channel = new ivs.Channel(this, 'Channel', {
      channelName: 'IVSIntegrationTestChannel',
      authorized: true,
      type: ivs.ChannelType.BASIC,
      latencyMode: ivs.LatencyMode.NORMAL,
    });

    const streamKey = new ivs.StreamKey(this, 'StreamKey', {
      channel: channel,
    });

    new CfnOutput(this, 'PlaybackKeyPairArn', { value: keypair.playbackKeyPairArn });
    new CfnOutput(this, 'ChannelArn', { value: channel.channelArn });
    new CfnOutput(this, 'StreamKeyArn', { value: streamKey.streamKeyArn });
  }
}


/*
 * Creates a channel, playback key pair and stream key
 *
 * Stack verification steps:
 * Check to make sure the resources exist
 *
 * -- aws ivs get-channel --arn <channel-arn-from-output> provides channel with name IVSIntegrationTestChannel
 * -- aws ivs get-stream-key --arn <streamkey-arn-from-output> provides stream key for the channel with the arn from output
 * -- aws ivs get-playback-key-pair --arn <playback-key-pair-arn-from-output> provides playback key pair with name IVSIntegrationTestPlaybackKeyPair
 */
const app = new App();

const stack = new Stack(app, 'aws-cdk-ivs');
new DefaultProperties(stack, 'DefaultProperties');
new AllProperties(stack, 'AllProperties');

new IntegTest(app, 'ivs-test', {
  testCases: [stack],
});

app.synth();
