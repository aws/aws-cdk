import { Template } from '../../assertions';
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
    const api = new appsync.EventApi(stack, 'api', { name: 'api' });
    api.addChannelNamespace('default');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'default',
    });
  });

  test('Appsync Event API channel namespace - name overrides id', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', { name: 'api' });
    api.addChannelNamespace('default', { name: 'another' });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'another',
    });
  });

  test('Appsync Event API channel namespace - dont allow modes that are not provided by the API', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', { name: 'api' });
    function configNameSpace() {
      api.addChannelNamespace('default', {
        authorizationConfig: {
          subscribeAuthModeTypes: [appsync.AuthorizationType.IAM],
        },
      });
    }

    // THEN
    expect(() => configNameSpace()).toThrow('API is missing authorization configuration for AWS_IAM');
  });

  test('Appsync Event API channel namespace - grant publish from channel', () => {
    // WHEN
    const api = new appsync.EventApi(stack, 'api', {
      name: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AuthorizationType.IAM }],
      },
    });
    const cn = api.addChannelNamespace('default');
    const fn = new lambda.Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('/* lambda authentication code here.*/'),
    });
    cn.grantPublish(fn);

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
      name: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AuthorizationType.IAM }],
      },
    });
    const cn = api.addChannelNamespace('default');
    const fn = new lambda.Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('/* lambda authentication code here.*/'),
    });
    cn.grantSubscribe(fn);

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
});
