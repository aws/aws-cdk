import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2');

const group = new mediapackagev2.ChannelGroup(stack, 'Group');
new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup: group,
  input: mediapackagev2.InputConfiguration.cmaf(),
  description: 'Input type is CMAF',
});

new IntegTest(app, 'cdk-integ-mediapackage-channel', {
  testCases: [stack],
});

app.synth();
