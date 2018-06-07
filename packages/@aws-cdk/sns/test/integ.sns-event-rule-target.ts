import { App, Stack } from "@aws-cdk/core";
import { EventRule } from "@aws-cdk/events";
import { Queue } from "@aws-cdk/sqs";
import { Topic } from "../lib";

// ---------------------------------
// Define a rule that triggers an SNS topic every 1min.
// Connect the topic with a queue. This means that the queue should have
// a message sent to it every minute.

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-sns-event-target');

const topic = new Topic(stack, 'MyTopic');
const event = new EventRule(stack, 'EveryMinute', {
    scheduleExpression: 'rate(1 minute)'
});

const queue = new Queue(stack, 'MyQueue');
topic.subscribeQueue(queue);

event.addTarget(topic);

process.stdout.write(app.run());
