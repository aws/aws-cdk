import { AccountRootPrincipal, Role } from '@aws-cdk/aws-iam';
import { Key } from '@aws-cdk/aws-kms';
import { App, CfnOutput, RemovalPolicy, Stack } from '@aws-cdk/core';
import { Queue, QueueEncryption } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-sqs');

const dlq = new Queue(stack, 'DeadLetterQueue');
const queue = new Queue(stack, 'Queue', {
  deadLetterQueue: { queue: dlq, maxReceiveCount: 5 },
  encryption: QueueEncryption.KMS_MANAGED,
});
const fifo = new Queue(stack, 'FifoQueue', {
  fifo: true,
  encryptionMasterKey: new Key(stack, 'EncryptionKey', { removalPolicy: RemovalPolicy.DESTROY }),
});

const role = new Role(stack, 'Role', {
  assumedBy: new AccountRootPrincipal(),
});

dlq.grantConsumeMessages(role);
queue.grantConsumeMessages(role);
fifo.grantConsumeMessages(role);

new CfnOutput(stack, 'QueueUrl', { value: queue.queueUrl });

app.synth();
