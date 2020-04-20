#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import * as autoscaling from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-asg-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

const asg = new autoscaling.AutoScalingGroup(stack, 'Fleet', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage(),
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
});

const listener = lb.addListener('Listener', {
  port: 80,
});

listener.addTargets('Target', {
  port: 80,
  targets: [asg],
});

listener.connections.allowDefaultPortFromAnyIpv4('Open to the world');

asg.scaleOnRequestCount('AModestLoad', {
  targetRequestsPerSecond: 1,
});

app.synth();
