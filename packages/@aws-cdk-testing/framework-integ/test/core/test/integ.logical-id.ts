import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as sqs from 'aws-cdk-lib/aws-sqs';

/**
 * This test creates resources using alphanumeric logical IDs.
 */

const app = new cdk.App();

const stack = new cdk.Stack(app);

new sqs.Queue(stack, '01234test', {
  visibilityTimeout: cdk.Duration.seconds(300),
});
new sqs.Queue(stack, 'test01234', {
  visibilityTimeout: cdk.Duration.seconds(300),
});

new integ.IntegTest(app, 'LogicalIdTest', {
  testCases: [stack],
});
