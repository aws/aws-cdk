#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
  http2Enabled: false,
  idleTimeout: cdk.Duration.seconds(1000),
  dropInvalidHeaderFields: true,
  desyncMitigationMode: elbv2.DesyncMitigationMode.DEFENSIVE,
  clientKeepAlive: cdk.Duration.seconds(1000),
  preserveHostHeader: true,
  xAmznTlsVersionAndCipherSuiteHeaders: true,
  preserveXffClientPort: true,
  xffHeaderProcessingMode: elbv2.XffHeaderProcessingMode.PRESERVE,
  wafFailOpen: true,
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

new elbv2.ApplicationLoadBalancer(stack, 'Http2EnabledTrue', {
  vpc,
  internetFacing: true,
  http2Enabled: true,
});

new integ.IntegTest(app, 'Elbv2Test', {
  testCases: [stack],
});

app.synth();
