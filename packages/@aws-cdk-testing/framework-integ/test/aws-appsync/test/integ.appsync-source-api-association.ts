import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'stack');

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

const mergedApiExecutionRole = new iam.Role(stack, 'MergedApiExecutionRole', {
  assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
});

const mergedApi = new appsync.GraphqlApi(stack, 'MergedAPI', {
  name: 'MergedAPI',
  definition: appsync.Definition.fromMergedApiConfiguration({
    sourceApiAssociationConfigs: [],
    mergedApiExecutionRole: mergedApiExecutionRole,
  }),
});

new appsync.SourceApiAssociation(stack, 'SourceApiAssociation1', {
  sourceApi: firstApi,
  mergedApiIdentifier: mergedApi.arn,
  mergeType: appsync.MergeType.MANUAL_MERGE,
});

new appsync.SourceApiAssociation(stack, 'SourceApiAssociation2', {
  sourceApiIdentifier: secondApi.arn,
  mergedApi: mergedApi,
  mergeType: appsync.MergeType.AUTO_MERGE,
});

new IntegTest(app, 'api', {
  testCases: [stack],
});

app.synth();