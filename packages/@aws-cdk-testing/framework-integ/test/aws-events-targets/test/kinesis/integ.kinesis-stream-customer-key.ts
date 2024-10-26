import * as events from 'aws-cdk-lib/aws-events';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

// ---------------------------------
// Define a rule that triggers a put to a Kinesis stream encrypted by a customer-managed KMS key every 1min.

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-kinesis-event-target');

const stream = new kinesis.Stream(stack, 'MyStream', {
  encryption: kinesis.StreamEncryption.KMS,
});
const event = new events.Rule(stack, 'EveryMinute', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

event.addTarget(new targets.KinesisStream(stream, {
  partitionKeyPath: events.EventField.eventId,
}));

new IntegTest(app, 'KinesisKms', {
  testCases: [stack],
});
