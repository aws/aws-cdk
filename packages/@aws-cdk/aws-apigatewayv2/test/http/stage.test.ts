import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { HttpApi, HttpStage } from '../../lib';

describe('HttpStage', () => {
  test('default', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: false,
    });

    new HttpStage(stack, 'Stage', {
      httpApi: api,
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.httpApiId),
      StageName: '$default',
    });
  });

  test('url returns the correct path', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: false,
    });

    const defaultStage = new HttpStage(stack, 'DefaultStage', {
      httpApi: api,
    });

    const betaStage = new HttpStage(stack, 'BetaStage', {
      httpApi: api,
      stageName: 'beta',
    });

    expect(defaultStage.url.endsWith('/')).toBe(true);
    expect(betaStage.url.endsWith('/')).toBe(false);
  });
});