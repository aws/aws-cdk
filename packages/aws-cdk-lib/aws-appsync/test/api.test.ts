import { Template } from '../../assertions';
import { UserPool } from '../../aws-cognito';
import { Code, Function, Runtime } from '../../aws-lambda';
import * as cdk from '../../core';
import * as appsync from '../lib';

let stack: cdk.Stack;

beforeEach(() => {
  stack = new cdk.Stack();
});

describe('Authorization Config test', () => {
  test('Create Api with API Key and IAM authorization', () => {
    // WHEN
    const expires = cdk.Expiration.after(cdk.Duration.days(10));
    const expirationDate: number = expires.toEpoch();

    const api = new appsync.Api(stack, 'api', {
      apiName: 'MyApi',
      ownerContact: 'test-owner',
      authProviders: [{
        authorizationType: appsync.AuthorizationType.API_KEY,
        apiKeyConfig: {
          name: 'test-api-key',
          description: 'test api key description',
          expires: expires,
        },
      },
      {
        authorizationType: appsync.AuthorizationType.IAM,
      }],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.IAM,
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'MyApi',
      OwnerContact: 'test-owner',
      EventConfig: {
        AuthProviders: [{
          AuthType: 'API_KEY',
        },
        {
          AuthType: 'AWS_IAM',
        }],
        ConnectionAuthModes: [{ AuthType: 'API_KEY' }],
        DefaultPublishAuthModes: [{ AuthType: 'API_KEY' }],
        DefaultSubscribeAuthModes: [{ AuthType: 'AWS_IAM' }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ApiKey', {
      ApiId: stack.resolve(api.apiId),
      Description: 'test api key description',
      Expires: expirationDate,
    });
  });

  test('Create Api with Cognito authorization', () => {
    // WHEN
    const userPool = new UserPool(stack, 'UserPool', {});
    new appsync.Api(stack, 'api', {
      apiName: 'MyApi',
      ownerContact: 'test-owner',
      authProviders: [{
        authorizationType: appsync.AuthorizationType.USER_POOL,
        cognitoConfig: {
          userPool: userPool,
          appIdClientRegex: 'test',
        },
      }],
      connectionAuthModes: [
        appsync.AuthorizationType.USER_POOL,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.USER_POOL,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.USER_POOL,
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'MyApi',
      OwnerContact: 'test-owner',
      EventConfig: {
        AuthProviders: [{
          AuthType: 'AMAZON_COGNITO_USER_POOLS',
          CognitoConfig: {
            AppIdClientRegex: 'test',
            AwsRegion: {
              Ref: 'AWS::Region',
            },
            UserPoolId: stack.resolve(userPool.userPoolId),
          },
        }],
        ConnectionAuthModes: [{ AuthType: 'AMAZON_COGNITO_USER_POOLS' }],
        DefaultPublishAuthModes: [{ AuthType: 'AMAZON_COGNITO_USER_POOLS' }],
        DefaultSubscribeAuthModes: [{ AuthType: 'AMAZON_COGNITO_USER_POOLS' }],
      },
    });
  });

  test('Create Api with Oidc authorization', () => {
    // WHEN
    new appsync.Api(stack, 'api', {
      apiName: 'MyApi',
      ownerContact: 'test-owner',
      authProviders: [{
        authorizationType: appsync.AuthorizationType.OIDC,
        openIdConnectConfig: {
          oidcProvider: 'test-provider',
          clientId: 'test-client',
          tokenExpiryFromAuth: 5,
          tokenExpiryFromIssue: 10,
        },
      }],
      connectionAuthModes: [
        appsync.AuthorizationType.OIDC,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.OIDC,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.OIDC,
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'MyApi',
      OwnerContact: 'test-owner',
      EventConfig: {
        AuthProviders: [{
          AuthType: 'OPENID_CONNECT',
          OpenIDConnectConfig: {
            Issuer: 'test-provider',
            ClientId: 'test-client',
            AuthTTL: 5,
            IatTTL: 10,
          },
        }],
        ConnectionAuthModes: [{ AuthType: 'OPENID_CONNECT' }],
        DefaultPublishAuthModes: [{ AuthType: 'OPENID_CONNECT' }],
        DefaultSubscribeAuthModes: [{ AuthType: 'OPENID_CONNECT' }],
      },
    });
  });

  test('Create Api with Lambdas authorization', () => {
    // WHEN
    const fn = new Function(stack, 'auth-function', {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: Code.fromInline('/* lambda authentication code here.*/'),
    });

    new appsync.Api(stack, 'api', {
      apiName: 'MyApi',
      ownerContact: 'test-owner',
      authProviders: [{
        authorizationType: appsync.AuthorizationType.LAMBDA,
        lambdaAuthorizerConfig: {
          handler: fn,
          resultsCacheTtl: cdk.Duration.minutes(6),
          validationRegex: 'test',
        },
      }],
      connectionAuthModes: [
        appsync.AuthorizationType.LAMBDA,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.LAMBDA,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.LAMBDA,
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'MyApi',
      OwnerContact: 'test-owner',
      EventConfig: {
        AuthProviders: [{
          AuthType: 'AWS_LAMBDA',
          LambdaAuthorizerConfig: {
            AuthorizerResultTtlInSeconds: 360,
            AuthorizerUri: {
              'Fn::GetAtt': ['authfunction96361832', 'Arn'],
            },
            IdentityValidationExpression: 'test',
          },
        }],
        ConnectionAuthModes: [{ AuthType: 'AWS_LAMBDA' }],
        DefaultPublishAuthModes: [{ AuthType: 'AWS_LAMBDA' }],
        DefaultSubscribeAuthModes: [{ AuthType: 'AWS_LAMBDA' }],
      },
    });
  });

  test('throws when authorizationType is OIDC without OIDC configuration',
    () => {
      expect(() => new appsync.Api(stack, 'api', {
        apiName: 'MyApi',
        ownerContact: 'test-owner',
        authProviders: [{
          authorizationType: appsync.AuthorizationType.OIDC,
        }],
        connectionAuthModes: [
          appsync.AuthorizationType.OIDC,
        ],
        defaultPublishAuthModes: [
          appsync.AuthorizationType.OIDC,
        ],
        defaultSubscribeAuthModes: [
          appsync.AuthorizationType.OIDC,
        ],
      }),
      ).toThrow('Missing OIDC Configuration');
    },
  );

  test('throws when authorizationType is USER_POOL without Cognito configuration',
    () => {
      expect(() => new appsync.Api(stack, 'api', {
        apiName: 'MyApi',
        ownerContact: 'test-owner',
        authProviders: [{
          authorizationType: appsync.AuthorizationType.USER_POOL,
        }],
        connectionAuthModes: [
          appsync.AuthorizationType.USER_POOL,
        ],
        defaultPublishAuthModes: [
          appsync.AuthorizationType.USER_POOL,
        ],
        defaultSubscribeAuthModes: [
          appsync.AuthorizationType.USER_POOL,
        ],
      }),
      ).toThrow('Missing Cognito Configuration');
    },
  );

  test('throws when authorizationType is LAMBDA without Lambda configuration',
    () => {
      expect(() => new appsync.Api(stack, 'api', {
        apiName: 'MyApi',
        ownerContact: 'test-owner',
        authProviders: [{
          authorizationType: appsync.AuthorizationType.LAMBDA,
        }],
        connectionAuthModes: [
          appsync.AuthorizationType.LAMBDA,
        ],
        defaultPublishAuthModes: [
          appsync.AuthorizationType.LAMBDA,
        ],
        defaultSubscribeAuthModes: [
          appsync.AuthorizationType.LAMBDA,
        ],
      }),
      ).toThrow('Missing Lambda Configuration');
    },
  );

  test('throws when multiple API Key authorization configurations are set',
    () => {
      expect(() => new appsync.Api(stack, 'api', {
        apiName: 'MyApi',
        ownerContact: 'test-owner',
        authProviders: [{
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
        {
          authorizationType: appsync.AuthorizationType.API_KEY,
        }],
        connectionAuthModes: [
          appsync.AuthorizationType.API_KEY,
        ],
        defaultPublishAuthModes: [
          appsync.AuthorizationType.API_KEY,
        ],
        defaultSubscribeAuthModes: [
          appsync.AuthorizationType.API_KEY,
        ],
      }),
      ).toThrow('You can\'t duplicate API_KEY configuration.');
    },
  );

  test('throws when multiple IAM authorization configurations are set',
    () => {
      expect(() => new appsync.Api(stack, 'api', {
        apiName: 'MyApi',
        ownerContact: 'test-owner',
        authProviders: [{
          authorizationType: appsync.AuthorizationType.IAM,
        },
        {
          authorizationType: appsync.AuthorizationType.IAM,
        }],
        connectionAuthModes: [
          appsync.AuthorizationType.IAM,
        ],
        defaultPublishAuthModes: [
          appsync.AuthorizationType.IAM,
        ],
        defaultSubscribeAuthModes: [
          appsync.AuthorizationType.IAM,
        ],
      }),
      ).toThrow('You can\'t duplicate IAM configuration.');
    },
  );

  test('throws when multiple Lambda authorization configurations are set',
    () => {
      const fn = new Function(stack, 'auth-function', {
        runtime: Runtime.NODEJS_LATEST,
        handler: 'index.handler',
        code: Code.fromInline('/* lambda authentication code here.*/'),
      });

      expect(() => new appsync.Api(stack, 'api', {
        apiName: 'MyApi',
        ownerContact: 'test-owner',
        authProviders: [{
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
            resultsCacheTtl: cdk.Duration.minutes(6),
            validationRegex: 'test',
          },
        },
        {
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: fn,
            resultsCacheTtl: cdk.Duration.minutes(6),
            validationRegex: 'test',
          },
        }],
        connectionAuthModes: [
          appsync.AuthorizationType.LAMBDA,
        ],
        defaultPublishAuthModes: [
          appsync.AuthorizationType.LAMBDA,
        ],
        defaultSubscribeAuthModes: [
          appsync.AuthorizationType.LAMBDA,
        ],
      }),
      ).toThrow('You can only have a single AWS Lambda function configured to authorize your API.');
    },
  );
});

describe('apiName test', () => {
  test.each(['', 'a'.repeat(257)])('throws when apiName length is invalid', (apiName) => {
    expect(() => new appsync.Api(stack, 'api', {
      apiName,
      authProviders: [{
        authorizationType: appsync.AuthorizationType.API_KEY,
      }],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
    }),
    ).toThrow(`\`apiName\` must be between 1 and 50 characters, got: ${apiName.length} characters.`);
  });

  test.each(['My Api Name?', 'My Api Name.'])('throws when apiName includes invalid characters', (apiName) => {
    expect(() => new appsync.Api(stack, 'api', {
      apiName,
      authProviders: [{
        authorizationType: appsync.AuthorizationType.API_KEY,
      }],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
    }),
    ).toThrow(`\`apiName\` must contain only alphanumeric characters, underscores, hyphens, and spaces, got: ${apiName}`);
  });
});

describe('ownerContact test', () => {
  test.each(['', 'a'.repeat(257)])('throws when ownerContact length is invalid', (ownerContact) => {
    expect(() => new appsync.Api(stack, 'api', {
      apiName: 'MyApi',
      ownerContact,
      authProviders: [{
        authorizationType: appsync.AuthorizationType.API_KEY,
      }],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
    }),
    ).toThrow(`\`ownerContact\` must be between 1 and 256 characters, got: ${ownerContact.length} characters.`);
  });

  test.each(['My Owner Contact?', 'My Owner Contact:'])('throws when ownerContact includes invalid characters', (ownerContact) => {
    expect(() => new appsync.Api(stack, 'api', {
      apiName: 'MyApi',
      ownerContact,
      authProviders: [{
        authorizationType: appsync.AuthorizationType.API_KEY,
      }],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
    }),
    ).toThrow(`\`ownerContact\` must contain only alphanumeric characters, underscores, hyphens, spaces, and periods, got: ${ownerContact}`);
  });
});
