import { Match, Template } from '../../assertions';
import { Certificate } from '../../aws-certificatemanager';
import { UserPool } from '../../aws-cognito';
import { ManagedPolicy, Role, ServicePrincipal } from '../../aws-iam';
import { Code, Function, Runtime } from '../../aws-lambda';
import { RetentionDays } from '../../aws-logs';
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
      authProviders: [
        appsync.AuthProvider.apiKeyAuth({
          name: 'test-api-key',
          description: 'test api key description',
          expires: expires,
        }),
        appsync.AuthProvider.iamAuth(),
      ],
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
      authProviders: [appsync.AuthProvider.cognitoAuth({
        userPool: userPool,
        appIdClientRegex: 'test',
      })],
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
      authProviders: [
        appsync.AuthProvider.oidcAuth({
          oidcProvider: 'test-provider',
          clientId: 'test-client',
          tokenExpiryFromAuth: 5,
          tokenExpiryFromIssue: 10,
        }),
      ],
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
      authProviders: [
        appsync.AuthProvider.lambdaAuth({
          handler: fn,
          resultsCacheTtl: cdk.Duration.minutes(6),
          validationRegex: 'test',
        }),
      ],
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

  test('throws when multiple API Key authorization configurations are set',
    () => {
      expect(() => new appsync.Api(stack, 'api', {
        apiName: 'MyApi',
        ownerContact: 'test-owner',
        authProviders: [
          appsync.AuthProvider.apiKeyAuth(),
          appsync.AuthProvider.apiKeyAuth(),
        ],
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
        authProviders: [
          appsync.AuthProvider.iamAuth(),
          appsync.AuthProvider.iamAuth(),
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
        authProviders: [appsync.AuthProvider.lambdaAuth({
          handler: fn,
          resultsCacheTtl: cdk.Duration.minutes(6),
          validationRegex: 'test',
        }),
        appsync.AuthProvider.lambdaAuth({
          handler: fn,
          resultsCacheTtl: cdk.Duration.minutes(6),
          validationRegex: 'test',
        })],
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

describe('Custom Domain test', () => {
  test('Event API should be configured with custom CloudWatch Logs role when specified', () => {
    // GIVEN
    const certificate = new Certificate(stack, 'certificate', {
      domainName: 'aws.amazon.com',
    });

    // WHEN
    const api = new appsync.Api(stack, 'api', {
      authProviders: [
        appsync.AuthProvider.apiKeyAuth(),
      ],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      domainName: {
        certificate,
        domainName: 'aws.amazon.com',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DomainName', {
      CertificateArn: stack.resolve(certificate.certificateArn),
      DomainName: 'aws.amazon.com',
      Description: 'domain for api',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DomainNameApiAssociation', {
      ApiId: stack.resolve(api.apiId),
      DomainName: 'aws.amazon.com',
    });
  });
});

describe('Logging Config test', () => {
  test.each([
    [appsync.LogLevel.ALL],
    [appsync.LogLevel.ERROR],
    [appsync.LogLevel.NONE],
    [appsync.LogLevel.INFO],
    [appsync.LogLevel.DEBUG],
  ])('Event APIs with LogLevel %s', (logLevel) => {
    // WHEN
    new appsync.Api(stack, 'api', {
      authProviders: [
        appsync.AuthProvider.apiKeyAuth(),
      ],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      eventLogConfig: {
        logLevel,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        LogConfig: {
          LogLevel: logLevel,
        },
      },
    });
  });

  test('Event API should be configured with custom CloudWatch Logs role when specified', () => {
    // GIVEN
    const cloudWatchLogRole = new Role(stack, 'CloudWatchLogRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppSyncPushToCloudWatchLogs'),
      ],
    });

    // WHEN
    new appsync.Api(stack, 'api', {
      authProviders: [
        appsync.AuthProvider.apiKeyAuth(),
      ],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      eventLogConfig: {
        role: cloudWatchLogRole,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      EventConfig: {
        LogConfig: {
          CloudWatchLogsRoleArn: {
            'Fn::GetAtt': [
              'CloudWatchLogRoleE3242F1C',
              'Arn',
            ],
          },
        },
      },
    });
  });

  test('Log retention should be configured with given retention time when specified', () => {
    // WHEN
    new appsync.Api(stack, 'api', {
      authProviders: [
        appsync.AuthProvider.apiKeyAuth(),
      ],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      eventLogConfig: {
        retention: RetentionDays.ONE_WEEK,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
      LogGroupName: {
        'Fn::Join': [
          '',
          [
            '/aws/appsync/apis/',
            {
              'Fn::GetAtt': [
                'apiC8550315',
                'ApiId',
              ],
            },
          ],
        ],
      },
      RetentionInDays: 7,
    });
  });
});

describe('apiName test', () => {
  test.each(['', 'a'.repeat(257)])('throws when apiName length is invalid', (apiName) => {
    expect(() => new appsync.Api(stack, 'api', {
      apiName,
      authProviders: [appsync.AuthProvider.apiKeyAuth()],
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
      authProviders: [appsync.AuthProvider.apiKeyAuth()],
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
      authProviders: [appsync.AuthProvider.apiKeyAuth()],
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
      authProviders: [appsync.AuthProvider.apiKeyAuth()],
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

describe('test addChannelNamespace method', () => {
  test('Create channel namespace by addChannelNamespace method', () => {
    // WHEN
    const api = new appsync.Api(stack, 'api', {
      apiName: 'MyApi',
      ownerContact: 'test-owner',
      authProviders: [
        appsync.AuthProvider.apiKeyAuth(),
      ],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
    });

    api.addChannelNamespace('MyChannelNamespace', {
      channelNamespaceName: 'MyChannelNamespace',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      ApiId: stack.resolve(api.apiId),
      Name: 'MyChannelNamespace',
    });
  });
});

describe('test grant methods', () => {
  test('test grant method', () => {
    // WHEN
    const api = new appsync.Api(stack, 'api', {
      apiName: 'MyApi',
      ownerContact: 'test-owner',
      authProviders: [
        appsync.AuthProvider.apiKeyAuth(),
      ],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
    });

    const role = new Role(stack, 'Role', {
      assumedBy: new ServicePrincipal('foo'),
    });

    api.grant(role, 'appsync:EventConnect');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', Match.objectLike({
      PolicyDocument: Match.objectLike({
        Statement: [
          {
            Action: 'appsync:EventConnect',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  { 'Fn::GetAtt': ['apiC8550315', 'ApiId'] },
                  '/*',
                ]
                ,
              ],
            },
          },
        ],
      }),
    }));
  });

  test('test grantPublish method', () => {
    // WHEN
    const api = new appsync.Api(stack, 'api', {
      apiName: 'MyApi',
      ownerContact: 'test-owner',
      authProviders: [
        appsync.AuthProvider.apiKeyAuth(),
      ],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
    });

    const role = new Role(stack, 'Role', {
      assumedBy: new ServicePrincipal('foo'),
    });

    api.grantPublish(role);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', Match.objectLike({
      PolicyDocument: Match.objectLike({
        Statement: [
          {
            Action: ['appsync:EventConnect', 'appsync:EventPublish'],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  { 'Fn::GetAtt': ['apiC8550315', 'ApiId'] },
                  '/*',
                ]
                ,
              ],
            },
          },
        ],
      }),
    }));
  });

  test('test grantSubscribe method', () => {
    // WHEN
    const api = new appsync.Api(stack, 'api', {
      apiName: 'MyApi',
      ownerContact: 'test-owner',
      authProviders: [
        appsync.AuthProvider.apiKeyAuth(),
      ],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
    });

    const role = new Role(stack, 'Role', {
      assumedBy: new ServicePrincipal('foo'),
    });

    api.grantSubscribe(role);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', Match.objectLike({
      PolicyDocument: Match.objectLike({
        Statement: [
          {
            Action: ['appsync:EventConnect', 'appsync:EventSubscribe'],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  { 'Fn::GetAtt': ['apiC8550315', 'ApiId'] },
                  '/*',
                ]
                ,
              ],
            },
          },
        ],
      }),
    }));
  });

  test('test grantPublishSubscribe method', () => {
    // WHEN
    const api = new appsync.Api(stack, 'api', {
      apiName: 'MyApi',
      ownerContact: 'test-owner',
      authProviders: [
        appsync.AuthProvider.apiKeyAuth(),
      ],
      connectionAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultPublishAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
      defaultSubscribeAuthModes: [
        appsync.AuthorizationType.API_KEY,
      ],
    });

    const role = new Role(stack, 'Role', {
      assumedBy: new ServicePrincipal('foo'),
    });

    api.grantPublishSubscribe(role);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', Match.objectLike({
      PolicyDocument: Match.objectLike({
        Statement: [
          {
            Action: ['appsync:EventConnect', 'appsync:EventPublish', 'appsync:EventSubscribe'],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  { 'Fn::GetAtt': ['apiC8550315', 'ApiId'] },
                  '/*',
                ]
                ,
              ],
            },
          },
        ],
      }),
    }));
  });
});

