import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Function, InlineCode, Runtime, UpdateRuntimeOn } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-lambda-runtime-management');

new Function(stack, 'Lambda', {
  code: new InlineCode('foo'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_18_X,
  runtimeManagement: {
    mode: UpdateRuntimeOn.AUTO,
  },
});

new integ.IntegTest(app, 'lambda-runtime-management', {
  testCases: [stack],
});

app.synth();
