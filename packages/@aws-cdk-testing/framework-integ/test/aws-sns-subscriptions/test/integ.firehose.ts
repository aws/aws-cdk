import { AwsApiCall, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-sns-firehose');

const topic = new sns.Topic(stack, 'MyTopic');
const deadLetterQueue = new sqs.Queue(stack, 'DeadLetterQueue');

const bucket = new s3.Bucket(stack, 'Bucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const deliveryStream = new firehose.DeliveryStream(stack, 'DeliveryStream', {
  destination: new firehose.S3Bucket(bucket, {
    bufferingInterval: cdk.Duration.seconds(30),
    loggingConfig: { logging: false },
  }),
});

topic.addSubscription(new subs.FirehoseSubscription(deliveryStream, {
  deadLetterQueue,
}));

const integTest = new IntegTest(app, 'sns-firehose-integ', {
  testCases: [stack],
});

integTest.assertions.awsApiCall('sns', 'Publish', {
  TopicArn: topic.topicArn,
  Message: 'Hello, world!',
});
const s3ApiCall = integTest.assertions.awsApiCall('s3', 'ListObjectsV2', {
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
