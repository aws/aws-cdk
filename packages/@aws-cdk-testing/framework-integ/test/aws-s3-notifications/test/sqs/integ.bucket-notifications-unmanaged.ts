import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-sqs-bucket-notifications');

const bucket1 = new s3.Bucket(stack, 'Bucket1', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const unmanagedBucket = s3.Bucket.fromBucketName(stack, 'IntegUnmanagedBucket1', bucket1.bucketName);
const queue1 = new sqs.Queue(stack, 'IntegQueue1');
const queue2 = new sqs.Queue(stack, 'IntegQueue2');

unmanagedBucket.addObjectCreatedNotification(new s3n.SqsDestination(queue1), {
  prefix: 'bucket1',
});
unmanagedBucket.addObjectCreatedNotification(new s3n.SqsDestination(queue2), {
  prefix: 'bucket2',
  suffix: '.png',
});

const integTest = new integ.IntegTest(app, 'SQSBucketNotificationsTest', {
  testCases: [stack],
  diffAssets: true,
});

integTest.assertions
  // First remove the test notifications
  .awsApiCall('SQS', 'purgeQueue', {
    QueueUrl: queue1.queueUrl,
  })
  .next(integTest.assertions
    .awsApiCall('SQS', 'purgeQueue', {
      QueueUrl: queue2.queueUrl,
    }),
  )
  .next(integTest.assertions
    .awsApiCall('S3', 'putObject', {
      Bucket: bucket1.bucketName,
      Key: 'bucket1/image.png',
      Body: 'Some content',
    }))
  .next(integTest.assertions
    .awsApiCall('S3', 'putObject', {
      Bucket: bucket1.bucketName,
      Key: 'bucket2/image.png',
      Body: 'Some content',
    }))
  .next(integTest.assertions
    .awsApiCall('SQS', 'receiveMessage', {
      QueueUrl: queue1.queueUrl,
      WaitTimeSeconds: 20,
    })
    .assertAtPath('Messages.0.Body.Records.0.s3.object.key', integ.ExpectedResult.stringLikeRegexp('bucket1\/image\\.png')))
  .next(integTest.assertions
    .awsApiCall('SQS', 'receiveMessage', {
      QueueUrl: queue2.queueUrl,
      WaitTimeSeconds: 20,
    })
    .assertAtPath('Messages.0.Body.Records.0.s3.object.key', integ.ExpectedResult.stringLikeRegexp('bucket2\/image\\.png')));

app.synth();
