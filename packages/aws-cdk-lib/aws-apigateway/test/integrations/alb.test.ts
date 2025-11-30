import { Template } from '../../../assertions';
import * as apigwv2 from '../../../aws-apigatewayv2';
import * as ec2 from '../../../aws-ec2';
import * as elbv2 from '../../../aws-elasticloadbalancingv2';
import * as cdk from '../../../core';
import * as apigateway from '../../lib';

describe('AlbIntegration', () => {
  test('minimal setup with ALB', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });

    const api = new apigateway.RestApi(stack, 'my-api');

    // WHEN
    const integ = new apigateway.AlbIntegration(alb);
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'HTTP_PROXY',
        IntegrationHttpMethod: 'GET',
        ConnectionType: 'VPC_LINK',
      },
    });

    // VPC Link V2 should be created
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::VpcLink', 1);
  });

  test('with existing VPC Link V2', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });

    const vpcLink = new apigwv2.VpcLink(stack, 'VpcLink', { vpc });
    const api = new apigateway.RestApi(stack, 'my-api');

    // WHEN
    const integ = new apigateway.AlbIntegration(alb, { vpcLink });
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'HTTP_PROXY',
        IntegrationHttpMethod: 'GET',
        ConnectionType: 'VPC_LINK',
        ConnectionId: {
          Ref: 'VpcLink42ED6FF0',
        },
      },
    });

    // Only one VPC Link should exist (the one we created)
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::VpcLink', 1);
  });

  test('proxy mode can be disabled', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });

    const api = new apigateway.RestApi(stack, 'my-api');

    // WHEN
    const integ = new apigateway.AlbIntegration(alb, { proxy: false });
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'HTTP',
      },
    });
  });

  test('custom HTTP method can be specified', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });

    const api = new apigateway.RestApi(stack, 'my-api');

    // WHEN
    const integ = new apigateway.AlbIntegration(alb, { httpMethod: 'POST' });
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      Integration: {
        IntegrationHttpMethod: 'POST',
      },
    });
  });

  test('VPC Link is reused when the same ALB is used for multiple methods', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });

    const api = new apigateway.RestApi(stack, 'my-api');

    // WHEN
    const integ1 = new apigateway.AlbIntegration(alb);
    const integ2 = new apigateway.AlbIntegration(alb);
    api.root.addMethod('GET', integ1);
    api.root.addMethod('POST', integ2);

    // THEN - Only one VPC Link should be created (reused)
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::VpcLink', 1);
  });

  test('integration options are passed through', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });

    const api = new apigateway.RestApi(stack, 'my-api');

    // WHEN
    const integ = new apigateway.AlbIntegration(alb, {
      options: {
        timeout: cdk.Duration.seconds(10),
        cacheKeyParameters: ['method.request.querystring.foo'],
      },
    });
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        TimeoutInMillis: 10000,
        CacheKeyParameters: ['method.request.querystring.foo'],
      },
    });
  });

  test('throws error when using imported ALB without VPC Link', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const importedAlb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ImportedALB', {
      loadBalancerArn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-alb/50dc6c495c0c9188',
      securityGroupId: 'sg-12345678',
    });

    const api = new apigateway.RestApi(stack, 'my-api');
    const integ = new apigateway.AlbIntegration(importedAlb);

    // WHEN/THEN
    expect(() => {
      api.root.addMethod('GET', integ);
    }).toThrow(/The vpcLink property must be specified when using an imported Application Load Balancer/);
  });

  test('imported ALB works with VPC Link', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const importedAlb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ImportedALB', {
      loadBalancerArn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-alb/50dc6c495c0c9188',
      securityGroupId: 'sg-12345678',
      loadBalancerDnsName: 'my-alb-123456789.us-east-1.elb.amazonaws.com',
    });
    const vpcLink = new apigwv2.VpcLink(stack, 'VpcLink', { vpc });

    const api = new apigateway.RestApi(stack, 'my-api');

    // WHEN
    const integ = new apigateway.AlbIntegration(importedAlb, { vpcLink });
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'HTTP_PROXY',
        ConnectionType: 'VPC_LINK',
        ConnectionId: {
          Ref: 'VpcLink42ED6FF0',
        },
        IntegrationTarget: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-alb/50dc6c495c0c9188',
      },
    });
  });

  test('integration target is set to load balancer ARN', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });

    const api = new apigateway.RestApi(stack, 'my-api');

    // WHEN
    const integ = new apigateway.AlbIntegration(alb);
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        IntegrationTarget: {
          Ref: 'ALBAEE750D2',
        },
      },
    });
  });

  test('uses ALB DNS name for URI', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });

    const api = new apigateway.RestApi(stack, 'my-api');

    // WHEN
    const integ = new apigateway.AlbIntegration(alb);
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Uri: {
          'Fn::Join': [
            '',
            [
              'http://',
              {
                'Fn::GetAtt': ['ALBAEE750D2', 'DNSName'],
              },
            ],
          ],
        },
      },
    });
  });
});
