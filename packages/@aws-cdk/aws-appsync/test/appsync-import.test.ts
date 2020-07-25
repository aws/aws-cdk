import * as path from 'path';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

let stack: cdk.Stack;
let baseApi: appsync.GraphQLApi;
beforeEach( () => {
  // Given
  stack = new cdk.Stack();
  baseApi = new appsync.GraphQLApi(stack, 'baseApi', {
    name: 'api',
    schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
  });
});

test('imported api can add NoneDataSource from id', () => {
  // WHEN
  const api = appsync.GraphQLApi.fromGraphQLApiId(stack, 'importedApi', baseApi.apiId);

  api.addNoneDataSource('none', 'none data source with imported Api');

  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::DataSource', {
    Type: 'NONE',
    ApiId: { 'Fn::GetAtt': [ 'baseApiCDA4D43A', 'ApiId' ],
    },
  });
});

test('imported api can add NoneDataSource from arn', () => {
  // WHEN
  const api = appsync.GraphQLApi.fromGraphQLApiArn(stack, 'importedApi', baseApi.arn);

  api.addNoneDataSource('none', 'none data source with imported Api');

  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::DataSource', {
    Type: 'NONE',
    ApiId: { 'Fn::Select': [ 1, { 'Fn::Split': [ '/', { 'Fn::GetAtt': [ 'baseApiCDA4D43A', 'Arn' ] } ] } ] },
  });
});

test('imported api can add NoneDataSource from attributes', () => {
  // WHEN
  const api = appsync.GraphQLApi.fromGraphQLApiAttributes(stack, 'importedApi', {
    apiId: baseApi.apiId,
    arn: baseApi.arn,
  });

  api.addNoneDataSource('none', 'none data source with imported Api');

  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::DataSource', {
    Type: 'NONE',
    ApiId: { 'Fn::GetAtt': [ 'baseApiCDA4D43A', 'ApiId' ],
    },
  });
});

