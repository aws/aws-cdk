import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as config from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-config-rule-scoped-integ');

const fn = new lambda.Function(stack, 'CustomFunction', {
  code: lambda.AssetCode.fromInline('exports.handler = (event) => console.log(event);'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10_X,
});

const customRule = new config.CustomRule(stack, 'Custom', {
  lambdaFunction: fn,
  periodic: true,
});

customRule.scopeToResource('AWS::EC2::Instance');

app.synth();
