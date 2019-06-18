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
  instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Micro),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AmazonLinux2 }),
});

asg.scaleOnSchedule('ScaleUpInTheMorning', {
  schedule: autoscaling.Schedule.cron({ hour: '8', minute: '0' }),
  minCapacity: 5
});

asg.scaleOnSchedule('ScaleDownAtNight', {
  schedule: autoscaling.Schedule.cron({ hour: '20', minute: '0' }),
  maxCapacity: 2
});

asg.scaleOnCpuUtilization('KeepCPUReasonable', {
  targetUtilizationPercent: 50
});

app.synth();