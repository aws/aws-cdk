#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as elbv2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
});

const listener = lb.addListener('Listener', {
  port: 80,
});

const group1 = listener.addTargets('Target', {
  port: 80,
  targets: [new elbv2.IpTarget('10.0.128.4')],
});

const group2 = listener.addTargets('ConditionalTarget', {
  priority: 10,
  hostHeader: 'example.com',
  port: 80,
  targets: [new elbv2.IpTarget('10.0.128.5')],
});

group1.metricTargetResponseTime().createAlarm(stack, 'ResponseTimeHigh1', {
  threshold: 5,
  evaluationPeriods: 2,
});

group2.metricTargetResponseTime().createAlarm(stack, 'ResponseTimeHigh2', {
  threshold: 5,
  evaluationPeriods: 2,
});

app.synth();
