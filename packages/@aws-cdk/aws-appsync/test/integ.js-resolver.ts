import * as path from 'path';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import * as appsync from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'AppSyncJsResolverTestStack');

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
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const dataSource = api.addDynamoDbDataSource('DynamoDataSource', db);

const addTestFunc = dataSource.createFunction('AddTestFunction', {
  name: 'addTestFunc',
  runtime: appsync.FunctionRuntime.JS_1_0_0,
  code: appsync.Code.fromAsset(path.join(
    __dirname,
    'integ-assets',
    'appsync-js-resolver.js',
  )),
});

new appsync.Resolver(stack, 'AddTestResolver', {
  api,
  typeName: 'Mutation',
  fieldName: 'addTest',
  code: appsync.Code.fromAsset(path.join(
    __dirname,
    'integ-assets',
    'appsync-js-pipeline.js',
  )),
  runtime: appsync.FunctionRuntime.JS_1_0_0,
  pipelineConfig: [addTestFunc],
});

const integ = new IntegTest(app, 'JsResolverIntegTest', { testCases: [stack] });

/**
 * Handler that calls our api with an `addTest` Mutation
 */
const invoke = new lambda.Function(stack, 'InvokeApi', {
  code: lambda.Code.fromAsset(path.join(__dirname, 'integ-assets/js-resolver-assertion')),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_18_X,
});

const addTestInvoke = integ.assertions.invokeFunction({
  functionName: invoke.functionName,
  payload: JSON.stringify({
    hostname: api.graphqlUrl,
    apiKey: api.apiKey,
  }),
});

/**
 * Assert result returned on API has a generated ID and the passed name.
 */
addTestInvoke.assertAtPath(
  'Payload.data.addTest.name',
  ExpectedResult.stringLikeRegexp('123'),
);

addTestInvoke.assertAtPath(
  'Payload.data.addTest.id',
  ExpectedResult.stringLikeRegexp('.+'),
);

/**
 * Generated ID of the item added in the previous handler
 */
const addTestResultId = addTestInvoke.getAttString('Payload.data.addTest.id');

/**
 * Try to find the item added in the DynamoDB data source.
 */
const getItemCall = integ.assertions.awsApiCall('DynamoDB', 'getItem', {
  TableName: db.tableName,
  Key: {
    id: {
      S: addTestResultId,
    },
  },
});

getItemCall.expect(ExpectedResult.objectLike({
  Item: {
    name: {
      S: '123',
    },
    id: {
      S: addTestResultId,
    },
  },
}));
