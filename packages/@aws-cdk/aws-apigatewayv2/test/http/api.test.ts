import '@aws-cdk/assert/jest';
import { ABSENT } from '@aws-cdk/assert';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Duration, Stack } from '@aws-cdk/core';
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

  describe('cors', () => {
    test('cors is correctly configured.', () => {
      const stack = new Stack();
      new HttpApi(stack, 'HttpApi', {
        corsPreflight: {
          allowHeaders: ['Authorization'],
          allowMethods: [HttpMethod.GET, HttpMethod.HEAD, HttpMethod.OPTIONS, HttpMethod.POST],
          allowOrigins: ['*'],
          maxAge: Duration.seconds(36400),
        },
      });

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Api', {
        CorsConfiguration: {
          AllowHeaders: ['Authorization'],
          AllowMethods: ['GET', 'HEAD', 'OPTIONS', 'POST'],
          AllowOrigins: ['*'],
          MaxAge: 36400,
        },
      });
    });

    test('cors is absent when not specified.', () => {
      const stack = new Stack();
      new HttpApi(stack, 'HttpApi');

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Api', {
        CorsConfiguration: ABSENT,
      });
    });

    test('errors when allowConfiguration is specified along with origin "*"', () => {
      const stack = new Stack();
      expect(() => new HttpApi(stack, 'HttpApi', {
        corsPreflight: {
          allowCredentials: true,
          allowOrigins: ['*'],
        },
      })).toThrowError(/allowCredentials is not supported/);
    });
  });
});
