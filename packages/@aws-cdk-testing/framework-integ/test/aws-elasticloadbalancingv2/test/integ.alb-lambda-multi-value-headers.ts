#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-lambda-multi-value-headers');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

const fn = new lambda.Function(stack, 'Function', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log('Event:', JSON.stringify(event));
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello from Lambda!'
        })
      };
    };
  `),
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', {
  vpc,
  internetFacing: true,
});

const listener = lb.addListener('Listener', {
  port: 80,
});

const multiValueEnabledGroup = new elbv2.ApplicationTargetGroup(stack, 'MultiValueEnabledGroup', {
  targetGroupName: 'multi-value-enabled',
  targetType: elbv2.TargetType.LAMBDA,
  targets: [new targets.LambdaTarget(fn)],
  multiValueHeadersEnabled: true,
});

const multiValueDisabledGroup = new elbv2.ApplicationTargetGroup(stack, 'MultiValueDisabledGroup', {
  targetGroupName: 'multi-value-disabled',
  targetType: elbv2.TargetType.LAMBDA,
  targets: [new targets.LambdaTarget(fn)],
  multiValueHeadersEnabled: false,
});

const defaultGroup = new elbv2.ApplicationTargetGroup(stack, 'DefaultGroup', {
  targetGroupName: 'default-group',
  targetType: elbv2.TargetType.LAMBDA,
  targets: [new targets.LambdaTarget(fn)],
});

listener.addAction('MultiValueEnabledAction', {
  priority: 10,
  conditions: [
    elbv2.ListenerCondition.pathPatterns(['/multi-value-enabled']),
  ],
  action: elbv2.ListenerAction.forward([multiValueEnabledGroup]),
});

listener.addAction('MultiValueDisabledAction', {
  priority: 20,
  conditions: [
    elbv2.ListenerCondition.pathPatterns(['/multi-value-disabled']),
  ],
  action: elbv2.ListenerAction.forward([multiValueDisabledGroup]),
});

listener.addAction('DefaultAction', {
  action: elbv2.ListenerAction.forward([defaultGroup]),
});

new IntegTest(app, 'integ-alb-lambda-multi-value-headers', {
  testCases: [stack],
});
