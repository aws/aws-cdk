import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2-key-rotation');

const group = new mediapackagev2.ChannelGroup(stack, 'Group');
const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup: group,
});

const spekeRole = new Role(stack, 'SpekeRole', {
  assumedBy: new ServicePrincipal('mediapackagev2.amazonaws.com'),
});

// CMAF CBCS with key rotation and custom presets
new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
  channel,
  manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
  segment: mediapackagev2.Segment.cmaf({
    encryption: mediapackagev2.CmafEncryption.speke({
      method: mediapackagev2.CmafEncryptionMethod.CBCS,
      drmSystems: [mediapackagev2.CmafDrmSystem.FAIRPLAY, mediapackagev2.CmafDrmSystem.WIDEVINE],
      resourceId: 'premium-content',
      url: 'https://example.com/speke',
      role: spekeRole,
      keyRotationInterval: cdk.Duration.seconds(300),
      audioPreset: mediapackagev2.PresetSpeke20Audio.PRESET_AUDIO_2,
      videoPreset: mediapackagev2.PresetSpeke20Video.PRESET_VIDEO_2,
      excludeSegmentDrmMetadata: true,
    }),
  }),
});

new IntegTest(app, 'cdk-integ-mediapackage-key-rotation', {
  testCases: [stack],
});

app.synth();
