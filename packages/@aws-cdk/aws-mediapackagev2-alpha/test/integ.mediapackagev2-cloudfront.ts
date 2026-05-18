import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2-cloudfront');

const group = new mediapackagev2.ChannelGroup(stack, 'Group', {
  channelGroupName: 'integ-cloudfront-group',
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

// Use the egress domain as a CloudFront origin (manual wiring without the helper class)
const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: new HttpOrigin(group.egressDomain, {
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
    }),
  },
});

// Output all attributes to verify they resolve
new cdk.CfnOutput(stack, 'EgressDomain', { value: group.egressDomain });
new cdk.CfnOutput(stack, 'DistributionDomainName', { value: distribution.distributionDomainName });
new cdk.CfnOutput(stack, 'EndpointArn', { value: endpoint.originEndpointArn });

new IntegTest(app, 'cdk-integ-mediapackagev2-cloudfront', {
  testCases: [stack],
});

app.synth();
