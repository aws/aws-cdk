import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2');

const group = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
const channel = new mediapackagev2.Channel(stack, 'myChannel', {
  channelGroup: group,
  input: mediapackagev2.InputConfiguration.cmaf(),
});
const origin = new mediapackagev2.OriginEndpoint(stack, 'myEndpoint', {
  channel,
  segment: mediapackagev2.Segment.cmaf(),
  manifests: [
    mediapackagev2.Manifest.hls({
      manifestName: 'index',
    }),
  ],
});
origin.addToResourcePolicy(new PolicyStatement({
  sid: 'AllowRequestsFromCloudFront',
  principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
  effect: Effect.ALLOW,
  actions: ['mediapackagev2:GetHeadObject', 'mediapackagev2:GetObject'],
  resources: [origin.originEndpointArn],
  conditions: {
    StringEquals: {
      'aws:SourceArn': 'arn:aws:cloudfront::123456789012:distribution/AAAAAAAAA',
    },
  },
}));

new IntegTest(app, 'cdk-integ-mediapackage-endpoint-policy', {
  testCases: [stack],
});

app.synth();
