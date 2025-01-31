import * as path from 'node:path';
import { Template } from '../../assertions';
import * as cognito from '../../aws-cognito';
import * as lambda from '../../aws-lambda';
import { App } from '../../core';
import * as cdk from '../../core';
import * as appsync from '../lib';

// GIVEN
let stack: cdk.Stack;
let app: App;
beforeEach(() => {
  app = new App({
    context: {
      '@aws-cdk/aws-appsync:appSyncGraphQLAPIScopeLambdaPermission': true,
    },
  });
  stack = new cdk.Stack(app);
});

describe('AppSync GraphQL API Key Authorization', () => {
  test('AppSync GraphQL API - creates default api key', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('AppSync GraphQL API - creates api key from additionalAuthorizationModes', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
        additionalAuthorizationModes: [{ authorizationType: appsync.AuthorizationType.API_KEY }],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('AppSync GraphQL API - does not create unspecified api key from additionalAuthorizationModes', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 0);
  });

  test('AppSync GraphQL API - does not create unspecified api key with empty additionalAuthorizationModes', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
        additionalAuthorizationModes: [],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 0);
  });

  test('AppSync GraphQL API - creates configured api key with additionalAuthorizationModes', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: { description: 'Custom Description' },
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ApiKey', {
      Description: 'Custom Description',
    });
  });

  test('AppSync GraphQL API - apiKeyConfig creates default with valid expiration date', () => {
    const expires = cdk.Expiration.after(cdk.Duration.days(10));
    const expirationDate: number = expires.toEpoch();

    // WHEN
    new appsync.GraphqlApi(stack, 'API', {
      name: 'apiKeyUnitTest',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.auth.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires,
          },
        },
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ApiKey', {
      ApiId: { 'Fn::GetAtt': ['API62EA1CFF', 'ApiId'] },
      Expires: expirationDate,
    });
  });

  test('AppSync GraphQL API - apiKeyConfig fails if expire argument less than a day', () => {
    // WHEN
    const when = () => {
      new appsync.GraphqlApi(stack, 'API', {
        name: 'apiKeyUnitTest',
        schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.auth.graphql')),
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              expires: cdk.Expiration.after(cdk.Duration.hours(1)),
            },
          },
        },
      });
    };

    // THEN
    expect(when).toThrow('API key expiration must be between 1 and 365 days.');
  });

  test('AppSync GraphQL API - apiKeyConfig fails if expire argument greater than 365 day', () => {
    // WHEN
    const when = () => {
      new appsync.GraphqlApi(stack, 'API', {
        name: 'apiKeyUnitTest',
        schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.auth.graphql')),
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              expires: cdk.Expiration.after(cdk.Duration.days(366)),
            },
          },
        },
      });
    };

    // THEN
    expect(when).toThrow('API key expiration must be between 1 and 365 days.');
  });

  test('AppSync GraphQL API - appsync creates configured api key with additionalAuthorizationModes (not as first element)', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
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
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ApiKey', {
      Description: 'Custom Description',
    });
  });

  test('AppSync GraphQL API - appsync fails when empty default and API_KEY in additional', () => {
    // THEN
    expect(() => {
      new appsync.GraphqlApi(stack, 'api', {
        name: 'api',
        schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
        authorizationConfig: {
          additionalAuthorizationModes: [
            {
              authorizationType: appsync.AuthorizationType.API_KEY,
            },
          ],
        },
      });
    }).toThrow('You can\'t duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });

  test('AppSync GraphQL API - appsync fails when multiple API_KEY auth modes', () => {
    // THEN
    expect(() => {
      new appsync.GraphqlApi(stack, 'api', {
        name: 'api',
        schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
        authorizationConfig: {
          defaultAuthorization: { authorizationType: appsync.AuthorizationType.API_KEY },
          additionalAuthorizationModes: [
            {
              authorizationType: appsync.AuthorizationType.API_KEY,
            },
          ],
        },
      });
    }).toThrow('You can\'t duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });

  test('AppSync GraphQL API - appsync fails when multiple API_KEY auth modes in additionalXxx', () => {
    // THEN
    expect(() => {
      new appsync.GraphqlApi(stack, 'api', {
        name: 'api',
        schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
        authorizationConfig: {
          defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
          additionalAuthorizationModes: [
            { authorizationType: appsync.AuthorizationType.API_KEY },
            { authorizationType: appsync.AuthorizationType.API_KEY },
          ],
        },
      });
    }).toThrow('You can\'t duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });
});

describe('AppSync Event API Key Authorization', () => {
  test('AppSync Event API creates default API key', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('AppSync Event API sets default connection, publish, and subscribe auth modes as API key', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.API_KEY }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.API_KEY }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.API_KEY }],
      },
    });
  });

  test('AppSync Event API sets connection auth modes as auth provider options when not explicitly specified', () => {
    // WHEN
    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
    };

    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [apiKeyProvider, iamProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.API_KEY }, { AuthType: appsync.AppSyncAuthorizationType.IAM }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.API_KEY }, { AuthType: appsync.AppSyncAuthorizationType.IAM }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.API_KEY }, { AuthType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });
  });

  test('AppSync Event API creates API key from secondary auth provider', () => {
    // WHEN
    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
    };

    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [apiKeyProvider, iamProvider],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('AppSync Event API - does not create unspecified API key when API key is not included as an auth provider', () => {
    // WHEN
    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [iamProvider],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 0);
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.IAM }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.IAM }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });
  });

  test('AppSync Event API - creates configured api key when explicitly provided', () => {
    // WHEN
    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
      apiKeyConfig: {
        description: 'Custom Description',
      },
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [apiKeyProvider],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ApiKey', {
      Description: 'Custom Description',
    });
  });

  test('AppSync Event API apiKeyConfig creates default with valid expiration date', () => {
    const expires = cdk.Expiration.after(cdk.Duration.days(10));
    const expirationDate: number = expires.toEpoch();

    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
      apiKeyConfig: {
        expires: expires,
      },
    };

    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [apiKeyProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ApiKey', {
      ApiId: { 'Fn::GetAtt': ['apiC8550315', 'ApiId'] },
      Expires: expirationDate,
    });
  });

  test('AppSync Event API - apiKeyConfig fails if expire argument less than a day', () => {
    // WHEN
    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
      apiKeyConfig: {
        expires: cdk.Expiration.after(cdk.Duration.hours(1)),
      },
    };

    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [apiKeyProvider],
        },
      });
    };

    // THEN
    expect(when).toThrow('API key expiration must be between 1 and 365 days.');
  });

  test('AppSync Event API - apiKeyConfig fails if expire argument greater than 365 day', () => {
    // WHEN
    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
      apiKeyConfig: {
        expires: cdk.Expiration.after(cdk.Duration.days(366)),
      },
    };

    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [apiKeyProvider],
        },
      });
    };

    // THEN
    expect(when).toThrow('API key expiration must be between 1 and 365 days.');
  });

  test('AppSync Event API - fails if API Key is specified in connection, publish, or subscribe auth modes but not specified as an auth provider', () => {
    // WHEN
    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [iamProvider],
          connectionAuthModeTypes: [appsync.AppSyncAuthorizationType.API_KEY],
          defaultPublishAuthModeTypes: [appsync.AppSyncAuthorizationType.API_KEY],
          defaultSubscribeAuthModeTypes: [appsync.AppSyncAuthorizationType.API_KEY],
        },
      });
    };

    // THEN
    expect(when).toThrow('Missing authorization configuration for API_KEY');
  });
});

