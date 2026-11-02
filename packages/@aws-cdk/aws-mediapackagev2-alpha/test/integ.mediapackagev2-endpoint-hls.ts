import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2');

const group = new mediapackagev2.ChannelGroup(stack, 'Group');
const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup: group,
  input: mediapackagev2.InputConfiguration.hls(),
});
new mediapackagev2.OriginEndpoint(stack, 'origin', {
  channel,
  startoverWindow: cdk.Duration.seconds(100),
  manifests: [
    mediapackagev2.Manifest.hls({
      manifestName: 'index',
    }),
  ],
  segment: mediapackagev2.Segment.ts({
    scteFilter: [mediapackagev2.ScteMessageType.BREAK, mediapackagev2.ScteMessageType.DISTRIBUTOR_ADVERTISEMENT],
    includeDvbSubtitles: true,
    useAudioRenditionGroup: true,
    duration: cdk.Duration.seconds(2),
    name: 'mysegment',
  }),
});

new IntegTest(app, 'cdk-integ-mediapackage-endpoint-hls', {
  testCases: [stack],
});

app.synth();
