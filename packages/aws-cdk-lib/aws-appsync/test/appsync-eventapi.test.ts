import { Template } from '../../assertions';
import * as cognito from '../../aws-cognito';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as logs from '../../aws-logs';
import { App } from '../../core';
import * as cdk from '../../core';
import * as appsync from '../lib';

// GIVEN
let stack: cdk.Stack;
let app: App;
beforeEach(() => {
  app = new App({});
  stack = new cdk.Stack(app);
});

describe('Appsync Event API Key Authorization - security related', () => {
  test('Appsync Event API - creates default api key', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', { apiName: 'api' });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('Appsync Event API - allows a single key with no name', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AppSyncAuthorizationType.API_KEY }],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('Appsync Event API - allows multiple keys to be created', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [
          { authorizationType: appsync.AppSyncAuthorizationType.API_KEY, apiKeyConfig: { name: 'first' } },
          { authorizationType: appsync.AppSyncAuthorizationType.API_KEY, apiKeyConfig: { name: 'second' } },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 2);
  });

  test('Appsync Event API - Requires a name when multiple keys are specified', () => {
    // WHEN and THEN
    expect(() => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [
            { authorizationType: appsync.AppSyncAuthorizationType.API_KEY },
            { authorizationType: appsync.AppSyncAuthorizationType.API_KEY, apiKeyConfig: { name: 'second' } },
          ],
        },
      });
    }).toThrow('You must specify key names when configuring more than 1 API key.');
  });
});

describe('AppSync Event Api auth configuration - security related', () => {
  test('Authorization providers are used as allowed modes by default', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'apiWithMultipleProviders',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AppSyncAuthorizationType.API_KEY }, { authorizationType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'apiWithMultipleProviders',
      EventConfig: {
        AuthProviders: [{ AuthType: appsync.AppSyncAuthorizationType.API_KEY }, { AuthType: appsync.AppSyncAuthorizationType.IAM }],
        ConnectionAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.API_KEY }, { AuthType: appsync.AppSyncAuthorizationType.IAM }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.API_KEY }, { AuthType: appsync.AppSyncAuthorizationType.IAM }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.API_KEY }, { AuthType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });
  });

  test('lambda', () => {
    // GIVEN
    const func = new lambda.Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('/* lambda authentication code here.*/'),
    });

    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'apiWithMultipleProviders',
      authorizationConfig: {
        authProviders: [
          {
            authorizationType: appsync.AppSyncAuthorizationType.LAMBDA,
            lambdaAuthorizerConfig: {
              handler: func,
            },
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'apiWithMultipleProviders',
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.LAMBDA }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.LAMBDA }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.LAMBDA }],
      },
    });
  });

  test('Authorization providers do not overwrite provided modes', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'apiWithMultipleProviders',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AppSyncAuthorizationType.API_KEY }, { authorizationType: appsync.AppSyncAuthorizationType.IAM }],
        connectionAuthModeTypes: [appsync.AppSyncAuthorizationType.IAM],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'apiWithMultipleProviders',
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.IAM }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.API_KEY }, { AuthType: appsync.AppSyncAuthorizationType.IAM }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.API_KEY }, { AuthType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });
  });

  test('Modes not specified by providers are not allowed', () => {
    // WHEN
    function configureWithUserPool() {
      new appsync.EventApi(stack, 'api', {
        apiName: 'apiWithMultipleProviders',
        authorizationConfig: {
          authProviders: [
            { authorizationType: appsync.AppSyncAuthorizationType.API_KEY },
            { authorizationType: appsync.AppSyncAuthorizationType.IAM },
          ],
          connectionAuthModeTypes: [appsync.AppSyncAuthorizationType.USER_POOL],
        },
      });
    }

    // THEN
    expect(() => configureWithUserPool()).toThrow('Missing authorization configuration for AMAZON_COGNITO_USER_POOLS');
  });

  test('Configuring OIDC and Cognito user pools', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'apiWithUserPool',
      authorizationConfig: {
        authProviders: [
          {
            authorizationType: appsync.AppSyncAuthorizationType.USER_POOL,
            cognitoConfig: { userPool: new cognito.UserPool(stack, 'myPool') },
          },
          {
            authorizationType: appsync.AppSyncAuthorizationType.OIDC,
            openIdConnectConfig: { oidcProvider: 'test' },
          },
        ],
        connectionAuthModeTypes: [appsync.AppSyncAuthorizationType.USER_POOL],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'apiWithUserPool',
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.USER_POOL }],
        DefaultPublishAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.USER_POOL }, { AuthType: appsync.AppSyncAuthorizationType.OIDC }],
        DefaultSubscribeAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.USER_POOL }, { AuthType: appsync.AppSyncAuthorizationType.OIDC }],
      },
    });
  });
});

