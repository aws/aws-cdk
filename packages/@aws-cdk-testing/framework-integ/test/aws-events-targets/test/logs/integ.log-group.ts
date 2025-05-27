import * as events from 'aws-cdk-lib/aws-events';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { LogGroupTargetInput } from 'aws-cdk-lib/aws-events-targets';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new cdk.Stack(app, 'log-group-events');

const logGroup = new logs.LogGroup(stack, 'log-group', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const logGroup2 = new logs.LogGroup(stack, 'log-group2', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new logs.LogGroup(stack, 'log-group-imported', {
  logGroupName: 'MyLogGroupNameToBeImported',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const importedLogGroup = logs.LogGroup.fromLogGroupName(stack, 'imported-log-group', 'MyLogGroupNameToBeImported');

const timer = new events.Rule(stack, 'Timer', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
timer.addTarget(new targets.CloudWatchLogGroup(logGroup));

const customRule = new events.Rule(stack, 'CustomRule', {
  eventPattern: {
    source: ['cdk-integ'],
    detailType: ['cdk-integ-custom-rule'],
  },
});
customRule.addTarget(new targets.CloudWatchLogGroup(logGroup2, {
  logEvent: LogGroupTargetInput.fromObject({
    message: events.EventField.fromPath('$.detail.date'),
  }),
}));

const queue = new sqs.Queue(stack, 'dlq');

const timer3 = new events.Rule(stack, 'Timer3', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
timer3.addTarget(new targets.CloudWatchLogGroup(importedLogGroup, {
  deadLetterQueue: queue,
  maxEventAge: cdk.Duration.hours(2),
  retryAttempts: 2,
}));

const integ = new IntegTest(app, 'LogGroup', {
  testCases: [stack],
  diffAssets: true,
});

const putEventsDate = Date.now();
const expectedValue = `abc${putEventsDate.toString()}`;

const putEvent = integ.assertions.awsApiCall('EventBridge', 'putEvents', {
  Entries: [
    {
      Detail: JSON.stringify({
        date: expectedValue,
      }),
      DetailType: 'cdk-integ-custom-rule',
      Source: 'cdk-integ',
    },
  ],
});
putEvent.provider.addPolicyStatementFromSdkCall('events', 'PutEvents');

const logEvents = integ.assertions.awsApiCall('CloudWatchLogs', 'filterLogEvents', {
  logGroupName: logGroup2.logGroupName,
  startTime: putEventsDate,
  limit: 1,
});

putEvent.next(logEvents);

logEvents.assertAtPath('events.0.message', ExpectedResult.stringLikeRegexp(expectedValue));

app.synth();
