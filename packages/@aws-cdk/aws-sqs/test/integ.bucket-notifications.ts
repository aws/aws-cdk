import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import sqs = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'sqs-bucket-notifications');

const bucket1 = new s3.Bucket(stack, 'Bucket1', {
  removalPolicy: cdk.RemovalPolicy.Destroy
});
const queue = new sqs.Queue(stack, 'MyQueue');

bucket1.onObjectCreated(queue);

const bucket2 = new s3.Bucket(stack, 'Bucket2', {
  removalPolicy: cdk.RemovalPolicy.Destroy
});
bucket2.onObjectCreated(queue, { suffix: '.png' });

const encryptedQueue = new sqs.Queue(stack, 'EncryptedQueue', { encryption: sqs.QueueEncryption.Kms });
bucket1.onObjectRemoved(encryptedQueue);

app.run();
