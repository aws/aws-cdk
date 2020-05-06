import '@aws-cdk/assert/jest';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { HttpApi, HttpRoute, HttpRouteKey, LambdaProxyIntegration, PayloadFormatVersion } from '../../../lib';

describe('LambdaProxyIntegration', () => {
  test('default', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    const fooFn = fooFunction(stack, 'Fn');
    new HttpRoute(stack, 'LambdaProxyRoute', {
      httpApi: api,
      integration: new LambdaProxyIntegration({
        handler: fooFn,
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS_PROXY',
      IntegrationUri: stack.resolve(fooFn.functionArn),
      PayloadFormatVersion: '2.0',
    });
  });

  test('payloadFormatVersion selection', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'LambdaProxyRoute', {
      httpApi: api,
      integration: new LambdaProxyIntegration({
        handler: fooFunction(stack, 'Fn'),
        payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      PayloadFormatVersion: '1.0',
    });
  });
});

function fooFunction(stack: Stack, id: string) {
  return new Function(stack, id, {
    code: Code.fromInline('foo'),
    runtime: Runtime.NODEJS_12_X,
    handler: 'index.handler',
  });
}