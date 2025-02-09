import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';

const app = new App();
const stack = new Stack(app, 'sqs-events-cross-account');

const queue = sqs.Queue.fromQueueArn(
  stack,
  'External',
  'arn:aws:sqs:eu-west-1:234567890123:MyQueue',
);

const timer = new events.Rule(stack, 'Timer', {
  schedule: events.Schedule.rate(Duration.minutes(1)),
});

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
});

timer.addTarget(new targets.SqsQueue(queue, { role }));

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();
