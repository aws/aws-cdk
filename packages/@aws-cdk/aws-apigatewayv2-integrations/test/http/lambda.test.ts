import { Match, Template } from '@aws-cdk/assertions';
import { HttpApi, HttpRoute, HttpRouteKey, MappingValue, ParameterMapping, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { HttpLambdaIntegration } from '../../lib';

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

  test('multiple routes for the same lambda integration', () => {
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

    // Make sure we have two permissions -- one for each method -- but a single integration
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::Join': ['', Match.arrayWith([':execute-api:', '/*/*/foo'])],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::Join': ['', Match.arrayWith([':execute-api:', '/*/*/bar'])],
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::Integration', 1);
  });
});

function fooFunction(stack: Stack, id: string) {
  return new Function(stack, id, {
    code: Code.fromInline('foo'),
    runtime: Runtime.NODEJS_14_X,
    handler: 'index.handler',
  });
}