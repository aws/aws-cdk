import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as config from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-config-rule-scoped-integ', {
  env: { account: '123456789012', region: 'us-east-1' },
});

const fn = new lambda.Function(stack, 'CustomFunction', {
  code: lambda.AssetCode.fromInline('exports.handler = (event) => console.log(event);'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  functionName: 'coolrule',
});

new config.CustomRule(stack, 'Custom', {
  lambdaFunction: fn,
  periodic: true,
  ruleScope: config.RuleScope.fromResources([config.ResourceType.EC2_INSTANCE]),
});

app.synth();
