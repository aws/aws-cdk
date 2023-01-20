import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as triggers from '../lib';

const app = new App();
const stack = new Stack(app, 'MyStack');

const topic1 = new sns.Topic(stack, 'Topic1');
const topic2 = new sns.Topic(stack, 'Topic2');

const trigger = new triggers.TriggerFunction(stack, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = function() { console.log("hi"); };'),
  executeBefore: [topic1],
});

trigger.executeAfter(topic2);

new triggers.TriggerFunction(stack, 'MySecondFunction', {
  runtime: lambda.Runtime.NODEJS_16_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = function() { console.log("hello"); };'),
});

new integ.IntegTest(app, 'TriggerTest', {
  testCases: [stack],
});

app.synth();
