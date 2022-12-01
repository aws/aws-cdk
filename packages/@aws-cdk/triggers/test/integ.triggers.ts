import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import { App, Duration, Stack } from '@aws-cdk/core';
import * as triggers from '../lib';
import { InvocationType } from '../lib';

const app = new App();
const stack = new Stack(app, 'MyStack');

const topic1 = new sns.Topic(stack, 'Topic1');
const topic2 = new sns.Topic(stack, 'Topic2');

const triggerFunction = new triggers.TriggerFunction(stack, 'MyTriggerFunction', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = function() { console.log("hi"); };'),
  executeBefore: [topic1],
});

const func = new lambda.Function(stack, 'MyLambdaFunction', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = function() { console.log("hi"); };'),
});

const trigger = new triggers.Trigger(stack, 'MyTrigger', {
  handler: func,
  invocationType: InvocationType.EVENT,
  timeout: Duration.minutes(1),
  executeAfter: [topic1],
});

triggerFunction.executeAfter(topic2);
trigger.executeAfter(topic2);

new triggers.TriggerFunction(stack, 'MySecondFunction', {
  runtime: lambda.Runtime.NODEJS_16_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = function() { console.log("hello"); };'),
});

app.synth();
