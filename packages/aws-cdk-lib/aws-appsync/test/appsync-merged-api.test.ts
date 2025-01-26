import * as path from 'path';
import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as cxapi from '../../cx-api';
import * as appsync from '../lib';

let stack: cdk.Stack;
let stackWithFlag: cdk.Stack;
let api1: appsync.GraphqlApi;
let api2: appsync.GraphqlApi;
let api3: appsync.GraphqlApi;
let api4: appsync.GraphqlApi;
beforeEach(() => {
  stack = new cdk.Stack();
  stackWithFlag = new cdk.Stack(new cdk.App({
    context: {
      [cxapi.APPSYNC_ENABLE_USE_ARN_IDENTIFIER_SOURCE_API_ASSOCIATION]: true,
    },
  }));

  api1 = new appsync.GraphqlApi(stack, 'api1', {
    authorizationConfig: {},
    name: 'api',
    definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.test.graphql')),
    logConfig: {},
  });

  api2 = new appsync.GraphqlApi(stack, 'api2', {
    authorizationConfig: {},
    name: 'api',
    definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.test.graphql')),
    logConfig: {},
  });

  api3 = new appsync.GraphqlApi(stackWithFlag, 'api1', {
    authorizationConfig: {},
    name: 'api',
    definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.test.graphql')),
    logConfig: {},
  });

  api4 = new appsync.GraphqlApi(stackWithFlag, 'api2', {
    authorizationConfig: {},
    name: 'api',
    definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.test.graphql')),
    logConfig: {},
  });
});

test('appsync supports merged API', () => {
  // WHEN
  const mergedApi = new appsync.GraphqlApi(stack, 'merged-api', {
    name: 'api',
    definition: appsync.Definition.fromSourceApis({
      sourceApis: [
        {
          sourceApi: api1,
          mergeType: appsync.MergeType.MANUAL_MERGE,
        },
        {
          sourceApi: api2,
          mergeType: appsync.MergeType.AUTO_MERGE,
        },
      ],
    }),
  });

  validateSourceApiAssociations(stack, 'mergedapiMergedApiExecutionRole2053D32E',
    'mergedapiMergedApiExecutionRoleDefaultPolicy6F79FCAF', 'ApiId');
});

test('appsync supports merged API - ARN identifier flag enabled', () => {
  // WHEN
  const mergedApi = new appsync.GraphqlApi(stackWithFlag, 'merged-api', {
    name: 'api',
    definition: appsync.Definition.fromSourceApis({
      sourceApis: [
        {
          sourceApi: api3,
          mergeType: appsync.MergeType.MANUAL_MERGE,
        },
        {
          sourceApi: api4,
          mergeType: appsync.MergeType.AUTO_MERGE,
        },
      ],
    }),
  });

  validateSourceApiAssociations(stackWithFlag, 'mergedapiMergedApiExecutionRole2053D32E',
    'mergedapiMergedApiExecutionRoleDefaultPolicy6F79FCAF', 'Arn');
});

