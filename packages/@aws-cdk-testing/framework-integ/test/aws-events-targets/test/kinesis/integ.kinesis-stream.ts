import * as events from 'aws-cdk-lib/aws-events';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';

// ---------------------------------
// Define a rule that triggers a put to a Kinesis stream every 1min.

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-kinesis-event-target');

const stream = new kinesis.Stream(stack, 'MyStream');
const event = new events.Rule(stack, 'EveryMinute', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

event.addTarget(new targets.KinesisStream(stream, {
  partitionKeyPath: events.EventField.eventId,
}));

app.synth();
