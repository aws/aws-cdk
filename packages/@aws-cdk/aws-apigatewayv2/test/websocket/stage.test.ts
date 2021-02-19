import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { WebSocketApi, WebSocketStage } from '../../lib';

describe('WebSocketStage', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'Api');

    // WHEN
    const defaultStage = new WebSocketStage(stack, 'Stage', {
      webSocketApi: api,
      stageName: 'dev',
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: 'dev',
    });
    expect(defaultStage.url.endsWith('/dev')).toBe(true);
  });
});
