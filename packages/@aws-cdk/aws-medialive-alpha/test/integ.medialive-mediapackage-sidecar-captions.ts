import * as mediapackagev2 from '@aws-cdk/aws-mediapackagev2-alpha';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as medialive from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-medialive-mediapackage-sidecar-captions');

// --- MediaPackage V2 ---
const empGroup = new mediapackagev2.ChannelGroup(stack, 'EmpGroup', {
  channelGroupName: 'integ-sidecar-captions-group',
});

const empChannel = new mediapackagev2.Channel(stack, 'EmpChannel', {
  channelGroup: empGroup,
  channelName: 'integ-sidecar-captions-channel',
});

new mediapackagev2.OriginEndpoint(stack, 'HlsEndpoint', {
  channel: empChannel,
  originEndpointName: 'integ-sidecar-captions-hls',
  segment: mediapackagev2.Segment.cmaf(),
  manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
});

// --- MediaLive Input ---
const input = new medialive.Input(stack, 'SrtInput', {
  inputName: 'integ-sidecar-captions-input',
  input: medialive.InputConfiguration.srtCaller([{
    srtListenerAddress: '203.0.113.20',
    srtListenerPort: 5000,
  }]),
});

// --- IAM Role ---
const role = new iam.Role(stack, 'MediaLiveRole', {
  assumedBy: new iam.ServicePrincipal('medialive.amazonaws.com'),
});

// --- Encodes ---
const video = medialive.EncodeConfiguration.video({
  name: 'video-1080p',
  width: 1920,
  height: 1080,
  codec: medialive.VideoCodecSettings.h264({
    rateControl: medialive.H264RateControl.cbr({ bitrate: cdk.Bitrate.mbps(5) }),
    profile: medialive.H264Profile.HIGH,
    framerate: medialive.Framerate.FPS_29_97,
  }),
});

const audio = medialive.EncodeConfiguration.audio({
  name: 'aac-stereo',
  codec: medialive.AudioCodecSettings.aac({ bitrate: cdk.Bitrate.kbps(192) }),
});

const selector = medialive.CaptionSelector.embedded('captions');

const ttml = medialive.EncodeConfiguration.caption({
  name: 'ttml-eng',
  captionSelectorName: selector.name,
  languageCode: 'eng',
  languageDescription: 'English',
  destination: medialive.CaptionDestination.ttml(),
});

// --- MediaLive Channel ---
const channel = new medialive.Channel(stack, 'SidecarCaptionChannel', {
  channelName: 'integ-sidecar-captions-channel',
  channelClass: medialive.ChannelClass.SINGLE_PIPELINE,
  role,
  inputs: [{
    input,
    captionSelectors: [selector],
  }],
  outputGroups: [
    medialive.OutputGroupConfiguration.mediaPackageV2({
      name: 'emp',
      channel: empChannel,
      outputs: [
        { encode: video, outputName: 'video' },
        { encode: audio, outputName: 'audio' },
        { encode: ttml, outputName: 'ttml' },
      ],
    }),
  ],
});

new cdk.CfnOutput(stack, 'ChannelArn', { value: channel.channelArn });

new IntegTest(app, 'cdk-integ-medialive-mediapackage-sidecar-captions', {
  testCases: [stack],
});
