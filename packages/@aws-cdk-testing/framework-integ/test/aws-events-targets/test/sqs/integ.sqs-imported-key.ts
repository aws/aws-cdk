import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as events from 'aws-cdk-lib/aws-events';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';

// ---------------------------------
// Test that using an imported KMS key with EventBridge -> SQS generates a warning.
// The warning indicates that users must manually configure KMS key permissions
// since CDK cannot modify imported key policies.

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-sqs-event-target-imported-key');

const importedKey = kms.Key.fromKeyArn(stack, 'ImportedKey',
  'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');

const queue = new sqs.Queue(stack, 'MyQueue', {
  encryptionMasterKey: importedKey,
});

const event = new events.Rule(stack, 'MyRule', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

event.addTarget(new targets.SqsQueue(queue));

new IntegTest(app, 'SqsImportedKeyTest', {
  testCases: [stack],
});
