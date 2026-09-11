/**
 * Integration test: Channel import and manifest name uniqueness validation.
 *
 * Creates a channel group, channel, and origin endpoint with multiple unique
 * manifest types. Imports the channel via fromChannelAttributes with explicit
 * region and verifies the region property is exposed.
 */
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2-import-channel');

// Create resources
const group = new mediapackagev2.ChannelGroup(stack, 'Group', {
  channelGroupName: 'import-test-group',
});

const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup: group,
  channelName: 'import-test-channel',
});

// Endpoint with multiple unique manifest types (exercises manifest name validation)
new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
  channel,
  originEndpointName: 'import-test-endpoint',
  segment: mediapackagev2.Segment.cmaf(),
  manifests: [
    mediapackagev2.Manifest.hls({ manifestName: 'hls-index' }),
    mediapackagev2.Manifest.dash({ manifestName: 'dash-index' }),
  ],
});

// Import the channel via attributes with explicit region
const importedChannel = mediapackagev2.Channel.fromChannelAttributes(stack, 'ImportedChannel', {
  channelGroupName: 'import-test-group',
  channelName: 'import-test-channel',
  region: stack.region,
});

// Verify the imported channel exposes region
new cdk.CfnOutput(stack, 'ImportedChannelRegion', {
  value: importedChannel.region,
});

new IntegTest(app, 'cdk-integ-mediapackagev2-import-channel', {
  testCases: [stack],
});

app.synth();
