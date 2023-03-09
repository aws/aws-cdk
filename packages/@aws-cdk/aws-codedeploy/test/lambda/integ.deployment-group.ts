import * as path from 'path';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as codedeploy from '../../lib';


const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codedeploy-lambda');

const handler = new lambda.Function(stack, 'Handler', {
  code: lambda.Code.fromAsset(path.join(__dirname, 'handler')),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
});
const version = handler.currentVersion;
const blueGreenAlias = new lambda.Alias(stack, 'Alias', {
  aliasName: 'alias',
  version,
});

const preHook = new lambda.Function(stack, 'PreHook', {
  code: lambda.Code.fromAsset(path.join(__dirname, 'preHook')),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
});
const postHook = new lambda.Function(stack, 'PostHook', {
  code: lambda.Code.fromAsset(path.join(__dirname, 'postHook')),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
});

new codedeploy.LambdaDeploymentGroup(stack, 'BlueGreenDeployment', {
  alias: blueGreenAlias,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
  alarms: [
    new cloudwatch.Alarm(stack, 'BlueGreenErrors', {
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: 1,
      evaluationPeriods: 1,
      metric: blueGreenAlias.metricErrors(),
    }),
  ],
  preHook,
  postHook,
});

const secondAlias = new lambda.Alias(stack, 'SecondAlias', {
  aliasName: 'secondAlias',
  version,
});

new codedeploy.LambdaDeploymentGroup(stack, 'SecondDeployment', {
  alias: secondAlias,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.CANARY_10PERCENT_5MINUTES,
});

app.synth();
