import * as path from 'path';
import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as appsync from '../lib';

let stack: cdk.Stack;
let api1: appsync.IGraphqlApi;
let api2: appsync.IGraphqlApi;
let mergedApiExecutionRole: iam.Role;
let mergedApi: appsync.IGraphqlApi;
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

test('Associate with source apis', () => {
  new appsync.SourceApiAssociation(stack, 'SourceApi1', {
    sourceApi: api1,
    mergedApi: mergedApi,
    mergeType: appsync.MergeType.MANUAL_MERGE,
    mergedApiExecutionRole: mergedApiExecutionRole,
  });

  new appsync.SourceApiAssociation(stack, 'SourceApi2', {
    sourceApi: api2,
    mergedApi: mergedApi,
    mergeType: appsync.MergeType.AUTO_MERGE,
    mergedApiExecutionRole: mergedApiExecutionRole,
  });

  // THEN
  verifySourceAssociations(stack, 'Arn');
  verifyMergedApiExecutionRole(stack);
  verifyDependencyToSchema(stack);
});

function verifyDependencyToSchema(stackToValidate: cdk.Stack) {
  // THEN
  Template.fromStack(stackToValidate).hasResource('AWS::AppSync::SourceApiAssociation', {
    DependsOn: [
      'api2SchemaD5C26031',
    ],
    Properties: {
      MergedApiIdentifier: {
        'Fn::GetAtt': [
          'mergedapiCE4CAF34',
          'Arn',
        ],
      },
      SourceApiIdentifier: {
        'Fn::GetAtt': [
          'api2C4850CEA',
          'Arn',
        ],
      },
    },
  });
  Template.fromStack(stackToValidate).hasResource('AWS::AppSync::SourceApiAssociation', {
    DependsOn: [
      'api1SchemaFFA53DB6',
    ],
    Properties: {
      MergedApiIdentifier: {
        'Fn::GetAtt': [
          'mergedapiCE4CAF34',
          'Arn',
        ],
      },
      SourceApiIdentifier: {
        'Fn::GetAtt': [
          'api1A91238E2',
          'Arn',
        ],
      },
    },
  });
}

function verifySourceAssociations(stackToValidate: cdk.Stack, expectedIdentifier: string) {
  // THEN
  Template.fromStack(stackToValidate).hasResourceProperties('AWS::AppSync::GraphQLApi', {
    ApiType: 'MERGED',
    MergedApiExecutionRoleArn: {
      'Fn::GetAtt': [
        'MergedApiExecutionRoleA4AA677D',
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
}

function verifyMergedApiExecutionRole(stackToValidate: cdk.Stack) {
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

