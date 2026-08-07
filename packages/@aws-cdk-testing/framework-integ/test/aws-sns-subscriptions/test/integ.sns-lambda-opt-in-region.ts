/**
 * Notes on how to run this integ test
 *
 * This test exercises {@link subs.LambdaSubscription}'s
 * `additionalServicePrincipalRegions` prop. The topic lives in an opt-in region
 * (`ap-east-1`); cross-region delivery to the Lambda function in `us-east-2`
 * therefore requires the regionalized SNS service principal
 * `sns.ap-east-1.amazonaws.com` on both the Lambda's resource policy and on the
 * subscription's dead-letter queue resource policy.
 *
 * Deploying this test requires an account that has opted into `ap-east-1`. To
 * regenerate the snapshot without deploying, run:
 *
 *   yarn integ aws-sns-subscriptions/test/integ.sns-lambda-opt-in-region.js \
 *     --dry-run --update-on-failed
 */

import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App();

const topicStack = new cdk.Stack(app, 'TopicStack', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: 'ap-east-1',
  },
});
const topic = new sns.Topic(topicStack, 'MyTopic', {
  topicName: cdk.PhysicalName.GENERATE_IF_NEEDED,
});

const functionStack = new cdk.Stack(app, 'FunctionStack', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-2',
  },
});
const fction = new lambda.Function(functionStack, 'Echo', {
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
});
const dlq = new sqs.Queue(functionStack, 'DLQ');

topic.addSubscription(new subs.LambdaSubscription(fction, {
  additionalServicePrincipalRegions: ['ap-east-1'],
  deadLetterQueue: dlq,
}));

new IntegTest(app, 'SnsLambdaOptInRegionTest', {
  testCases: [topicStack, functionStack],
});

function handler(event: any, _context: any, callback: any) {
  console.log('====================================================');
  console.log(JSON.stringify(event, undefined, 2));
  console.log('====================================================');
  return callback(undefined, event);
}
