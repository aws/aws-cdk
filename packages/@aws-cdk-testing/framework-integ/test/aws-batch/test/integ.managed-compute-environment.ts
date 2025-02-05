import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { LaunchTemplate } from 'aws-cdk-lib/aws-ec2';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { App, CfnParameter, Duration, Stack, Tags } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { AllocationStrategy, FargateComputeEnvironment, ManagedEc2EcsComputeEnvironment, EcsMachineImageType } from 'aws-cdk-lib/aws-batch';

const app = new App();
const stack = new Stack(app, 'batch-stack');
const vpc = new ec2.Vpc(stack, 'vpc', { restrictDefaultSecurityGroup: false });

const spotFleetRole = new Role(stack, 'SpotFleetRole', {
  assumedBy: new ServicePrincipal('batch.amazonaws.com'),
});

new FargateComputeEnvironment(stack, 'minimalPropsFargate', {
  vpc,
  maxvCpus: 512,
});

new FargateComputeEnvironment(stack, 'maximalPropsFargate', {
  vpc,
  maxvCpus: 512,
  computeEnvironmentName: 'maxPropsFargateCE',
  replaceComputeEnvironment: true,
  spot: true,
  terminateOnUpdate: true,
  updateTimeout: Duration.minutes(30),
  updateToLatestImageVersion: false,
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
  placementGroup: new ec2.PlacementGroup(stack, 'placementGroup'),
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
  spotFleetRole: spotFleetRole,
});

new ManagedEc2EcsComputeEnvironment(stack, 'AllocationStrategySPOT_CAPACITY', {
  vpc,
  images: [{
    image: new ec2.AmazonLinuxImage(),
  }],
  spot: true,
  spotBidPercentage: 95,
  allocationStrategy: AllocationStrategy.SPOT_CAPACITY_OPTIMIZED,
});

const taggedEc2Ecs = new ManagedEc2EcsComputeEnvironment(stack, 'taggedCE', {
  vpc,
  images: [{
    image: new ec2.AmazonLinuxImage(),
  }],
});

Tags.of(taggedEc2Ecs).add('foo', 'bar');
Tags.of(taggedEc2Ecs).add('super', 'salamander');

new ManagedEc2EcsComputeEnvironment(stack, 'ECS_AL2023', {
  vpc,
  images: [{
    imageType: EcsMachineImageType.ECS_AL2023,
  }],
});

new ManagedEc2EcsComputeEnvironment(stack, 'ParamertizedManagedCE', {
  vpc,
  images: [{
    image: new ec2.AmazonLinuxImage(),
  }],
  minvCpus: new CfnParameter(stack, 'MinVCpuParameter', {
    default: 512,
    minValue: 0,
    type: 'Number',
  }).valueAsNumber,
  maxvCpus: new CfnParameter(stack, 'MaxVCpuParameter', {
    default: 512,
    minValue: 1,
    type: 'Number',
  }).valueAsNumber,
  spot: true,
  spotBidPercentage: new CfnParameter(stack, 'SpotBidPercentageParameter', {
    default: 100,
    minValue: 1,
    type: 'Number',
  }).valueAsNumber,
  spotFleetRole: spotFleetRole,
});

new integ.IntegTest(app, 'BatchManagedComputeEnvironmentTest', {
  testCases: [stack],
});

app.synth();
