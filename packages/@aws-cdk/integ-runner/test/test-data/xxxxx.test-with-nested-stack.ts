/**
 * This is NOT a real integ test!
 * It is used to create snapshots for testing the integ-runner.
 * Kep around so that adjustments are easier in future.
 */
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'test-stack');
new lambda.Function(stack, 'MyFunction', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
});

const nestedStack = new cdk.NestedStack(stack, 'nested', {});
new sns.Topic(nestedStack, 'MyTopic');
new lambda.Function(nestedStack, 'MyNestedFunction', {
  code: lambda.Code.fromAsset('assets/code-asset'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
});


new integ.IntegTest(app, 'TestWithNestedStack', {
  testCases: [stack],
});

app.synth();
