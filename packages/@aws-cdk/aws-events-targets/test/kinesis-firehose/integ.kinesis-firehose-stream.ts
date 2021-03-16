import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';

// ---------------------------------
// Define a rule that triggers a put to a Kinesis stream every 1min.

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-firehose-event-target');

const bucket = new s3.Bucket(stack, 'firehose-bucket');
const firehoseRole = new iam.Role(stack, 'firehose-role', {
  assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
});
const stream = new firehose.CfnDeliveryStream(stack, 'MyStream', {
  extendedS3DestinationConfiguration: {
    bucketArn: bucket.bucketArn,
    roleArn: firehoseRole.roleArn,
  },
});
bucket.grantReadWrite(firehoseRole);

const event = new events.Rule(stack, 'EveryMinute', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

event.addTarget(new targets.KinesisFirehoseStream(stream, {}));

app.synth();
