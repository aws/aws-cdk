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

  test('setting defaultStageName', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new WebSocketApi(stack, 'api', {
      defaultStageName: 'dev',
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.webSocketApiId),
      StageName: 'dev',
      AutoDeploy: true,
    });
  });

  test('addRoute: adds a route with passed key', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'api');

    // WHEN
    api.addRoute('myroute', { integration: new DummyIntegration() });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(api.webSocketApiId),
      RouteKey: 'myroute',
    });
  });

  test('addConnectRoute: adds a $connect route', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'api');

    // WHEN
    api.addConnectRoute({ integration: new DummyIntegration() });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(api.webSocketApiId),
      RouteKey: '$connect',
    });
  });

  test('addDisconnectRoute: adds a $disconnect route', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'api');

    // WHEN
    api.addDisconnectRoute({ integration: new DummyIntegration() });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(api.webSocketApiId),
      RouteKey: '$disconnect',
    });
  });

  test('addDefaultRoute: adds a $default route', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'api');

    // WHEN
    api.addDefaultRoute({ integration: new DummyIntegration() });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(api.webSocketApiId),
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
