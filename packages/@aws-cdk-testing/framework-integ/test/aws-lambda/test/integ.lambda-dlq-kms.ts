import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/*
 * Lambda functions whose dead-letter queue or topic is encrypted with a
 * customer managed KMS key. The function role must be allowed to use the key,
 * otherwise failed asynchronous invocations cannot be delivered.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-lambda-dlq-kms');

const queueKey = new kms.Key(stack, 'QueueKey', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const deadLetterQueue = new sqs.Queue(stack, 'DeadLetterQueue', {
  encryption: sqs.QueueEncryption.KMS,
  encryptionMasterKey: queueKey,
});
new lambda.Function(stack, 'FunctionWithEncryptedQueue', {
  code: new lambda.InlineCode('exports.handler = async () => { throw new Error("fail"); };'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
  deadLetterQueue,
});

const topicKey = new kms.Key(stack, 'TopicKey', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const deadLetterTopic = new sns.Topic(stack, 'DeadLetterTopic', {
  masterKey: topicKey,
});
new lambda.Function(stack, 'FunctionWithEncryptedTopic', {
  code: new lambda.InlineCode('exports.handler = async () => { throw new Error("fail"); };'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
  deadLetterTopic,
});

new IntegTest(app, 'lambda-dlq-kms', {
  testCases: [stack],
});
