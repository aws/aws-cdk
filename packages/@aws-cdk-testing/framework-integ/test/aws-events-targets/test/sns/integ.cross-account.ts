import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';

const app = new App();
const stack = new Stack(app, 'sns-events-cross-account');

const topic = sns.Topic.fromTopicArn(
  stack,
  'External',
  'arn:aws:sns:eu-west-1:234567890123:MyTopic',
);

const timer = new events.Rule(stack, 'Timer', {
  schedule: events.Schedule.rate(Duration.minutes(1)),
});

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
});

timer.addTarget(new targets.SnsTopic(topic, { role }));

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();