describe('AppSync GraphQL API IAM Authorization', () => {
  test('AppSync GraphQL API Iam authorization configurable in default authorization', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AuthenticationType: 'AWS_IAM',
    });
  });

  test('AppSync GraphQL API Iam authorization configurable in additional authorization', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        additionalAuthorizationModes: [{ authorizationType: appsync.AuthorizationType.IAM }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [{ AuthenticationType: 'AWS_IAM' }],
    });
  });

  test('AppSync GraphQL API fails when multiple iam auth modes', () => {
    // THEN
    expect(() => {
      new appsync.GraphqlApi(stack, 'api', {
        name: 'api',
        schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
        authorizationConfig: {
          defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
          additionalAuthorizationModes: [{ authorizationType: appsync.AuthorizationType.IAM }],
        },
      });
    }).toThrow('You can\'t duplicate IAM configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });

  test('AppSync GraphQL API fails when multiple IAM auth modes in additionalXxx', () => {
    // THEN
    expect(() => {
      new appsync.GraphqlApi(stack, 'api', {
        name: 'api',
        schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
        authorizationConfig: {
          additionalAuthorizationModes: [
            { authorizationType: appsync.AuthorizationType.IAM },
            { authorizationType: appsync.AuthorizationType.IAM },
          ],
        },
      });
    }).toThrow('You can\'t duplicate IAM configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });
});

describe('AppSync Event API IAM Authorization', () => {
  test('AppSync Event API Iam authorization configurable in authorization provider', () => {
    // WHEN
    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [iamProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [
          {
            AuthType: appsync.AuthorizationType.IAM,
          },
        ],
      },
    });
  });

  test('AppSync Event API sets connection auth modes as auth provider options when not explicitly specified', () => {
    // WHEN
    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [iamProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AuthorizationType.IAM }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AuthorizationType.IAM }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AuthorizationType.IAM }],
      },
    });
  });

  test('AppSync Event API throws error when specified connection, publish, subscribe mode not included as auth provider', () => {
    // WHEN
    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
    };

    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [apiKeyProvider],
          connectionAuthModeTypes: [appsync.AppSyncAuthorizationType.IAM],
          defaultPublishAuthModeTypes: [appsync.AppSyncAuthorizationType.IAM],
          defaultSubscribeAuthModeTypes: [appsync.AppSyncAuthorizationType.IAM],
        },
      });
    };

    // THEN
    expect(when).toThrow('Missing authorization configuration for AWS_IAM');
  });

  test('AppSync Event API fails when multiple iam auth modes', () => {
    // THEN
    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    expect(() => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [iamProvider, iamProvider],
        },
      });
    }).toThrow("You can't duplicate IAM configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html");
  });
});

