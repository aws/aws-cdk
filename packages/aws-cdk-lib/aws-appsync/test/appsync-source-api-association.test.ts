import * as path from 'path';
import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as appsync from '../lib';

let stack: cdk.Stack;
let api1: appsync.GraphqlApi;
let api2: appsync.GraphqlApi;
let mergedApi: appsync.GraphqlApi;
let mergedApiExecutionRole: iam.Role;

beforeEach(() => {
  stack = new cdk.Stack();
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

  mergedApiExecutionRole = new iam.Role(stack, 'MergedApiExecutionRole', {
    assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
  });

  mergedApi = new appsync.GraphqlApi(stack, 'merged-api', {
    name: 'api',
    definition: appsync.Definition.fromSourceApis({
      sourceApis: [],
      mergedApiExecutionRole: mergedApiExecutionRole,
    }),
  });
});

test('source api association requires source api', () => {
  // WHEN
  expect(() => new appsync.SourceApiAssociation(stack, 'SourceApi', {
    mergedApi: mergedApi,
    description: 'This is a source api association where I do not specify a source api :)',
  })).toThrow('Cannot determine the source AppSync API to associate. Must specify the sourceApi or sourceApiIdentifier');
});

test('source api association requires merged api', () => {
  // WHEN
  expect(() => new appsync.SourceApiAssociation(stack, 'SourceApi', {
    sourceApi: api1,
    description: 'This is a source api association where I do not specify a merged api :)',
  })).toThrow('Cannot determine the AppSync Merged API to associate. Must specify the mergedApi or mergedApiIdentifier');
});

test('Associate with source api identifier', () => {
  new appsync.SourceApiAssociation(stack, 'SourceApi1', {
    sourceApiIdentifier: api1.apiId,
    mergedApi: mergedApi,
    mergeType: appsync.MergeType.MANUAL_MERGE,
  });

  new appsync.SourceApiAssociation(stack, 'SourceApi2', {
    sourceApiIdentifier: api2.apiId,
    mergedApi: mergedApi,
    mergeType: appsync.MergeType.AUTO_MERGE,
  });

  // THEN
  verifyBasicSourceAssociations();
});

test('Associate with merged api identifier', () => {
  new appsync.SourceApiAssociation(stack, 'SourceApi1', {
    sourceApiIdentifier: api1.apiId,
    mergedApiIdentifier: mergedApi.apiId,
    mergeType: appsync.MergeType.MANUAL_MERGE,
  });

  new appsync.SourceApiAssociation(stack, 'SourceApi2', {
    sourceApi: api2,
    mergedApiIdentifier: mergedApi.apiId,
    mergeType: appsync.MergeType.AUTO_MERGE,
  });

  // THEN
  verifyBasicSourceAssociations();
});

test('Associate with merged api execution role', () => {
  new appsync.SourceApiAssociation(stack, 'SourceApi1', {
    sourceApi: api1,
    mergedApi: mergedApi,
    mergeType: appsync.MergeType.MANUAL_MERGE,
    mergedApiExecutionRole: mergedApiExecutionRole,
  });

  new appsync.SourceApiAssociation(stack, 'SourceApi2', {
    sourceApiIdentifier: api2.apiId,
    mergedApiIdentifier: mergedApi.apiId,
    mergeType: appsync.MergeType.AUTO_MERGE,
    mergedApiExecutionRole: mergedApiExecutionRole,
  });

  // THEN
  verifyBasicSourceAssociations();
  verifyMergedApiExecutionRole();
});

function verifyBasicSourceAssociations() {
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
    ApiType: 'MERGED',
    MergedApiExecutionRoleArn: {
      'Fn::GetAtt': [
        'MergedApiExecutionRoleA4AA677D',
        'Arn',
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::SourceApiAssociation', {
    MergedApiIdentifier: {
      'Fn::GetAtt': [
        'mergedapiCE4CAF34',
        'ApiId',
      ],
    },
    SourceApiAssociationConfig: {
      MergeType: 'MANUAL_MERGE',
    },
    SourceApiIdentifier: {
      'Fn::GetAtt': [
        'api1A91238E2',
        'ApiId',
      ],
    },
  });
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
        'api2C4850CEA',
        'ApiId',
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
}

function verifyMergedApiExecutionRole() {
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'appsync:SourceGraphQL',
          Effect: 'Allow',
          Resource: [
            {
              'Fn::GetAtt': [
                'SourceApi19C17DBB7',
                'SourceApiArn',
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'SourceApi19C17DBB7',
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
                'SourceApi26424431C',
                'SourceApiArn',
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'SourceApi26424431C',
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
              'SourceApi26424431C',
              'AssociationArn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'MergedApiExecutionRoleDefaultPolicy249A5507',
    Roles: [
      {
        Ref: 'MergedApiExecutionRoleA4AA677D',
      },
    ],
  });
}

