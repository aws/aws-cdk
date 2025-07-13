import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'stack');

new lambda.Function(stack, 'LambdaWithRecursionLoopProtection', {
  runtime: Runtime.PYTHON_3_9,
  handler: 'index.handler',
  code: new InlineCode('foo'),
  recursiveLoop: lambda.RecursiveLoop.TERMINATE,
});

new lambda.Function(stack, 'LambdaWithoutRecursionLoopProtection', {
  runtime: Runtime.PYTHON_3_9,
  handler: 'index.handler',
  code: new InlineCode('foo'),
  recursiveLoop: lambda.RecursiveLoop.ALLOW,
});

new lambda.Function(stack, 'LambdaWithDefaultRecursionLoopProtection', {
  runtime: Runtime.PYTHON_3_9,
  handler: 'index.handler',
  code: new InlineCode('foo'),
});

new IntegTest(app, 'LambdaRecursiveLoopTest', {
  testCases: [stack],
});
