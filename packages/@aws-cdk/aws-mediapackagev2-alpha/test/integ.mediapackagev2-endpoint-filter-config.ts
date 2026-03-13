import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2');

const channelGroup = new mediapackagev2.ChannelGroup(stack, 'ChannelGroup', {
  channelGroupName: 'streaming-group',
});

const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup,
  channelName: 'live-channel',
  input: mediapackagev2.InputConfiguration.cmaf(),
});

new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
  channel,
  originEndpointName: 'hls-endpoint',
  segment: mediapackagev2.Segment.ts(),
  startoverWindow: cdk.Duration.seconds(900),
  manifests: [
    mediapackagev2.Manifest.hls({
      manifestName: 'index',
      manifestWindow: cdk.Duration.seconds(60),
      programDateTimeInterval: cdk.Duration.seconds(60),
      filterConfiguration: {
        start: new Date('2025-12-15T17:15:00Z'),
        end: new Date('2025-12-15T17:20:00Z'),
        timeDelay: cdk.Duration.seconds(1),
        drmSettings: [mediapackagev2.DrmSettingsKey.EXCLUDE_SESSION_KEYS],
        manifestFilter: [
          mediapackagev2.ManifestFilter.range(mediapackagev2.ManifestFilterKeys.AUDIO_SAMPLE_RATE, 0, 50000),
          mediapackagev2.ManifestFilter.single(mediapackagev2.ManifestFilterKeys.VIDEO_CODEC, 'h264'),
          mediapackagev2.ManifestFilter.multiple(mediapackagev2.ManifestFilterKeys.VIDEO_HEIGHT, ['240', '360', '720']),
        ],
      },
    }),
  ],
});

new IntegTest(app, 'cdk-integ-mediapackage-endpoint-filter', {
  testCases: [stack],
});

app.synth();
