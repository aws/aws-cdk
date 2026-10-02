import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2-starttag');

const group = new mediapackagev2.ChannelGroup(stack, 'Group');
const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup: group,
  input: mediapackagev2.InputConfiguration.cmaf(),
  description: 'Channel with StartTag examples',
});

// HLS with StartTag.of()
new mediapackagev2.OriginEndpoint(stack, 'HlsEndpoint', {
  channel,
  segment: mediapackagev2.Segment.cmaf(),
  manifests: [
    mediapackagev2.Manifest.hls({
      manifestName: 'hls-start',
      startTag: mediapackagev2.StartTag.of(10),
    }),
  ],
});

// LL-HLS with StartTag.withPrecise()
new mediapackagev2.OriginEndpoint(stack, 'LlHlsEndpoint', {
  channel,
  segment: mediapackagev2.Segment.cmaf(),
  manifests: [
    mediapackagev2.Manifest.lowLatencyHLS({
      manifestName: 'll-hls-precise',
      startTag: mediapackagev2.StartTag.withPrecise(-30),
    }),
  ],
});

// Multiple manifests with different StartTags
new mediapackagev2.OriginEndpoint(stack, 'MultiManifestEndpoint', {
  channel,
  segment: mediapackagev2.Segment.cmaf(),
  manifests: [
    mediapackagev2.Manifest.hls({
      manifestName: 'hls-from-start',
      startTag: mediapackagev2.StartTag.of(5, { precise: true }),
    }),
    mediapackagev2.Manifest.lowLatencyHLS({
      manifestName: 'll-hls-from-live',
      startTag: mediapackagev2.StartTag.of(-20),
    }),
  ],
});

new IntegTest(app, 'cdk-integ-mediapackage-endpoint-starttag', {
  testCases: [stack],
});

app.synth();
