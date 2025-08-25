import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'stack');

const api = new appsync.GraphqlApi(stack, 'EnhancedMetrics', {
  name: 'EnhancedMetrics',
  definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
  enhancedMetricsConfig: {
    dataSourceLevelMetricsBehavior: appsync.DataSourceLevelMetricsBehavior.PER_DATA_SOURCE_METRICS,
    operationLevelMetricsEnabled: true,
    resolverLevelMetricsBehavior: appsync.ResolverLevelMetricsBehavior.PER_RESOLVER_METRICS,
  },
});

api.addNoneDataSource('NoneDS', {
  name: cdk.Lazy.string({ produce(): string { return 'NoneDS'; } }),
});

new IntegTest(app, 'api', {
  testCases: [stack],
});
