import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ivs from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-ivs-multitarck-video');

new ivs.Channel(stack, 'ChannelWithMultitrackVideo', {
  type: ivs.ChannelType.STANDARD,
  containerFormat: ivs.ContainerFormat.FRAGMENTED_MP4,
  multitrackInputConfiguration: {
    maximumResolution: ivs.MaximumResolution.HD,
    policy: ivs.Policy.ALLOW,
  },
});

new integ.IntegTest(app, 'aws-cdk-ivs-multitarck-video-test', {
  testCases: [stack],
  regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1'], // IVS is only available in these regions
});
