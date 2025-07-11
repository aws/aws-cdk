import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack');

const firstApi = new appsync.GraphqlApi(stack, 'FirstSourceAPI', {
  name: 'FirstSourceAPI',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.merged-api-1.graphql')),
});

firstApi.addNoneDataSource('FirstSourceDS', {
  name: cdk.Lazy.string({ produce(): string { return 'FirstSourceDS'; } }),
});

const secondApi = new appsync.GraphqlApi(stack, 'SecondSourceAPI', {
  name: 'SecondSourceAPI',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.merged-api-2.graphql')),
});

secondApi.addNoneDataSource('SecondSourceDS', {
  name: cdk.Lazy.string({ produce(): string { return 'SecondSourceDS'; } }),
});

const thirdApi = new appsync.GraphqlApi(stack, 'ThirdSourceAPI', {
  name: 'ThirdSourceAPI',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.merged-api-3.graphql')),
});

const mergedApiExecutionRole = new iam.Role(stack, 'MergedApiExecutionRole', {
  assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
});

const mergedApi = new appsync.GraphqlApi(stack, 'MergedAPI', {
  name: 'MergedAPI',
  definition: appsync.Definition.fromSourceApis({
    sourceApis: [],
    mergedApiExecutionRole: mergedApiExecutionRole,
  }),
});

new appsync.SourceApiAssociation(stack, 'SourceApiAssociation1', {
  sourceApi: firstApi,
  mergedApi: mergedApi,
  mergeType: appsync.MergeType.MANUAL_MERGE,
  mergedApiExecutionRole: mergedApiExecutionRole,
});

new appsync.SourceApiAssociation(stack, 'SourceApiAssociation2', {
  sourceApi: secondApi,
  mergedApi: mergedApi,
  mergeType: appsync.MergeType.AUTO_MERGE,
  mergedApiExecutionRole: mergedApiExecutionRole,
});

const iThirdApi = appsync.GraphqlApi.fromGraphqlApiAttributes(stack, 'ImportedThirdApi', {
  graphqlApiId: thirdApi.apiId,
  graphqlApiArn: thirdApi.arn,
});

new appsync.SourceApiAssociation(stack, 'SourceApiAssociation3', {
  sourceApi: iThirdApi,
  mergedApi: mergedApi,
  mergeType: appsync.MergeType.MANUAL_MERGE,
  mergedApiExecutionRole: mergedApiExecutionRole,
});

new IntegTest(app, 'api', {
  testCases: [stack],
});

app.synth();
