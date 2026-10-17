import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2-ism-encryption');

const group = new mediapackagev2.ChannelGroup(stack, 'Group');
const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup: group,
});

const spekeRole = new Role(stack, 'SpekeRole', {
  assumedBy: new ServicePrincipal('mediapackagev2.amazonaws.com'),
});

// ISM + CENC with PlayReady (default)
new mediapackagev2.OriginEndpoint(stack, 'IsmEndpoint', {
  channel,
  manifests: [mediapackagev2.Manifest.mss({ manifestName: 'index' })],
  segment: mediapackagev2.Segment.ism({
    encryption: mediapackagev2.IsmEncryption.speke({
      resourceId: 'ism-content',
      url: 'https://example.com/speke',
      role: spekeRole,
    }),
  }),
});

new IntegTest(app, 'cdk-integ-mediapackage-ism-encryption', {
  testCases: [stack],
});

app.synth();
