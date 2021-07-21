import '@aws-cdk/assert-internal/jest';
import { HttpApi, HttpMethod, HttpRoute, HttpRouteKey, VpcLink } from '@aws-cdk/aws-apigatewayv2';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { Stack } from '@aws-cdk/core';
import { HttpNlbIntegration } from '../../lib';

describe('HttpNlbIntegration', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'lb', { vpc });
    const listener = lb.addListener('listener', { port: 80 });
    listener.addTargets('target', { port: 80 });

    // WHEN
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new HttpNlbIntegration({
        listener,
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'HTTP_PROXY',
      ConnectionId: {
        Ref: 'HttpApiVpcLink159804837',
      },
      ConnectionType: 'VPC_LINK',
      IntegrationMethod: 'ANY',
      IntegrationUri: {
        Ref: 'lblistener657ADDEC',
      },
      PayloadFormatVersion: '1.0',
    });
  });

  test('able to add a custom vpcLink', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const vpcLink = new VpcLink(stack, 'VpcLink', { vpc });
    const lb = new elbv2.NetworkLoadBalancer(stack, 'lb', { vpc });
    const listener = lb.addListener('listener', { port: 80 });
    listener.addTargets('target', { port: 80 });

    // WHEN
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new HttpNlbIntegration({
        vpcLink,
        listener,
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'HTTP_PROXY',
      ConnectionId: {
        Ref: 'VpcLink42ED6FF0',
      },
      ConnectionType: 'VPC_LINK',
      IntegrationMethod: 'ANY',
      IntegrationUri: {
        Ref: 'lblistener657ADDEC',
      },
      PayloadFormatVersion: '1.0',
    });
  });

  test('method option is correctly recognized', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'lb', { vpc });
    const listener = lb.addListener('listener', { port: 80 });
    listener.addTargets('target', { port: 80 });

    // WHEN
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new HttpNlbIntegration({
        listener,
        method: HttpMethod.PATCH,
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      IntegrationMethod: 'PATCH',
    });
  });

  test('fails when imported NLB is used without specifying vpcLink', () => {
    const stack = new Stack();
    const listener = elbv2.NetworkListener.fromNetworkListenerArn(stack, 'Listener',
      'arn:aws:elasticloadbalancing:us-east-1:012345655:listener/net/myloadbalancer/lb-12345/listener-12345');
    const api = new HttpApi(stack, 'HttpApi');

    expect(() => new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new HttpNlbIntegration({
        listener,
      }),
      routeKey: HttpRouteKey.with('/pets'),
    })).toThrow(/vpcLink property must be specified/);
  });

  test('tlsConfig option is correctly recognized', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'lb', { vpc });
    const listener = lb.addListener('listener', { port: 80 });
    listener.addTargets('target', { port: 80 });

    // WHEN
    const api = new HttpApi(stack, 'HttpApi');
    new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new HttpNlbIntegration({
        listener,
        secureServerName: 'name-to-verify',
      }),
      routeKey: HttpRouteKey.with('/pets'),
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      TlsConfig: {
        ServerNameToVerify: 'name-to-verify',
      },
    });
  });
});
