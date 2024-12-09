#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 3,
});

new elbv2.ApplicationLoadBalancer(stack, 'ALB', {
  vpc,
  crossZoneEnabled: true,
});

new elbv2.NetworkLoadBalancer(stack, 'NLB', {
  vpc,
  crossZoneEnabled: false,
});

new IntegTest(app, 'integ-test', {
  testCases: [stack],
});
