import { join } from 'path';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

let stack: cdk.Stack;
beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

describe('AuthorizationType ApiKey', () => {

  test('apiKeyConfig creates default description and no expire field', () => {
    // WHEN
    new appsync.GraphQLApi(stack, 'API', {
      name: 'apiKeyUnitTest',
      schemaDefinitionFile: join(__dirname, 'appsync.auth.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
    });

    // THEN
    expect(stack).toHaveResource('AWS::AppSync::ApiKey', {
      ApiId: { 'Fn::GetAtt': ['API62EA1CFF', 'ApiId' ] },
      Description: 'Default API Key created by CDK',
    });
  });

  test('apiKeyConfig creates default description and valid expiration date', () => {
    const expirationDate: number = cdk.Expiration.after(cdk.Duration.days(10)).asEpoch();

    // WHEN
    new appsync.GraphQLApi(stack, 'API', {
      name: 'apiKeyUnitTest',
      schemaDefinitionFile: join(__dirname, 'appsync.auth.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(10)),
          },
        },
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::ApiKey', {
      ApiId: { 'Fn::GetAtt': ['API62EA1CFF', 'ApiId' ] },
      Description: 'Default API Key created by CDK',
      Expires: expirationDate,
    });
  });

  test('apiKeyConfig fails if expire argument less than a day', () => {
    // WHEN
    const when = () => { new appsync.GraphQLApi(stack, 'API', {
      name: 'apiKeyUnitTest',
      schemaDefinitionFile: join(__dirname, 'appsync.auth.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.hours(1)),
          },
        },
      },
    }); };

    // THEN
    expect(when).toThrowError('API key expiration must be between 1 and 365 days.');
  });

  test('apiKeyConfig fails if expire argument greater than 365 day', () => {
    // WHEN
    const when = () => {new appsync.GraphQLApi(stack, 'API', {
      name: 'apiKeyUnitTest',
      schemaDefinitionFile: join(__dirname, 'appsync.auth.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(366)),
          },
        },
      },
    }); };

    // THEN
    expect(when).toThrowError('API key expiration must be between 1 and 365 days.');
  });
});