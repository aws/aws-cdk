import * as events from '@aws-cdk/aws-events';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';

// ---------------------------------
// Define a rule that triggers an SNS topic every 1min.
// Connect the topic with a queue. This means that the queue should have
// a message sent to it every minute.

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
}));

app.synth();
