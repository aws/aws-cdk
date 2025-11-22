import * as events from 'aws-cdk-lib/aws-events';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';

// ---------------------------------
// Define a rule that puts a message to a SQS queue every 1min and uses a role.

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-sqs-event-target-with-role');

const role = new iam.Role(stack, 'MyRole', {
  assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
});

const event = new events.Rule(stack, 'MyRule', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

const queue = new sqs.Queue(stack, 'MyQueue');

event.addTarget(new targets.SqsQueue(queue, {
  eventRole: role,
}));

app.synth();