describe('AppSync GraphQL API User Pool Authorization', () => {
  let userPool: cognito.UserPool;
  beforeEach(() => {
    userPool = new cognito.UserPool(stack, 'pool');
  });
  test('User Pool authorization configurable in default authorization has default configuration', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: { userPool },
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AuthenticationType: 'AMAZON_COGNITO_USER_POOLS',
      UserPoolConfig: {
        AwsRegion: { Ref: 'AWS::Region' },
        DefaultAction: 'ALLOW',
        UserPoolId: { Ref: 'pool056F3F7E' },
      },
    });
  });

  test('User Pool authorization configurable in default authorization', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
            appIdClientRegex: 'test',
            defaultAction: appsync.UserPoolDefaultAction.DENY,
          },
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AuthenticationType: 'AMAZON_COGNITO_USER_POOLS',
      UserPoolConfig: {
        AwsRegion: { Ref: 'AWS::Region' },
        DefaultAction: 'DENY',
        AppIdClientRegex: 'test',
        UserPoolId: { Ref: 'pool056F3F7E' },
      },
    });
  });

  test('User Pool authorization configurable in additional authorization has default configuration', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: { userPool },
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [
        {
          AuthenticationType: 'AMAZON_COGNITO_USER_POOLS',
          UserPoolConfig: {
            AwsRegion: { Ref: 'AWS::Region' },
            UserPoolId: { Ref: 'pool056F3F7E' },
          },
        },
      ],
    });
  });

  test('User Pool property defaultAction does not configure when in additional auth', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool,
              appIdClientRegex: 'test',
              defaultAction: appsync.UserPoolDefaultAction.DENY,
            },
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [
        {
          AuthenticationType: 'AMAZON_COGNITO_USER_POOLS',
          UserPoolConfig: {
            AwsRegion: { Ref: 'AWS::Region' },
            AppIdClientRegex: 'test',
            UserPoolId: { Ref: 'pool056F3F7E' },
          },
        },
      ],
    });
  });

  test('User Pool property defaultAction does not configure when in additional auth (complex)', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: { userPool },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: { userPool },
          },
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool,
              appIdClientRegex: 'test',
              defaultAction: appsync.UserPoolDefaultAction.DENY,
            },
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AuthenticationType: 'AMAZON_COGNITO_USER_POOLS',
      UserPoolConfig: {
        AwsRegion: { Ref: 'AWS::Region' },
        DefaultAction: 'ALLOW',
        UserPoolId: { Ref: 'pool056F3F7E' },
      },
      AdditionalAuthenticationProviders: [
        {
          AuthenticationType: 'AMAZON_COGNITO_USER_POOLS',
          UserPoolConfig: {
            AwsRegion: { Ref: 'AWS::Region' },
            UserPoolId: { Ref: 'pool056F3F7E' },
          },
        },
        {
          AuthenticationType: 'AMAZON_COGNITO_USER_POOLS',
          UserPoolConfig: {
            AwsRegion: { Ref: 'AWS::Region' },
            AppIdClientRegex: 'test',
            UserPoolId: { Ref: 'pool056F3F7E' },
          },
        },
      ],
    });
  });
});

