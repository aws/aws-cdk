import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import {
  WebSocketApi, WebSocketAuthorizer, WebSocketAuthorizerType,
} from '../../lib';

describe('WebSocketAuthorizer', () => {
  describe('lambda', () => {
    it('default', () => {
      const stack = new Stack();
      const webSocketApi = new WebSocketApi(stack, 'WebSocketApi');

      new WebSocketAuthorizer(stack, 'WebSocketAuthorizer', {
        webSocketApi,
        identitySource: ['identitysource.1', 'identitysource.2'],
        type: WebSocketAuthorizerType.LAMBDA,
        authorizerUri: 'arn:cool-lambda-arn',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
        AuthorizerType: 'REQUEST',
        AuthorizerUri: 'arn:cool-lambda-arn',
      });
    });
  });
});
