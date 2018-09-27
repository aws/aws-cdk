import events = require('@aws-cdk/aws-events');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');
import sns = require('../lib');

// ---------------------------------
// Define a rule that triggers an SNS topic every 1min.
// Connect the topic with a queue. This means that the queue should have
// a message sent to it every minute.

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-sns-event-target');

const topic = new sns.Topic(stack, 'MyTopic');
const event = new events.EventRule(stack, 'EveryMinute', {
  scheduleExpression: 'rate(1 minute)'
});

const queue = new sqs.Queue(stack, 'MyQueue');
topic.subscribeQueue(queue);

event.addTarget(topic);

process.stdout.write(app.run());
