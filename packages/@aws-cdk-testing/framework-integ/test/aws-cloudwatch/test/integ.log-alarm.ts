import { App, ArnFormat, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { ComparisonOperator, LogAlarm, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';

const app = new App();
const stack = new Stack(app, 'cdk-integ-log-alarm');

const logGroup = new LogGroup(stack, 'LogGroup', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const queryRole = new Role(stack, 'ScheduledQueryRole', {
  assumedBy: new ServicePrincipal('logs.amazonaws.com', {
    conditions: {
      StringEquals: { 'aws:SourceAccount': stack.account },
      ArnLike: {
        'aws:SourceArn': stack.formatArn({
          service: 'logs',
          resource: 'scheduled-query',
          resourceName: '*',
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
        }),
      },
    },
  }),
});

new LogAlarm(stack, 'LogAlarm', {
  alarmName: 'integ-log-alarm',
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

// Auto-created roles: no scheduledQueryRole, and actionLogLines to trigger the log-line role.
new LogAlarm(stack, 'AutoRoleLogAlarm', {
  alarmName: 'integ-log-alarm-auto-role',
  threshold: 1,
  comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
  queryResultsToEvaluate: 1,
  queryResultsToAlarm: 1,
  actionLogLines: { count: 5 },
  warmUpConfiguration: {
    warmUpPeriod: Duration.minutes(10),
    onlyStartEvaluatingAfterWarmUpPeriodEnds: true,
  },
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

// No logGroups: the query selects its own log groups with SOURCE.
new LogAlarm(stack, 'SourceQueryLogAlarm', {
  alarmName: 'integ-log-alarm-source-query',
  threshold: 5,
  comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
  queryResultsToEvaluate: 1,
  queryResultsToAlarm: 1,
  treatMissingData: TreatMissingData.NOT_BREACHING,
  scheduledQueryConfiguration: {
    queryString: `SOURCE logGroups(namePrefix: ['${logGroup.logGroupName}']) | fields @message | filter @message like /ERROR/`,
    aggregationExpression: 'count(*)',
    schedule: {
      rate: Duration.minutes(5),
      startTimeOffset: Duration.minutes(5),
    },
  },
});

const integ = new IntegTest(app, 'LogAlarmInteg', {
  testCases: [stack],
});

// Confirms the service created the alarm.
integ.assertions.awsApiCall('CloudWatch', 'describeAlarms', {
  AlarmNames: ['integ-log-alarm'],
  AlarmTypes: ['LogAlarm'],
}).expect(ExpectedResult.objectLike({
  LogAlarms: Match.arrayWith([
    Match.objectLike({ AlarmName: 'integ-log-alarm' }),
  ]),
}));

integ.assertions.awsApiCall('CloudWatch', 'describeAlarms', {
  AlarmNames: ['integ-log-alarm-auto-role'],
  AlarmTypes: ['LogAlarm'],
}).expect(ExpectedResult.objectLike({
  LogAlarms: Match.arrayWith([
    Match.objectLike({ AlarmName: 'integ-log-alarm-auto-role' }),
  ]),
}));

integ.assertions.awsApiCall('CloudWatch', 'describeAlarms', {
  AlarmNames: ['integ-log-alarm-source-query'],
  AlarmTypes: ['LogAlarm'],
}).expect(ExpectedResult.objectLike({
  LogAlarms: Match.arrayWith([
    Match.objectLike({ AlarmName: 'integ-log-alarm-source-query' }),
  ]),
}));
