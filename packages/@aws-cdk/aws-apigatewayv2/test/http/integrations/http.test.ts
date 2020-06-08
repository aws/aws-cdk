import { ABSENT } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { Duration, Stack } from '@aws-cdk/core';
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

  test('CORS Configuration is correctly configured.', () => {
    const stack = new Stack();
    new HttpApi(stack, 'HttpApi', {
      corsPreflight: {
        allowCredentials: true,
        allowHeaders: ['Authorization'],
        allowMethods: [HttpMethod.GET, HttpMethod.HEAD, HttpMethod.OPTIONS, HttpMethod.POST],
        allowOrigins: ['*'],
        maxAge: Duration.seconds(36400),
      },
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Api', {
      CorsConfiguration: {
        AllowCredentials: true,
        AllowHeaders: ['Authorization'],
        AllowMethods: ['GET', 'HEAD', 'OPTIONS', 'POST'],
        AllowOrigins: ['*'],
        MaxAge: 36400,
      },
    });
  });

  test('CorsConfiguration is ABSENT when not specified.', () => {
    const stack = new Stack();
    new HttpApi(stack, 'HttpApi');

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Api', {
      CorsConfiguration: ABSENT,
    });
  });
});