describe('Appsync Event api with cloudwatch logs', () => {
  test('Appsync Event API should be configured with custom CloudWatch Logs role when specified', () => {
    // GIVEN
    const cloudWatchLogRole: iam.Role = new iam.Role(stack, 'CloudWatchLogRole', {
      assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppSyncPushToCloudWatchLogs')],
    });

    // WHEN
    new appsync.EventApi(stack, 'api-custom-cw-logs-role', {
      apiName: 'apiWithCustomRole',
      logConfig: { role: cloudWatchLogRole },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'apiWithCustomRole',
      EventConfig: {
        LogConfig: {
          CloudWatchLogsRoleArn: {
            'Fn::GetAtt': ['CloudWatchLogRoleE3242F1C', 'Arn'],
          },
        },
      },
    });
  });

  test('appsync GraphqlApi should not use custom role for CW Logs when not specified', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      logConfig: {},
    });
    // EXPECT
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'api',
      EventConfig: {
        LogConfig: {
          CloudWatchLogsRoleArn: {
            'Fn::GetAtt': ['apiApiLogsRole56BEE3F1', 'Arn'],
          },
        },
      },
    });
  });

  test('log retention should be configured with given retention time when specified', () => {
    // GIVEN
    const retention = logs.RetentionDays.ONE_WEEK;

    // WHEN
    new appsync.EventApi(stack, 'log-retention', {
      apiName: 'log-retention',
      logConfig: { retention },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
      LogGroupName: {
        'Fn::Join': [
          '',
          [
            '/aws/appsync/apis/',
            {
              'Fn::GetAtt': ['logretentionB69DFB48', 'ApiId'],
            },
          ],
        ],
      },
      RetentionInDays: 7,
    });
  });

  test('log retention will appear whenever logconfig is set', () => {
    // WHEN
    new appsync.EventApi(stack, 'no-log-retention', {
      apiName: 'no-log-retention',
      logConfig: {},
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('Custom::LogRetention', 1);
  });
});

describe('owner contact configuration', () => {
  test('when owner contact is set, they should be used on API', () => {
    // WHEN
    new appsync.EventApi(stack, 'owner-contact', {
      apiName: 'owner-contact',
      ownerContact: 'test',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      OwnerContact: 'test',
    });
  });

  test('when owner contact exceeds 256 characters, it throws an error', () => {
    const buildWithOwnerContact = () => {
      new appsync.EventApi(stack, 'owner-contact-length-exceeded', {
        apiName: 'owner-contact',
        ownerContact: 'a'.repeat(256 + 1),
      });
    };

    expect(() => buildWithOwnerContact()).toThrow('`ownerContact` must be between 1 and 256 characters, got: 257 characters.');
  });
});

describe('Event API security grant tests', () => {
  // GIVEN
  let func: lambda.Function;
  beforeEach(() => {
    func = new lambda.Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('/* lambda authentication code here.*/'),
    });
  });

  test('Can grant connect to a function', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });
    api.grantConnect(func);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:EventConnect',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':appsync:',
                  { Ref: 'AWS::Region' },
                  ':',
                  { Ref: 'AWS::AccountId' },
                  ':apis/',
                  { 'Fn::GetAtt': ['apiC8550315', 'ApiId'] },
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('can only grant IAM permissions if IAM is a configured mode provider', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', { apiName: 'api' });

    // THEN
    expect(() => api.grantConnect(func)).toThrow('Cannot use grant method because IAM Authorization mode is missing in the auth providers on this API.');
  });

  test('Appsync Event API - grant publish for all channel namespaces within an API', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });
    api.grantPublish(func);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:EventPublish',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':appsync:',
                  { Ref: 'AWS::Region' },
                  ':',
                  { Ref: 'AWS::AccountId' },
                  ':apis/',
                  { 'Fn::GetAtt': ['apiC8550315', 'ApiId'] },
                  '/channelNamespace/*',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('Appsync Event API - grant subscribe for all channel namespaces within an API', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });
    api.grantSubscribe(func);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:EventSubscribe',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':appsync:',
                  { Ref: 'AWS::Region' },
                  ':',
                  { Ref: 'AWS::AccountId' },
                  ':apis/',
                  { 'Fn::GetAtt': ['apiC8550315', 'ApiId'] },
                  '/channelNamespace/*',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('Appsync Event API - grant publish and subscribe for all channel namespaces within an API', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });
    api.grantPublishAndSubscribe(func);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'appsync:EventPublish',
              'appsync:EventSubscribe',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':appsync:',
                  { Ref: 'AWS::Region' },
                  ':',
                  { Ref: 'AWS::AccountId' },
                  ':apis/',
                  { 'Fn::GetAtt': ['apiC8550315', 'ApiId'] },
                  '/channelNamespace/*',
                ],
              ],
            },
          },
        ],
      },
    });
  });
});
