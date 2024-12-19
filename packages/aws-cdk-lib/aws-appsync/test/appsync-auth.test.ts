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
    }).toThrow("You can't duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html");
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
    }).toThrow("You can't duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html");
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
    }).toThrow("You can't duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html");
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
        ConnectionAuthModes: [{ AuthType: appsync.AuthorizationType.API_KEY }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AuthorizationType.API_KEY }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AuthorizationType.API_KEY }],
      },
    });
  });

  test('AppSync Event API sets connection auth modes as auth provider options when not explicitly specified', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.apiKeyAuth(), appsync.AuthProvider.iamAuth()],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AuthorizationType.API_KEY }, { AuthType: appsync.AuthorizationType.IAM }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AuthorizationType.API_KEY }, { AuthType: appsync.AuthorizationType.IAM }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AuthorizationType.API_KEY }, { AuthType: appsync.AuthorizationType.IAM }],
      },
    });
  });

  test('AppSync Event API creates API key from secondary auth provider', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.apiKeyAuth(), appsync.AuthProvider.iamAuth()],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('AppSync Event API - does not create unspecified API key when API key is not included as an auth provider', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.iamAuth()],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 0);
  });

  test('AppSync Event API - creates configured api key when explicitly provided', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.apiKeyAuth({ description: 'Custom Description' })],
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

    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.apiKeyAuth({ expires })],
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
    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [appsync.AuthProvider.apiKeyAuth({ expires: cdk.Expiration.after(cdk.Duration.hours(1)) })],
        },
      });
    };

    // THEN
    expect(when).toThrow('API key expiration must be between 1 and 365 days.');
  });

  test('AppSync Event API - apiKeyConfig fails if expire argument greater than 365 day', () => {
    // WHEN
    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [appsync.AuthProvider.apiKeyAuth({ expires: cdk.Expiration.after(cdk.Duration.days(366)) })],
        },
      });
    };

    // THEN
    expect(when).toThrow('API key expiration must be between 1 and 365 days.');
  });

  test('AppSync Event API - fails if API Key is specified in connection, publish, or subscribe auth modes but not specified as an auth provider', () => {
    // WHEN
    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [appsync.AuthProvider.iamAuth()],
          connectionAuthModeTypes: [appsync.AuthorizationType.API_KEY],
          defaultPublishAuthModeTypes: [appsync.AuthorizationType.API_KEY],
          defaultSubscribeAuthModeTypes: [appsync.AuthorizationType.API_KEY],
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
    }).toThrow("You can't duplicate IAM configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html");
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
    }).toThrow("You can't duplicate IAM configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html");
  });
});

