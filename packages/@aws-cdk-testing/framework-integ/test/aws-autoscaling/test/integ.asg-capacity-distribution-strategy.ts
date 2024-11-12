#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-autoscaling-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

new autoscaling.AutoScalingGroup(stack, 'CapacityDistributionStrategy', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage(),
  availabilityZoneDistribution: {
    capacityDistributionStrategy: autoscaling.CapacityDistributionStrategy.BALANCED_ONLY,
  },
});

new integ.IntegTest(app, 'CapacityDistributionStrategyTest', {
  testCases: [stack],
});

app.synth();
