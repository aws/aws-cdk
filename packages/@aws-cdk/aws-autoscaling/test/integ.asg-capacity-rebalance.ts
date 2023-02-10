#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as autoscaling from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-autoscaling-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

new autoscaling.AutoScalingGroup(stack, 'CapacityRebalance', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
  capacityRebalance: true,
});

new integ.IntegTest(app, 'CapacityRebalanceTest', {
  testCases: [stack],
});

app.synth();
