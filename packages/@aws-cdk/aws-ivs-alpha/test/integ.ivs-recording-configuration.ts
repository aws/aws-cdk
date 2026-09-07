import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Channel, ChannelType, RecordingConfiguration, Resolution } from '../lib';
import { RenditionConfiguration } from '../lib/rendition-configuration';
import { Storage, ThumbnailConfiguration } from '../lib/thumbnail-configuration';

const app = new App();

const stack = new Stack(app, 'aws-cdk-ivs-recording-configuration-test');

const bucket = new Bucket(stack, 'Bucket', {
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const recordingConfiguration = new RecordingConfiguration(stack, 'RecordingConfiguration', {
  recordingConfigurationName: 'my-recording-configuration',
  bucket,
  recordingReconnectWindow: Duration.seconds(10),
  renditionConfiguration: RenditionConfiguration.custom([
    Resolution.FULL_HD,
    Resolution.HD,
    Resolution.SD,
    Resolution.LOWEST_RESOLUTION,
  ]),
  thumbnailConfiguration: ThumbnailConfiguration.interval(Resolution.FULL_HD, [Storage.LATEST, Storage.SEQUENTIAL], Duration.seconds(30)),
});

new Channel(stack, 'Channel', {
  type: ChannelType.ADVANCED_SD,
  recordingConfiguration,
});

new integ.IntegTest(app, 'ivs-recording-configuration-test', {
  testCases: [stack],
  regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1'], // IVS is only available in these regions
});
