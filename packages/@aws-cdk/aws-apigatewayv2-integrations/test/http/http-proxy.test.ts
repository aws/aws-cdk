import { Template } from '@aws-cdk/assertions';
import { HttpApi, HttpIntegration, HttpIntegrationType, HttpMethod, HttpRoute, HttpRouteKey, MappingValue, ParameterMapping, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2';
import { Stack } from '@aws-cdk/core';
import { HttpUrlIntegration } from '../../lib';

describe('HttpProxyIntegration', () => {
  test('default', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'HttpProxyRoute', {
      httpApi: api,
      integration: new HttpUrlIntegration('Integration', 'some-target-url'),
      routeKey: HttpRouteKey.with('/pets'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
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
      integration: new HttpUrlIntegration('Integration', 'some-target-url', { method: HttpMethod.PATCH }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationMethod: 'PATCH',
    });
  });

  test('custom payload format version is allowed', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    new HttpIntegration(stack, 'HttpInteg', {
      payloadFormatVersion: PayloadFormatVersion.custom('99.99'),
      httpApi: api,
      integrationType: HttpIntegrationType.HTTP_PROXY,
      integrationUri: 'some-target-url',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'HTTP_PROXY',
      IntegrationUri: 'some-target-url',
      PayloadFormatVersion: '99.99',
    });
  });

  test('HttpIntegration without payloadFormatVersion is allowed', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    new HttpIntegration(stack, 'HttpInteg', {
      httpApi: api,
      integrationType: HttpIntegrationType.HTTP_PROXY,
      integrationUri: 'some-target-url',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'HTTP_PROXY',
      IntegrationUri: 'some-target-url',
    });
  });

  test('parameterMapping is correctly recognized', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    new HttpIntegration(stack, 'HttpInteg', {
      httpApi: api,
      integrationType: HttpIntegrationType.HTTP_PROXY,
      integrationUri: 'some-target-url',
      parameterMapping: new ParameterMapping()
        .appendHeader('header2', MappingValue.requestHeader('header1'))
        .removeHeader('header1'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'HTTP_PROXY',
      IntegrationUri: 'some-target-url',
      RequestParameters: {
        'append:header.header2': '$request.header.header1',
        'remove:header.header1': '',
      },
    });
  });
});
