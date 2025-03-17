import * as events from 'aws-cdk-lib/aws-events';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

// ---------------------------------
// Define a rule that triggers a put to a Kinesis stream every 1min.

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-firehose-event-target');

const bucket = new s3.Bucket(stack, 'firehose-bucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const stream = new firehose.DeliveryStream(stack, 'MyStream', {
  destination: new firehose.S3Bucket(bucket, {
    bufferingInterval: cdk.Duration.seconds(30),
  }),
});

const event = new events.Rule(stack, 'EveryMinute', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

event.addTarget(new targets.FirehoseDeliveryStream(stream));

new IntegTest(app, 'firehose-event-target-integ', {
  testCases: [stack],
});
