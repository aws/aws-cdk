import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as cognito from '@aws-cdk/aws-cognito';
import * as lambda from '@aws-cdk/aws-lambda';
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
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('AppSync creates api key from additionalAuthorizationModes', () => {
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

  test('AppSync does not create unspecified api key from additionalAuthorizationModes', () => {
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

  test('appsync does not create unspecified api key with empty additionalAuthorizationModes', () => {
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

  test('appsync creates configured api key with additionalAuthorizationModes', () => {
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

  test('apiKeyConfig creates default with valid expiration date', () => {
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

  test('apiKeyConfig fails if expire argument less than a day', () => {
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
    expect(when).toThrowError('API key expiration must be between 1 and 365 days.');
  });

  test('apiKeyConfig fails if expire argument greater than 365 day', () => {
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
    expect(when).toThrowError('API key expiration must be between 1 and 365 days.');
  });

  test('appsync creates configured api key with additionalAuthorizationModes (not as first element)', () => {
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

  test('appsync fails when empty default and API_KEY in additional', () => {
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
    }).toThrowError('You can\'t duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });

  test('appsync fails when multiple API_KEY auth modes', () => {
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
    }).toThrowError('You can\'t duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });

  test('appsync fails when multiple API_KEY auth modes in additionalXxx', () => {
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
    }).toThrowError('You can\'t duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });
});

describe('AppSync IAM Authorization', () => {
  test('Iam authorization configurable in default authorization', () => {
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

  test('Iam authorization configurable in additional authorization', () => {
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

  test('appsync fails when multiple iam auth modes', () => {
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
    }).toThrowError('You can\'t duplicate IAM configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });

  test('appsync fails when multiple IAM auth modes in additionalXxx', () => {
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
    }).toThrowError('You can\'t duplicate IAM configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
  });
});

describe('AppSync User Pool Authorization', () => {
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

describe('AppSync OIDC Authorization', () => {
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

describe('AppSync Lambda Authorization', () => {
  let fn: lambda.Function;
  beforeEach(() => {
    fn = new lambda.Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_14_X,
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
});