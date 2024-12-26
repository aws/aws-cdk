import * as path from 'path';
import { Template } from '../../assertions';
import { Certificate } from '../../aws-certificatemanager';
import * as iam from '../../aws-iam';
import * as logs from '../../aws-logs';
import * as cdk from '../../core';
import * as appsync from '../lib';

let stack: cdk.Stack;
let api: appsync.GraphqlApi;
beforeEach(() => {
  stack = new cdk.Stack();
  api = new appsync.GraphqlApi(stack, 'api', {
    authorizationConfig: {},
    name: 'api',
    definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    logConfig: {},
  });
});

test('appsync should configure pipeline when pipelineConfig has contents', () => {
  // WHEN
  const ds = api.addNoneDataSource('none');
  const test1 = ds.createFunction('Test1Function', {
    name: 'test1',
  });
  const test2 = ds.createFunction('Test2Function', {
    name: 'test2',
  });
  api.createResolver('TestTest2', {
    typeName: 'test',
    fieldName: 'test2',
    pipelineConfig: [test1, test2],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Resolver', {
    Kind: 'PIPELINE',
    PipelineConfig: {
      Functions: [
        { 'Fn::GetAtt': ['apiTest1Function793605E9', 'FunctionId'] },
        { 'Fn::GetAtt': ['apiTest2FunctionB704A7AD', 'FunctionId'] },
      ],
    },
  });
});

test('appsync should error when creating pipeline resolver with data source', () => {
  // WHEN
  const ds = api.addNoneDataSource('none');
  const test1 = ds.createFunction('Test1Function', {
    name: 'test1',
  });
  const test2 = ds.createFunction('Test2Function', {
    name: 'test2',
  });

  // THEN
  expect(() => {
    api.createResolver('TestTest2', {
      dataSource: ds,
      typeName: 'test',
      fieldName: 'test2',
      pipelineConfig: [test1, test2],
    });
  }).toThrow('Pipeline Resolver cannot have data source. Received: none');
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
  api.createResolver('TestTest2', {
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

test('log retention will appear whenever logconfig is set', () => {
  // WHEN
  new appsync.GraphqlApi(stack, 'no-log-retention', {
    authorizationConfig: {},
    name: 'no-log-retention',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
  });

  // THEN
  Template.fromStack(stack).resourceCountIs('Custom::LogRetention', 1);
});

test('when visibility is set it should be used when creating the API', () => {
  // WHEN
  new appsync.GraphqlApi(stack, 'api-x-ray', {
    authorizationConfig: {},
    name: 'api',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    visibility: appsync.Visibility.PRIVATE,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
    Visibility: 'PRIVATE',
  });
});

test('appsync should support deprecated schema property', () => {
  // WHEN
  const schemaFile = appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'));
  const apiWithSchema = new appsync.GraphqlApi(stack, 'apiWithSchema', {
    authorizationConfig: {},
    name: 'api',
    schema: schemaFile,
  });

  // THEN
  expect(apiWithSchema.schema).toBe(schemaFile);
});

test('appsync api from file', () => {
  // WHEN
  const apiWithSchema = new appsync.GraphqlApi(stack, 'apiWithSchema', {
    authorizationConfig: {},
    name: 'api',
    definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.test.graphql')),
  });

  // THEN
  expect(apiWithSchema.schema).not.toBeNull();
});

test('appsync fails when properties schema and definition are undefined', () => {
  // THEN
  expect(() => {
    new appsync.GraphqlApi(stack, 'apiWithoutSchemaAndDefinition', {
      name: 'api',
    });
  }).toThrow('You must specify a GraphQL schema or source APIs in property definition.');
});

test('appsync fails when specifing schema and definition', () => {
  // THEN
  expect(() => {
    new appsync.GraphqlApi(stack, 'apiWithSchemaAndDefinition', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    });
  }).toThrow('You cannot specify both properties schema and definition.');
});

test('when introspectionConfig is set it should be used when creating the API', () => {
  // WHEN
  new appsync.GraphqlApi(stack, 'disabled-introspection', {
    authorizationConfig: {},
    name: 'disabled-introspection',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    introspectionConfig: appsync.IntrospectionConfig.DISABLED,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
    IntrospectionConfig: 'DISABLED',
  });
});

test('when query limits are set, they should be used on API', () => {
  // WHEN
  new appsync.GraphqlApi(stack, 'query-limits', {
    authorizationConfig: {},
    name: 'query-limits',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    queryDepthLimit: 2,
    resolverCountLimit: 2,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
    QueryDepthLimit: 2,
    ResolverCountLimit: 2,
  });
});

test('when query depth limit is out of range, it throws an error', () => {

  const errorString = 'You must specify a query depth limit between 0 and 75.';

  const buildWithLimit = (name, queryDepthLimit) => {
    new appsync.GraphqlApi(stack, name, {
      authorizationConfig: {},
      name: 'query-limits',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      queryDepthLimit,
    });
  };

  expect(() => buildWithLimit('query-limit-low', -1)).toThrow(errorString);
  expect(() => buildWithLimit('query-limit-min', 0)).not.toThrow(errorString);
  expect(() => buildWithLimit('query-limit-max', 75)).not.toThrow(errorString);
  expect(() => buildWithLimit('query-limit-high', 76)).toThrow(errorString);

});

test('when resolver limit is out of range, it throws an error', () => {

  const errorString = 'You must specify a resolver count limit between 0 and 10000.';

  const buildWithLimit = (name, resolverCountLimit) => {
    new appsync.GraphqlApi(stack, name, {
      authorizationConfig: {},
      name: 'query-limits',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      resolverCountLimit,
    });
  };

  expect(() => buildWithLimit('resolver-limit-low', -1)).toThrow(errorString);
  expect(() => buildWithLimit('resolver-limit-min', 0)).not.toThrow(errorString);
  expect(() => buildWithLimit('resolver-limit-max', 10000)).not.toThrow(errorString);
  expect(() => buildWithLimit('resolver-limit-high', 10001)).toThrow(errorString);

});

test.each([
  [appsync.FieldLogLevel.ALL],
  [appsync.FieldLogLevel.ERROR],
  [appsync.FieldLogLevel.NONE],
  [appsync.FieldLogLevel.INFO],
  [appsync.FieldLogLevel.DEBUG],
])('GraphQLApi with LogLevel %s', (fieldLogLevel) => {
  // WHEN
  new appsync.GraphqlApi(stack, 'GraphQLApi', {
    name: 'api',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    logConfig: {
      fieldLogLevel,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
    LogConfig: {
      FieldLogLevel: fieldLogLevel,
    },
  });
});

test('when owner contact is set, they should be used on API', () => {
  // WHEN
  new appsync.GraphqlApi(stack, 'owner-contact', {
    name: 'owner-contact',
    definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    ownerContact: 'test',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
    OwnerContact: 'test',
  });
});

test('when owner contact exceeds 256 characters, it throws an error', () => {
  const buildWithOwnerContact = () => {
    new appsync.GraphqlApi(stack, 'owner-contact-length-exceeded', {
      name: 'owner-contact',
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
      ownerContact: 'a'.repeat(256 + 1),
    });
  };

  expect(() => buildWithOwnerContact()).toThrow('You must specify `ownerContact` as a string of 256 characters or less.');
});
