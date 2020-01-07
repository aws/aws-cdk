import * as events from '@aws-cdk/aws-events';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'lambda-events');

const fn = new lambda.Function(stack, 'MyFunc', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`)
});

const timer = new events.Rule(stack, 'Timer', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
timer.addTarget(new targets.LambdaFunction(fn));

const timer2 = new events.Rule(stack, 'Timer2', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
});
timer2.addTarget(new targets.LambdaFunction(fn));

app.synth();

// tslint:disable:no-console
function handler(event: any, _context: any, callback: any) {
  console.log(JSON.stringify(event, undefined, 2));
  return callback();
}
