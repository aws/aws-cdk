import { App, Stack } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App({ context: { '@aws-cdk/aws-lambda:versionMetrics': true } });
const stack = new Stack(app, 'VersionMetricDimensions');
const fn = new lambda.Function(stack, 'Function', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async () => {};'),
});
const version = fn.currentVersion;
const alarm = version.metricErrors().createAlarm(stack, 'Alarm', {
  threshold: 1,
  evaluationPeriods: 1,
});
const test = new IntegTest(app, 'VersionMetricDimensionsTest', { testCases: [stack] });
test.assertions.awsApiCall('CloudWatch', 'describeAlarms', {
  AlarmNames: [alarm.alarmName],
}).expect(ExpectedResult.objectLike({
  MetricAlarms: [{
    Dimensions: [
      { Name: 'FunctionName', Value: fn.functionName },
      { Name: 'Resource', Value: `${fn.functionName}:${version.version}` },
    ],
  }],
}));
