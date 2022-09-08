import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { LambdaDestination } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-logs-destinations-lambda');

const fn = new lambda.Function(stack, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_16_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = function(event, ctx, cb) { return cb("hi", null); }'),
});

const logGroup = new logs.LogGroup(stack, 'LogGroup');
new logs.SubscriptionFilter(stack, 'LogSubscriptionFilter', {
  destination: new LambdaDestination(fn),
  logGroup,
  filterPattern: logs.FilterPattern.allEvents(),
});

new IntegTest(app, 'LogsDestinationsLambda', {
  testCases: [stack],
});