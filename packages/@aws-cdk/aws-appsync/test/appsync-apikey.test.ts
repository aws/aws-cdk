import '@aws-cdk/assert/jest';
import * as path from 'path';
import * as cognito from '@aws-cdk/aws-cognito';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

describe('AppSync Authorization Config', () => {
  test('AppSync creates default api key', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
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
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
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
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
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
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
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

  test('appsync creates configured api key with additionalAuthorizationModes', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            description: 'Custom Description',
          },
        }],
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::ApiKey', {
      Description: 'Custom Description',
    });
  });

  test('appsync creates configured api key with additionalAuthorizationModes (not as first element)', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const userPool = new cognito.UserPool(stack, 'myPool');

    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool,
            },
          },
          {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              description: 'Custom Description',
            },
          },
        ],
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::ApiKey', {
      Description: 'Custom Description',
    });
  });

  test('appsync fails when multiple API_KEY auth modes', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const when = () => {
      new appsync.GraphQLApi(stack, 'api', {
        name: 'api',
        schemaDefinition: appsync.SchemaDefinition.FILE,
        schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.API_KEY,
          },
          additionalAuthorizationModes: [{
            authorizationType: appsync.AuthorizationType.API_KEY,
          }],
        },
      });
    };

    // THEN
    expect(when).toThrowError('You can\'t duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });

  test('appsync fails when multiple API_KEY auth modes in additionalXxx', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const when = () => {
      new appsync.GraphQLApi(stack, 'api', {
        name: 'api',
        schemaDefinition: appsync.SchemaDefinition.FILE,
        schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.IAM,
          },
          additionalAuthorizationModes: [
            {
              authorizationType: appsync.AuthorizationType.API_KEY,
            },
            {
              authorizationType: appsync.AuthorizationType.API_KEY,
            },
          ],
        },
      });
    };

    // THEN
    expect(when).toThrowError('You can\'t duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });
});
