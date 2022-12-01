import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import {
  WebSocketRouteIntegration, WebSocketApi, WebSocketIntegrationType,
  WebSocketRoute, WebSocketRouteIntegrationBindOptions, WebSocketRouteIntegrationConfig,
} from '../../lib';

describe('WebSocketRoute', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const webSocketApi = new WebSocketApi(stack, 'Api');

    // WHEN
    new WebSocketRoute(stack, 'Route', {
      webSocketApi,
      integration: new DummyIntegration(),
      routeKey: 'message',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(webSocketApi.apiId),
      RouteKey: 'message',
      Target: {
        'Fn::Join': [
          '',
          [
            'integrations/',
            {
              Ref: 'RouteDummyIntegrationE40E82B4',
            },
          ],
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      ApiId: stack.resolve(webSocketApi.apiId),
      IntegrationType: 'AWS_PROXY',
      IntegrationUri: 'some-uri',
    });
  });

  test('Api Key is required for route when apiKeyIsRequired is true', () => {
    // GIVEN
    const stack = new Stack();
    const webSocketApi = new WebSocketApi(stack, 'Api');

    // WHEN
    new WebSocketRoute(stack, 'Route', {
      webSocketApi,
      integration: new DummyIntegration(),
      routeKey: 'message',
      apiKeyRequired: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(webSocketApi.apiId),
      ApiKeyRequired: true,
      RouteKey: 'message',
      Target: {
        'Fn::Join': [
          '',
          [
            'integrations/',
            {
              Ref: 'RouteDummyIntegrationE40E82B4',
            },
          ],
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      ApiId: stack.resolve(webSocketApi.apiId),
      IntegrationType: 'AWS_PROXY',
      IntegrationUri: 'some-uri',
    });
  });


  test('integration cannot be used across WebSocketApis', () => {
    // GIVEN
    const integration = new DummyIntegration();

    // WHEN
    const stack = new Stack();
    const webSocketApi1 = new WebSocketApi(stack, 'WebSocketApi1');
    const webSocketApi2 = new WebSocketApi(stack, 'WebSocketApi2');

    new WebSocketRoute(stack, 'WebSocketRoute1', {
      webSocketApi: webSocketApi1,
      integration,
      routeKey: 'route',
    });

    expect(() => new WebSocketRoute(stack, 'WebSocketRoute2', {
      webSocketApi: webSocketApi2,
      integration,
      routeKey: 'route',
    })).toThrow(/cannot be associated with multiple APIs/);
  });

  test('associating integrations in different APIs creates separate AWS::ApiGatewayV2::Integration', () => {
    const stack = new Stack();

    const api = new WebSocketApi(stack, 'WebSocketApi');
    new WebSocketRoute(stack, 'WebSocketRoute1', {
      webSocketApi: api,
      integration: new DummyIntegration(),
      routeKey: '/books',
    });
    new WebSocketRoute(stack, 'WebSocketRoute2', {
      webSocketApi: api,
      integration: new DummyIntegration(),
      routeKey: '/magazines',
    });

    Template.fromStack(stack).hasResource('AWS::ApiGatewayV2::Integration', 2);
  });

  test('default RouteResponseSelectionExpression is set if route will return a response to the client', () => {
    // GIVEN
    const stack = new Stack();
    const webSocketApi = new WebSocketApi(stack, 'Api');

    // WHEN
    const route = new WebSocketRoute(stack, 'Route', {
      webSocketApi,
      integration: new DummyIntegration(),
      routeKey: 'message',
      returnResponse: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(webSocketApi.apiId),
      RouteKey: 'message',
      RouteResponseSelectionExpression: '$default',
      Target: {
        'Fn::Join': [
          '',
          [
            'integrations/',
            {
              Ref: 'RouteDummyIntegrationE40E82B4',
            },
          ],
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::RouteResponse', {
      ApiId: stack.resolve(webSocketApi.apiId),
      RouteId: stack.resolve(route.routeId),
      RouteResponseKey: '$default',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      ApiId: stack.resolve(webSocketApi.apiId),
      IntegrationType: 'AWS_PROXY',
      IntegrationUri: 'some-uri',
    });
  });
});


class DummyIntegration extends WebSocketRouteIntegration {
  constructor(name?: string) {
    super(name ?? 'DummyIntegration');
  }

  bind(_options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    return {
      type: WebSocketIntegrationType.AWS_PROXY,
      uri: 'some-uri',
    };
  }
}
