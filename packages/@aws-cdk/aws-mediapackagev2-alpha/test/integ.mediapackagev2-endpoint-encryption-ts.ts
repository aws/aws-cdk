import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2-ts-encryption');

const group = new mediapackagev2.ChannelGroup(stack, 'Group');
const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup: group,
  input: mediapackagev2.InputConfiguration.hls(),
});

const spekeRole = new Role(stack, 'SpekeRole', {
  assumedBy: new ServicePrincipal('mediapackagev2.amazonaws.com'),
});

// TS + SAMPLE_AES defaults to FairPlay
new mediapackagev2.OriginEndpoint(stack, 'TsSampleAes', {
  channel,
  manifests: [mediapackagev2.Manifest.hls({ manifestName: 'sample-aes' })],
  segment: mediapackagev2.Segment.ts({
    encryption: mediapackagev2.TsEncryption.speke({
      method: mediapackagev2.TsEncryptionMethod.SAMPLE_AES,
      resourceId: 'ts-sample-aes-content',
      url: 'https://example.com/speke',
      role: spekeRole,
    }),
  }),
});

// TS + AES_128 defaults to Clear Key AES 128
new mediapackagev2.OriginEndpoint(stack, 'TsAes128', {
  channel,
  manifests: [mediapackagev2.Manifest.hls({ manifestName: 'aes128' })],
  segment: mediapackagev2.Segment.ts({
    encryption: mediapackagev2.TsEncryption.speke({
      method: mediapackagev2.TsEncryptionMethod.AES_128,
      resourceId: 'ts-aes128-content',
      url: 'https://example.com/speke',
      role: spekeRole,
    }),
  }),
});

new IntegTest(app, 'cdk-integ-mediapackage-ts-encryption', {
  testCases: [stack],
});

app.synth();
