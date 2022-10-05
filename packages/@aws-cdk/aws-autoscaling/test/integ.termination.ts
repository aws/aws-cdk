#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as autoscaling from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-autoscaling-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

const terminationFunction = new lambda.Function(stack, 'aws-cdk-autoscaling-integ-func', {
  runtime: lambda.Runtime.NODEJS_16_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('// Lambda function code... '),
});

new autoscaling.AutoScalingGroup(stack, 'Fleet', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
  maxInstanceLifetime: cdk.Duration.days(7),
  terminationPolicies: [
    autoscaling.TerminationPolicy.OLDEST_INSTANCE,
    autoscaling.TerminationPolicy.DEFAULT,
    autoscaling.TerminationPolicy.LAMBDA_FUNCTION,
  ],
  terminationPolicyLambdaFunctionArns: [
    terminationFunction.functionArn,
  ],
});

new integ.IntegTest(app, 'termination-inte-test', {
  testCases: [stack],
});

app.synth();
