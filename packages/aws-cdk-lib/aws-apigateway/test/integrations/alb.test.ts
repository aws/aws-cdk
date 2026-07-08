import { Construct } from 'constructs';
import { Match, Template } from '../../../assertions';
import * as apigwv2 from '../../../aws-apigatewayv2';
import * as ec2 from '../../../aws-ec2';
import * as elbv2 from '../../../aws-elasticloadbalancingv2';
import * as cdk from '../../../core';
import * as apigateway from '../../lib';

describe('AlbIntegration', () => {
  test('minimal setup with concrete listener auto-creates VPC link, security group, and listener ingress', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });
    const listener = alb.addListener('Listener', { port: 80, open: false });
    listener.addAction('Default', {
      action: elbv2.ListenerAction.fixedResponse(200),
    });

    const api = new apigateway.RestApi(stack, 'Api');

    // WHEN
    const integ = new apigateway.AlbIntegration(listener);
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      Integration: {
        Type: 'HTTP_PROXY',
        IntegrationHttpMethod: 'GET',
        ConnectionType: 'VPC_LINK',
        ConnectionId: { Ref: 'ApiVpcLinkc8fd940acb9a3f95ad0e87fb4c3a2482b1900ba1755BD81F6F' },
        IntegrationTarget: { Ref: 'Alb16C2F182' },
        Uri: {
          'Fn::Join': [
            '',
            [
              'http://',
              { 'Fn::GetAtt': ['Alb16C2F182', 'DNSName'] },
              ':80',
            ],
          ],
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::VpcLink', {
      SecurityGroupIds: [
        { 'Fn::GetAtt': ['ApiVpcLinkSgc8fd940acb9a3f95ad0e87fb4c3a2482b1900ba175E55A2949', 'GroupId'] },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
      IpProtocol: 'tcp',
      FromPort: 80,
      ToPort: 80,
      GroupId: { 'Fn::GetAtt': ['AlbSecurityGroup580F65A6', 'GroupId'] },
      SourceSecurityGroupId: { 'Fn::GetAtt': ['ApiVpcLinkSgc8fd940acb9a3f95ad0e87fb4c3a2482b1900ba175E55A2949', 'GroupId'] },
    });
  });

  test('with existing VPC Link skips auto security group wiring', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });
    const listener = alb.addListener('Listener', { port: 80, open: false });
    listener.addAction('Default', {
      action: elbv2.ListenerAction.fixedResponse(200),
    });

    const vpcLink = new apigwv2.VpcLink(stack, 'VpcLink', { vpc });
    const api = new apigateway.RestApi(stack, 'Api');

    // WHEN
    const integ = new apigateway.AlbIntegration(listener, { vpcLink });
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        ConnectionId: { Ref: 'VpcLink42ED6FF0' },
        IntegrationTarget: { Ref: 'Alb16C2F182' },
      },
    });

    // Only the user-provided VPC Link exists; no auto-created one.
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::VpcLink', 1);

    // No SecurityGroupIngress should be created on the ALB SG since vpcLink was user-supplied.
    Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 0);
  });

  test('proxy mode can be disabled', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });
    const listener = alb.addListener('Listener', { port: 80, open: false });
    listener.addAction('Default', {
      action: elbv2.ListenerAction.fixedResponse(200),
    });

    const api = new apigateway.RestApi(stack, 'Api');

    // WHEN
    const integ = new apigateway.AlbIntegration(listener, { proxy: false });
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: { Type: 'HTTP' },
    });
  });

  test('custom HTTP method can be specified', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });
    const listener = alb.addListener('Listener', { port: 80, open: false });
    listener.addAction('Default', {
      action: elbv2.ListenerAction.fixedResponse(200),
    });

    const api = new apigateway.RestApi(stack, 'Api');

    // WHEN
    const integ = new apigateway.AlbIntegration(listener, { httpMethod: 'POST' });
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      Integration: { IntegrationHttpMethod: 'POST' },
    });
  });

  test('VPC Link and security group are reused across listeners in the same VPC', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb1 = new elbv2.ApplicationLoadBalancer(stack, 'Alb1', { vpc });
    const alb2 = new elbv2.ApplicationLoadBalancer(stack, 'Alb2', { vpc });
    const listener1 = alb1.addListener('Listener', { port: 80, open: false });
    listener1.addAction('Default', { action: elbv2.ListenerAction.fixedResponse(200) });
    const listener2 = alb2.addListener('Listener', { port: 80, open: false });
    listener2.addAction('Default', { action: elbv2.ListenerAction.fixedResponse(200) });

    const api = new apigateway.RestApi(stack, 'Api');

    // WHEN
    api.root.addMethod('GET', new apigateway.AlbIntegration(listener1));
    api.root.addMethod('POST', new apigateway.AlbIntegration(listener2));

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::VpcLink', 1);
    // Same auto-SG is reused across both integrations.
    Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroup', 1 + 2); // 1 VpcLink SG + 1 SG per ALB
    // One ingress rule per ALB listener.
    Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 2);
  });

  test('VPC Link and security group are not reused across different VPCs sharing a construct id', () => {
    // GIVEN - two VPCs in different scopes, both with the local construct id 'Vpc'
    const stack = new cdk.Stack();
    const vpc1 = new ec2.Vpc(new Construct(stack, 'Scope1'), 'Vpc');
    const vpc2 = new ec2.Vpc(new Construct(stack, 'Scope2'), 'Vpc');
    const alb1 = new elbv2.ApplicationLoadBalancer(stack, 'Alb1', { vpc: vpc1 });
    const alb2 = new elbv2.ApplicationLoadBalancer(stack, 'Alb2', { vpc: vpc2 });
    const listener1 = alb1.addListener('Listener', { port: 80, open: false });
    listener1.addAction('Default', { action: elbv2.ListenerAction.fixedResponse(200) });
    const listener2 = alb2.addListener('Listener', { port: 80, open: false });
    listener2.addAction('Default', { action: elbv2.ListenerAction.fixedResponse(200) });

    const api = new apigateway.RestApi(stack, 'Api');

    // WHEN
    api.root.addMethod('GET', new apigateway.AlbIntegration(listener1));
    api.root.addMethod('POST', new apigateway.AlbIntegration(listener2));

    // THEN - a dedicated VPC Link and security group per VPC, each scoped to its own VPC.
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::VpcLink', 2);
    Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroup', 2 + 2); // 1 VpcLink SG per VPC + 1 SG per ALB

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Automatic security group for API Gateway VPC Link',
      VpcId: { Ref: 'Scope1Vpc77A7F8AD' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Automatic security group for API Gateway VPC Link',
      VpcId: { Ref: 'Scope2Vpc7DB58442' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::VpcLink', {
      SecurityGroupIds: [
        { 'Fn::GetAtt': ['ApiVpcLinkSgc8e25fc2fc6fa933d3d982cec77d6102a544a53e41036DBE87', 'GroupId'] },
      ],
      SubnetIds: [
        { Ref: 'Scope1VpcPrivateSubnet1SubnetF9D63A69' },
        { Ref: 'Scope1VpcPrivateSubnet2SubnetBFD1CE1D' },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::VpcLink', {
      SecurityGroupIds: [
        { 'Fn::GetAtt': ['ApiVpcLinkSgc8461cc2baba5b58933b430cf55b61157e54c75f48925AABA9', 'GroupId'] },
      ],
      SubnetIds: [
        { Ref: 'Scope2VpcPrivateSubnet1Subnet2FEA74AC' },
        { Ref: 'Scope2VpcPrivateSubnet2SubnetD7F79BA0' },
      ],
    });
  });

  test('integration options are passed through', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });
    const listener = alb.addListener('Listener', { port: 80, open: false });
    listener.addAction('Default', { action: elbv2.ListenerAction.fixedResponse(200) });

    const api = new apigateway.RestApi(stack, 'Api');

    // WHEN
    api.root.addMethod('GET', new apigateway.AlbIntegration(listener, {
      options: {
        timeout: cdk.Duration.seconds(10),
        cacheKeyParameters: ['method.request.querystring.foo'],
      },
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        TimeoutInMillis: 10000,
        CacheKeyParameters: ['method.request.querystring.foo'],
      },
    });
  });

  test('HTTPS listener picks https scheme automatically', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });
    const listener = alb.addListener('Listener', {
      port: 443,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      open: false,
      defaultAction: elbv2.ListenerAction.fixedResponse(200),
      certificates: [{ certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/abc' }],
    });

    const api = new apigateway.RestApi(stack, 'Api');

    // WHEN
    api.root.addMethod('GET', new apigateway.AlbIntegration(listener));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Uri: {
          'Fn::Join': [
            '',
            [
              'https://',
              { 'Fn::GetAtt': ['Alb16C2F182', 'DNSName'] },
              ':443',
            ],
          ],
        },
      },
    });
  });

  test('explicit protocol overrides listener-derived scheme', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });
    const listener = alb.addListener('Listener', { port: 80, open: false });
    listener.addAction('Default', { action: elbv2.ListenerAction.fixedResponse(200) });

    const api = new apigateway.RestApi(stack, 'Api');

    // WHEN
    api.root.addMethod('GET', new apigateway.AlbIntegration(listener, {
      protocol: apigateway.AlbIntegrationProtocol.HTTPS,
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Uri: { 'Fn::Join': ['', ['https://', Match.anyValue(), ':80']] },
      },
    });
  });

  test('non-default port is included in the URI', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });
    const listener = alb.addListener('Listener', { port: 8080, open: false });
    listener.addAction('Default', { action: elbv2.ListenerAction.fixedResponse(200) });

    const api = new apigateway.RestApi(stack, 'Api');

    // WHEN
    api.root.addMethod('GET', new apigateway.AlbIntegration(listener));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Uri: { 'Fn::Join': ['', ['http://', Match.anyValue(), ':8080']] },
      },
    });
  });

  describe('concrete listener rejects redundant props', () => {
    test('fails when loadBalancerArn is supplied alongside a concrete listener', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });
      const listener = alb.addListener('Listener', { port: 80, open: false });
      listener.addAction('Default', { action: elbv2.ListenerAction.fixedResponse(200) });

      const api = new apigateway.RestApi(stack, 'Api');
      const integ = new apigateway.AlbIntegration(listener, {
        loadBalancerArn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/other/abc',
      });

      // WHEN/THEN
      expect(() => api.root.addMethod('GET', integ))
        .toThrow('loadBalancerArn must not be specified when the Application Listener is created in the same CDK app; the value is derived from the listener');
    });

    test('loadBalancerDnsName override is honored on a concrete listener (e.g. Route53 alias for cert alignment)', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });
      const listener = alb.addListener('Listener', { port: 80, open: false });
      listener.addAction('Default', { action: elbv2.ListenerAction.fixedResponse(200) });

      const api = new apigateway.RestApi(stack, 'Api');

      // WHEN
      api.root.addMethod('GET', new apigateway.AlbIntegration(listener, {
        loadBalancerDnsName: 'alias.example.com',
      }));

      // THEN — URI uses the override, but integrationTarget still resolves from the concrete listener's ALB.
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
        Integration: {
          IntegrationTarget: { Ref: 'Alb16C2F182' },
          Uri: 'http://alias.example.com:80',
        },
      });
    });

    test('fails when port is supplied alongside a concrete listener', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });
      const listener = alb.addListener('Listener', { port: 80, open: false });
      listener.addAction('Default', { action: elbv2.ListenerAction.fixedResponse(200) });

      const api = new apigateway.RestApi(stack, 'Api');
      const integ = new apigateway.AlbIntegration(listener, {
        port: 8080,
      });

      // WHEN/THEN
      expect(() => api.root.addMethod('GET', integ))
        .toThrow('port must not be specified when the Application Listener is created in the same CDK app; the value is derived from the listener');
    });
  });

  describe('imported listener', () => {
    const LISTENER_ARN = 'arn:aws:elasticloadbalancing:us-east-1:123456789012:listener/app/my-alb/50dc6c495c0c9188/abc';
    const ALB_ARN = 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-alb/50dc6c495c0c9188';

    test('fails when loadBalancerArn is missing', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const vpcLink = new apigwv2.VpcLink(stack, 'VpcLink', { vpc });
      const importedListener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'ImportedListener', {
        listenerArn: LISTENER_ARN,
        securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'ImportedListenerSg', 'sg-12345678'),
        defaultPort: 80,
      });

      const api = new apigateway.RestApi(stack, 'Api');
      const integ = new apigateway.AlbIntegration(importedListener, {
        vpcLink,
        loadBalancerDnsName: 'my-alb.example.com',
        port: 80,
      });

      // WHEN/THEN
      expect(() => api.root.addMethod('GET', integ))
        .toThrow('loadBalancerArn must be specified when using an imported Application Listener');
    });

    test('fails when loadBalancerDnsName is missing', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const vpcLink = new apigwv2.VpcLink(stack, 'VpcLink', { vpc });
      const importedListener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'ImportedListener', {
        listenerArn: LISTENER_ARN,
        securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'ImportedListenerSg', 'sg-12345678'),
        defaultPort: 80,
      });

      const api = new apigateway.RestApi(stack, 'Api');
      const integ = new apigateway.AlbIntegration(importedListener, {
        vpcLink,
        loadBalancerArn: ALB_ARN,
        port: 80,
      });

      // WHEN/THEN
      expect(() => api.root.addMethod('GET', integ))
        .toThrow('loadBalancerDnsName must be specified when using an imported Application Listener');
    });

    test('fails when port is missing', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const vpcLink = new apigwv2.VpcLink(stack, 'VpcLink', { vpc });
      const importedListener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'ImportedListener', {
        listenerArn: LISTENER_ARN,
        securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'ImportedListenerSg', 'sg-12345678'),
      });

      const api = new apigateway.RestApi(stack, 'Api');
      const integ = new apigateway.AlbIntegration(importedListener, {
        vpcLink,
        loadBalancerArn: ALB_ARN,
        loadBalancerDnsName: 'my-alb.example.com',
      });

      // WHEN/THEN
      expect(() => api.root.addMethod('GET', integ))
        .toThrow('port must be specified when using an imported Application Listener');
    });

    test('fails when vpcLink is missing', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const importedListener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'ImportedListener', {
        listenerArn: LISTENER_ARN,
        securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'ImportedListenerSg', 'sg-12345678'),
      });

      const api = new apigateway.RestApi(stack, 'Api');
      const integ = new apigateway.AlbIntegration(importedListener, {
        loadBalancerArn: ALB_ARN,
        loadBalancerDnsName: 'my-alb.example.com',
        port: 80,
      });

      // WHEN/THEN
      expect(() => api.root.addMethod('GET', integ))
        .toThrow('Cannot determine VPC from the imported Application Listener. Provide vpcLink to AlbIntegration.');
    });

    test('works with all required props supplied', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const vpcLink = new apigwv2.VpcLink(stack, 'VpcLink', { vpc });
      const importedListener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'ImportedListener', {
        listenerArn: LISTENER_ARN,
        securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'ImportedListenerSg', 'sg-12345678'),
      });

      const api = new apigateway.RestApi(stack, 'Api');

      // WHEN
      api.root.addMethod('GET', new apigateway.AlbIntegration(importedListener, {
        vpcLink,
        loadBalancerArn: ALB_ARN,
        loadBalancerDnsName: 'my-alb.example.com',
        port: 80,
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
        Integration: {
          Type: 'HTTP_PROXY',
          ConnectionType: 'VPC_LINK',
          ConnectionId: { Ref: 'VpcLink42ED6FF0' },
          IntegrationTarget: ALB_ARN,
          Uri: 'http://my-alb.example.com:80',
        },
      });
    });
  });
});
