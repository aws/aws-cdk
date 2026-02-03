#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-drop-invalid-headers');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

// Create ALB with dropInvalidHeaderFields set to true
const lbWithDropEnabled = new elbv2.ApplicationLoadBalancer(stack, 'LBDropEnabled', {
  vpc,
  internetFacing: true,
  dropInvalidHeaderFields: true,
});

const listenerEnabled = lbWithDropEnabled.addListener('ListenerEnabled', {
  port: 80,
});

listenerEnabled.addTargets('TargetsEnabled', {
  port: 80,
  targets: [new elbv2.IpTarget('10.0.128.4')],
});

// Create ALB with dropInvalidHeaderFields explicitly set to false
const lbWithDropDisabled = new elbv2.ApplicationLoadBalancer(stack, 'LBDropDisabled', {
  vpc,
  internetFacing: true,
  dropInvalidHeaderFields: false,
});

const listenerDisabled = lbWithDropDisabled.addListener('ListenerDisabled', {
  port: 80,
});

listenerDisabled.addTargets('TargetsDisabled', {
  port: 80,
  targets: [new elbv2.IpTarget('10.0.128.5')],
});

// Create ALB without dropInvalidHeaderFields set (default behavior)
const lbDefault = new elbv2.ApplicationLoadBalancer(stack, 'LBDefault', {
  vpc,
  internetFacing: true,
});

const listenerDefault = lbDefault.addListener('ListenerDefault', {
  port: 80,
});

listenerDefault.addTargets('TargetsDefault', {
  port: 80,
  targets: [new elbv2.IpTarget('10.0.128.6')],
});

new IntegTest(app, 'AlbDropInvalidHeaderFieldsTest', {
  testCases: [stack],
});

app.synth();
