import { App, Stack } from 'aws-cdk-lib';
import * as ivs from '../lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

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
});
