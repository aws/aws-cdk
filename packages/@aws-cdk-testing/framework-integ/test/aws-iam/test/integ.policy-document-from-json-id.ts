import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cxapi from 'aws-cdk-lib/cx-api';

const app = new App({
  postCliContext: {
    [cxapi.IAM_POLICY_DOCUMENT_FROM_JSON_KEEPS_ID]: true,
  },
});
const stack = new Stack(app, 'aws-cdk-iam-policy-document-from-json-id');

const queue = new sqs.Queue(stack, 'Queue', {
  encryption: sqs.QueueEncryption.SQS_MANAGED,
});

// The L2 QueuePolicy has no document property, so the document is passed to the L1 CfnQueuePolicy
new sqs.CfnQueuePolicy(stack, 'QueuePolicy', {
  queues: [queue.queueUrl],
  policyDocument: iam.PolicyDocument.fromJson({
    Version: '2012-10-17',
    Id: 'queue-policy-from-json',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: stack.formatArn({ service: 'iam', region: '', resource: 'root' }) },
        Action: 'sqs:SendMessage',
        Resource: queue.queueArn,
      },
    ],
  }),
});

const integ = new IntegTest(app, 'PolicyDocumentFromJsonIdTest', {
  testCases: [stack],
});

integ.assertions.awsApiCall('SQS', 'getQueueAttributes', {
  QueueUrl: queue.queueUrl,
  AttributeNames: ['Policy'],
}).expect(ExpectedResult.objectLike({
  Attributes: {
    Policy: Match.serializedJson(Match.objectLike({
      Id: 'queue-policy-from-json',
    })),
  },
}));
