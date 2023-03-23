import * as ec2 from '@aws-cdk/aws-ec2';
import { LaunchTemplate } from '@aws-cdk/aws-ec2';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { App, Duration, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { AllocationStrategy, FargateComputeEnvironment, ManagedEc2EcsComputeEnvironment } from '../lib';

const app = new App();
const stack = new Stack(app, 'batch-stack');
const vpc = new ec2.Vpc(stack, 'vpc');

new FargateComputeEnvironment(stack, 'minimalPropsFargate', {
  vpc,
  maxvCpus: 512,
});

new FargateComputeEnvironment(stack, 'maximalPropsFargate', {
  vpc,
  maxvCpus: 512,
  name: 'FargateCEName',
  replaceComputeEnvironment: true,
  spot: true,
  terminateOnUpdate: true,
  updateTimeout: Duration.minutes(30),
  updateToLatestImageVersion: false,
  serviceRole: new Role(stack, 'ServiceRole', {
    assumedBy: new ServicePrincipal('batch.amazonaws.com'),
  }),
});

new ManagedEc2EcsComputeEnvironment(stack, 'minimalPropsEc2', {
  vpc,
  images: [{
    image: new ec2.AmazonLinuxImage(),
  }],
});

new ManagedEc2EcsComputeEnvironment(stack, 'LaunchTemplate', {
  vpc,
  images: [{
    image: new ec2.AmazonLinuxImage(),
  }],
  allocationStrategy: AllocationStrategy.BEST_FIT,
  minvCpus: 256,
  maxvCpus: 512,
  replaceComputeEnvironment: true,
  terminateOnUpdate: false,
  updateTimeout: Duration.hours(1),
  launchTemplate: new LaunchTemplate(stack, 'launchTemplate'),
});

new ManagedEc2EcsComputeEnvironment(stack, 'SpotEc2', {
  vpc,
  images: [{
    image: new ec2.AmazonLinuxImage(),
  }],
  spot: true,
  spotBidPercentage: 95,
  spotFleetRole: new Role(stack, 'SpotFleetRole', {
    assumedBy: new ServicePrincipal('batch.amazonaws.com'),
  }),
});

new integ.IntegTest(app, 'BatchManagedComputeEnvironmentTest', {
  testCases: [stack],
});

app.synth();