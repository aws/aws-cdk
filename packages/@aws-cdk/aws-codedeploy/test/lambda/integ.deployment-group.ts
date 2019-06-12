import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import codedeploy = require('../../lib');

import path = require('path');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codedeploy-lambda');

const handler = new lambda.Function(stack, `Handler`, {
  code: lambda.Code.asset(path.join(__dirname, 'handler')),
  handler: 'index.handler',
  runtime: lambda.Runtime.Nodejs810,
});
const version = handler.addVersion('1');
const blueGreenAlias = new lambda.Alias(stack, `Alias`, {
  aliasName: `alias`,
  version
});

const preHook = new lambda.Function(stack, `PreHook`, {
  code: lambda.Code.asset(path.join(__dirname, 'preHook')),
  handler: 'index.handler',
  runtime: lambda.Runtime.Nodejs810
});
const postHook = new lambda.Function(stack, `PostHook`, {
  code: lambda.Code.asset(path.join(__dirname, 'postHook')),
  handler: 'index.handler',
  runtime: lambda.Runtime.Nodejs810
});

new codedeploy.LambdaDeploymentGroup(stack, 'BlueGreenDeployment', {
  alias: blueGreenAlias,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.Linear10PercentEvery1Minute,
  alarms: [
    new cloudwatch.Alarm(stack, 'BlueGreenErrors', {
      comparisonOperator: cloudwatch.ComparisonOperator.GreaterThanThreshold,
      threshold: 1,
      evaluationPeriods: 1,
      metric: blueGreenAlias.metricErrors()
    })
  ],
  preHook,
  postHook
});

app.synth();
