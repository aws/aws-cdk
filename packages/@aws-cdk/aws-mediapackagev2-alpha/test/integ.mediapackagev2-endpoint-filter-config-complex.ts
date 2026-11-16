import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2-filter-config-complex');

const channelGroup = new mediapackagev2.ChannelGroup(stack, 'ChannelGroup', {
  channelGroupName: 'hd-streaming-group',
});

const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup,
  channelName: 'hd-channel',
  input: mediapackagev2.InputConfiguration.cmaf(),
});

new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
  channel,
  originEndpointName: 'hd-endpoint',
  segment: mediapackagev2.Segment.cmaf(),
  manifests: [
    mediapackagev2.Manifest.hls({
      manifestName: 'index',
      filterConfiguration: {
        manifestFilter: [
          mediapackagev2.ManifestFilter.bitrateRange(mediapackagev2.BitrateFilterKey.VIDEO_BITRATE, cdk.Bitrate.mbps(1), cdk.Bitrate.mbps(5)),
          mediapackagev2.ManifestFilter.numericRange(mediapackagev2.NumericFilterKey.VIDEO_HEIGHT, 720, 1080),
          mediapackagev2.ManifestFilter.videoCodecList([mediapackagev2.VideoCodec.H264, mediapackagev2.VideoCodec.H265]),
          mediapackagev2.ManifestFilter.numeric(mediapackagev2.NumericFilterKey.AUDIO_CHANNELS, 2),
          mediapackagev2.ManifestFilter.textList(mediapackagev2.TextFilterKey.AUDIO_LANGUAGE, ['en-US', 'fr']),
        ],
        timeDelay: cdk.Duration.seconds(30),
      },
    }),
  ],
});

new IntegTest(app, 'cdk-integ-mediapackage-endpoint-filter-config-complex', {
  testCases: [stack],
});

app.synth();
