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
  manifests: [
    mediapackagev2.Manifest.hls({
      manifestName: 'index',
    }),
  ],
  startoverWindow: cdk.Duration.seconds(900),
  segment: mediapackagev2.Segment.cmaf({
    name: 'segment',
    duration: cdk.Duration.seconds(6),
  }),
  forceEndpointConfigurationConditions:
    [mediapackagev2.EndpointErrorConfiguration.INCOMPLETE_MANIFEST, mediapackagev2.EndpointErrorConfiguration.STALE_MANIFEST],
});

new IntegTest(app, 'cdk-integ-mediapackage-endpoint-error-config', {
  testCases: [stack],
});

app.synth();
