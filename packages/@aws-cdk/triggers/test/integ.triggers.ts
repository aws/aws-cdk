import * as lambda from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { Trigger } from '../lib';

const app = new App();
const stack = new Stack(app, 'MyStack');

const handler = new lambda.Function(stack, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_12_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = function() { console.log("hi"); };'),
});

new Trigger(stack, 'MyTrigger', { handler });

app.synth();