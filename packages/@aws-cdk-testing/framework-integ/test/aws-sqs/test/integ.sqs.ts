import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { Key } from 'aws-cdk-lib/aws-kms';
import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { DeduplicationScope, FifoThroughputLimit, Queue, QueueEncryption } from 'aws-cdk-lib/aws-sqs';

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
const highThroughputFifo = new Queue(stack, 'HighThroughputFifoQueue', {
  fifo: true,
  fifoThroughputLimit: FifoThroughputLimit.PER_MESSAGE_GROUP_ID,
  deduplicationScope: DeduplicationScope.MESSAGE_GROUP,
});
const sqsManagedEncryptedQueue = new Queue(stack, 'SqsManagedEncryptedQueue', {
  encryption: QueueEncryption.SQS_MANAGED,
});
const unencryptedQueue = new Queue(stack, 'UnencryptedQueue', {
  encryption: QueueEncryption.UNENCRYPTED,
});
const ssl = new Queue(stack, 'SSLQueue', { enforceSSL: true });

const role = new Role(stack, 'Role', {
  assumedBy: new AccountRootPrincipal(),
});

dlq.grantConsumeMessages(role);
queue.grantConsumeMessages(role);
fifo.grantConsumeMessages(role);
highThroughputFifo.grantConsumeMessages(role);
sqsManagedEncryptedQueue.grantConsumeMessages(role);
unencryptedQueue.grantConsumeMessages(role);
ssl.grantConsumeMessages(role);

new CfnOutput(stack, 'QueueUrl', { value: queue.queueUrl });

new integ.IntegTest(app, 'SqsTest', {
  testCases: [stack],
});

app.synth();
