import { App, Duration, Stack } from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { ComparisonOperator, LogAlarm, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';

const app = new App();
const stack = new Stack(app, 'cdk-integ-log-alarm');

const logGroup = new LogGroup(stack, 'LogGroup');

const queryRole = new Role(stack, 'ScheduledQueryRole', {
  assumedBy: new ServicePrincipal('logs.amazonaws.com'),
});

new LogAlarm(stack, 'LogAlarm', {
  logAlarmName: 'integ-log-alarm',
  threshold: 5,
  comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
  queryResultsToEvaluate: 3,
  queryResultsToAlarm: 2,
  treatMissingData: TreatMissingData.NOT_BREACHING,
  scheduledQueryConfiguration: {
    queryString: 'fields @message | filter @message like /ERROR/',
    aggregationExpression: 'count(*)',
    logGroups: [logGroup],
    scheduledQueryRole: queryRole,
    schedule: {
      rate: Duration.minutes(5),
      startTimeOffset: Duration.minutes(5),
      endTimeOffset: Duration.seconds(0),
    },
  },
});

// Auto-created roles: no scheduledQueryRole, and actionLogLineCount > 0 to trigger the log-line role.
new LogAlarm(stack, 'AutoRoleLogAlarm', {
  logAlarmName: 'integ-log-alarm-auto-role',
  threshold: 1,
  comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
  queryResultsToEvaluate: 1,
  queryResultsToAlarm: 1,
  actionLogLineCount: 5,
  scheduledQueryConfiguration: {
    queryString: 'fields @message | filter @message like /WARN/',
    aggregationExpression: 'count(*)',
    logGroups: [logGroup],
    schedule: {
      rate: Duration.minutes(5),
      startTimeOffset: Duration.minutes(5),
    },
  },
});

new IntegTest(app, 'LogAlarmInteg', {
  testCases: [stack],
});
