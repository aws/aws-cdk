import { Match, Template } from '@aws-cdk/assertions';
import { User } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import {
  WebSocketRouteIntegration, WebSocketApi, WebSocketIntegrationType,
  WebSocketRouteIntegrationBindOptions, WebSocketRouteIntegrationConfig,
} from '../../lib';

describe('WebSocketApi', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new WebSocketApi(stack, 'api');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Api', {
      Name: 'api',
      ProtocolType: 'WEBSOCKET',
    });

    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::Stage', 0);
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::Route', 0);
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::Integration', 0);
  });

  test('addRoute: adds a route with passed key', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'api');

    // WHEN
    api.addRoute('myroute', { integration: new DummyIntegration() });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(api.apiId),
      RouteKey: 'myroute',
    });
  });

  test('connectRouteOptions: adds a $connect route', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'api', {
      connectRouteOptions: { integration: new DummyIntegration() },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(api.apiId),
      RouteKey: '$connect',
    });
  });

  test('disconnectRouteOptions: adds a $disconnect route', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'api', {
      disconnectRouteOptions: { integration: new DummyIntegration() },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(api.apiId),
      RouteKey: '$disconnect',
    });
  });

  test('defaultRouteOptions: adds a $default route', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'api', {
      defaultRouteOptions: { integration: new DummyIntegration() },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(api.apiId),
      RouteKey: '$default',
    });
  });

  describe('grantManageConnections', () => {
    test('adds an IAM policy to the principal', () => {
      // GIVEN
      const stack = new Stack();
      const api = new WebSocketApi(stack, 'api');
      const principal = new User(stack, 'user');

      // WHEN
      api.grantManageConnections(principal);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([{
            Action: 'execute-api:ManageConnections',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':execute-api:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':',
                {
                  Ref: 'apiC8550315',
                },
                '/*/POST/@connections/*',
              ]],
            },
          }]),
        },
      });
    });
  });
});

class DummyIntegration extends WebSocketRouteIntegration {
  bind(_options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    return {
      type: WebSocketIntegrationType.AWS_PROXY,
      uri: 'some-uri',
    };
  }
}
