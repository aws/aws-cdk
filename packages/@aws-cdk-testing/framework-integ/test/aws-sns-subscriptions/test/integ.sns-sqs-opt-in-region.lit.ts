/**
 * Notes on how to run this integ test
 *
 * This test exercises {@link subs.SqsSubscription}'s
 * `additionalServicePrincipalRegions` prop. The topic lives in an opt-in region
 * (`ap-east-1`); cross-region delivery to the SQS queue in `us-east-2`
 * therefore requires the regionalized SNS service principal
 * `sns.ap-east-1.amazonaws.com` on the queue's resource policy.
 *
 * Deploying this test requires an account that has opted into `ap-east-1`. To
 * regenerate the snapshot without deploying, run:
 *
 *   yarn integ aws-sns-subscriptions/test/integ.sns-sqs-opt-in-region.lit.js \
 *     --dry-run --update-on-failed
 */

import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';

const app = new cdk.App();

/// !show
const topicStack = new cdk.Stack(app, 'TopicStack', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: 'ap-east-1',
  },
});
const topic = new sns.Topic(topicStack, 'MyTopic', {
  topicName: cdk.PhysicalName.GENERATE_IF_NEEDED,
});

const queueStack = new cdk.Stack(app, 'QueueStack', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-2',
  },
});
const queue = new sqs.Queue(queueStack, 'MyQueue');

topic.addSubscription(new subs.SqsSubscription(queue, {
  additionalServicePrincipalRegions: ['ap-east-1'],
}));
/// !hide

new IntegTest(app, 'SnsSqsOptInRegionTest', {
  testCases: [topicStack, queueStack],
});
