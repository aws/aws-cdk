import { AwsApiCall, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import { FirehosePutRecord } from 'aws-cdk-lib/aws-scheduler-targets';

/*
 * Stack verification steps:
 * A record is put to the Amazon Data Firehose stream by the scheduler
 * The firehose deliveries the record to S3 bucket
 * The assertion checks there is an object in the S3 bucket
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-scheduler-targets-firehose-put-record');

const payload = {
  Data: 'record',
};

const destinationBucket = new Bucket(stack, 'DestinationBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const deliveryStreamRole = new cdk.aws_iam.Role(stack, 'deliveryStreamRole', {
  assumedBy: new cdk.aws_iam.ServicePrincipal('firehose.amazonaws.com'),
});

destinationBucket.grantReadWrite(deliveryStreamRole);

const firehoseStream = new firehose.DeliveryStream(stack, 'MyFirehoseStream', {
  destination: new firehose.S3Bucket(destinationBucket, {
    role: deliveryStreamRole,
    bufferingInterval: cdk.Duration.minutes(1),
  }),
});

new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new FirehosePutRecord(firehoseStream, {
    input: scheduler.ScheduleTargetInput.fromObject(payload),
  }),
});

const integrationTest = new IntegTest(app, 'integrationtest-firehose-put-record', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this would cause the schedule to trigger with the old code
});

// Verifies that an object was delivered to the S3 bucket by the firehose
const objects = integrationTest.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: destinationBucket.bucketName,
  MaxKeys: 1,
}).expect(ExpectedResult.objectLike({
  KeyCount: 1,
})).waitForAssertions({
  interval: cdk.Duration.seconds(30),
  totalTimeout: cdk.Duration.minutes(10),
});

if (objects instanceof AwsApiCall && objects.waiterProvider) {
  objects.waiterProvider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['s3:GetObject', 's3:ListBucket'],
    Resource: ['*'],
  });
}
