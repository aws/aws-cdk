import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'stack');

new lambda.Function(stack, 'MyFunc1', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
  insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_54_0,
});

new lambda.Function(stack, 'MyFunc2', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
  insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_86_0,
});

new lambda.Function(stack, 'MyFunc3', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
  insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_89_0,
});

new lambda.Function(stack, 'MyFunc4', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
  insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_98_0,
});

new lambda.Function(stack, 'MyFunc5', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
  insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_119_0,
});

new lambda.Function(stack, 'MyFunc6', {
  runtime: STANDARD_NODEJS_RUNTIME,
  architecture: lambda.Architecture.ARM_64,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
  insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_119_0,
});

app.synth();

/* eslint-disable no-console */
function handler(event: any, _context: any, callback: any) {
  console.log(JSON.stringify(event, undefined, 2));
  return callback();
}
