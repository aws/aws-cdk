#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-autoscaling-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const asg = new autoscaling.AutoScalingGroup(stack, 'Fleet', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
});

asg.scaleOnSchedule('ScaleUpInTheMorning', {
  schedule: autoscaling.Schedule.cron({ hour: '8', minute: '0' }),
  minCapacity: 5,
});

asg.scaleOnSchedule('ScaleDownAtNight', {
  schedule: autoscaling.Schedule.cron({ hour: '20', minute: '0' }),
  maxCapacity: 2,
});

asg.scaleOnSchedule('ScaleUpInTheDay', {
  schedule: autoscaling.Schedule.cron({ minute: '0/10', day: '1' }),
  minCapacity: 5,
});

asg.scaleOnSchedule('ScaleUpInTheWeekDay', {
  schedule: autoscaling.Schedule.cron({ minute: '0/10', weekDay: 'MON-SUN' }),
  minCapacity: 5,
});

asg.scaleOnCpuUtilization('KeepCPUReasonable', {
  targetUtilizationPercent: 50,
});

app.synth();
