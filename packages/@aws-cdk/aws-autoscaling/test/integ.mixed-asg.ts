#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as autoscaling from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-autoscaling-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2
});

new autoscaling.AutoScalingGroup(stack, 'ASG', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
  maxCapacity: 2,
  minCapacity: 2,
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
  mixedInstancesPolicy: {
    instanceDistribution: {
      onDemandBaseCapacity: 0,
      onDemandPercentageAboveBaseCapacity: 0,
      spotAllocationStrategy: autoscaling.SpotAllocationStrategy.LOWESTPRICE,
      spotInstancePools: 10,
    },
    overrideInstanceTypes: [
      ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
      ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.LARGE),
      ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
    ]
  }
});