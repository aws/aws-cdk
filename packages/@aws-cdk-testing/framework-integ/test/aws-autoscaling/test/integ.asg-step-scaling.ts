#!/usr/bin/env node
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'autoscaling-step-scaling');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
});
asg.scaleOnMetric('StepScaling', {
  metric: new cloudwatch.Metric({ namespace: 'AWS/EC2', metricName: 'CPUUtilization', dimensionsMap: { AutoScalingGroupName: asg.autoScalingGroupName } }),
  scalingSteps: [
    { upper: 10, change: -1 },
    { lower: 50, change: +1 },
    { lower: 90, change: +2 },
  ],
  adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
  evaluationPeriods: 10,
  datapointsToAlarm: 5,
  metricAggregationType: autoscaling.MetricAggregationType.MAXIMUM,
});
asg.scaleOnMetric('StepScalingWithDefaultAdjustmentType', {
  metric: new cloudwatch.Metric({ namespace: 'AWS/EC2', metricName: 'DiskWriteOps', dimensionsMap: { AutoScalingGroupName: asg.autoScalingGroupName } }),
  scalingSteps: [
    { upper: 100, change: -1 },
    { lower: 300, change: +1 },
    { lower: 500, change: +2 },
  ],
  evaluationPeriods: 10,
  datapointsToAlarm: 5,
  metricAggregationType: autoscaling.MetricAggregationType.MAXIMUM,
});

new integ.IntegTest(app, 'autoscaling-step-scaling-integ', {
  testCases: [stack],
});

app.synth();
