import '@aws-cdk/assert/jest';
import * as path from 'path';
import * as cognito from '@aws-cdk/aws-cognito';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

// GIVEN
let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

describe('AppSync API Key Authorization', () => {
  test('AppSync creates default api key', () => {
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
    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
        additionalAuthorizationModes: [
          { authorizationType: appsync.AuthorizationType.API_KEY },
        ],
      },
    });

    // THEN
    expect(stack).toHaveResource('AWS::AppSync::ApiKey');
  });

  test('AppSync does not create unspecified api key from additionalAuthorizationModes', () => {
    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
      },
    });

    // THEN
    expect(stack).not.toHaveResource('AWS::AppSync::ApiKey');
  });

  test('appsync does not create unspecified api key with empty additionalAuthorizationModes', () => {
    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
        additionalAuthorizationModes: [],
      },
    });

    // THEN
    expect(stack).not.toHaveResource('AWS::AppSync::ApiKey');
  });

  test('appsync creates configured api key with additionalAuthorizationModes', () => {
    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: { description: 'Custom Description' },
        }],
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::ApiKey', {
      Description: 'Custom Description',
    });
  });

  test('appsync creates configured api key with additionalAuthorizationModes (not as first element)', () => {
    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: { userPool: new cognito.UserPool(stack, 'myPool') },
          },
          {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: { description: 'Custom Description' },
          },
        ],
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::ApiKey', {
      Description: 'Custom Description',
    });
  });

  test('appsync fails when empty default and API_KEY in additional', () => {
    // WHEN
    const when = () => {
      new appsync.GraphQLApi(stack, 'api', {
        name: 'api',
        schemaDefinition: appsync.SchemaDefinition.FILE,
        schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
        authorizationConfig: {
          additionalAuthorizationModes: [{
            authorizationType: appsync.AuthorizationType.API_KEY,
          }],
        },
      });
    };

    // THEN
    expect(when).toThrowError('You can\'t duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });

  test('appsync fails when multiple API_KEY auth modes', () => {
    // WHEN
    const when = () => {
      new appsync.GraphQLApi(stack, 'api', {
        name: 'api',
        schemaDefinition: appsync.SchemaDefinition.FILE,
        schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
        authorizationConfig: {
          defaultAuthorization: { authorizationType: appsync.AuthorizationType.API_KEY },
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
    // WHEN
    const when = () => {
      new appsync.GraphQLApi(stack, 'api', {
        name: 'api',
        schemaDefinition: appsync.SchemaDefinition.FILE,
        schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
        authorizationConfig: {
          defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
          additionalAuthorizationModes: [
            { authorizationType: appsync.AuthorizationType.API_KEY },
            { authorizationType: appsync.AuthorizationType.API_KEY },
          ],
        },
      });
    };

    // THEN
    expect(when).toThrowError('You can\'t duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });
});

describe('AppSync IAM Authorization', () => {
  test('Iam authorization configurable in default authorization', () => {
    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLApi', {
      AuthenticationType: 'AWS_IAM',
    });
  });

  test('Iam authorization configurable in additional authorization', () => {
    // WHEN
    new appsync.GraphQLApi(stack, 'api', {
      name: 'api',
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        additionalAuthorizationModes: [{ authorizationType: appsync.AuthorizationType.IAM }],
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [{ AuthenticationType: 'AWS_IAM' }],
    });
  });

  test('appsync fails when multiple iam auth modes', () => {
    // WHEN
    const when = () => {
      new appsync.GraphQLApi(stack, 'api', {
        name: 'api',
        schemaDefinition: appsync.SchemaDefinition.FILE,
        schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
        authorizationConfig: {
          defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
          additionalAuthorizationModes: [{ authorizationType: appsync.AuthorizationType.IAM }],
        },
      });
    };

    // THEN
    expect(when).toThrowError('You can\'t duplicate IAM configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });

  test('appsync fails when multiple IAM auth modes in additionalXxx', () => {
    // WHEN
    const when = () => {
      new appsync.GraphQLApi(stack, 'api', {
        name: 'api',
        schemaDefinition: appsync.SchemaDefinition.FILE,
        schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
        authorizationConfig: {
          additionalAuthorizationModes: [
            { authorizationType: appsync.AuthorizationType.IAM },
            { authorizationType: appsync.AuthorizationType.IAM },
          ],
        },
      });
    };

    // THEN
    expect(when).toThrowError('You can\'t duplicate IAM configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });
});
