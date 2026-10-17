import * as events from 'aws-cdk-lib/aws-events';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

// ---------------------------------
// Define a rule that triggers an SNS topic every 1min.
// Connect the topic with a queue. This means that the queue should have
// a message sent to it every minute.

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-sqs-event-target');

const key = new kms.Key(stack, 'MyKey');

const event = new events.Rule(stack, 'MyRule', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

const queue = new sqs.Queue(stack, 'MyQueue', {
  encryption: sqs.QueueEncryption.KMS,
  encryptionMasterKey: key,
});
// Suppress false positive: queue uses separate QueuePolicy resource (not inline), which is the correct pattern
(queue.node.defaultChild as cdk.CfnResource).addMetadata('guard', {
  SuppressedRules: ['SQS_NO_WORLD_ACCESSIBLE_INLINE'],
});

const deadLetterQueue = new sqs.Queue(stack, 'MyDeadLetterQueue', {
  encryption: sqs.QueueEncryption.SQS_MANAGED,
});
// Suppress false positive: queue uses separate QueuePolicy resource (not inline), which is the correct pattern
(deadLetterQueue.node.defaultChild as cdk.CfnResource).addMetadata('guard', {
  SuppressedRules: ['SQS_NO_WORLD_ACCESSIBLE_INLINE'],
});

event.addTarget(new targets.SqsQueue(queue, {
  deadLetterQueue,
}));

// Test messageGroupId support for standard (non-FIFO) queues
const standardQueue = new sqs.Queue(stack, 'StandardQueue', {
  encryption: sqs.QueueEncryption.SQS_MANAGED,
});
// Suppress false positive: queue uses separate QueuePolicy resource (not inline), which is the correct pattern
(standardQueue.node.defaultChild as cdk.CfnResource).addMetadata('guard', {
  SuppressedRules: ['SQS_NO_WORLD_ACCESSIBLE_INLINE'],
});

const standardQueueEvent = new events.Rule(stack, 'StandardQueueRule', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

standardQueueEvent.addTarget(new targets.SqsQueue(standardQueue, {
  messageGroupId: 'MyMessageGroupId',
}));

new IntegTest(app, 'integ.sqs-event-rule-target', {
  testCases: [stack],
  allowDestroy: [
    'AWS::SQS::Queue',
    'AWS::SQS::QueuePolicy',
    'AWS::Events::Rule',
  ],
});
