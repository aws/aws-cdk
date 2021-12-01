import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'stack');

new lambda.Function(stack, 'MyFunc1', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
  insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_54_0,
});

new lambda.Function(stack, 'MyFunc2', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
  insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_86_0,
});

new lambda.Function(stack, 'MyFunc3', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
  insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_89_0,
});

new lambda.Function(stack, 'MyFunc4', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
  insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_98_0,
});

app.synth();

/* eslint-disable no-console */
function handler(event: any, _context: any, callback: any) {
  console.log(JSON.stringify(event, undefined, 2));
  return callback();
}
