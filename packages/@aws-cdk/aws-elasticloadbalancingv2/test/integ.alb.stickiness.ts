#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as elbv2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

// Duration-based stickiness cookie
const lb1 = new elbv2.ApplicationLoadBalancer(stack, 'LB1', {
  vpc,
  internetFacing: true,
});

const listener1 = lb1.addListener('Listener1', {
  port: 80,
});

const tg1 = new elbv2.ApplicationTargetGroup(stack, 'TG1', {
  targetType: elbv2.TargetType.INSTANCE,
  port: 80,
  stickinessCookieDuration: cdk.Duration.hours(1),
  vpc,
});

listener1.addTargetGroups('TG1', {
  targetGroups: [tg1],
});

// Application-based stickiness cookie
const lb2 = new elbv2.ApplicationLoadBalancer(stack, 'LB2', {
  vpc,
  internetFacing: true,
});

const listener2 = lb2.addListener('Listener2', {
  port: 80,
});

const tg2 = new elbv2.ApplicationTargetGroup(stack, 'TG2', {
  targetType: elbv2.TargetType.INSTANCE,
  port: 80,
  stickinessCookieDuration: cdk.Duration.hours(1),
  stickinessCookieName: 'MyDeliciousCookie',
  vpc,
});

listener2.addTargetGroups('TG2', {
  targetGroups: [tg2],
});

app.synth();
