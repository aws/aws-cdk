import { App, Stack } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App({ context: { '@aws-cdk/aws-lambda:importedAliasMetrics': true } });
const stack = new Stack(app, 'ImportedAliasMetrics');
const fn = new lambda.Function(stack, 'Function', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async () => {};'),
});
const created = new lambda.Alias(stack, 'CreatedAlias', { aliasName: 'live', version: fn.currentVersion });
const imported = lambda.Alias.fromAliasAttributes(stack, 'ImportedAlias', {
  aliasName: created.aliasName,
  aliasVersion: created.version,
});
const alarm = imported.metricInvocations().createAlarm(stack, 'Alarm', {
  threshold: 1,
  evaluationPeriods: 1,
});
const test = new IntegTest(app, 'ImportedAliasMetricsTest', { testCases: [stack] });
test.assertions.awsApiCall('CloudWatch', 'describeAlarms', {
  AlarmNames: [alarm.alarmName],
}).expect(ExpectedResult.objectLike({
  MetricAlarms: [{
    Dimensions: [
      { Name: 'FunctionName', Value: fn.functionName },
      { Name: 'Resource', Value: `${fn.functionName}:live` },
    ],
  }],
}));
