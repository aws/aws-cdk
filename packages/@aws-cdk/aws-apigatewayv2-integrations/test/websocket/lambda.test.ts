import '@aws-cdk/assert/jest';
import { WebSocketApi } from '@aws-cdk/aws-apigatewayv2';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { LambdaWebSocketIntegration } from '../../lib';


describe('LambdaWebSocketIntegration', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const fooFn = fooFunction(stack, 'Fn');

    // WHEN
    new WebSocketApi(stack, 'Api', {
      connectRouteOptions: {
        integration: new LambdaWebSocketIntegration({ handler: fooFn }),
      },
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS_PROXY',
      IntegrationUri: stack.resolve(fooFn.functionArn),
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
