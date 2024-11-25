import * as path from 'path';
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
  app = new App(
    {
      context: {
        '@aws-cdk/aws-appsync:appSyncGraphQLAPIScopeLambdaPermission': true,
      },
    },
  );
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
        additionalAuthorizationModes: [
          { authorizationType: appsync.AuthorizationType.API_KEY },
        ],
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
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: { description: 'Custom Description' },
        }],
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
          additionalAuthorizationModes: [{
            authorizationType: appsync.AuthorizationType.API_KEY,
          }],
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
          additionalAuthorizationModes: [{
            authorizationType: appsync.AuthorizationType.API_KEY,
          }],
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
      name: 'api',
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('AppSync Event API creates API key from secondary auth provider', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      name: 'api',
      authorizationConfig: {
        authProviders: [
          { authorizationType: appsync.AuthorizationType.IAM },
          { authorizationType: appsync.AuthorizationType.API_KEY },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('AppSync Event API - does not create unspecified API key when API key is not included as an auth provider', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      name: 'api',
      authorizationConfig: {
        authProviders: [
          { authorizationType: appsync.AuthorizationType.IAM },
        ],
        connectionAuthModes: [
          appsync.AuthorizationType.IAM,
        ],
        defaultPublishAuthModes: [
          appsync.AuthorizationType.IAM,
        ],
        defaultSubscribeAuthModes: [
          appsync.AuthorizationType.IAM,
        ],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 0);
  });

  test('AppSync Event API - creates configured api key with additionalAuthorizationModes', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      name: 'api',
      authorizationConfig: {
        authProviders: [
          {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: { description: 'Custom Description' },
          },
        ],
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
      name: 'api',
      authorizationConfig: {
        authProviders: [
          {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: { expires },
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ApiKey', {
      ApiId: { 'Fn::GetAtt': ['API62EA1CFF', 'ApiId'] },
      Expires: expirationDate,
    });
  });

  test('AppSync Event API - apiKeyConfig fails if expire argument less than a day', () => {
    // WHEN
    const when = () => {
      new appsync.EventApi(stack, 'api', {
        name: 'api',
        authorizationConfig: {
          authProviders: [
            {
              authorizationType: appsync.AuthorizationType.API_KEY,
              apiKeyConfig: {
                expires: cdk.Expiration.after(cdk.Duration.hours(1)),
              },
            },
          ],
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
        name: 'api',
        authorizationConfig: {
          authProviders: [
            {
              authorizationType: appsync.AuthorizationType.API_KEY,
              apiKeyConfig: {
                expires: cdk.Expiration.after(cdk.Duration.days(366)),
              },
            },
          ],
        },
      });
    };

    // THEN
    expect(when).toThrow('API key expiration must be between 1 and 365 days.');
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
    new appsync.EventApi(stack, 'api', {
      name: 'api',
      authorizationConfig: {
        authProviders: [
          { authorizationType: appsync.AuthorizationType.IAM },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [{
          AuthType: appsync.AuthorizationType.IAM,
        }],
      },
    });
  });

  test('AppSync Event API fails when multiple iam auth modes', () => {
    // THEN
    expect(() => {
      new appsync.EventApi(stack, 'api', {
        name: 'api',
        authorizationConfig: {
          authProviders: [
            { authorizationType: appsync.AuthorizationType.IAM },
            { authorizationType: appsync.AuthorizationType.IAM },
          ],
        },
      });
    }).toThrow('You can\'t duplicate IAM configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
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
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: { userPool },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [{
        AuthenticationType: 'AMAZON_COGNITO_USER_POOLS',
        UserPoolConfig: {
          AwsRegion: { Ref: 'AWS::Region' },
          UserPoolId: { Ref: 'pool056F3F7E' },
        },
      }],
    });
  });

  test('User Pool property defaultAction does not configure when in additional auth', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
            appIdClientRegex: 'test',
            defaultAction: appsync.UserPoolDefaultAction.DENY,
          },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [{
        AuthenticationType: 'AMAZON_COGNITO_USER_POOLS',
        UserPoolConfig: {
          AwsRegion: { Ref: 'AWS::Region' },
          AppIdClientRegex: 'test',
          UserPoolId: { Ref: 'pool056F3F7E' },
        },
      }],
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
      name: 'api',
      authorizationConfig: {
        authProviders: [
          { authorizationType: appsync.AuthorizationType.USER_POOL, userPoolConfig: { userPool } },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [{
          AuthType: appsync.AuthorizationType.USER_POOL,
          UserPoolConfig: {
            AwsRegion: { Ref: 'AWS::Region' },
            UserPoolId: { Ref: 'pool056F3F7E' },
          },
        }],
      },
    });
  });

  test('User Pool property defaultAction does not configure when in additional auth', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      name: 'api',
      authorizationConfig: {
        authProviders: [
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
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [{
          AuthType: appsync.AuthorizationType.USER_POOL,
          UserPoolConfig: {
            AwsRegion: { Ref: 'AWS::Region' },
            AppIdClientRegex: 'test',
            UserPoolId: { Ref: 'pool056F3F7E' },
          },
        }],
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
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.OIDC,
          openIdConnectConfig: { oidcProvider: 'test' },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [{
        AuthenticationType: 'OPENID_CONNECT',
        OpenIDConnectConfig: {
          Issuer: 'test',
        },
      }],
    });
  });

  test('User Pool authorization configurable in additional authorization', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.OIDC,
          openIdConnectConfig: {
            oidcProvider: 'test',
            clientId: 'id',
            tokenExpiryFromAuth: 1,
            tokenExpiryFromIssue: 1,
          },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [{
        AuthenticationType: 'OPENID_CONNECT',
        OpenIDConnectConfig: {
          AuthTTL: 1,
          ClientId: 'id',
          IatTTL: 1,
          Issuer: 'test',
        },
      }],
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
      name: 'api',
      authorizationConfig: {
        authProviders: [
          { authorizationType: appsync.AuthorizationType.OIDC, openIdConnectConfig: { oidcProvider: 'test' } },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [{
          AuthType: appsync.AuthorizationType.OIDC,
          OpenIDConnectConfig: {
            Issuer: 'test',
          },
        }],
      },
    });
  });

  test('OIDC authorization configurable in default authorization', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      name: 'api',
      authorizationConfig: {
        authProviders: [{
          authorizationType: appsync.AuthorizationType.OIDC,
          openIdConnectConfig: {
            oidcProvider: 'test',
            clientId: 'id',
            tokenExpiryFromAuth: 1,
            tokenExpiryFromIssue: 1,
          },
        }],
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [{
          AuthType: appsync.AuthorizationType.OIDC,
          OpenIDConnectConfig: {
            AuthTTL: 1,
            ClientId: 'id',
            IatTTL: 1,
            Issuer: 'test',
          },
        }],
      },
    });
  });

  test('User Pool authorization configurable in with multiple authorization', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      name: 'api',
      authorizationConfig: {
        authProviders: [
          { authorizationType: appsync.AuthorizationType.OIDC, openIdConnectConfig: { oidcProvider: 'test' } },
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
          'Fn::GetAtt': [
            'authfunction96361832',
            'Arn',
          ],
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'authfunction96361832',
          'Arn',
        ],
      },
    });

  });

  test('Attach Lambda Authorization to two or more graphql api', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api1', {
      name: 'api1',
      schema: appsync.SchemaFile.fromAsset(
        path.join(__dirname, 'appsync.test.graphql'),
      ),
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
      schema: appsync.SchemaFile.fromAsset(
        path.join(__dirname, 'appsync.test.graphql'),
      ),
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
    Template.fromStack(stack).hasResourceProperties(
      'AWS::AppSync::GraphQLApi',
      {
        AuthenticationType: 'AWS_LAMBDA',
        LambdaAuthorizerConfig: {
          AuthorizerUri: {
            'Fn::GetAtt': ['authfunction96361832', 'Arn'],
          },
        },
      },
    );

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
          'Fn::GetAtt': [
            'authfunction96361832',
            'Arn',
          ],
        },
        AuthorizerResultTtlInSeconds: 300,
        IdentityValidationExpression: 'custom-.*',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'authfunction96361832',
          'Arn',
        ],
      },
    });
  });

  test('Lambda authorization configurable in additional authorization has default configuration', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
          },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [{
        AuthenticationType: 'AWS_LAMBDA',
        LambdaAuthorizerConfig: {
          AuthorizerUri: {
            'Fn::GetAtt': [
              'authfunction96361832',
              'Arn',
            ],
          },
        },
      }],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'authfunction96361832',
          'Arn',
        ],
      },
    });
  });

  test('Lambda authorization configurable in additional authorization', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
            resultsCacheTtl: cdk.Duration.seconds(300),
            validationRegex: 'custom-.*',
          },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AdditionalAuthenticationProviders: [{
        AuthenticationType: 'AWS_LAMBDA',
        LambdaAuthorizerConfig: {
          AuthorizerUri: {
            'Fn::GetAtt': [
              'authfunction96361832',
              'Arn',
            ],
          },
          AuthorizerResultTtlInSeconds: 300,
          IdentityValidationExpression: 'custom-.*',
        },
      }],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'authfunction96361832',
          'Arn',
        ],
      },
    });
  });

  test('Lambda authorization throws with multiple lambda authorization', () => {
    expect(() => new appsync.GraphqlApi(stack, 'api', {
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
    })).toThrow('You can only have a single AWS Lambda function configured to authorize your API.');

    expect(() => new appsync.GraphqlApi(stack, 'api2', {
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
    })).toThrow('You can only have a single AWS Lambda function configured to authorize your API.');
  });

  test('throws if authorization type and mode do not match', () => {
    expect(() => new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.LAMBDA,
          openIdConnectConfig: { oidcProvider: 'test' },
        },
      },
    })).toThrow('Missing Lambda Configuration');
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
        'Fn::GetAtt': [
          'authfunction96361832',
          'Arn',
        ],
      },
      Principal: 'appsync.amazonaws.com',
      SourceArn: {
        'Fn::GetAtt': [
          'apiC8550315',
          'Arn',
        ],
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
      code: lambda.Code.fromInline('/* lambda authentication code here.*/'),
    });
  });

  test('Lambda authorization configurable in default authorization has default configuration', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      name: 'api',
      authorizationConfig: {
        authProviders: [{
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
          },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [{
          AuthType: appsync.AuthorizationType.LAMBDA,
          LambdaAuthorizerConfig: {
            AuthorizerUri: {
              'Fn::GetAtt': [
                'authfunction96361832',
                'Arn',
              ],
            },
          },
        }],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'authfunction96361832',
          'Arn',
        ],
      },
    });
  });

  test('Attach Lambda Authorization to two or more event api', () => {
    // WHEN
    new appsync.EventApi(stack, 'api1', {
      name: 'api1',
      authorizationConfig: {
        authProviders: [{
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
          },
        }],
      },
    });

    new appsync.EventApi(stack, 'api2', {
      name: 'api2',
      authorizationConfig: {
        authProviders: [{
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
          },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [{
          AuthType: appsync.AuthorizationType.LAMBDA,
          LambdaAuthorizerConfig: {
            AuthorizerUri: {
              'Fn::GetAtt': [
                'authfunction96361832',
                'Arn',
              ],
            },
          },
        }],
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
      name: 'api',
      authorizationConfig: {
        authProviders: [{
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
            resultsCacheTtl: cdk.Duration.seconds(300),
            validationRegex: 'custom-.*',
          },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        AuthProviders: [{
          AuthType: appsync.AuthorizationType.LAMBDA,
          LambdaAuthorizerConfig: {
            AuthorizerUri: {
              'Fn::GetAtt': [
                'authfunction96361832',
                'Arn',
              ],
            },
            AuthorizerResultTtlInSeconds: 300,
            IdentityValidationExpression: 'custom-.*',
          },
        }],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'authfunction96361832',
          'Arn',
        ],
      },
    });
  });

  test('Lambda authorization throws with multiple lambda authorization', () => {
    expect(() =>
      new appsync.EventApi(stack, 'api', {
        name: 'api',
        authorizationConfig: {
          authProviders: [{
            authorizationType: appsync.AuthorizationType.LAMBDA,
            lambdaAuthorizerConfig: {
              handler: fn,
            },
          }, {
            authorizationType: appsync.AuthorizationType.LAMBDA,
            lambdaAuthorizerConfig: {
              handler: fn,
              resultsCacheTtl: cdk.Duration.seconds(300),
              validationRegex: 'custom-.*',
            },
          }],
        },
      })).toThrow('You can only have a single AWS Lambda function configured to authorize your Event API.');

    expect(() =>
      new appsync.EventApi(stack, 'api2', {
        name: 'api',
        authorizationConfig: {
          authProviders: [{
            authorizationType: appsync.AuthorizationType.IAM,
          }, {
            authorizationType: appsync.AuthorizationType.LAMBDA,
            lambdaAuthorizerConfig: {
              handler: fn,
              resultsCacheTtl: cdk.Duration.seconds(300),
              validationRegex: 'custom-.*',
            },
          }, {
            authorizationType: appsync.AuthorizationType.LAMBDA,
            lambdaAuthorizerConfig: {
              handler: fn,
              resultsCacheTtl: cdk.Duration.seconds(300),
              validationRegex: 'custom-.*',
            },
          }],
        },
      })).toThrow('You can only have a single AWS Lambda function configured to authorize your Event API.');
  });

  test('throws if authorization type and mode do not match', () => {
    expect(() =>
      new appsync.EventApi(stack, 'api', {
        name: 'api',
        authorizationConfig: {
          authProviders: [{
            authorizationType: appsync.AuthorizationType.LAMBDA,
            openIdConnectConfig: { oidcProvider: 'test' },
          }],
        },
      })).toThrow('Missing Lambda Configuration');
  });

  test('Lambda authorization properly scoped under feature flag', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      name: 'api',
      authorizationConfig: {
        authProviders: [{
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
          },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'authfunction96361832',
          'Arn',
        ],
      },
      Principal: 'appsync.amazonaws.com',
      SourceArn: {
        'Fn::GetAtt': [
          'apiC8550315',
          'Arn',
        ],
      },
    });
  });
});