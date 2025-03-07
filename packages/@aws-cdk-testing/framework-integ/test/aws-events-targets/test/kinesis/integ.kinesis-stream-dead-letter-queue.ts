import * as events from 'aws-cdk-lib/aws-events';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-kinesis-event-target-dlq');

const stream = new kinesis.Stream(stack, 'MyStream');
const queue = new sqs.Queue(stack, 'Queue');

const event = new events.Rule(stack, 'EveryMinute', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

event.addTarget(new targets.KinesisStream(stream, {
  partitionKeyPath: events.EventField.eventId,
  retryAttempts: 2,
  maxEventAge: cdk.Duration.hours(2),
  deadLetterQueue: queue,
}));

new IntegTest(app, 'KinesisDlq', {
  testCases: [stack],
});
