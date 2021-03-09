import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import {
  IWebSocketRouteIntegration, WebSocketApi, WebSocketIntegrationType,
  WebSocketRouteIntegrationBindOptions, WebSocketRouteIntegrationConfig,
} from '../../lib';

describe('WebSocketApi', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new WebSocketApi(stack, 'api');

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Api', {
      Name: 'api',
      ProtocolType: 'WEBSOCKET',
    });

    expect(stack).not.toHaveResource('AWS::ApiGatewayV2::Stage');
    expect(stack).not.toHaveResource('AWS::ApiGatewayV2::Route');
    expect(stack).not.toHaveResource('AWS::ApiGatewayV2::Integration');
  });

  test('addRoute: adds a route with passed key', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'api');

    // WHEN
    api.addRoute('myroute', { integration: new DummyIntegration() });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Route', {
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
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Route', {
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
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Route', {
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
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(api.apiId),
      RouteKey: '$default',
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
