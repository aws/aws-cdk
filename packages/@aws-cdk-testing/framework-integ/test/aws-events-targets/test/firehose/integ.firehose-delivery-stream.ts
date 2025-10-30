import * as events from 'aws-cdk-lib/aws-events';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { IntegTest, ExpectedResult, AwsApiCall } from '@aws-cdk/integ-tests-alpha';

// ---------------------------------
// Define a rule that triggers a put to a Firehose delivery stream every 1min.

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-firehose-event-target');

const bucket = new s3.Bucket(stack, 'firehose-bucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const deliveryStream = new firehose.DeliveryStream(stack, 'MyDeliveryStream', {
  destination: new firehose.S3Bucket(bucket, {
    bufferingInterval: cdk.Duration.seconds(30),
  }),
});

const event = new events.Rule(stack, 'EveryMinute', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

event.addTarget(new targets.FirehoseDeliveryStream(deliveryStream));

const testCase = new IntegTest(app, 'firehose-event-target-integ', {
  testCases: [stack],
});

const s3ApiCall = testCase.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: bucket.bucketName,
  MaxKeys: 1,
}).expect(ExpectedResult.objectLike({
  KeyCount: 1,
})).waitForAssertions({
  interval: cdk.Duration.seconds(30),
  totalTimeout: cdk.Duration.minutes(10),
});

if (s3ApiCall instanceof AwsApiCall) {
  s3ApiCall.waiterProvider?.addToRolePolicy({
    Effect: 'Allow',
    Action: ['s3:GetObject', 's3:ListBucket'],
    Resource: ['*'],
  });
}
