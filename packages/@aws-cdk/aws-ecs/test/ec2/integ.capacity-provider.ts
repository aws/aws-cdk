import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';
import { CapacityProvider } from '../../lib/capacity-provider';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new cdk.Stack(app, 'integ-capacity-provider2', { env });

// const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1});
const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', { isDefault: true })

const asg = new AutoScalingGroup(stack, 'ASG', {
  vpc,  
  machineImage: new ecs.EcsOptimizedAmi(),
  instanceType: new ec2.InstanceType('t3.large'),
  maxCapacity: 5,
  minCapacity: 1,
});

const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
});

cluster.addAutoScalingGroup(asg)

const cp = new CapacityProvider(stack, 'CP', {
  autoscalingGroup: asg,
  managedScaling: true,
  managedTerminationProtection: true,
});

// cluster.addCapacityProvider(cp);



// const asgSpot = new AutoScalingGroup(stack, 'ASGSpot', {
//   vpc,
//   machineImage: new ecs.EcsOptimizedAmi(),
//   instanceType: new ec2.InstanceType('t3.large'),
//   maxCapacity: 5,
//   minCapacity: 1,
//   spotPrice: '0.1088',
// });



// const cpSpot = new CapacityProvider(stack, 'CPSpot', {
//   autoscalingGroup: asgSpot,
// });