describe('AppSync Event API User Pool Authorization', () => {
  let userPool: cognito.UserPool;
  beforeEach(() => {
    userPool = new cognito.UserPool(stack, 'pool');
  });
  test('User Pool authorization configurable', () => {
    // WHEN
    const cognitoProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.USER_POOL,
      cognitoConfig: {
        userPool,
      },
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [cognitoProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [
          {
            AuthType: appsync.AuthorizationType.USER_POOL,
            CognitoConfig: {
              AwsRegion: { Ref: 'AWS::Region' },
              UserPoolId: { Ref: 'pool056F3F7E' },
            },
          },
        ],
      },
    });
  });

  test('AppSync Event API sets connection auth modes as auth provider options when not explicitly specified', () => {
    // WHEN
    const cognitoProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.USER_POOL,
      cognitoConfig: {
        userPool,
      },
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [cognitoProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.USER_POOL }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.USER_POOL }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.USER_POOL }],
      },
    });
  });

  test('AppSync Event API throws error when specified connection, publish, subscribe mode not included as auth provider', () => {
    // WHEN
    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
    };

    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [apiKeyProvider],
          connectionAuthModeTypes: [appsync.AppSyncAuthorizationType.USER_POOL],
          defaultPublishAuthModeTypes: [appsync.AppSyncAuthorizationType.USER_POOL],
          defaultSubscribeAuthModeTypes: [appsync.AppSyncAuthorizationType.USER_POOL],
        },
      });
    };

    // THEN
    expect(when).toThrow('Missing authorization configuration for AMAZON_COGNITO_USER_POOLS');
  });

  test('User Pool property defaultAction does not configure when in additional auth', () => {
    // WHEN
    const cognitoProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.USER_POOL,
      cognitoConfig: {
        userPool,
        appIdClientRegex: 'test',
      },
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [cognitoProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [
          {
            AuthType: appsync.AppSyncAuthorizationType.USER_POOL,
            CognitoConfig: {
              AwsRegion: { Ref: 'AWS::Region' },
              AppIdClientRegex: 'test',
              UserPoolId: { Ref: 'pool056F3F7E' },
            },
          },
        ],
      },
    });
  });

  test('AppSync Event API throws error when authType is defined but missing Cognito Config', () => {
    // WHEN
    const cognitoProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.USER_POOL,
    };

    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [cognitoProvider],
        },
      });
    };

    // THEN
    expect(when).toThrow('AMAZON_COGNITO_USER_POOLS authorization type is specified but Cognito Authorizer Configuration is missing in the AuthProvider');
  });
});

