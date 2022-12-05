import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as lambda from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'current-version-options');

new lambda.Function(stack, 'F', {
  code: new lambda.InlineCode(`
  exports.handler = async(event) => {
    return "My versioned lambda";
  };
  `),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  currentVersionOptions: {
    provisionedConcurrentExecutions: 3,
  },
});

new integ.IntegTest(app, 'CurrentVersionOptions', {
  testCases: [stack],
});

app.synth();