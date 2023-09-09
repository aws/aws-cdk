import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, Stack, Duration } from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as batch from 'aws-cdk-lib/aws-batch';

const app = new App();
const stack = new Stack(app, 'stack');
const vpc = new Vpc(stack, 'vpc', { restrictDefaultSecurityGroup: false });

const fairsharePolicy = new batch.FairshareSchedulingPolicy(stack, 'fairshare', {
  computeReservation: 75,
  schedulingPolicyName: 'joBBQFairsharePolicy',
  shareDecay: Duration.hours(1),
  shares: [{
    shareIdentifier: 'shareA',
    weightFactor: 0.5,
  }],
});

const queue = new batch.JobQueue(stack, 'joBBQ', {
  computeEnvironments: [{
    computeEnvironment: new batch.ManagedEc2EcsComputeEnvironment(stack, 'managedEc2CE', {
      vpc,
    }),
    order: 1,
  }],
  priority: 10,
  schedulingPolicy: fairsharePolicy,
});

fairsharePolicy.addShare({
  shareIdentifier: 'shareB',
  weightFactor: 7,
});

queue.addComputeEnvironment(
  new batch.ManagedEc2EcsComputeEnvironment(stack, 'newManagedEc2CE', {
    vpc,
  }),
  2,
);

new integ.IntegTest(app, 'BatchEcsJobDefinitionTest', {
  testCases: [stack],
});

app.synth();
