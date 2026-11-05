import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

/**
 * This test demonstrates the discriminator feature of uniqueResourceName.
 * It creates multiple SQS queues from the same construct using different
 * discriminators to ensure each gets a unique name.
 */

const app = new cdk.App();

const stack = new cdk.Stack(app, 'Stack');

// Create a parent construct
const parentConstruct = new Construct(stack, 'ParentConstruct');

// Generate unique names using discriminators before creating child resources
const name1 = cdk.Names.uniqueResourceName(parentConstruct, { discriminator: 'queue1' });
const name2 = cdk.Names.uniqueResourceName(parentConstruct, { discriminator: 'queue2' });
const name3 = cdk.Names.uniqueResourceName(parentConstruct, { discriminator: 'queue3' });

// Create SQS queues with the unique names
// If names were not unique, CloudFormation deployment would fail
new sqs.Queue(parentConstruct, 'Queue1', {
  queueName: name1,
  encryption: sqs.QueueEncryption.SQS_MANAGED,
});

new sqs.Queue(parentConstruct, 'Queue2', {
  queueName: name2,
  encryption: sqs.QueueEncryption.SQS_MANAGED,
});

new sqs.Queue(parentConstruct, 'Queue3', {
  queueName: name3,
  encryption: sqs.QueueEncryption.SQS_MANAGED,
});

// Test without discriminator (should still work)
const nameWithoutDiscriminator = cdk.Names.uniqueResourceName(parentConstruct, {});
new sqs.Queue(parentConstruct, 'QueueWithoutDiscriminator', {
  queueName: nameWithoutDiscriminator,
  encryption: sqs.QueueEncryption.SQS_MANAGED,
});

new integ.IntegTest(app, 'UniqueResourceNameDiscriminatorTest', {
  testCases: [stack],
});
