import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2');

new mediapackagev2.ChannelGroup(stack, 'Group');

new IntegTest(app, 'cdk-integ-mediapackage-channel-group', {
  testCases: [stack],
});

app.synth();
