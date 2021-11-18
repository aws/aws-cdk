import { App, CfnOutput, Stack } from '@aws-cdk/core';
import * as ivs from '../lib';

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

const publicKey = `-----BEGIN PUBLIC KEY-----
MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEs6k8Xf6WyFq3yZXoup8G/gH6DntSATqD
Yfo83eX0GJCKxJ8fr09h9LP9HDGof8/bo66P+SGHeAARGF/O9WPAQVUgSlm/KMFX
EPtPtOm1s0GR9k1ydU5hkI++f9CoZ5lM
-----END PUBLIC KEY-----`;

const keypair = new ivs.PlaybackKeyPair(stack, 'PlaybackKeyPair', {
  publicKeyMaterial: publicKey,
  name: 'IVSIntegrationTestPlaybackKeyPair',
});

const channel = new ivs.Channel(stack, 'Channel', {
  name: 'IVSIntegrationTestChannel',
  authorized: true,
  type: ivs.ChannelType.BASIC,
  latencyMode: ivs.LatencyMode.NORMAL,
});

const streamKey = new ivs.StreamKey(stack, 'StreamKey', {
  channel: channel,
});

new CfnOutput(stack, 'PlaybackKeyPairArn', { value: keypair.playbackKeyPairArn });
new CfnOutput(stack, 'ChannelArn', { value: channel.channelArn });
new CfnOutput(stack, 'StreamKeyArn', { value: streamKey.streamKeyArn });

app.synth();
