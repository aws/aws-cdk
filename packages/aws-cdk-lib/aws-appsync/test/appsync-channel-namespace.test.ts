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
  app = new App({});
  stack = new cdk.Stack(app);
});

describe('Basic channel namespace', () => {
  test('Appsync Event API channel namespace - id is used as the default name', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', { apiName: 'api' });
    api.addChannelNamespace('default');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'default',
    });
  });

  test('Appsync Event API channel namespace - name overrides id', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', { apiName: 'api' });
    api.addChannelNamespace('default', { channelNamespaceName: 'another' });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'another',
    });
  });
});

describe('Channel namespace security tests', () => {
  // GIVEN
  let func: lambda.Function;
  beforeEach(() => {
    func = new lambda.Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('/* lambda authentication code here.*/'),
    });
  });

  test('Can grant EventPublish permissions to channel namespaces', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });
    api.grantConnect(func);

    const defaultNamespace = api.addChannelNamespace('default');
    const namespace1 = api.addChannelNamespace('namespace1');

    defaultNamespace.grantPublish(func);
    namespace1.grantPublish(func);

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
                  '/channelNamespace/default',
                ],
              ],
            },
          },
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
                  '/channelNamespace/namespace1',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('Can grant EventSubscribe permissions to channel namespaces', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });
    api.grantConnect(func);

    const defaultNamespace = api.addChannelNamespace('default');
    const namespace1 = api.addChannelNamespace('namespace1');

    defaultNamespace.grantSubscribe(func);
    namespace1.grantSubscribe(func);

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
                  '/channelNamespace/default',
                ],
              ],
            },
          },
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
                  '/channelNamespace/namespace1',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('Appsync Event API channel namespace - don\'t allow modes that are not provided by the API', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', { apiName: 'api' });
    function configNameSpace() {
      api.addChannelNamespace('default', {
        authorizationConfig: {
          subscribeAuthModeTypes: [appsync.AppSyncAuthorizationType.IAM],
        },
      });
    }

    // THEN
    expect(() => configNameSpace()).toThrow('API is missing authorization configuration for AWS_IAM');
  });

  test('AppSync Event API channel namespace - allow override for publish authorization mode', () => {
    // WHEN
    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
      apiKeyConfig: {
        description: 'Custom Description',
      },
    };

    const userPool: cognito.UserPool = new cognito.UserPool(stack, 'pool');
    const cognitoProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.USER_POOL,
      cognitoConfig: {
        userPool,
      },
    };

    const api = new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [iamProvider, apiKeyProvider, cognitoProvider],
        connectionAuthModeTypes: [appsync.AppSyncAuthorizationType.IAM],
        defaultPublishAuthModeTypes: [appsync.AppSyncAuthorizationType.API_KEY],
        defaultSubscribeAuthModeTypes: [appsync.AppSyncAuthorizationType.USER_POOL],
      },
    });

    api.addChannelNamespace('default', {
      authorizationConfig: {
        publishAuthModeTypes: [appsync.AppSyncAuthorizationType.IAM],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'default',
      PublishAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.IAM }],
    });
  });

  test('AppSync Event API channel namespace - allow override for subscribe authorization mode', () => {
    // WHEN
    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
      apiKeyConfig: {
        description: 'Custom Description',
      },
    };

    const userPool: cognito.UserPool = new cognito.UserPool(stack, 'pool');
    const cognitoProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.USER_POOL,
      cognitoConfig: {
        userPool,
      },
    };

    const api = new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [iamProvider, apiKeyProvider, cognitoProvider],
        connectionAuthModeTypes: [appsync.AppSyncAuthorizationType.IAM],
        defaultPublishAuthModeTypes: [appsync.AppSyncAuthorizationType.API_KEY],
        defaultSubscribeAuthModeTypes: [appsync.AppSyncAuthorizationType.USER_POOL],
      },
    });

    api.addChannelNamespace('default', {
      authorizationConfig: {
        subscribeAuthModeTypes: [appsync.AppSyncAuthorizationType.API_KEY],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'default',
      SubscribeAuthModes: [{ AuthType: appsync.AppSyncAuthorizationType.API_KEY }],
    });
  });

  test('Appsync Event API channel namespace - grant publish from channel', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });
    const cn = api.addChannelNamespace('default');
    cn.grantPublish(func);

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
                  '/channelNamespace/default',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('Appsync Event API channel namespace - grant subscribe from channel', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });
    const cn = api.addChannelNamespace('default');
    cn.grantSubscribe(func);

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
                  '/channelNamespace/default',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('Appsync Event API channel namespace - grant publish and subscribe from channel', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AppSyncAuthorizationType.IAM }],
      },
    });
    const cn = api.addChannelNamespace('default');
    cn.grantPublishAndSubscribe(func);

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
                  '/channelNamespace/default',
                ],
              ],
            },
          },
        ],
      },
    });
  });
});
