import { Match, Template } from '@aws-cdk/assertions';
import { User } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import {
  WebSocketRouteIntegration,
  WebSocketApi,
  WebSocketApiKeySelectionExpression,
  WebSocketIntegrationType,
  WebSocketRouteIntegrationBindOptions,
  WebSocketRouteIntegrationConfig,
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

  test('apiKeySelectionExpression: given a value', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new WebSocketApi(stack, 'api', {
      apiKeySelectionExpression: WebSocketApiKeySelectionExpression.AUTHORIZER_USAGE_IDENTIFIER_KEY,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Api', {
      ApiKeySelectionExpression: '$context.authorizer.usageIdentifierKey',
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

  test('addRoute: adds a route with passed key and allows it to return a response', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'api');

    // WHEN
    const route = api.addRoute('myroute', { integration: new DummyIntegration(), returnResponse: true });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(api.apiId),
      RouteKey: 'myroute',
      RouteResponseSelectionExpression: '$default',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::RouteResponse', {
      ApiId: stack.resolve(api.apiId),
      RouteId: stack.resolve(route.routeId),
      RouteResponseKey: '$default',
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

  test('import', () => {
    // GIVEN
    const stack = new Stack();
    const imported = WebSocketApi.fromWebSocketApiAttributes(stack, 'imported', { webSocketId: 'ws-1234', apiEndpoint: 'api-endpoint' });

    // THEN
    expect(imported.apiId).toEqual('ws-1234');
    expect(imported.apiEndpoint).toEqual('api-endpoint');
  });

  test('apiEndpoint for imported', () => {
    // GIVEN
    const stack = new Stack();
    const api = WebSocketApi.fromWebSocketApiAttributes(stack, 'imported', { webSocketId: 'api-1234' });

    // THEN
    expect(() => api.apiEndpoint).toThrow(/apiEndpoint is not configured/);
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
                '/*/*/@connections/*',
              ]],
            },
          }]),
        },
      });
    });
  });
});

class DummyIntegration extends WebSocketRouteIntegration {
  constructor() {
    super('DummyIntegration');
  }

  bind(_options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    return {
      type: WebSocketIntegrationType.AWS_PROXY,
      uri: 'some-uri',
    };
  }
}
