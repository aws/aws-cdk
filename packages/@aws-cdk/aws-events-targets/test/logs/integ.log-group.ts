import * as events from '@aws-cdk/aws-events';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'log-group-events');

const logGroup = new logs.LogGroup(stack, 'log-group', {
  logGroupName: 'MyLogGroupName',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const logGroup2 = new logs.LogGroup(stack, 'log-group2', {
  logGroupName: 'MyLogGroupName2',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const timer = new events.Rule(stack, 'Timer', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
timer.addTarget(new targets.LogGroup(logGroup));

const timer2 = new events.Rule(stack, 'Timer2', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
});
timer2.addTarget(new targets.LogGroup(logGroup2, {
  event: events.RuleTargetInput.fromObject({
    data: events.EventField.fromPath('$.detail-type'),
  }),
}));

app.synth();

