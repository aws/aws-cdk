import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { HttpApi, HttpMethod, HttpProxyIntegration, HttpRoute, HttpRouteKey } from '../../../lib';

describe('HttpProxyIntegration', () => {
  test('default', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'HttpProxyRoute', {
      httpApi: api,
      integration: new HttpProxyIntegration({
        url: 'some-target-url',
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'HTTP_PROXY',
      IntegrationUri: 'some-target-url',
      PayloadFormatVersion: '1.0',
      IntegrationMethod: 'ANY',
    });
  });

  test('method option is correctly recognized', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'HttpProxyRoute', {
      httpApi: api,
      integration: new HttpProxyIntegration({
        url: 'some-target-url',
        method: HttpMethod.PATCH,
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      IntegrationMethod: 'PATCH',
    });
  });
});