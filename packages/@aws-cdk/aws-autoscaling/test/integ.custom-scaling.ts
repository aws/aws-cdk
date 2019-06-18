#!/usr/bin/env node
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import autoscaling = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-autoscaling-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAZs: 2
});

const asg = new autoscaling.AutoScalingGroup(stack, 'Fleet', {
  vpc,
  instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
});

asg.scaleOnSchedule('ScaleUpInTheMorning', {
  schedule: autoscaling.Cron.dailyUtc(8),
  minCapacity: 5
});

asg.scaleOnSchedule('ScaleDownAtNight', {
  schedule: autoscaling.Cron.dailyUtc(20),
  maxCapacity: 2
});

asg.scaleOnCpuUtilization('KeepCPUReasonable', {
  targetUtilizationPercent: 50
});

app.synth();