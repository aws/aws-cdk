import { Match, Template } from '../../../assertions';
import { HttpApi, HttpRoute, HttpRouteKey, MappingValue, ParameterMapping, PayloadFormatVersion } from '../../../aws-apigatewayv2';
import * as lambda from '../../../aws-lambda';
import { Code, Function } from '../../../aws-lambda';
import { App, Duration, Stack } from '../../../core';
import { HttpLambdaIntegration } from './../../lib/http/lambda';

describe('LambdaProxyIntegration', () => {
  test('default', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    const fooFn = fooFunction(stack, 'Fn');
    new HttpRoute(stack, 'LambdaProxyRoute', {
      httpApi: api,
      integration: new HttpLambdaIntegration('Integration', fooFn),
      routeKey: HttpRouteKey.with('/pets'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
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
      integration: new HttpLambdaIntegration('Integration', fooFunction(stack, 'Fn'), {
        payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      PayloadFormatVersion: '1.0',
    });
  });

  test('parameterMapping selection', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'LambdaProxyRoute', {
      httpApi: api,
      integration: new HttpLambdaIntegration('Integration', fooFunction(stack, 'Fn'), {
        parameterMapping: new ParameterMapping()
          .appendHeader('header2', MappingValue.requestHeader('header1'))
          .removeHeader('header1'),
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      RequestParameters: {
        'append:header.header2': '$request.header.header1',
        'remove:header.header1': '',
      },
    });
  });

  test('timeout selection', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'LambdaProxyRoute', {
      httpApi: api,
      integration: new HttpLambdaIntegration('Integration', fooFunction(stack, 'Fn'), {
        timeout: Duration.seconds(20),
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      TimeoutInMillis: 20000,
    });
  });

  test('no dependency cycles', () => {
    const app = new App();
    const lambdaStack = new Stack(app, 'lambdaStack');
    const fooFn = fooFunction(lambdaStack, 'Fn');

    const apigwStack = new Stack(app, 'apigwStack');
    new HttpApi(apigwStack, 'httpApi', {
      defaultIntegration: new HttpLambdaIntegration('Integration', fooFn),
    });

    expect(() => app.synth()).not.toThrow();
  });

  test('handler reused once maintains route-specific permissions', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    const handler = fooFunction(stack, 'Handler');

    new HttpRoute(stack, 'Route1', {
      httpApi: api,
      integration: new HttpLambdaIntegration('Integration1', handler),
      routeKey: HttpRouteKey.with('/foo'),
    });

    // Make sure we have one route-specific permission
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Permission', 1);
  });

  test('handler reused twice maintains route-specific permissions', () => {
    const app = new App();
    const lambdaStack = new Stack(app, 'lambdaStack');
    const fooFn = fooFunction(lambdaStack, 'Fn');

    const stack = new Stack(app, 'apigwStack');
    const api = new HttpApi(stack, 'httpApi');
    const integration = new HttpLambdaIntegration('Integration', fooFn);

    api.addRoutes({
      path: '/foo',
      integration,
    });

    api.addRoutes({
      path: '/bar',
      integration,
    });

    // Make sure we have two route-specific permissions (below threshold)
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Permission', 2);

    template.hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::Join': ['', Match.arrayWith([':execute-api:', '/*/*/foo'])],
      },
    });

    template.hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::Join': ['', Match.arrayWith([':execute-api:', '/*/*/bar'])],
      },
    });

    template.resourceCountIs('AWS::ApiGatewayV2::Integration', 1);
  });

  test('handler reused 11 times consolidates to API-scoped permission', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    const handler = fooFunction(stack, 'Handler');

    // Add 11 routes with the same handler (exceeds threshold of 10 permissions)
    for (let i = 1; i <= 11; i++) {
      new HttpRoute(stack, `Route${i}`, {
        httpApi: api,
        integration: new HttpLambdaIntegration(`Integration${i}`, handler),
        routeKey: HttpRouteKey.with(`/path${i}`),
      });
    }

    // Make sure we have only one permission scoped to the full API
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Permission', 1);

    template.hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::Join': ['', Match.arrayWith([':execute-api:', '/*/*/*'])],
      },
    });
  });

  test('adding route after consolidation maintains single API-scoped permission', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    const handler = fooFunction(stack, 'Handler');

    // Add 11 routes to trigger consolidation, then add another
    for (let i = 1; i <= 11; i++) {
      new HttpRoute(stack, `Route${i}`, {
        httpApi: api,
        integration: new HttpLambdaIntegration(`Integration${i}`, handler),
        routeKey: HttpRouteKey.with(`/path${i}`),
      });
    }

    // Add another route after consolidation
    new HttpRoute(stack, 'Route12', {
      httpApi: api,
      integration: new HttpLambdaIntegration('Integration12', handler),
      routeKey: HttpRouteKey.with('/path12'),
    });

    // Should still have only 1 consolidated permission
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Permission', 1);

    // Verify it's still the API-scoped permission
    template.hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::Join': ['', Match.arrayWith([':execute-api:', '/*/*/*'])],
      },
    });
  });

  test('different handlers maintain route-specific permissions', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    const handler1 = fooFunction(stack, 'Handler1');
    const handler2 = fooFunction(stack, 'Handler2');

    new HttpRoute(stack, 'Route1', {
      httpApi: api,
      integration: new HttpLambdaIntegration('Integration1', handler1),
      routeKey: HttpRouteKey.with('/foo'),
    });

    new HttpRoute(stack, 'Route2', {
      httpApi: api,
      integration: new HttpLambdaIntegration('Integration2', handler2),
      routeKey: HttpRouteKey.with('/bar'),
    });

    // Make sure we have two permissions -- one for each handler
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Permission', 2);

    template.hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::Join': ['', Match.arrayWith([':execute-api:', '/*/*/foo'])],
      },
    });

    template.hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::Join': ['', Match.arrayWith([':execute-api:', '/*/*/bar'])],
      },
    });
  });
});

function fooFunction(stack: Stack, id: string) {
  return new Function(stack, id, {
    code: Code.fromInline('foo'),
    runtime: lambda.Runtime.NODEJS_LATEST,
    handler: 'index.handler',
  });
}
