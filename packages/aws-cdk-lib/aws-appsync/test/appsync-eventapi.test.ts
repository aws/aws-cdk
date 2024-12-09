import { Template } from '../../assertions';
import * as lambda from '../../aws-lambda';
import * as cognito from '../../aws-cognito';
import * as iam from '../../aws-iam';
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

describe('Appsync Event API Key Authorization', () => {
  test('Appsync Event API - creates default api key', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', { name: 'api' });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('Appsync Event API - allows a single key with no name', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      name: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AuthorizationType.API_KEY }],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('Appsync Event API - allows multiple keys to be created', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      name: 'api',
      authorizationConfig: {
        authProviders: [
          { authorizationType: appsync.AuthorizationType.API_KEY, apiKeyConfig: { name: 'first' } },
          { authorizationType: appsync.AuthorizationType.API_KEY, apiKeyConfig: { name: 'second' } },
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
        name: 'api',
        authorizationConfig: {
          authProviders: [
            { authorizationType: appsync.AuthorizationType.API_KEY },
            { authorizationType: appsync.AuthorizationType.API_KEY, apiKeyConfig: { name: 'second' } },
          ],
        },
      });
    }).toThrow('You must specify key names when configuring more than 1 API key.');
  });
});

describe('AppSync Event Api auth configuration', () => {
  test('Authorization providers are used as allowed modes by default', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      name: 'apiWithMultipleProviders',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AuthorizationType.API_KEY }, { authorizationType: appsync.AuthorizationType.IAM }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'apiWithMultipleProviders',
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: 'API_KEY' }, { AuthType: 'AWS_IAM' }],
        DefaultPublishAuthModes: [{ AuthType: 'API_KEY' }, { AuthType: 'AWS_IAM' }],
        DefaultSubscribeAuthModes: [{ AuthType: 'API_KEY' }, { AuthType: 'AWS_IAM' }],
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
      name: 'apiWithMultipleProviders',
      authorizationConfig: {
        authProviders: [
          {
            authorizationType: appsync.AuthorizationType.LAMBDA,
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
        ConnectionAuthModes: [{ AuthType: 'AWS_LAMBDA' }],
        DefaultPublishAuthModes: [{ AuthType: 'AWS_LAMBDA' }],
        DefaultSubscribeAuthModes: [{ AuthType: 'AWS_LAMBDA' }],
      },
    });
  });

  test('Authorization providers do not overwrite provided modes', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      name: 'apiWithMultipleProviders',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AuthorizationType.API_KEY }, { authorizationType: appsync.AuthorizationType.IAM }],
        connectionAuthModeTypes: [appsync.AuthorizationType.IAM],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'apiWithMultipleProviders',
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: 'AWS_IAM' }],
        DefaultPublishAuthModes: [{ AuthType: 'API_KEY' }, { AuthType: 'AWS_IAM' }],
        DefaultSubscribeAuthModes: [{ AuthType: 'API_KEY' }, { AuthType: 'AWS_IAM' }],
      },
    });
  });

  test('Modes not specified by providers are not allowed', () => {
    // WHEN
    function configureWithUserPool() {
      new appsync.EventApi(stack, 'api', {
        name: 'apiWithMultipleProviders',
        authorizationConfig: {
          authProviders: [{ authorizationType: appsync.AuthorizationType.API_KEY }, { authorizationType: appsync.AuthorizationType.IAM }],
          connectionAuthModeTypes: [appsync.AuthorizationType.USER_POOL],
        },
      });
    }

    // THEN
    expect(() => configureWithUserPool()).toThrow('Missing authorization configuration for AMAZON_COGNITO_USER_POOLS');
  });

  test('Configuring OIDC and Cognito user pools', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      name: 'apiWithUserPool',
      authorizationConfig: {
        authProviders: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            cognitoConfig: { userPool: new cognito.UserPool(stack, 'myPool') },
          },
          {
            authorizationType: appsync.AuthorizationType.OIDC,
            openIdConnectConfig: { oidcProvider: 'test' },
          },
        ],
        connectionAuthModeTypes: [appsync.AuthorizationType.USER_POOL],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Api', {
      Name: 'apiWithUserPool',
      EventConfig: {
        ConnectionAuthModes: [{ AuthType: 'AMAZON_COGNITO_USER_POOLS' }],
        DefaultPublishAuthModes: [{ AuthType: 'AMAZON_COGNITO_USER_POOLS' }, { AuthType: 'OPENID_CONNECT' }],
        DefaultSubscribeAuthModes: [{ AuthType: 'AMAZON_COGNITO_USER_POOLS' }, { AuthType: 'OPENID_CONNECT' }],
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
      name: 'apiWithCustomRole',
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
      name: 'api',
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
      name: 'log-retention',
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
      name: 'no-log-retention',
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
      name: 'owner-contact',
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
        name: 'owner-contact',
        ownerContact: 'a'.repeat(256 + 1),
      });
    };

    expect(() => buildWithOwnerContact()).toThrow('You must specify `ownerContact` as a string of 256 characters or less.');
  });
});

describe('grants', () => {
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
      name: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AuthorizationType.IAM }],
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
    const api = new appsync.EventApi(stack, 'api', { name: 'api' });

    // THEN
    expect(() => api.grantConnect(func)).toThrow('IAM Authorization mode is not configured on this API.');
  });
});