test('appsync supports merged API with default merge type', () => {
  // WHEN
  new appsync.GraphqlApi(stack, 'merged-api', {
    name: 'api',
    definition: appsync.Definition.fromSourceApis({
      sourceApis: [
        {
          sourceApi: api1,
        },
      ],
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::SourceApiAssociation', {
    MergedApiIdentifier: {
      'Fn::GetAtt': [
        'mergedapiCE4CAF34',
        'ApiId',
      ],
    },
    SourceApiAssociationConfig: {
      MergeType: 'AUTO_MERGE',
    },
    SourceApiIdentifier: {
      'Fn::GetAtt': [
        'api1A91238E2',
        'ApiId',
      ],
    },
  });
});

test('appsync merged API with custom merged API execution role', () => {
  // WHEN
  const role = new iam.Role(stack, 'CustomMergedApiExecutionRole', {
    assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
  });
  new appsync.GraphqlApi(stack, 'merged-api', {
    name: 'api',
    definition: appsync.Definition.fromSourceApis({
      mergedApiExecutionRole: role,
      sourceApis: [
        {
          sourceApi: api1,
          mergeType: appsync.MergeType.MANUAL_MERGE,
        },
        {
          sourceApi: api2,
          mergeType: appsync.MergeType.AUTO_MERGE,
        },
      ],
    }),
  });

  // THEN
  validateSourceApiAssociations(stack, 'CustomMergedApiExecutionRoleB795A9C4',
    'CustomMergedApiExecutionRoleDefaultPolicy012408A1', 'ApiId');
});

test('Merged API throws when accessing schema property', () => {
  // WHEN
  const mergedApi = new appsync.GraphqlApi(stack, 'merged-api', {
    name: 'api',
    definition: appsync.Definition.fromSourceApis({
      sourceApis: [
        {
          sourceApi: api1,
          mergeType: appsync.MergeType.MANUAL_MERGE,
        },
        {
          sourceApi: api2,
          mergeType: appsync.MergeType.AUTO_MERGE,
        },
      ],
    }),
  });

  // THEN
  expect(() => {
    mergedApi.schema;
  }).toThrow('Schema does not exist for AppSync merged APIs.');
});

test('source api association depends on source schema', () => {
  // WHEN
  new appsync.GraphqlApi(stack, 'merged-api', {
    name: 'api',
    definition: appsync.Definition.fromSourceApis({
      sourceApis: [
        {
          sourceApi: api1,
        },
      ],
    }),
  });

  // THEN
  Template.fromStack(stack).hasResource('AWS::AppSync::SourceApiAssociation', {
    DependsOn: [
      'api1SchemaFFA53DB6',
    ],
    Properties: {
      MergedApiIdentifier: {
        'Fn::GetAtt': [
          'mergedapiCE4CAF34',
          'ApiId',
        ],
      },
      SourceApiIdentifier: {
        'Fn::GetAtt': [
          'api1A91238E2',
          'ApiId',
        ],
      },
    },
  });
});

function validateSourceApiAssociations(stackToValidate: cdk.Stack,
  expectedMergedApiExecutionRole: string,
  expectedPolicyName: string,
  expectedIdentifier: string) {
  // THEN
  Template.fromStack(stackToValidate).hasResourceProperties('AWS::AppSync::GraphQLApi', {
    ApiType: 'MERGED',
    MergedApiExecutionRoleArn: {
      'Fn::GetAtt': [
        expectedMergedApiExecutionRole,
        'Arn',
      ],
    },
  });

  Template.fromStack(stackToValidate).hasResourceProperties('AWS::AppSync::SourceApiAssociation', {
    MergedApiIdentifier: {
      'Fn::GetAtt': [
        'mergedapiCE4CAF34',
        expectedIdentifier,
      ],
    },
    SourceApiAssociationConfig: {
      MergeType: 'MANUAL_MERGE',
    },
    SourceApiIdentifier: {
      'Fn::GetAtt': [
        'api1A91238E2',
        expectedIdentifier,
      ],
    },
  });
  Template.fromStack(stackToValidate).hasResourceProperties('AWS::AppSync::SourceApiAssociation', {
    MergedApiIdentifier: {
      'Fn::GetAtt': [
        'mergedapiCE4CAF34',
        expectedIdentifier,
      ],
    },
    SourceApiAssociationConfig: {
      MergeType: 'AUTO_MERGE',
    },
    SourceApiIdentifier: {
      'Fn::GetAtt': [
        'api2C4850CEA',
        expectedIdentifier,
      ],
    },
  });
  Template.fromStack(stackToValidate).hasResourceProperties('AWS::AppSync::SourceApiAssociation', {
    MergedApiIdentifier: {
      'Fn::GetAtt': [
        'mergedapiCE4CAF34',
        expectedIdentifier,
      ],
    },
    SourceApiAssociationConfig: {
      MergeType: 'AUTO_MERGE',
    },
    SourceApiIdentifier: {
      'Fn::GetAtt': [
        'api2C4850CEA',
        expectedIdentifier,
      ],
    },
  });

  Template.fromStack(stackToValidate).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'appsync.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });

  Template.fromStack(stackToValidate).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'appsync:SourceGraphQL',
          Effect: 'Allow',
          Resource: [
            {
              'Fn::GetAtt': [
                'mergedapiapi1Association63F38E0D',
                'SourceApiArn',
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'mergedapiapi1Association63F38E0D',
                      'SourceApiArn',
                    ],
                  },
                  '/*',
                ],
              ],
            },
          ],
        },
        {
          Action: 'appsync:SourceGraphQL',
          Effect: 'Allow',
          Resource: [
            {
              'Fn::GetAtt': [
                'mergedapiapi2AssociationC4E5E15E',
                'SourceApiArn',
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'mergedapiapi2AssociationC4E5E15E',
                      'SourceApiArn',
                    ],
                  },
                  '/*',
                ],
              ],
            },
          ],
        },
        {
          Action: 'appsync:StartSchemaMerge',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'mergedapiapi2AssociationC4E5E15E',
              'AssociationArn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: expectedPolicyName,
    Roles: [
      {
        Ref: expectedMergedApiExecutionRole,
      },
    ],
  });
}
