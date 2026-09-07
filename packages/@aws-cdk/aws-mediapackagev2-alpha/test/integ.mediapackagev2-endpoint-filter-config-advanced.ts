import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2-filter-config-advanced');

const channelGroup = new mediapackagev2.ChannelGroup(stack, 'ChannelGroup', {
  channelGroupName: 'advanced-filter-group',
});

const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup,
  channelName: 'advanced-channel',
  input: mediapackagev2.InputConfiguration.cmaf(),
});

new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
  channel,
  originEndpointName: 'advanced-endpoint',
  segment: mediapackagev2.Segment.cmaf(),
  manifests: [
    mediapackagev2.Manifest.hls({
      manifestName: 'index',
      filterConfiguration: {
        manifestFilter: [
          mediapackagev2.ManifestFilter.numericCombo(mediapackagev2.NumericFilterKey.VIDEO_HEIGHT, [
            mediapackagev2.NumericExpression.range(240, 360),
            mediapackagev2.NumericExpression.range(720, 1080),
            mediapackagev2.NumericExpression.value(1440),
          ]),
          mediapackagev2.ManifestFilter.bitrateCombo(mediapackagev2.BitrateFilterKey.VIDEO_BITRATE, [
            mediapackagev2.BitrateExpression.range(cdk.Bitrate.mbps(1), cdk.Bitrate.mbps(3)),
            mediapackagev2.BitrateExpression.value(cdk.Bitrate.mbps(5)),
          ]),
          mediapackagev2.ManifestFilter.videoCodecList([mediapackagev2.VideoCodec.H264, mediapackagev2.VideoCodec.H265]),
        ],
      },
    }),
  ],
});

new IntegTest(app, 'cdk-integ-mediapackage-endpoint-filter-config-advanced', {
  testCases: [stack],
});

app.synth();
