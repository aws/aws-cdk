import * as s3 from '@aws-cdk/aws-s3';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
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
});
bucket2.addObjectCreatedNotification(new s3n.SqsDestination(queue), { suffix: '.png' });

const encryptedQueue = new sqs.Queue(stack, 'EncryptedQueue', { encryption: sqs.QueueEncryption.KMS });
bucket1.addObjectRemovedNotification(new s3n.SqsDestination(encryptedQueue));

app.synth();
