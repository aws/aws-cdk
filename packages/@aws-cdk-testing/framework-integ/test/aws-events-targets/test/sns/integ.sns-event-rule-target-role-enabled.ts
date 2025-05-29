import * as events from 'aws-cdk-lib/aws-events';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

// ---------------------------------
// Define a rule that triggers an SNS topic every 1min.
// Connect the topic with a queue. This means that the queue should have
// a message sent to it every minute. A custom role is attached to the target.

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-sns-event-target');

const topic = new sns.Topic(stack, 'MyTopic');
const event = new events.Rule(stack, 'EveryMinute', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

const queue = new sqs.Queue(stack, 'MyQueue');
topic.addSubscription(new subs.SqsSubscription(queue));

const deadLetterQueue = new sqs.Queue(stack, 'MyDeadLetterQueue');

event.addTarget(new targets.SnsTopic(topic, {
  deadLetterQueue,
  authorizeUsingRole: true, // role authorization is enabled
}));

new IntegTest(app, 'sns-event-rule-target-role-enabled', {
  testCases: [stack],
});
