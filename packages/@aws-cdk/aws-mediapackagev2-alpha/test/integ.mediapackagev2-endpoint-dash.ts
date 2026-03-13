import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2');

const group = new mediapackagev2.ChannelGroup(stack, 'Group');
const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup: group,
  input: mediapackagev2.InputConfiguration.cmaf(),
  description: 'Input type is CMAF',
});
new mediapackagev2.OriginEndpoint(stack, 'OriginEndpoint', {
  channel,
  forceEndpointConfigurationConditions: [mediapackagev2.EndpointErrorConfiguration.INCOMPLETE_MANIFEST,
    mediapackagev2.EndpointErrorConfiguration.STALE_MANIFEST],
  segment: mediapackagev2.Segment.cmaf({
    scteFilter: [mediapackagev2.ScteMessageType.DISTRIBUTOR_ADVERTISEMENT],
    name: 'segment',
    duration: cdk.Duration.seconds(6),
  }),
  startoverWindow: cdk.Duration.seconds(900),
  manifests: [
    mediapackagev2.Manifest.dash({
      manifestName: 'index',
      periodTriggers: [mediapackagev2.DashPeriodTriggers.AVAILS],
      segmentTemplateFormat: mediapackagev2.SegmentTemplateFormat.NUMBER_WITH_TIMELINE,
      scteDashAdMarker: mediapackagev2.AdMarkerDash.BINARY,
      utcTimingMode: mediapackagev2.DashUtcTimingMode.HTTP_HEAD,
      utcTimingSource: 'https://example.com',
      manifestWindow: cdk.Duration.seconds(66),
      minBufferTime: cdk.Duration.seconds(66),
      minUpdatePeriod: cdk.Duration.seconds(10),
      suggestedPresentationDelay: cdk.Duration.seconds(10),
      filterConfiguration: {
        end: new Date('May 18, 2025 15:10:00'),
        start: new Date('May 18, 2025 15:00:00'),
        timeDelay: cdk.Duration.seconds(1),
        manifestFilter: [mediapackagev2.ManifestFilter.range(mediapackagev2.ManifestFilterKeys.AUDIO_SAMPLE_RATE, 0, 50000)],
      },
    }),
  ],
});

new IntegTest(app, 'cdk-integ-mediapackage-endpoint-dash', {
  testCases: [stack],
});

app.synth();
