import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2-cmaf-cenc');

const group = new mediapackagev2.ChannelGroup(stack, 'Group');
const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup: group,
});

const spekeRole = new Role(stack, 'SpekeRole', {
  assumedBy: new ServicePrincipal('mediapackagev2.amazonaws.com'),
});

// CMAF + CENC supports PlayReady, Widevine, and Irdeto
new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
  channel,
  manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
  segment: mediapackagev2.Segment.cmaf({
    encryption: mediapackagev2.CmafEncryption.speke({
      method: mediapackagev2.CmafEncryptionMethod.CENC,
      drmSystems: [mediapackagev2.CmafDrmSystem.PLAYREADY, mediapackagev2.CmafDrmSystem.WIDEVINE],
      resourceId: 'cmaf-cenc-content',
      url: 'https://example.com/speke',
      role: spekeRole,
    }),
  }),
});

new IntegTest(app, 'cdk-integ-mediapackage-cmaf-cenc', {
  testCases: [stack],
});

app.synth();
