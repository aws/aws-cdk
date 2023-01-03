import * as path from 'path';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as appsync from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack');

const logConfig: appsync.LogConfig = {
  retention: logs.RetentionDays.ONE_WEEK,
};

const api = new appsync.GraphqlApi(stack, 'JsResolverApi', {
  name: 'JsResolverApi',
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.js-resolver.graphql')),
  logConfig,
});

const db = new dynamodb.Table(stack, 'DynamoTable', {
  partitionKey: {
    name: 'id',
    type: dynamodb.AttributeType.STRING,
  },
});

const dataSource = api.addDynamoDbDataSource('DynamoDataSource', db);

const addTestFunc = dataSource.createFunction('AddTestFunction', {
  name: 'addTestFunc',
  runtime: appsync.FunctionRuntime.JS_1_0_0,
  code: appsync.Code.fromAsset(path.join(__dirname, 'appsync-js-resolver.js')),
});

new appsync.Resolver(stack, 'AddTestResolver', {
  api,
  typeName: 'Mutation',
  fieldName: 'addTest',
  code: appsync.Code.fromAsset(path.join(__dirname, 'appsync-js-pipeline.js')),
  runtime: appsync.FunctionRuntime.JS_1_0_0,
  pipelineConfig: [addTestFunc],
});

new IntegTest(app, 'JsResolverIntegTest', { testCases: [stack] });
