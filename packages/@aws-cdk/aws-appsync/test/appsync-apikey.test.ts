import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import * as appsync from '../lib';

describe('AppSync Authorization Config', () => {
  test('AppSync creates default api key', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinitionFile: path.join(__dirname, 'schema.graphql'),
    });

    // THEN
    expect(stack).toHaveResource('AWS::AppSync::ApiKey');
  });

  test('AppSync creates api key from additionalAuthorizationModes', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinitionFile: path.join(__dirname, 'schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
        additionalAuthorizationModes: [
          { authorizationType: appsync.AuthorizationType.API_KEY },
        ],
      },
    });

    // THEN
    expect(stack).toHaveResource('AWS::AppSync::ApiKey');
  });

  test('AppSync does not create unspecified api key from additionalAuthorizationModes', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinitionFile: path.join(__dirname, 'schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // THEN
    expect(stack).not.toHaveResource('AWS::AppSync::ApiKey');
  });

  test('appsync does not create unspecified api key with empty additionalAuthorizationModes', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinitionFile: path.join(__dirname, 'schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
        additionalAuthorizationModes: [],
      },
    });

    // THEN
    expect(stack).not.toHaveResource('AWS::AppSync::ApiKey');
  });
});