describe('AppSync GraphQL API OIDC Authorization', () => {
  test('OIDC authorization configurable in default authorization has default configuration', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.OIDC,
          openIdConnectConfig: { oidcProvider: 'test' },
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AuthenticationType: 'OPENID_CONNECT',
      OpenIDConnectConfig: {
        Issuer: 'test',
      },
    });
  });

  test('User Pool authorization configurable in default authorization', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.OIDC,
          openIdConnectConfig: {
            oidcProvider: 'test',
            clientId: 'id',
            tokenExpiryFromAuth: 1,
            tokenExpiryFromIssue: 1,
          },
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AuthenticationType: 'OPENID_CONNECT',
      OpenIDConnectConfig: {
        AuthTTL: 1,
        ClientId: 'id',
        IatTTL: 1,
        Issuer: 'test',
      },
    });
  });

  test('OIDC authorization configurable in additional authorization has default configuration', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.OIDC,
            openIdConnectConfig: { oidcProvider: 'test' },
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [
        {
          AuthenticationType: 'OPENID_CONNECT',
          OpenIDConnectConfig: {
            Issuer: 'test',
          },
        },
      ],
    });
  });

  test('User Pool authorization configurable in additional authorization', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.OIDC,
            openIdConnectConfig: {
              oidcProvider: 'test',
              clientId: 'id',
              tokenExpiryFromAuth: 1,
              tokenExpiryFromIssue: 1,
            },
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [
        {
          AuthenticationType: 'OPENID_CONNECT',
          OpenIDConnectConfig: {
            AuthTTL: 1,
            ClientId: 'id',
            IatTTL: 1,
            Issuer: 'test',
          },
        },
      ],
    });
  });

  test('User Pool authorization configurable in with multiple authorization', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.OIDC,
          openIdConnectConfig: { oidcProvider: 'test' },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.OIDC,
            openIdConnectConfig: {
              oidcProvider: 'test1',
              clientId: 'id',
              tokenExpiryFromAuth: 1,
              tokenExpiryFromIssue: 1,
            },
          },
          {
            authorizationType: appsync.AuthorizationType.OIDC,
            openIdConnectConfig: {
              oidcProvider: 'test2',
              clientId: 'id',
              tokenExpiryFromAuth: 1,
              tokenExpiryFromIssue: 1,
            },
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AuthenticationType: 'OPENID_CONNECT',
      OpenIDConnectConfig: { Issuer: 'test' },
      AdditionalAuthenticationProviders: [
        {
          AuthenticationType: 'OPENID_CONNECT',
          OpenIDConnectConfig: {
            AuthTTL: 1,
            ClientId: 'id',
            IatTTL: 1,
            Issuer: 'test1',
          },
        },
        {
          AuthenticationType: 'OPENID_CONNECT',
          OpenIDConnectConfig: {
            AuthTTL: 1,
            ClientId: 'id',
            IatTTL: 1,
            Issuer: 'test2',
          },
        },
      ],
    });
  });
});

describe('AppSync Event API OIDC Authorization', () => {
  test('OIDC authorization configurable', () => {
    // WHEN
    const oidcProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.OIDC,
      openIdConnectConfig: { oidcProvider: 'test' },
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [oidcProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [
          {
            AuthType: appsync.AppSyncAuthorizationType.OIDC,
            OpenIDConnectConfig: {
              Issuer: 'test',
            },
          },
        ],
      },
    });
  });

  test('OIDC authorization configurable in default authorization', () => {
    // WHEN
    const oidcProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.OIDC,
      openIdConnectConfig: {
        oidcProvider: 'test',
        clientId: 'id',
        tokenExpiryFromAuth: 1,
        tokenExpiryFromIssue: 1,
      },
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [oidcProvider],
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [
          {
            AuthType: appsync.AppSyncAuthorizationType.OIDC,
            OpenIDConnectConfig: {
              AuthTTL: 1,
              ClientId: 'id',
              IatTTL: 1,
              Issuer: 'test',
            },
          },
        ],
      },
    });
  });

  test('AppSync Event API sets connection auth modes as auth provider options when not explicitly specified', () => {
    // WHEN
    const oidcProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.OIDC,
      openIdConnectConfig: {
        oidcProvider: 'test',
        clientId: 'id',
        tokenExpiryFromAuth: 1,
        tokenExpiryFromIssue: 1,
      },
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [oidcProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.OIDC }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.OIDC }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.OIDC }],
      },
    });
  });

  test('AppSync Event API throws error when specified connection, publish, subscribe mode not included as auth provider', () => {
    // WHEN
    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
    };

    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [apiKeyProvider],
          connectionAuthModeTypes: [appsync.AppSyncAuthorizationType.OIDC],
          defaultPublishAuthModeTypes: [appsync.AppSyncAuthorizationType.OIDC],
          defaultSubscribeAuthModeTypes: [appsync.AppSyncAuthorizationType.OIDC],
        },
      });
    };

    // THEN
    expect(when).toThrow('Missing authorization configuration for OPENID_CONNECT');
  });

  test('User Pool authorization configurable in with multiple authorization', () => {
    // WHEN
    const oidcProvider1: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.OIDC,
      openIdConnectConfig: {
        oidcProvider: 'test',
      },
    };

    const oidcProvider2: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.OIDC,
      openIdConnectConfig: {
        oidcProvider: 'test1',
        clientId: 'id',
        tokenExpiryFromAuth: 1,
        tokenExpiryFromIssue: 1,
      },
    };

    const oidcProvider3: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.OIDC,
      openIdConnectConfig: {
        oidcProvider: 'test2',
        clientId: 'id',
        tokenExpiryFromAuth: 1,
        tokenExpiryFromIssue: 1,
      },
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [oidcProvider1, oidcProvider2, oidcProvider3],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [
          {
            AuthType: appsync.AppSyncAuthorizationType.OIDC,
            OpenIDConnectConfig: {
              Issuer: 'test',
            },
          },
          {
            AuthType: appsync.AppSyncAuthorizationType.OIDC,
            OpenIDConnectConfig: {
              AuthTTL: 1,
              ClientId: 'id',
              IatTTL: 1,
              Issuer: 'test1',
            },
          },
          {
            AuthType: appsync.AppSyncAuthorizationType.OIDC,
            OpenIDConnectConfig: {
              AuthTTL: 1,
              ClientId: 'id',
              IatTTL: 1,
              Issuer: 'test2',
            },
          },
        ],
      },
    });
  });

  test('AppSync Event API throws error when authType is defined but missing OIDC Config', () => {
    // WHEN
    const oidcProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.OIDC,
    };

    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [oidcProvider],
        },
      });
    };

    // THEN
    expect(when).toThrow('OPENID_CONNECT authorization type is specified but OIDC Authorizer Configuration is missing in the AuthProvider');
  });
});

