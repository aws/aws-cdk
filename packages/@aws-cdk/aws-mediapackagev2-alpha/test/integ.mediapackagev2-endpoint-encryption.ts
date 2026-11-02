import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
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
    encryption: mediapackagev2.CmafEncryption.speke({
      keyRotationInterval: cdk.Duration.seconds(300),
      method: mediapackagev2.CmafEncryptionMethod.CBCS,
      drmSystems: [mediapackagev2.CmafDrmSystem.FAIRPLAY],
      audioPreset: mediapackagev2.PresetSpeke20Audio.SHARED,
      videoPreset: mediapackagev2.PresetSpeke20Video.SHARED,
      resourceId: 'abcdefghij',
      role: new Role(stack, 'Role', {
        assumedBy: new ServicePrincipal('mediapackagev2.amazonaws.com'),
      }),
      url: 'https://example.com/speke',
    }),
  }),
});

new IntegTest(app, 'cdk-integ-mediapackage-originendpoint-encryption', {
  testCases: [stack],
});

app.synth();
