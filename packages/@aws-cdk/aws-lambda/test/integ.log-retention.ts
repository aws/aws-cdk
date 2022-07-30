/// !cdk-integ pragma:ignore-assets
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-lambda-log-retention');

new lambda.Function(stack, 'OneWeek', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  logRetention: logs.RetentionDays.ONE_WEEK,
});

new lambda.Function(stack, 'OneMonth', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  logRetention: logs.RetentionDays.ONE_MONTH,
});

new lambda.Function(stack, 'OneYear', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  logRetention: logs.RetentionDays.ONE_YEAR,
});

app.synth();
