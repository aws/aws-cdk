import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import {
  IWebSocketRouteIntegration, WebSocketApi, WebSocketIntegrationType,
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
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(webSocketApi.webSocketApiId),
      RouteKey: 'message',
      Target: {
        'Fn::Join': [
          '',
          [
            'integrations/',
            {
              Ref: 'ApiWebSocketIntegrationb7742333c7ab20d7b2b178df59bb17f23D15DECE',
            },
          ],
        ],
      },
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      ApiId: stack.resolve(webSocketApi.webSocketApiId),
      IntegrationType: 'AWS_PROXY',
      IntegrationUri: 'some-uri',
    });
  });
});


class DummyIntegration implements IWebSocketRouteIntegration {
  bind(_options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    return {
      type: WebSocketIntegrationType.AWS_PROXY,
      uri: 'some-uri',
    };
  }
}
