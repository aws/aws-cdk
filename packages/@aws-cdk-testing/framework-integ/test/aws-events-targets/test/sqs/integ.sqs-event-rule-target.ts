import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';

// ---------------------------------
// Define a rule that triggers an SQS queue every 1min.
// The queue is encrypted with KMS and only the specified role has access to the key.

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-sqs-event-target');

// Create the IAM role that will have access to the KMS key
const kmsKeyAccessRole = new iam.Role(stack, 'EventBusRole', {
  assumedBy: new iam.ServicePrincipal('events.amazonaws.com'), // Changed to events service
  description: 'Role for accessing KMS key for SQS encryption',
  roleName: 'EventBusAccessRole',
});

const key = new kms.Key(stack, 'MyKey', {
  description: 'KMS key for SQS queue encryption',
});

key.grantEncryptDecrypt(kmsKeyAccessRole);

const event = new events.Rule(stack, 'MyRule', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

const queue = new sqs.Queue(stack, 'MyQueue', {
  encryption: sqs.QueueEncryption.KMS,
  encryptionMasterKey: key,
});

const deadLetterQueue = new sqs.Queue(stack, 'MyDeadLetterQueue', {
  encryption: sqs.QueueEncryption.KMS,
  encryptionMasterKey: key,
});

event.addTarget(new targets.SqsQueue(queue, {
  deadLetterQueue,
}));

app.synth();
