#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as elbv2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
  http2Enabled: false,
  idleTimeout: cdk.Duration.seconds(1000),
  dropInvalidHeaderFields: true,
  desyncMitigationMode: elbv2.DesyncMitigationMode.DEFENSIVE,
});

new elbv2.ApplicationLoadBalancer(stack, 'DesyncMitigationModeMonitor', {
  vpc,
  internetFacing: true,
  desyncMitigationMode: elbv2.DesyncMitigationMode.MONITOR,
});

new elbv2.ApplicationLoadBalancer(stack, 'DesyncMitigationModeStrictest', {
  vpc,
  internetFacing: true,
  desyncMitigationMode: elbv2.DesyncMitigationMode.STRICTEST,
});

new integ.IntegTest(app, 'Elbv2Test', {
  testCases: [stack],
});

app.synth();
