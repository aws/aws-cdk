import * as events from 'aws-cdk-lib/aws-events';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { STANDARD_NODEJS_RUNTIME } from '../../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'lambda-events');

const fn = new lambda.Function(stack, 'MyFunc', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
});

const timer = new events.Rule(stack, 'Timer', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
timer.addTarget(new targets.LambdaFunction(fn));

const timer2 = new events.Rule(stack, 'Timer2', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
});
timer2.addTarget(new targets.LambdaFunction(fn));

const timer3 = new events.Rule(stack, 'Timer3', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
});

const queue = new sqs.Queue(stack, 'Queue');

timer3.addTarget(new targets.LambdaFunction(fn, {
  deadLetterQueue: queue,
  maxEventAge: cdk.Duration.hours(2),
  retryAttempts: 0,
}));

app.synth();

/* eslint-disable no-console */
function handler(event: any, _context: any, callback: any) {
  console.log(JSON.stringify(event, undefined, 2));
  return callback();
}
