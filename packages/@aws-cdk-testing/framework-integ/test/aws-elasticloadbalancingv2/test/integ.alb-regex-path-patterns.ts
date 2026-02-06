#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-regex-path-patterns');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
});

const listener = lb.addListener('Listener', {
  port: 80,
});

// Default target group
listener.addTargets('DefaultTarget', {
  port: 80,
  targets: [new elbv2.IpTarget('10.0.128.4')],
});

// Add action with regex path pattern for API routes
listener.addAction('ApiRoutes', {
  priority: 10,
  conditions: [
    elbv2.ListenerCondition.regexPathPatterns(['^/api/?.*$']),
  ],
  action: elbv2.ListenerAction.fixedResponse(200, {
    contentType: 'application/json',
    messageBody: '{"message":"API route matched"}',
  }),
});

// Add action with multiple regex patterns for versioned APIs
listener.addAction('VersionedRoutes', {
  priority: 20,
  conditions: [
    elbv2.ListenerCondition.regexPathPatterns([
      '^/v[0-9]+/.*$',
      '^/api/v[0-9]+/.*$',
    ]),
  ],
  action: elbv2.ListenerAction.fixedResponse(200, {
    contentType: 'application/json',
    messageBody: '{"message":"Versioned API route matched"}',
  }),
});

// Add action with regex for specific file extensions
listener.addAction('StaticFiles', {
  priority: 30,
  conditions: [
    elbv2.ListenerCondition.regexPathPatterns(['^/static/.*\\.(js|css|png|jpg)$']),
  ],
  action: elbv2.ListenerAction.fixedResponse(200, {
    contentType: 'text/plain',
    messageBody: 'Static file',
  }),
});

new IntegTest(app, 'AlbRegexPathPatternsTest', {
  testCases: [stack],
});

app.synth();
