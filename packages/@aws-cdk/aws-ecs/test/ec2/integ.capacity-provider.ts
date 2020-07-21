import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';
import { CapacityProvider } from '../../lib/capacity-provider';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-capacity-provider');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1});

const asg = new AutoScalingGroup(stack, 'ASG', {
  vpc,
  machineImage: new ecs.EcsOptimizedAmi(),
  instanceType: new ec2.InstanceType('t3.large'),
  maxCapacity: 5,
  minCapacity: 1,
});

const asgSpot = new AutoScalingGroup(stack, 'ASGSpot', {
  vpc,
  machineImage: new ecs.EcsOptimizedAmi(),
  instanceType: new ec2.InstanceType('t3.large'),
  maxCapacity: 5,
  minCapacity: 1,
  spotPrice: '0.1088',
});

const cp = new CapacityProvider (stack, 'CP', {
  autoscalingGroup: asg,
  managedScaling: true,
  managedTerminationProtection: true,
});

const cpSpot = new CapacityProvider(stack, 'CPSpot', {
  autoscalingGroup: asgSpot,
});

const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
});

cluster.addCapacityProvider(cp, cpSpot);
