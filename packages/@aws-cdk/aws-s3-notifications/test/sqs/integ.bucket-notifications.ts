import * as s3 from '@aws-cdk/aws-s3';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as s3n from '../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'sqs-bucket-notifications');

const bucket1 = new s3.Bucket(stack, 'Bucket1', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const queue = new sqs.Queue(stack, 'MyQueue');

bucket1.addObjectCreatedNotification(new s3n.SqsDestination(queue));

const bucket2 = new s3.Bucket(stack, 'Bucket2', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
bucket2.addObjectCreatedNotification(new s3n.SqsDestination(queue), { suffix: '.png' });

const encryptedQueue = new sqs.Queue(stack, 'EncryptedQueue', { encryption: sqs.QueueEncryption.KMS });
bucket1.addObjectRemovedNotification(new s3n.SqsDestination(encryptedQueue));


const integTest = new integ.IntegTest(app, 'SQSBucketNotificationsTest', {
  testCases: [stack],
});

integTest.assertions
  // First remove the test notifications
  .awsApiCall('SQS', 'purgeQueue', {
    QueueUrl: queue.queueUrl,
  })
  .next(integTest.assertions
    .awsApiCall('S3', 'putObject', {
      Bucket: bucket2.bucketName,
      Key: 'image.png',
      Body: 'Some content',
    }))
  .next(integTest.assertions
    .awsApiCall('SQS', 'receiveMessage', {
      QueueUrl: queue.queueUrl,
      WaitTimeSeconds: 20,
    })
    .assertAtPath('Messages.0.Body.Records.0.s3.object.key', integ.ExpectedResult.stringLikeRegexp('image\\.png')));

app.synth();
