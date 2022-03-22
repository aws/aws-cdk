#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import * as autoscaling from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-autoscaling-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

new autoscaling.AutoScalingGroup(stack, 'Fleet', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
  maxInstanceLifetime: cdk.Duration.days(7),
  minCapacity: 0,
  maxCapacity: 1,
  desiredCapacity: 0,
  init: ec2.CloudFormationInit.fromElements(
    ec2.InitPackage.yum('nginx'),
  ),
  signals: autoscaling.Signals.waitForAll({
    timeout: Duration.minutes(5),
  }),
  initOptions: {
    includeRole: true,
    includeUrl: true,
    httpsProxy: 'https://my-example-proxy.com',
    ignoreFailures: true,
  },
});

app.synth();
