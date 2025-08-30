import { join } from 'path';
import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'stack');

const api = new appsync.GraphqlApi(stack, 'EnhancedMetrics', {
  name: 'EnhancedMetrics',
  definition: appsync.Definition.fromFile(join(__dirname, 'appsync.test.graphql')),
  enhancedMetricsConfig: {
    dataSourceLevelMetricsBehavior: appsync.DataSourceLevelMetricsBehavior.PER_DATA_SOURCE_METRICS,
    operationLevelMetricsEnabled: true,
    resolverLevelMetricsBehavior: appsync.ResolverLevelMetricsBehavior.PER_RESOLVER_METRICS,
  },
});

const noneDS = api.addNoneDataSource('none', {
  name: 'None',
  enhancedMetricsEnabled: true,
});

noneDS.createResolver('QuerygetServiceVersion', {
  typeName: 'Query',
  fieldName: 'getTests',
  requestMappingTemplate: appsync.MappingTemplate.fromString(JSON.stringify({
    version: '2017-02-28',
  })),
  responseMappingTemplate: appsync.MappingTemplate.fromString(JSON.stringify({
    version: 'v1',
  })),
  enhancedMetricsEnabled: true,
});

new IntegTest(app, 'api', {
  testCases: [stack],
});
