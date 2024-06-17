#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Metric } from 'aws-cdk-lib/aws-cloudwatch';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-autoscaling-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'Fleet', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
  spotPrice: '0.20',
});

const metric = new Metric({
  namespace: 'Repro',
  metricName: 'Metric',
});

autoScalingGroup.scaleOnMetric('MetricScale', {
  metric,
  scalingSteps: [
    { upper: 10, change: -5 },
    { lower: 50, change: 5 },
  ],
  cooldown: cdk.Duration.minutes(5), // should ignore this property and deploy successfully
});

new IntegTest(app, 'step-scaling-with-cooldown', {
  testCases: [stack],
});
