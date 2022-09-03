import { Template } from '@aws-cdk/assertions';
import { SecretValue, Stack } from '@aws-cdk/core';
import * as events from '../lib';

test('basic connection', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new events.Connection(stack, 'Connection', {
    authorization: events.Authorization.basic('username', SecretValue.unsafePlainText('password')),
    connectionName: 'testConnection',
    description: 'ConnectionDescription',
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Events::Connection', {
    AuthorizationType: 'BASIC',
    AuthParameters: {
      BasicAuthParameters: {
        Password: 'password',
        Username: 'username',
      },
    },
    Name: 'testConnection',
    Description: 'ConnectionDescription',
  });
});

test('API key connection', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new events.Connection(stack, 'Connection', {
    authorization: events.Authorization.apiKey('keyname', SecretValue.unsafePlainText('keyvalue')),
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Events::Connection', {
    AuthorizationType: 'API_KEY',
    AuthParameters: {
      ApiKeyAuthParameters: {
        ApiKeyName: 'keyname',
        ApiKeyValue: 'keyvalue',
      },
    },
  });
});

test('oauth connection', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new events.Connection(stack, 'Connection', {
    authorization: events.Authorization.oauth({
      authorizationEndpoint: 'authorizationEndpoint',
      clientId: 'clientID',
      clientSecret: SecretValue.unsafePlainText('clientSecret'),
      httpMethod: events.HttpMethod.GET,
      headerParameters: {
        oAuthHeaderKey: events.HttpParameter.fromString('oAuthHeaderValue'),
      },
    }),
    headerParameters: {
      invocationHeaderKey: events.HttpParameter.fromString('invocationHeaderValue'),
    },
    connectionName: 'testConnection',
    description: 'ConnectionDescription',
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Events::Connection', {
    AuthorizationType: 'OAUTH_CLIENT_CREDENTIALS',
    AuthParameters: {
      OAuthParameters: {
        AuthorizationEndpoint: 'authorizationEndpoint',
        ClientParameters: {
          ClientID: 'clientID',
          ClientSecret: 'clientSecret',
        },
        HttpMethod: 'GET',
        OAuthHttpParameters: {
          HeaderParameters: [{
            Key: 'oAuthHeaderKey',
            Value: 'oAuthHeaderValue',
            IsValueSecret: false,
          }],
        },
      },
      InvocationHttpParameters: {
        HeaderParameters: [{
          Key: 'invocationHeaderKey',
          Value: 'invocationHeaderValue',
        }],
      },
    },
    Name: 'testConnection',
    Description: 'ConnectionDescription',
  });
});

test('Additional plaintext headers', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new events.Connection(stack, 'Connection', {
    authorization: events.Authorization.apiKey('keyname', SecretValue.unsafePlainText('keyvalue')),
    headerParameters: {
      'content-type': events.HttpParameter.fromString('application/json'),
    },
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Events::Connection', {
    AuthParameters: {
      InvocationHttpParameters: {
        HeaderParameters: [{
          Key: 'content-type',
          Value: 'application/json',
          IsValueSecret: false,
        }],
      },
    },
  });
});

test('Additional secret headers', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new events.Connection(stack, 'Connection', {
    authorization: events.Authorization.apiKey('keyname', SecretValue.unsafePlainText('keyvalue')),
    headerParameters: {
      'client-secret': events.HttpParameter.fromSecret(SecretValue.unsafePlainText('apiSecret')),
    },
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Events::Connection', {
    AuthParameters: {
      InvocationHttpParameters: {
        HeaderParameters: [{
          Key: 'client-secret',
          Value: 'apiSecret',
          IsValueSecret: true,
        }],
      },
    },
  });
});