describe('test import methods', () => {
  test('test import method without arn', () => {
    // WHEN
    const apiId = 'MyApi';
    const dnsHttp = 'MyDnsHttp';
    const dnsRealTime = 'MyDnsRealTime';
    const api = appsync.Api.fromApiAttributes(stack, 'MyApi', {
      apiId,
      dnsHttp,
      dnsRealTime,
    });

    // THEN
    expect(api.apiId).toEqual(apiId);
    expect(api.dnsHttp).toEqual(dnsHttp);
    expect(api.dnsRealTime).toEqual(dnsRealTime);
    expect(api.apiArn).toEqual(stack.formatArn({
      service: 'appsync',
      resource: 'apis',
      resourceName: apiId,
    }));
  });

  test('test import method with arn', () => {
    // WHEN
    const apiArn = 'arn:aws:appsync:us-east-1:123456789012:apis/MyApi';
    const apiId = 'MyApi';
    const dnsHttp = 'MyDnsHttp';
    const dnsRealTime = 'MyDnsRealTime';
    const api = appsync.Api.fromApiAttributes(stack, 'MyApi', {
      apiId,
      apiArn,
      dnsHttp,
      dnsRealTime,
    });

    // THEN
    expect(api.apiId).toEqual(apiId);
    expect(api.dnsHttp).toEqual(dnsHttp);
    expect(api.dnsRealTime).toEqual(dnsRealTime);
    expect(api.apiArn).toEqual(apiArn);
  });
});
