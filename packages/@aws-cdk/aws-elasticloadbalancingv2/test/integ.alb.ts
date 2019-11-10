#!/usr/bin/env node
import {Alarm} from '@aws-cdk/aws-cloudwatch/lib';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');
import elbv2 = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true
});

const listener = lb.addListener('Listener', {
  port: 80,
});

const group1 = listener.addTargets('Target', {
  port: 80,
  targets: [new elbv2.IpTarget('10.0.1.1')]
});

const group2 = listener.addTargets('ConditionalTarget', {
  priority: 10,
  hostHeader: 'example.com',
  port: 80,
  targets: [new elbv2.IpTarget('10.0.1.2')]
});

const metric = group1.metricTargetResponseTime();

new Alarm(stack, 'ResponseTimeHigh1', {
  metric,
  threshold: 5,
  evaluationPeriods: 2,
});

const metric2 = group2.metricTargetResponseTime();

new Alarm(stack, 'ResponseTimeHigh2', {
  metric: metric2,
  threshold: 5,
  evaluationPeriods: 2
});

app.synth();
