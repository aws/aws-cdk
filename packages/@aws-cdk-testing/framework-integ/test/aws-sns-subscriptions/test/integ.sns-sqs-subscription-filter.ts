import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'sns-sqs-subscription-filter');

const topic = new sns.Topic(stack, 'MyTopic');

const queue = new sqs.Queue(stack, 'MyQueue');

topic.addSubscription(new subs.SqsSubscription(queue, {
  filterPolicyWithMessageBody: {
    background: sns.Policy.policy({
      color: sns.Filter.filter(sns.SubscriptionFilter.stringFilter({
        allowlist: ['red', 'green'],
        denylist: ['white', 'orange'],
      })),
    }),
    price: sns.Filter.filter(sns.SubscriptionFilter.numericFilter({
      allowlist: [100, 200],
      between: { start: 300, stop: 350 },
      greaterThan: 500,
      lessThan: 1000,
      betweenStrict: { start: 2000, stop: 3000 },
    })),
    store: sns.Filter.filter(sns.SubscriptionFilter.existsFilter()),
    event: sns.Filter.filter(sns.SubscriptionFilter.notExistsFilter()),
  },
  rawMessageDelivery: true,
}));

new IntegTest(app, 'SNS Subscription filters', {
  testCases: [stack],
});
