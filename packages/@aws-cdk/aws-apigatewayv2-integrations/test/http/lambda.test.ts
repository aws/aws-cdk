import '@aws-cdk/assert/jest';
import { HttpApi, HttpRoute, HttpRouteKey, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { LambdaProxyIntegration } from '../../lib';

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

  test('no dependency cycles', () => {
    const app = new App();
    const lambdaStack = new Stack(app, 'lambdaStack');
    const fooFn = fooFunction(lambdaStack, 'Fn');

    const apigwStack = new Stack(app, 'apigwStack');
    new HttpApi(apigwStack, 'httpApi', {
      defaultIntegration: new LambdaProxyIntegration({
        handler: fooFn,
      }),
    });

    expect(() => app.synth()).not.toThrow();
  });
});

function fooFunction(stack: Stack, id: string) {
  return new Function(stack, id, {
    code: Code.fromInline('foo'),
    runtime: Runtime.NODEJS_12_X,
    handler: 'index.handler',
  });
}