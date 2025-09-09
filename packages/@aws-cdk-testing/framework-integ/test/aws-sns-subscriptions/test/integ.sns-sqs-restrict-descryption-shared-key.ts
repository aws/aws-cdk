import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';

const app = new cdk.App({
  context: {
    '@aws-cdk/aws-sns-subscriptions:restrictSqsDescryption': true,
  },
});

const stack = new cdk.Stack(app, 'SnsSqsRestrictDescryptionSharedKeyStack');

const key = new kms.Key(stack, 'SharedKey');
const topic = new sns.Topic(stack, 'MyTopic', { masterKey: key });
const queue = new sqs.Queue(stack, 'MyQueue', {
  encryption: sqs.QueueEncryption.KMS,
  encryptionMasterKey: key,
});

// This should throw a validation error during synthesis
topic.addSubscription(new subs.SqsSubscription(queue));

new IntegTest(app, 'SNS SQS Restrict Descryption Shared Key', {
  testCases: [stack],
});