describe('AppSync Event API IAM Authorization', () => {
  test('AppSync Event API Iam authorization configurable in authorization provider', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.iamAuth()],
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
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.iamAuth()],
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
    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [appsync.AuthProvider.apiKeyAuth()],
          connectionAuthModeTypes: [appsync.AuthorizationType.IAM],
          defaultPublishAuthModeTypes: [appsync.AuthorizationType.IAM],
          defaultSubscribeAuthModeTypes: [appsync.AuthorizationType.IAM],
        },
      });
    };

    // THEN
    expect(when).toThrow('Missing authorization configuration for AWS_IAM');
  });

  test('AppSync Event API fails when multiple iam auth modes', () => {
    // THEN
    expect(() => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [appsync.AuthProvider.iamAuth(), appsync.AuthProvider.iamAuth()],
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
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.cognitoAuth({ userPool })],
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
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.cognitoAuth({ userPool })],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AuthorizationType.USER_POOL }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AuthorizationType.USER_POOL }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AuthorizationType.USER_POOL }],
      },
    });
  });

  test('AppSync Event API throws error when specified connection, publish, subscribe mode not included as auth provider', () => {
    // WHEN
    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [appsync.AuthProvider.apiKeyAuth()],
          connectionAuthModeTypes: [appsync.AuthorizationType.USER_POOL],
          defaultPublishAuthModeTypes: [appsync.AuthorizationType.USER_POOL],
          defaultSubscribeAuthModeTypes: [appsync.AuthorizationType.USER_POOL],
        },
      });
    };

    // THEN
    expect(when).toThrow('Missing authorization configuration for AMAZON_COGNITO_USER_POOLS');
  });

  test('User Pool property defaultAction does not configure when in additional auth', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.cognitoAuth({ userPool, appIdClientRegex: 'test' })],
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
              AppIdClientRegex: 'test',
              UserPoolId: { Ref: 'pool056F3F7E' },
            },
          },
        ],
      },
    });
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
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.oidcAuth({ oidcProvider: 'test' })],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [
          {
            AuthType: appsync.AuthorizationType.OIDC,
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
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.oidcAuth({
          oidcProvider: 'test',
          clientId: 'id',
          tokenExpiryFromAuth: 1,
          tokenExpiryFromIssue: 1,
        })],
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [
          {
            AuthType: appsync.AuthorizationType.OIDC,
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
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.oidcAuth({
          oidcProvider: 'test',
          clientId: 'id',
          tokenExpiryFromAuth: 1,
          tokenExpiryFromIssue: 1,
        })],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AuthorizationType.OIDC }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AuthorizationType.OIDC }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AuthorizationType.OIDC }],
      },
    });
  });

  test('AppSync Event API throws error when specified connection, publish, subscribe mode not included as auth provider', () => {
    // WHEN
    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [appsync.AuthProvider.apiKeyAuth()],
          connectionAuthModeTypes: [appsync.AuthorizationType.OIDC],
          defaultPublishAuthModeTypes: [appsync.AuthorizationType.OIDC],
          defaultSubscribeAuthModeTypes: [appsync.AuthorizationType.OIDC],
        },
      });
    };

    // THEN
    expect(when).toThrow('Missing authorization configuration for OPENID_CONNECT');
  });

  test('User Pool authorization configurable in with multiple authorization', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [
          appsync.AuthProvider.oidcAuth( { oidcProvider: 'test' } ),
          appsync.AuthProvider.oidcAuth( {
            oidcProvider: 'test1',
            clientId: 'id',
            tokenExpiryFromAuth: 1,
            tokenExpiryFromIssue: 1,
          } ),
          appsync.AuthProvider.oidcAuth( {
            oidcProvider: 'test2',
            clientId: 'id',
            tokenExpiryFromAuth: 1,
            tokenExpiryFromIssue: 1,
          } ),
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [
          {
            AuthType: appsync.AuthorizationType.OIDC,
            OpenIDConnectConfig: {
              Issuer: 'test',
            },
          },
          {
            AuthType: appsync.AuthorizationType.OIDC,
            OpenIDConnectConfig: {
              AuthTTL: 1,
              ClientId: 'id',
              IatTTL: 1,
              Issuer: 'test1',
            },
          },
          {
            AuthType: appsync.AuthorizationType.OIDC,
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
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.lambdaAuth( { handler: fn } )],
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
            AuthType: appsync.AuthorizationType.LAMBDA,
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
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.lambdaAuth( { handler: fn } )],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'api',
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AuthorizationType.LAMBDA }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AuthorizationType.LAMBDA }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AuthorizationType.LAMBDA }],
      },
    });
  });

  test('AppSync Event API throws error when specified connection, publish, subscribe mode not included as auth provider', () => {
    // WHEN
    const when = () => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [appsync.AuthProvider.apiKeyAuth()],
          connectionAuthModeTypes: [appsync.AuthorizationType.LAMBDA],
          defaultPublishAuthModeTypes: [appsync.AuthorizationType.LAMBDA],
          defaultSubscribeAuthModeTypes: [appsync.AuthorizationType.LAMBDA],
        },
      });
    };

    // THEN
    expect(when).toThrow('Missing authorization configuration for AWS_LAMBDA');
  });

  test('Attach Lambda Authorization to two or more event api', () => {
    // WHEN
    new appsync.EventApi(stack, 'api1', {
      apiName: 'api1',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.lambdaAuth( { handler: fn } )],
      },
    });

    new appsync.EventApi(stack, 'api2', {
      apiName: 'api2',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.lambdaAuth( { handler: fn } )],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [
          {
            AuthType: appsync.AuthorizationType.LAMBDA,
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
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.lambdaAuth( {
          handler: fn,
          resultsCacheTtl: cdk.Duration.seconds(300),
          validationRegex: 'custom-.*',
        } )],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [
          {
            AuthType: appsync.AuthorizationType.LAMBDA,
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
    expect(
      () =>
        new appsync.EventApi(stack, 'api1', {
          apiName: 'api',
          authorizationConfig: {
            authProviders: [
              appsync.AuthProvider.lambdaAuth( { handler: fn } ),
              appsync.AuthProvider.lambdaAuth( {
                handler: fn,
                resultsCacheTtl: cdk.Duration.seconds(300),
                validationRegex: 'custom-.*',
              } ),
            ],
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
            authProviders: [
              appsync.AuthProvider.iamAuth(),
              appsync.AuthProvider.lambdaAuth( {
                handler: fn,
                resultsCacheTtl: cdk.Duration.seconds(300),
                validationRegex: 'custom-.*',
              } ),
              appsync.AuthProvider.lambdaAuth( {
                handler: fn,
                resultsCacheTtl: cdk.Duration.seconds(300),
                validationRegex: 'custom-.*',
              } ),
            ],
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
                authorizationType: appsync.AuthorizationType.LAMBDA,
                openIdConnectConfig: { oidcProvider: 'test' },
              },
            ],
          },
        }),
    ).toThrow('Missing Lambda Configuration');
  });

  test('Lambda authorization properly scoped under feature flag', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [appsync.AuthProvider.lambdaAuth( { handler: fn } )],
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
