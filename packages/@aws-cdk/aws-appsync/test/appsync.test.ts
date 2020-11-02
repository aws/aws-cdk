import * as path from 'path';
import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
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

test('appsync GraphqlApi should be configured with custom CloudWatch Logs role when specified', () => {
  // GIVEN
  const cloudWatchLogRole: iam.Role = new iam.Role(stack, 'CloudWatchLogRole', {
    assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppSyncPushToCloudWatchLogs'),
    ],
  });

  // WHEN
  new appsync.GraphqlApi(stack, 'api-custom-cw-logs-role', {
    authorizationConfig: {},
    name: 'apiWithCustomRole',
    schema: appsync.Schema.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    logConfig: {
      role: cloudWatchLogRole,
    },
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLApi', {
    Name: 'apiWithCustomRole',
    LogConfig: {
      CloudWatchLogsRoleArn: {
        'Fn::GetAtt': [
          'CloudWatchLogRoleE3242F1C',
          'Arn',
        ],
      },
    },
  });
});

test('appsync GraphqlApi should not use custom role for CW Logs when not specified', () => {
  // EXPECT
  expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLApi', {
    Name: 'api',
    LogConfig: {
      CloudWatchLogsRoleArn: {
        'Fn::GetAtt': [
          'apiApiLogsRole56BEE3F1',
          'Arn',
        ],
      },
    },
  });
});
