import { join } from 'path';
import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

describe('Grant Permissions', () => {

  test('grant provides correct accurate CUSTOM permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    const grantResources = [
      { custom: 'types/Mutation/fields/addTest' },
    ];
    api.grant(role, grantResources, 'appsync:graphql');

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'ApiF70053CD',
                      'ApiId',
                    ],
                  },
                  '/types/Mutation/fields/addTest',
                ],
              ],
            },
          },
        ],
      },
    });

  });
});