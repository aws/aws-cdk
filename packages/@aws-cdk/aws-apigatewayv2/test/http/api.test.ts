import '@aws-cdk/assert/jest';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { HttpApi, HttpMethod, LambdaProxyIntegration } from '../../lib';

describe('HttpApi', () => {
  test('default', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'api');

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Api', {
      Name: 'api',
      ProtocolType: 'HTTP',
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.httpApiId),
      StageName: '$default',
      AutoDeploy: true,
    });

    expect(stack).not.toHaveResource('AWS::ApiGatewayV2::Route');
    expect(stack).not.toHaveResource('AWS::ApiGatewayV2::Integration');

    expect(api.url).toBeDefined();
  });

  test('import', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'api', { apiName: 'customName' });
    const imported = HttpApi.fromApiId(stack, 'imported', api.httpApiId );

    expect(imported.httpApiId).toEqual(api.httpApiId);

  });

  test('unsetting createDefaultStage', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'api', {
      createDefaultStage: false,
    });

    expect(stack).not.toHaveResource('AWS::ApiGatewayV2::Stage');
    expect(api.url).toBeUndefined();
  });

  test('default integration', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'api', {
      defaultIntegration: new LambdaProxyIntegration({
        handler: new Function(stack, 'fn', {
          code: Code.fromInline('foo'),
          runtime: Runtime.NODEJS_12_X,
          handler: 'index.handler',
        }),
      }),
    });

    expect(stack).toHaveResourceLike('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(httpApi.httpApiId),
      RouteKey: '$default',
    });

    expect(stack).toHaveResourceLike('AWS::ApiGatewayV2::Integration', {
      ApiId: stack.resolve(httpApi.httpApiId),
    });
  });

  test('addRoutes() configures the correct routes', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'api');

    httpApi.addRoutes({
      path: '/pets',
      methods: [ HttpMethod.GET, HttpMethod.PATCH ],
      integration: new LambdaProxyIntegration({
        handler: new Function(stack, 'fn', {
          code: Code.fromInline('foo'),
          runtime: Runtime.NODEJS_12_X,
          handler: 'index.handler',
        }),
      }),
    });

    expect(stack).toHaveResourceLike('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(httpApi.httpApiId),
      RouteKey: 'GET /pets',
    });

    expect(stack).toHaveResourceLike('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(httpApi.httpApiId),
      RouteKey: 'PATCH /pets',
    });
  });

  test('addRoutes() creates the default method', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'api');

    httpApi.addRoutes({
      path: '/pets',
      integration: new LambdaProxyIntegration({
        handler: new Function(stack, 'fn', {
          code: Code.fromInline('foo'),
          runtime: Runtime.NODEJS_12_X,
          handler: 'index.handler',
        }),
      }),
    });

    expect(stack).toHaveResourceLike('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(httpApi.httpApiId),
      RouteKey: 'ANY /pets',
    });
  });
});
