/// !cdk-integ aws-cdk-scheduler-schedule
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';

class SomeSqsTarget implements scheduler.IScheduleTarget {
  public constructor(
    private readonly queue: sqs.IQueue,
    private readonly role: iam.IRole,
    private readonly input?: scheduler.ScheduleTargetInput) {
  }

  public bind(): scheduler.ScheduleTargetConfig {
    return {
      arn: this.queue.queueArn,
      role: this.role,
      input: this.input,
      retryPolicy: {
        maximumEventAgeInSeconds: 180,
        maximumRetryAttempts: 3,
      },
    };
  }
}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-scheduler-schedule');
const queue = new sqs.Queue(stack, 'ScheduleTargetQueue');
const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
});
queue.grantSendMessages(role);

new scheduler.Schedule(stack, 'ScheduleToSendMessageToQueue', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  description: 'test description from the ScheduleToSendMessageToQueue',
  target: new SomeSqsTarget(queue, role,
    scheduler.ScheduleTargetInput.fromText(`valueA-${stack.region}`)),
});
const key = new kms.Key(stack, 'ScheduleKey');
new scheduler.Schedule(stack, 'ScheduleWithCMK', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new SomeSqsTarget(queue, role,
    scheduler.ScheduleTargetInput.fromText(`valueB-${stack.region}`)),
  key,
});

const namedGroup = new scheduler.ScheduleGroup(stack, 'NamedGroup', {
  scheduleGroupName: 'TestGroup',
});
namedGroup.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

const unnamedGroup = new scheduler.ScheduleGroup(stack, 'UnnamedGroup', {});
unnamedGroup.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

const randomTargetThatWontGetInvoked = new SomeSqsTarget(queue, role);
new scheduler.Schedule(stack, 'ScheduleToTestWithNamedGroup', {
  schedule: scheduler.ScheduleExpression.at(new Date('2060-04-15T06:30:00.000Z')),
  target: randomTargetThatWontGetInvoked,
  scheduleGroup: namedGroup,
});

new scheduler.Schedule(stack, 'ScheduleToTestWithUnnamedGroup', {
  schedule: scheduler.ScheduleExpression.at(new Date('2060-04-15T06:30:00.000Z')),
  target: randomTargetThatWontGetInvoked,
  scheduleGroup: unnamedGroup,
});

new scheduler.Schedule(stack, 'TestDisabledSchedule', {
  schedule: scheduler.ScheduleExpression.at(new Date('2060-04-15T06:30:00.000Z')),
  target: randomTargetThatWontGetInvoked,
  enabled: false,
});

new scheduler.Schedule(stack, 'UseFlexibleTimeWindow', {
  schedule: scheduler.ScheduleExpression.at(new Date('2060-04-15T06:30:00.000Z')),
  target: randomTargetThatWontGetInvoked,
  timeWindow: scheduler.TimeWindow.flexible(cdk.Duration.minutes(10)),
});

new scheduler.Schedule(stack, 'ScheduleWithTimeFrame', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: randomTargetThatWontGetInvoked,
  start: new Date('2060-04-15T06:30:00.000Z'),
  end: new Date('2060-10-01T00:00:00.000Z'),
});

new cloudwatch.Alarm(stack, 'AllSchedulerErrorsAlarm', {
  metric: scheduler.Schedule.metricAllErrors(),
  threshold: 1,
  evaluationPeriods: 1,
});

const integ = new IntegTest(app, 'integtest-schedule', {
  testCases: [stack],
});

integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: queue.queueUrl,
  MaxNumberOfMessages: 10,
}).expect(ExpectedResult.objectLike({
  Messages: Match.arrayWith([
    Match.objectLike({ Body: `valueA-${stack.region}` }),
    Match.objectLike({ Body: `valueB-${stack.region}` }),
  ]),
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(5),
  interval: cdk.Duration.seconds(20),
});
