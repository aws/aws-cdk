import { join } from 'path';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { GraphqlApi, LogConfig, SchemaFile } from 'aws-cdk-lib/aws-appsync';

const app = new App();
const stack = new Stack(app, 'AppSyncLogMetrics');

const retentionTime = RetentionDays.ONE_WEEK;
const logConfig: LogConfig = {
  retention: retentionTime,
};

const api = new GraphqlApi(stack, 'Api', {
  authorizationConfig: {},
  name: 'IntegLogRetention',
  schema: SchemaFile.fromAsset(join(__dirname, 'appsync.test.graphql')),
  logConfig,
});

api.logGroup.addMetricFilter('MetricFilter', {
  filterPattern: {
    logPatternString: '{ $.fieldName = "myQuery" && $.fieldInError IS TRUE }',
  },
  metricName: 'ErrorCount',
  metricNamespace: 'MyNamespace',
  metricValue: '1',
});

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();
