import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2-attributes');

// Create full resource chain
const group = new mediapackagev2.ChannelGroup(stack, 'Group', {
  channelGroupName: 'integ-attributes-group',
});

const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup: group,
  input: mediapackagev2.InputConfiguration.cmaf(),
});

const endpoint = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
  channel,
  segment: mediapackagev2.Segment.cmaf(),
  manifests: [
    mediapackagev2.Manifest.hls({ manifestName: 'hls-primary' }),
    mediapackagev2.Manifest.hls({ manifestName: 'hls-backup' }),
    mediapackagev2.Manifest.lowLatencyHLS({ manifestName: 'llhls' }),
    mediapackagev2.Manifest.dash({ manifestName: 'dash-primary' }),
    mediapackagev2.Manifest.dash({ manifestName: 'dash-backup' }),
  ],
});

// Output all attributes to verify they resolve to real values
new cdk.CfnOutput(stack, 'GroupEgressDomain', { value: group.egressDomain });
new cdk.CfnOutput(stack, 'ChannelIngestUrl0', { value: channel.ingestEndpointUrls[0] });
new cdk.CfnOutput(stack, 'ChannelIngestUrl1', { value: channel.ingestEndpointUrls[1] });
new cdk.CfnOutput(stack, 'GroupCreatedAt', { value: group.createdAt ?? 'undefined' });
new cdk.CfnOutput(stack, 'GroupModifiedAt', { value: group.modifiedAt ?? 'undefined' });
new cdk.CfnOutput(stack, 'ChannelCreatedAt', { value: channel.createdAt ?? 'undefined' });
new cdk.CfnOutput(stack, 'ChannelModifiedAt', { value: channel.modifiedAt ?? 'undefined' });
new cdk.CfnOutput(stack, 'EndpointCreatedAt', { value: endpoint.createdAt ?? 'undefined' });
new cdk.CfnOutput(stack, 'EndpointModifiedAt', { value: endpoint.modifiedAt ?? 'undefined' });
new cdk.CfnOutput(stack, 'EndpointHlsUrls', { value: (endpoint.hlsManifestUrls ?? []).toString() });
new cdk.CfnOutput(stack, 'EndpointLlHlsUrls', { value: (endpoint.lowLatencyHlsManifestUrls ?? []).toString() });
new cdk.CfnOutput(stack, 'EndpointDashUrls', { value: (endpoint.dashManifestUrls ?? []).toString() });

new IntegTest(app, 'cdk-integ-mediapackagev2-attributes', {
  testCases: [stack],
});

app.synth();
