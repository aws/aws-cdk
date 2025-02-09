import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const app = new App();
const stack = new Stack(app, 'lambda-events-cross-account');

const fn = lambda.Function.fromFunctionArn(
  stack,
  'External',
  'arn:aws:lambda:eu-west-1:234567890123:function:MyFn',
);

const timer = new events.Rule(stack, 'Timer', {
  schedule: events.Schedule.rate(Duration.minutes(1)),
});

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
});

timer.addTarget(new targets.LambdaFunction(fn, { role }));

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();
