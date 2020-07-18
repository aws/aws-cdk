import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as autoscaling from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-asg-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 3,
});

const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage(),
  vpc,
  groupMetrics: [new autoscaling.GroupMetrics()],
});
asg.emitGroupMetrics(
  autoscaling.GroupMetric.PENDING_INSTANCES,
  autoscaling.GroupMetric.STANDBY_INSTANCES,
  autoscaling.GroupMetric.TOTAL_INSTANCES,
  autoscaling.GroupMetric.TOTAL_INSTANCES,
);

app.synth();
