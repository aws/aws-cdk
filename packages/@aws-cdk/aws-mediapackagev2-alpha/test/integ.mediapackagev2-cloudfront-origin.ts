/**
 * Integration test: MediaPackage V2 with CloudFront using MediaPackageV2Origin.
 *
 * Creates a channel group, channel, origin endpoint, and a CloudFront distribution
 * using the MediaPackageV2Origin helper class. This automatically creates an OAC
 * and wires the endpoint policy.
 */
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2-cloudfront-origin');

const group = new mediapackagev2.ChannelGroup(stack, 'Group', {
  channelGroupName: 'integ-cf-origin-group',
});

const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup: group,
  input: mediapackagev2.InputConfiguration.cmaf(),
});

const endpoint = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
  channel,
  segment: mediapackagev2.Segment.cmaf(),
  manifests: [
    mediapackagev2.Manifest.hls({ manifestName: 'index' }),
  ],
});

// Use MediaPackageV2Origin — auto-creates OAC and endpoint policy
const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: new mediapackagev2.MediaPackageV2Origin(endpoint, {
      channelGroup: group,
    }),
  },
});

new cdk.CfnOutput(stack, 'DistributionDomainName', { value: distribution.distributionDomainName });
new cdk.CfnOutput(stack, 'EndpointArn', { value: endpoint.originEndpointArn });

new IntegTest(app, 'cdk-integ-mediapackagev2-cloudfront-origin', {
  testCases: [stack],
});

app.synth();
