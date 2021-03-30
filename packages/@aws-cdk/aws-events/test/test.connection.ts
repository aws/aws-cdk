import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { AuthorizationType, Connection } from '../lib/connection';

export = {
  'creates an connection for an EventBus'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Connection(stack, 'Connection', {
      authorizationType: AuthorizationType.BASIC,
      authParameters: {
        basicAuthParameters: {
          password: 'password',
          username: 'username',
        },
      },
      connectionName: 'testConnection',
      description: 'ConnectionDescription',
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::Connection', {
      AuthorizationType: 'BASIC',
      AuthParameters: {
        BasicAuthParameters: {
          Password: 'password',
          Username: 'username',
        },
      },
      Name: 'testConnection',
      Description: 'ConnectionDescription',
    }));

    test.done();
  },
  'fail to create a connection if wrong authParameters'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const createInvalidConnection = () => new Connection(stack, 'Connection', {
      authorizationType: AuthorizationType.API_KEY,
      authParameters: {
        basicAuthParameters: {
          password: 'password',
          username: 'username',
        },
      },
      connectionName: 'testConnection',
      description: 'ConnectionDescription',
    });

    // THEN
    test.throws(() => {
      createInvalidConnection();
    }, /You must supply the relevant authParameters for this authorizationType/);

    test.done();
  },

  'create connection with InvocationHttpParameters'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    // WHEN
    new Connection(stack, 'Connection', {
      authorizationType: AuthorizationType.OAUTH_CLIENT_CREDENTIALS,
      authParameters: {
        oAuthParameters: {
          authorizationEndpoint: 'authorizationEndpoint',
          clientParameters: {
            clientID: 'clientID',
            clientSecret: 'clientSecret',
          },
          httpMethod: 'GET',
          oAuthHttpParameters: {
            headerParameters: [{
              key: 'oAuthHeaderKey',
              value: 'oAuthHeaderValue',
            }],
          },
        },
        invocationHttpParameters: {
          headerParameters: [{
            key: 'invocationHeaderKey',
            value: 'invocationHeaderValue',
          }],
        },
      },
      connectionName: 'testConnection',
      description: 'ConnectionDescription',
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::Connection', {
      AuthorizationType: 'OAUTH_CLIENT_CREDENTIALS',
      AuthParameters: {
        OAuthParameters: {
          AuthorizationEndpoint: 'authorizationEndpoint',
          ClientParameters: {
            ClientID: 'clientID',
            ClientSecret: 'clientSecret',
          },
          HttpMethod: 'GET',
          // OAuthHttpParameters: {
          //   HeaderParameters: [{
          //     Key: 'oAuthHeaderKey',
          //     Value: 'oAuthHeaderValue',
          //   }],
          // },
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
    }));

    test.done();
  },
}
