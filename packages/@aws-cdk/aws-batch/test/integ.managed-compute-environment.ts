import { Vpc } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as batch from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'TestStack');
const vpc = new Vpc(stack, 'vpc');

new batch.ManagedEc2EcsComputeEnvironment(stack, 'CE', {
  vpc,
});

new IntegTest(app, 'ArchiveTest', {
  testCases: [stack],
});

app.synth();