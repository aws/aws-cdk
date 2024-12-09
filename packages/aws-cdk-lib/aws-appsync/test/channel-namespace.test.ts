import * as path from 'path';
import { Match, Template } from '../../assertions';
import * as cdk from '../../core';
import * as appsync from '../lib';

let stack: cdk.Stack;
let api: appsync.Api;

beforeEach(() => {
  stack = new cdk.Stack();
  api = new appsync.Api(stack, 'api', {
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
  });
});

test('Create channel namespace', () => {
  // WHEN
  new appsync.ChannelNamespace(stack, 'test', {
    api,
    channelNamespaceName: 'MyChannelNamespace',
    publishAuthModes: [appsync.AuthorizationType.API_KEY],
    subscribeAuthModes: [appsync.AuthorizationType.API_KEY],
    code: appsync.Code.fromInline('/* lambda authentication code here.*/'),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
    ApiId: stack.resolve(api.apiId),
    Name: 'MyChannelNamespace',
    PublishAuthModes: [{ AuthType: 'API_KEY' }],
    SubscribeAuthModes: [{ AuthType: 'API_KEY' }],
    CodeHandlers: '/* lambda authentication code here.*/',
  });
});

test('Create channel namespace with code asset', () => {
  // WHEN
  new appsync.ChannelNamespace(stack, 'MyChannelNamespace', {
    api,
    code: appsync.Code.fromAsset(path.join(
      __dirname,
      'events-api',
      'appsync-js-channel-namespace-handler.js',
    )),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
    ApiId: stack.resolve(api.apiId),
    CodeS3Location: Match.anyValue(),
  });
});

test.each(['', 'a'.repeat(51)])('throws when channelNamespaceName length is invalid',
  (channelNamespaceName) => {
    expect(() => new appsync.ChannelNamespace(stack, 'MyChannelNamespace', {
      api,
      channelNamespaceName,
    })).toThrow(`\`channelNamespaceName\` must be between 1 and 50 characters, got: ${channelNamespaceName.length} characters.`);
  },
);

test.each(['My channel namespace', 'My-Channel-Namespace'])('throws when channelNamespaceName includes invalid characters',
  (channelNamespaceName) => {
    expect(() => new appsync.ChannelNamespace(stack, 'MyChannelNamespace', {
      api,
      channelNamespaceName,
    })).toThrow(`\`channelNamespaceName\` must contain only alphanumeric characters, got: ${channelNamespaceName}`);
  },
);

test('test import method', () => {
  // WHEN
  const channelNamespaceArn = 'arn:aws:appsync:us-east-1:123456789012:apis/MyApi/channelNamespace/MyChannelNamespace';
  const channelNamespace = appsync.ChannelNamespace.fromChannelNamespaceArn(stack, 'MyChannelNamespace', channelNamespaceArn);

  // THEN
  expect(channelNamespace.channelNamespaceArn).toEqual(channelNamespaceArn);
});
