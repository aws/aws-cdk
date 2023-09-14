import * as path from 'path';
import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as cxapi from '../../cx-api';
import * as appsync from '../lib';

let stack: cdk.Stack;
let api1: appsync.IGraphqlApi;
let api2: appsync.IGraphqlApi;
let api3: appsync.IGraphqlApi;
let api4: appsync.IGraphqlApi;
let appWithFlag: cdk.App;
let stackWithFlag: cdk.Stack;
let mergedApiExecutionRole1: iam.Role;
let mergedApiExecutionRole2: iam.Role;
let mergedApi1: appsync.IGraphqlApi;
let mergedApi2: appsync.IGraphqlApi;
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

  appWithFlag = new cdk.App({
    context: {
      [cxapi.APPSYNC_ENABLE_USE_ARN_IDENTIFIER_SOURCE_API_ASSOCIATION]: true,
    },
  });
  stackWithFlag = new cdk.Stack(appWithFlag);

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

  mergedApiExecutionRole1 = new iam.Role(stack, 'MergedApiExecutionRole', {
    assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
  });

  mergedApi1 = new appsync.GraphqlApi(stack, 'merged-api', {
    name: 'api',
    definition: appsync.Definition.fromSourceApis({
      sourceApis: [],
      mergedApiExecutionRole: mergedApiExecutionRole1,
    }),
  });

  mergedApiExecutionRole2 = new iam.Role(stackWithFlag, 'MergedApiExecutionRole', {
    assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
  });

  mergedApi2 = new appsync.GraphqlApi(stackWithFlag, 'merged-api', {
    name: 'api',
    definition: appsync.Definition.fromSourceApis({
      sourceApis: [],
      mergedApiExecutionRole: mergedApiExecutionRole2,
    }),
  });
});

test('Associate with source apis', () => {
  new appsync.SourceApiAssociation(stack, 'SourceApi1', {
    sourceApi: api1,
    mergedApi: mergedApi1,
    mergeType: appsync.MergeType.MANUAL_MERGE,
    mergedApiExecutionRole: mergedApiExecutionRole1,
  });

  new appsync.SourceApiAssociation(stack, 'SourceApi2', {
    sourceApi: api2,
    mergedApi: mergedApi1,
    mergeType: appsync.MergeType.AUTO_MERGE,
    mergedApiExecutionRole: mergedApiExecutionRole1,
  });

  // THEN
  verifyBasicSourceAssociations(stack, 'ApiId');
  verifyMergedApiExecutionRole(stack);
});

test('Associate with source apis - use ARN identifier flag enabled', () => {
  new appsync.SourceApiAssociation(stackWithFlag, 'SourceApi1', {
    sourceApi: api3,
    mergedApi: mergedApi2,
    mergeType: appsync.MergeType.MANUAL_MERGE,
    mergedApiExecutionRole: mergedApiExecutionRole2,
  });

  new appsync.SourceApiAssociation(stackWithFlag, 'SourceApi2', {
    sourceApi: api4,
    mergedApi: mergedApi2,
    mergeType: appsync.MergeType.AUTO_MERGE,
    mergedApiExecutionRole: mergedApiExecutionRole2,
  });

  // THEN
  verifyBasicSourceAssociations(stackWithFlag, 'Arn');
  verifyMergedApiExecutionRole(stackWithFlag);
});

function verifyBasicSourceAssociations(stackToValidate: cdk.Stack, expectedIdentifier: string) {
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

