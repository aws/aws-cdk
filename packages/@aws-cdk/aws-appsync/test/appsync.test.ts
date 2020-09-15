import * as path from 'path';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

let stack: cdk.Stack;
let api: appsync.GraphqlApi;
beforeEach(() => {
  stack = new cdk.Stack();
  api = new appsync.GraphqlApi(stack, 'api', {
    authorizationConfig: {},
    name: 'api',
    schema: appsync.Schema.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    logConfig: {},
  });
});

test('appsync should configure pipeline when pipelineConfig has contents', () => {
  // WHEN
  new appsync.Resolver(stack, 'resolver', {
    api: api,
    typeName: 'test',
    fieldName: 'test2',
    pipelineConfig: ['test', 'test'],
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::Resolver', {
    Kind: 'PIPELINE',
    PipelineConfig: { Functions: ['test', 'test'] },
  });
});

test('appsync should configure resolver as unit when pipelineConfig is empty', () => {
  // WHEN
  new appsync.Resolver(stack, 'resolver', {
    api: api,
    typeName: 'test',
    fieldName: 'test2',
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::Resolver', {
    Kind: 'UNIT',
  });
});

test('appsync should configure resolver as unit when pipelineConfig is empty array', () => {
  // WHEN
  new appsync.Resolver(stack, 'resolver', {
    api: api,
    typeName: 'test',
    fieldName: 'test2',
    pipelineConfig: [],
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::Resolver', {
    Kind: 'UNIT',
  });
});

test('when xray is enabled should not throw an Error', () => {
  // WHEN
  new appsync.GraphqlApi(stack, 'api-x-ray', {
    authorizationConfig: {},
    name: 'api',
    schema: appsync.Schema.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    xrayEnabled: true,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLApi', {
    XrayEnabled: true,
  });
});

test('appsync GraphqlApi should be configured with custom CW Logs Role ARN when specified', () => {
  // WHEN
  new appsync.GraphqlApi(stack, 'api-custom-cw-logs-role', {
    authorizationConfig: {},
    name: 'api',
    schema: appsync.Schema.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    logConfig: {
      roleArn: 'testCustomRoleArn',
    },
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLApi', {
    LogConfig: {
      CloudWatchLogsRoleArn: 'testCustomRoleArn',
    },
  });
});

test('appsync GraphqlApi should not use custom role for CW Logs when not specified', () => {
  // EXPECT
  expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLApi', {
    LogConfig: {
      CloudWatchLogsRoleArn: {
        'Fn::GetAtt': [],
      },
    },
  });
});
