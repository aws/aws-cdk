/// !cdk-integ aws-cdk-scheduler-schedule
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as scheduler from '../lib';

class SomeLambdaTarget implements scheduler.IScheduleTarget {
  public constructor(private readonly fn: lambda.IFunction, private readonly role: iam.IRole) {
  }

  public bind(): scheduler.ScheduleTargetConfig {
    return {
      arn: this.fn.functionArn,
      role: this.role,
      input: scheduler.ScheduleTargetInput.fromText('Input Text'),
      retryPolicy: {
        maximumEventAgeInSeconds: 180,
        maximumRetryAttempts: 3,
      },
    };
  }
}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-scheduler-schedule');

const expression = scheduler.ScheduleExpression.rate(cdk.Duration.hours(12));
const func = new lambda.Function(stack, 'Function', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_LATEST,
});
const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
});

const target = new SomeLambdaTarget(func, role);

const namedGroup = new scheduler.Group(stack, 'NamedGroup', {
  groupName: 'TestGroup',
});
const unnamedGroup = new scheduler.Group(stack, 'UnnamedGroup', {});

new scheduler.Schedule(stack, 'DefaultSchedule', {
  schedule: expression,
  target: target,
});

new scheduler.Schedule(stack, 'NamedGroupSchedule', {
  schedule: expression,
  target: target,
  group: namedGroup,
});

new scheduler.Schedule(stack, 'UnnamedGroupSchedule', {
  schedule: expression,
  target: target,
  group: unnamedGroup,
});

new scheduler.Schedule(stack, 'DisabledSchedule', {
  schedule: expression,
  target: target,
  enabled: false,
});

new scheduler.Schedule(stack, 'TargetOverrideSchedule', {
  schedule: expression,
  target: target,
  targetOverrides: {
    input: scheduler.ScheduleTargetInput.fromText('Changed Text'),
    maxEventAge: cdk.Duration.seconds(360),
    retryAttempts: 5,
  },
});

new cloudwatch.Alarm(stack, 'AllSchedulerErrorsAlarm', {
  metric: scheduler.Schedule.metricAllErrors(),
  threshold: 1,
  evaluationPeriods: 1,
});

const key = new kms.Key(stack, 'ScheduleKey');
new scheduler.Schedule(stack, 'CustomerKmsSchedule', {
  schedule: expression,
  target: target,
  key,
});

new scheduler.Schedule(stack, 'UseFlexibleTimeWindow', {
  schedule: expression,
  target: target,
  timeWindow: scheduler.TimeWindow.flexible(cdk.Duration.minutes(10)),
});

const currentYear = new Date().getFullYear();
new scheduler.Schedule(stack, 'ScheduleWithTimeFrame', {
  schedule: expression,
  target: target,
  start: new Date(`${currentYear + 1}-04-15T06:30:00.000Z`),
  end: new Date(`${currentYear + 2}-10-01T00:00:00.000Z`),
});

new IntegTest(app, 'integtest-schedule', {
  testCases: [stack],
});

app.synth();
