import { Template } from '@aws-cdk/assertions';
import { HttpApi, HttpMethod, HttpRoute, HttpRouteKey, MappingValue, ParameterMapping, VpcLink } from '@aws-cdk/aws-apigatewayv2';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as servicediscovery from '@aws-cdk/aws-servicediscovery';
import { Stack } from '@aws-cdk/core';
import { HttpServiceDiscoveryIntegration } from '../../lib';

describe('HttpServiceDiscoveryIntegration', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const vpcLink = new VpcLink(stack, 'VpcLink', { vpc });
    const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'Namespace', {
      name: 'foobar.com',
      vpc,
    });
    const service = namespace.createService('Service');

    // WHEN
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new HttpServiceDiscoveryIntegration('Integration', service, { vpcLink }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'HTTP_PROXY',
      ConnectionId: {
        Ref: 'VpcLink42ED6FF0',
      },
      ConnectionType: 'VPC_LINK',
      IntegrationMethod: 'ANY',
      IntegrationUri: {
        'Fn::GetAtt': [
          'NamespaceServiceCABDF534',
          'Arn',
        ],
      },
      PayloadFormatVersion: '1.0',
    });
  });

  test('method option is correctly recognized', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const vpcLink = new VpcLink(stack, 'VpcLink', { vpc });
    const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'Namespace', {
      name: 'foobar.com',
      vpc,
    });
    const service = namespace.createService('Service');

    // WHEN
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new HttpServiceDiscoveryIntegration('Integration', service, {
        vpcLink,
        method: HttpMethod.PATCH,
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationMethod: 'PATCH',
    });
  });

  test('fails if vpcLink is not specified', () => {
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'Namespace', {
      name: 'foobar.com',
      vpc,
    });
    const service = namespace.createService('Service');
    const api = new HttpApi(stack, 'HttpApi');

    expect(() => new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new HttpServiceDiscoveryIntegration('Integration', service, { method: HttpMethod.PATCH }),
      routeKey: HttpRouteKey.with('/pets'),
    })).toThrow(/vpcLink property is mandatory/);
  });

  test('tlsConfig option is correctly recognized', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const vpcLink = new VpcLink(stack, 'VpcLink', { vpc });
    const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'Namespace', {
      name: 'foobar.com',
      vpc,
    });
    const service = namespace.createService('Service');

    // WHEN
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new HttpServiceDiscoveryIntegration('Integration', service, {
        vpcLink,
        secureServerName: 'name-to-verify',
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      TlsConfig: {
        ServerNameToVerify: 'name-to-verify',
      },
    });
  });

  test('parameterMapping option is correctly recognized', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const vpcLink = new VpcLink(stack, 'VpcLink', { vpc });
    const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'Namespace', {
      name: 'foobar.com',
      vpc,
    });
    const service = namespace.createService('Service');

    // WHEN
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new HttpServiceDiscoveryIntegration('Integration', service, {
        vpcLink,
        parameterMapping: new ParameterMapping()
          .appendHeader('header2', MappingValue.requestHeader('header1'))
          .removeHeader('header1'),
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      RequestParameters: {
        'append:header.header2': '$request.header.header1',
        'remove:header.header1': '',
      },
    });
  });
});
