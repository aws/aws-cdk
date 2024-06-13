import * as path from 'path';
import { Template } from '../../assertions';
import * as lambda from '../../aws-lambda';
import * as cdk from '../../core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let api: appsync.GraphqlApi;
beforeEach(() => {
  stack = new cdk.Stack();
  api = new appsync.GraphqlApi(stack, 'baseApi', {
    name: 'api',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
  });
});

test('maxBatchSize property can be set in AppSync Function with Lambda DataSource.', () => {
  // GIVEN
  const func = new lambda.Function(stack, 'func', {
    code: lambda.Code.fromAsset(path.join(__dirname, 'verify', 'iam-query')),
    handler: 'iam-query.handler',
    runtime: lambda.Runtime.NODEJS_LATEST,
  });
  const dataSource = api.addLambdaDataSource('ds', func);

  // WHEN
  dataSource.createFunction('TestFunction', {
    name: 'test',
    maxBatchSize: 10,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::FunctionConfiguration', {
    Name: 'test',
    MaxBatchSize: 10,
  });
});

test('maxBatchSize property cannot be set in AppSync Function if data source is not Lambda.', () => {
  const dataSource = api.addNoneDataSource('none');

  expect(() => {
    dataSource.createFunction('TestFunction', {
      name: 'test',
      maxBatchSize: 10,
    });
  }).toThrow('maxBatchSize can only be set for the data source of type \LambdaDataSource\'');
});

