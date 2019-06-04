import events = require('@aws-cdk/aws-events');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');
import targets = require('../../lib');

// ---------------------------------
// Define a rule that triggers an SNS topic every 1min.
// Connect the topic with a queue. This means that the queue should have
// a message sent to it every minute.

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-sqs-event-target');

const event = new events.Rule(stack, 'MyRule', {
  scheduleExpression: 'rate(1 minute)',
});

const queue = new sqs.Queue(stack, 'MyQueue');
event.addTarget(new targets.SqsQueue(queue));

app.run();