describe('AppSync GraphQL API Lambda Authorization', () => {
  let fn: lambda.Function;
  beforeEach(() => {
    fn = new lambda.Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('/* lambda authentication code here.*/'),
    });
  });

  test('Lambda authorization configurable in default authorization has default configuration', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
          },
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AuthenticationType: 'AWS_LAMBDA',
      LambdaAuthorizerConfig: {
        AuthorizerUri: {
          'Fn::GetAtt': ['authfunction96361832', 'Arn'],
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': ['authfunction96361832', 'Arn'],
      },
    });
  });

  test('Attach Lambda Authorization to two or more graphql api', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api1', {
      name: 'api1',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
          },
        },
      },
    });

    new appsync.GraphqlApi(stack, 'api2', {
      name: 'api2',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
          },
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AuthenticationType: 'AWS_LAMBDA',
      LambdaAuthorizerConfig: {
        AuthorizerUri: {
          'Fn::GetAtt': ['authfunction96361832', 'Arn'],
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': ['authfunction96361832', 'Arn'],
      },
    });
  });

  test('Lambda authorization configurable in default authorization', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
            resultsCacheTtl: cdk.Duration.seconds(300),
            validationRegex: 'custom-.*',
          },
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AuthenticationType: 'AWS_LAMBDA',
      LambdaAuthorizerConfig: {
        AuthorizerUri: {
          'Fn::GetAtt': ['authfunction96361832', 'Arn'],
        },
        AuthorizerResultTtlInSeconds: 300,
        IdentityValidationExpression: 'custom-.*',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': ['authfunction96361832', 'Arn'],
      },
    });
  });

  test('Lambda authorization configurable in additional authorization has default configuration', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.LAMBDA,
            lambdaAuthorizerConfig: {
              handler: fn,
            },
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [
        {
          AuthenticationType: 'AWS_LAMBDA',
          LambdaAuthorizerConfig: {
            AuthorizerUri: {
              'Fn::GetAtt': ['authfunction96361832', 'Arn'],
            },
          },
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': ['authfunction96361832', 'Arn'],
      },
    });
  });

  test('Lambda authorization configurable in additional authorization', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.LAMBDA,
            lambdaAuthorizerConfig: {
              handler: fn,
              resultsCacheTtl: cdk.Duration.seconds(300),
              validationRegex: 'custom-.*',
            },
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [
        {
          AuthenticationType: 'AWS_LAMBDA',
          LambdaAuthorizerConfig: {
            AuthorizerUri: {
              'Fn::GetAtt': ['authfunction96361832', 'Arn'],
            },
            AuthorizerResultTtlInSeconds: 300,
            IdentityValidationExpression: 'custom-.*',
          },
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': ['authfunction96361832', 'Arn'],
      },
    });
  });

  test('Lambda authorization throws with multiple lambda authorization', () => {
    expect(
      () =>
        new appsync.GraphqlApi(stack, 'api', {
          name: 'api',
          schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
          authorizationConfig: {
            defaultAuthorization: {
              authorizationType: appsync.AuthorizationType.LAMBDA,
              lambdaAuthorizerConfig: {
                handler: fn,
              },
            },
            additionalAuthorizationModes: [
              {
                authorizationType: appsync.AuthorizationType.LAMBDA,
                lambdaAuthorizerConfig: {
                  handler: fn,
                  resultsCacheTtl: cdk.Duration.seconds(300),
                  validationRegex: 'custom-.*',
                },
              },
            ],
          },
        }),
    ).toThrow('You can only have a single AWS Lambda function configured to authorize your API.');

    expect(
      () =>
        new appsync.GraphqlApi(stack, 'api2', {
          name: 'api',
          schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
          authorizationConfig: {
            defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
            additionalAuthorizationModes: [
              {
                authorizationType: appsync.AuthorizationType.LAMBDA,
                lambdaAuthorizerConfig: {
                  handler: fn,
                  resultsCacheTtl: cdk.Duration.seconds(300),
                  validationRegex: 'custom-.*',
                },
              },
              {
                authorizationType: appsync.AuthorizationType.LAMBDA,
                lambdaAuthorizerConfig: {
                  handler: fn,
                  resultsCacheTtl: cdk.Duration.seconds(300),
                  validationRegex: 'custom-.*',
                },
              },
            ],
          },
        }),
    ).toThrow('You can only have a single AWS Lambda function configured to authorize your API.');
  });

  test('throws if authorization type and mode do not match', () => {
    expect(
      () =>
        new appsync.GraphqlApi(stack, 'api', {
          name: 'api',
          schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
          authorizationConfig: {
            defaultAuthorization: {
              authorizationType: appsync.AuthorizationType.LAMBDA,
              openIdConnectConfig: { oidcProvider: 'test' },
            },
          },
        }),
    ).toThrow('Missing Lambda Configuration');
  });

  test('Lambda authorization properly scoped under feature flag', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
          },
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': ['authfunction96361832', 'Arn'],
      },
      Principal: 'appsync.amazonaws.com',
      SourceArn: {
        'Fn::GetAtt': ['apiC8550315', 'Arn'],
      },
    });
  });
});

