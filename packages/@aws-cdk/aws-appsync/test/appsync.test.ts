import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

let stack: cdk.Stack;
let api: appsync.GraphqlApi;
beforeEach(() => {
  stack = new cdk.Stack();
  api = new appsync.GraphqlApi(stack, 'api', {
    authorizationConfig: {},
    name: 'api',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    logConfig: {},
  });
});

test('appsync should configure pipeline when pipelineConfig has contents', () => {
  // WHEN
  const ds = api.addNoneDataSource('none');
  const test1 = ds.createFunction({
    name: 'test1',
  });
  const test2 = ds.createFunction({
    name: 'test2',
  });
  api.createResolver({
    typeName: 'test',
    fieldName: 'test2',
    pipelineConfig: [test1, test2],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Resolver', {
    Kind: 'PIPELINE',
    PipelineConfig: {
      Functions: [
        { 'Fn::GetAtt': ['apinonetest1FunctionEF63046F', 'FunctionId'] },
        { 'Fn::GetAtt': ['apinonetest2Function615111D0', 'FunctionId'] },
      ],
    },
  });
});

test('appsync should error when creating pipeline resolver with data source', () => {
  // WHEN
  const ds = api.addNoneDataSource('none');
  const test1 = ds.createFunction({
    name: 'test1',
  });
  const test2 = ds.createFunction({
    name: 'test2',
  });

  // THEN
  expect(() => {
    ds.createResolver({
      typeName: 'test',
      fieldName: 'test2',
      pipelineConfig: [test1, test2],
    });
  }).toThrowError('Pipeline Resolver cannot have data source. Received: none');
});

test('appsync should configure resolver as unit when pipelineConfig is empty', () => {
  // WHEN
  const ds = api.addNoneDataSource('none');
  new appsync.Resolver(stack, 'resolver', {
    api: api,
    dataSource: ds,
    typeName: 'test',
    fieldName: 'test2',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Resolver', {
    Kind: 'UNIT',
  });
});

test('appsync should configure resolver as unit when pipelineConfig is empty array', () => {
  // WHEN
  api.createResolver({
    typeName: 'test',
    fieldName: 'test2',
    pipelineConfig: [],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Resolver', {
    Kind: 'UNIT',
  });
});

test('when xray is enabled should not throw an Error', () => {
  // WHEN
  new appsync.GraphqlApi(stack, 'api-x-ray', {
    authorizationConfig: {},
    name: 'api',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    xrayEnabled: true,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
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
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    logConfig: {
      role: cloudWatchLogRole,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
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
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
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

test('appsync GraphqlApi should be configured with custom domain when specified', () => {
  const domainName = 'api.example.com';
  // GIVEN
  const certificate = new Certificate(stack, 'AcmCertificate', {
    domainName,
  });

  // WHEN
  new appsync.GraphqlApi(stack, 'api-custom-cw-logs-role', {
    authorizationConfig: {},
    name: 'apiWithCustomRole',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    domainName: {
      domainName,
      certificate,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DomainNameApiAssociation', {
    ApiId: {
      'Fn::GetAtt': [
        'apicustomcwlogsrole508EAC74',
        'ApiId',
      ],
    },
    DomainName: domainName,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DomainName', {
    CertificateArn: { Ref: 'AcmCertificate49D3B5AF' },
    DomainName: domainName,
  });
});

test('log retention should be configured with given retention time when specified', () => {
  // GIVEN
  const retentionTime = logs.RetentionDays.ONE_WEEK;

  // WHEN
  new appsync.GraphqlApi(stack, 'log-retention', {
    authorizationConfig: {},
    name: 'log-retention',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    logConfig: {
      retention: retentionTime,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
    LogGroupName: {
      'Fn::Join': [
        '',
        [
          '/aws/appsync/apis/',
          {
            'Fn::GetAtt': [
              'logretentionB69DFB48',
              'ApiId',
            ],
          },
        ],
      ],
    },
    RetentionInDays: 7,
  });
});

test('log retention should not appear when no retention time is specified', () => {
  // WHEN
  new appsync.GraphqlApi(stack, 'no-log-retention', {
    authorizationConfig: {},
    name: 'no-log-retention',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
  });

  // THEN
  Template.fromStack(stack).resourceCountIs('Custom::LogRetention', 0);
});