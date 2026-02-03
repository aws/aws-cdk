/// !cdk-integ log-group-class
import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup, LogGroupClass } from 'aws-cdk-lib/aws-logs';

const app = new App();
const stack = new Stack(app, 'log-group-class');
const integTest = new IntegTest(app, 'LogGroupClassIntegTest', { testCases: [stack] });

// Create and query log group with all default settings
const logGroupDefault = new LogGroup(stack, 'log-group-default');
const describeDefault = integTest.assertions.awsApiCall('CloudWatchLogs',
  'describeLogGroups',
  {
    logGroupNamePrefix: logGroupDefault.logGroupName,
  });

// validate
describeDefault.expect(ExpectedResult.objectLike({
  logGroups: [
    {
      logGroupName: logGroupDefault.logGroupName,
      logGroupClass: LogGroupClass.STANDARD,
    },
  ],
}));

// Create and query log group of STANDARD LogGroupClass
const logGroupStandard = new LogGroup(stack, 'log-group-standard', { logGroupClass: LogGroupClass.STANDARD });
const describeStandard = integTest.assertions.awsApiCall('CloudWatchLogs',
  'describeLogGroups',
  {
    logGroupNamePrefix: logGroupStandard.logGroupName,
  });

// validate
describeStandard.expect(ExpectedResult.objectLike({
  logGroups: [
    {
      logGroupName: logGroupStandard.logGroupName,
      logGroupClass: LogGroupClass.STANDARD,
    },
  ],
}));

// Create and query log group of INFREQUENT_ACCESS LogGroupClass
const logGroupInfrequentAccess = new LogGroup(stack, 'log-group-infrequent-access', { logGroupClass: LogGroupClass.INFREQUENT_ACCESS });
const describeInfrequentAccess = integTest.assertions.awsApiCall('CloudWatchLogs',
  'describeLogGroups',
  {
    logGroupNamePrefix: logGroupInfrequentAccess.logGroupName,
  });

// valdiate
describeInfrequentAccess.expect(ExpectedResult.objectLike({
  logGroups: [
    {
      logGroupName: logGroupInfrequentAccess.logGroupName,
      logGroupClass: LogGroupClass.INFREQUENT_ACCESS,
    },
  ],
}));

app.synth();
