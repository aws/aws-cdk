import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'stack');

new lambda.Function(stack, 'Lambda', {
  code: lambda.Code.fromInline('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
  tracingMode: lambda.TracingMode.ACTIVE,
});

new IntegTest(app, 'LambdaTest', {
  testCases: [stack],
});