describe('AppSync Event API Lambda Authorization', () => {
  let fn: lambda.Function;
  beforeEach(() => {
    fn = new lambda.Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('// lambda authentication code here.'),
    });
  });

  test('Lambda authorization configurable in default authorization has default configuration', () => {
    // WHEN
    const lambdaProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.LAMBDA,
      lambdaAuthorizerConfig: {
        handler: fn,
      },
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [lambdaProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: 'AWS_LAMBDA' }],
        DefaultPublishAuthModes: [{ AuthType: 'AWS_LAMBDA' }],
        DefaultSubscribeAuthModes: [{ AuthType: 'AWS_LAMBDA' }],
        AuthProviders: [
          {
            AuthType: appsync.AppSyncAuthorizationType.LAMBDA,
            LambdaAuthorizerConfig: {
              AuthorizerUri: {
                'Fn::GetAtt': ['authfunction96361832', 'Arn'],
              },
            },
          },
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': ['authfunction96361832', 'Arn'],
      },
    });
  });

  test('AppSync Event API sets connection auth modes as auth provider options when not explicitly specified', () => {
    // WHEN
    const lambdaProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.LAMBDA,
      lambdaAuthorizerConfig: {
        handler: fn,
      },
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [lambdaProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'api',
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.LAMBDA }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.LAMBDA }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.LAMBDA }],
      },
    });
  });

  test('AppSync Event API throws error when specified connection, publish, subscribe mode not included as auth provider', () => {
    // WHEN
    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
    };

    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [apiKeyProvider],
          connectionAuthModeTypes: [appsync.AppSyncAuthorizationType.LAMBDA],
          defaultPublishAuthModeTypes: [appsync.AppSyncAuthorizationType.LAMBDA],
          defaultSubscribeAuthModeTypes: [appsync.AppSyncAuthorizationType.LAMBDA],
        },
      });
    };

    // THEN
    expect(when).toThrow('Missing authorization configuration for AWS_LAMBDA');
  });

  test('Attach Lambda Authorization to two or more event api', () => {
    // WHEN
    const lambdaProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.LAMBDA,
      lambdaAuthorizerConfig: {
        handler: fn,
      },
    };

    new appsync.EventApi(stack, 'api1', {
      apiName: 'api1',
      authorizationConfig: {
        authProviders: [lambdaProvider],
      },
    });

    new appsync.EventApi(stack, 'api2', {
      apiName: 'api2',
      authorizationConfig: {
        authProviders: [lambdaProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [
          {
            AuthType: appsync.AppSyncAuthorizationType.LAMBDA,
            LambdaAuthorizerConfig: {
              AuthorizerUri: {
                'Fn::GetAtt': ['authfunction96361832', 'Arn'],
              },
            },
          },
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': ['authfunction96361832', 'Arn'],
      },
    });
  });

  test('Lambda authorization configurable in default authorization', () => {
    // WHEN
    const lambdaProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.LAMBDA,
      lambdaAuthorizerConfig: {
        handler: fn,
        resultsCacheTtl: cdk.Duration.seconds(300),
        validationRegex: 'custom-.*',
      },
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [lambdaProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [
          {
            AuthType: appsync.AppSyncAuthorizationType.LAMBDA,
            LambdaAuthorizerConfig: {
              AuthorizerUri: {
                'Fn::GetAtt': ['authfunction96361832', 'Arn'],
              },
              AuthorizerResultTtlInSeconds: 300,
              IdentityValidationExpression: 'custom-.*',
            },
          },
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': ['authfunction96361832', 'Arn'],
      },
    });
  });

  test('Lambda authorization throws with multiple lambda authorization', () => {
    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    const lambdaProvider1: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.LAMBDA,
      lambdaAuthorizerConfig: {
        handler: fn,
      },
    };

    const lambdaProvider2: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.LAMBDA,
      lambdaAuthorizerConfig: {
        handler: fn,
        resultsCacheTtl: cdk.Duration.seconds(300),
        validationRegex: 'custom-.*',
      },
    };
    expect(
      () =>
        new appsync.EventApi(stack, 'api1', {
          apiName: 'api',
          authorizationConfig: {
            authProviders: [lambdaProvider1, lambdaProvider2],
          },
        }),
    ).toThrow(
      'You can only have a single AWS Lambda function configured to authorize your API. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html',
    );

    expect(
      () =>
        new appsync.EventApi(stack, 'api2', {
          apiName: 'api',
          authorizationConfig: {
            authProviders: [iamProvider, lambdaProvider2, lambdaProvider2],
          },
        }),
    ).toThrow(
      'You can only have a single AWS Lambda function configured to authorize your API. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html',
    );
  });

  test('throws if authorization type and mode do not match', () => {
    expect(
      () =>
        new appsync.EventApi(stack, 'api', {
          apiName: 'api',
          authorizationConfig: {
            authProviders: [
              {
                authorizationType: appsync.AppSyncAuthorizationType.LAMBDA,
                openIdConnectConfig: { oidcProvider: 'test' },
              },
            ],
          },
        }),
    ).toThrow('AWS_LAMBDA authorization type is specified but Lambda Authorizer Configuration is missing in the AuthProvider');
  });

  test('Lambda authorization properly scoped under feature flag', () => {
    // WHEN
    const lambdaProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.LAMBDA,
      lambdaAuthorizerConfig: {
        handler: fn,
      },
    };

    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [lambdaProvider],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': ['authfunction96361832', 'Arn'],
      },
      Principal: 'appsync.amazonaws.com',
      SourceArn: {
        'Fn::GetAtt': ['apiC8550315', 'ApiArn'],
      },
    });
  });
});
