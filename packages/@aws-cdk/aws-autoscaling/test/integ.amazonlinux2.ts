#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as autoscaling from '../lib';

const app = new cdk.App();

const env = {
  region:  process.env.CDK_DEFAULT_REGION,
  account:  process.env.CDK_DEFAULT_ACCOUNT
};

const stack = new cdk.Stack(app, 'aws-cdk-autoscaling-integ', { env });

// const vpc = new ec2.Vpc(stack, 'VPC', {
//   maxAzs: 2,
// });

// use an existing vpc or create a new one
const vpc = stack.node.tryGetContext('use_default_vpc') === '1' ?
  ec2.Vpc.fromLookup(stack, 'Vpc', { isDefault: true }) :
  stack.node.tryGetContext('use_vpc_id') ?
    ec2.Vpc.fromLookup(stack, 'Vpc', { vpcId: stack.node.tryGetContext('use_vpc_id') }) :
    new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1 });


new autoscaling.AutoScalingGroup(stack, 'Fleet', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
  // maxInstanceLifetime: cdk.Duration.days(0),
});

app.synth();
