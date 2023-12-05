import * as scheduler from '@aws-cdk/aws-scheduler-alpha';
import { AwsApiCall, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { KinesisDataFirehosePutRecord } from '../lib';

/*
 * Stack verification steps:
 * A record is put to the kinesis data firehose stream by the scheduler
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

const firehose = new CfnDeliveryStream(stack, 'MyFirehose', {
  s3DestinationConfiguration: {
    bucketArn: destinationBucket.bucketArn,
    roleArn: deliveryStreamRole.roleArn,
    bufferingHints: {
      intervalInSeconds: 60,
    },
  },
});

new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new KinesisDataFirehosePutRecord(firehose, {
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

app.synth();
