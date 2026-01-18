import { Template } from '../../../assertions';
import * as apigwv2 from '../../../aws-apigatewayv2';
import * as ec2 from '../../../aws-ec2';
import * as elbv2 from '../../../aws-elasticloadbalancingv2';
import { HttpMethod } from '../../../aws-events';
import * as cdk from '../../../core';
import * as apigateway from '../../lib';

describe('AlbIntegration', () => {
  test('minimal setup with ALB', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });

    const api = new apigateway.RestApi(stack, 'Api');

    // WHEN
    const integ = new apigateway.AlbIntegration(alb);
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: HttpMethod.GET,
      Integration: {
        Type: 'HTTP_PROXY',
        IntegrationHttpMethod: 'GET',
        ConnectionType: 'VPC_LINK',
        ConnectionId: {
          Ref: 'ApiVpcLinkVpcF5DC0392',
        },
        IntegrationTarget: {
          Ref: 'Alb16C2F182',
        },
        Uri: {
          'Fn::Join': [
            '',
            [
              'http://',
              {
                'Fn::GetAtt': ['Alb16C2F182', 'DNSName'],
              },
            ],
          ],
        },
      },
    });

    // VPC Link V2 should be created
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::VpcLink', {
      Name: 'ApiVpcLinkVpc1D6FAC02',
      SecurityGroupIds: [],
    });
  });

  test('with existing VPC Link V2', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });

    const vpcLink = new apigwv2.VpcLink(stack, 'VpcLink', { vpc });
    const api = new apigateway.RestApi(stack, 'Api');

    // WHEN
    const integ = new apigateway.AlbIntegration(alb, { vpcLink });
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: HttpMethod.GET,
      Integration: {
        Type: 'HTTP_PROXY',
        IntegrationHttpMethod: 'GET',
        ConnectionType: 'VPC_LINK',
        ConnectionId: {
          Ref: 'VpcLink42ED6FF0',
        },
        IntegrationTarget: {
          Ref: 'Alb16C2F182',
        },
        Uri: {
          'Fn::Join': [
            '',
            [
              'http://',
              {
                'Fn::GetAtt': ['Alb16C2F182', 'DNSName'],
              },
            ],
          ],
        },
      },
    });

    // Only one VPC Link should exist (the one we created)
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::VpcLink', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::VpcLink', {
      Name: 'VpcLink',
      SecurityGroupIds: [],
    });
  });

  test('proxy mode can be disabled', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });

    const api = new apigateway.RestApi(stack, 'Api');

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
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });

    const api = new apigateway.RestApi(stack, 'Api');

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

  test('VPC Link is reused when multiple ALBs are integrated to the same apigateway', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb1 = new elbv2.ApplicationLoadBalancer(stack, 'Alb1', { vpc });
    const alb2 = new elbv2.ApplicationLoadBalancer(stack, 'Alb2', { vpc });

    const api = new apigateway.RestApi(stack, 'Api');

    // WHEN
    const integ1 = new apigateway.AlbIntegration(alb1);
    const integ2 = new apigateway.AlbIntegration(alb2);
    api.root.addMethod('GET', integ1);
    api.root.addMethod('POST', integ2);

    // THEN - Only one VPC Link should be created (reused)
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::VpcLink', 1);
  });

  test('integration options are passed through', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', { vpc });

    const api = new apigateway.RestApi(stack, 'Api');

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

  describe('imported ALB', () => {
    test('throws error when vpc is not available', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const importedAlb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ImportedALB', {
        loadBalancerArn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-alb/50dc6c495c0c9188',
        securityGroupId: 'sg-12345678',
      });

      const api = new apigateway.RestApi(stack, 'Api');
      const integ = new apigateway.AlbIntegration(importedAlb);

      // WHEN/THEN
      expect(() => {
        api.root.addMethod('GET', integ);
      }).toThrow('Cannot determine VPC from the imported Application Load Balancer. Specify the vpc property when importing the ALB, or provide a vpcLink to AlbIntegration.');
    });

    test('works with vpcLink provided to AlbIntegration', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const importedAlb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ImportedALB', {
        loadBalancerArn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-alb/50dc6c495c0c9188',
        securityGroupId: 'sg-12345678',
        loadBalancerDnsName: 'my-alb-123456789.us-east-1.elb.amazonaws.com',
      });
      const vpcLink = new apigwv2.VpcLink(stack, 'VpcLink', { vpc });

      const api = new apigateway.RestApi(stack, 'Api');

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

    test('works with vpc property specified during import', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const importedAlb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ImportedALB', {
        loadBalancerArn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-alb/50dc6c495c0c9188',
        securityGroupId: 'sg-12345678',
        loadBalancerDnsName: 'my-alb-123456789.us-east-1.elb.amazonaws.com',
        vpc,
      });

      const api = new apigateway.RestApi(stack, 'Api');

      // WHEN
      const integ = new apigateway.AlbIntegration(importedAlb);
      api.root.addMethod('GET', integ);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
        Integration: {
          Type: 'HTTP_PROXY',
          ConnectionType: 'VPC_LINK',
          IntegrationTarget: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-alb/50dc6c495c0c9188',
          Uri: 'http://my-alb-123456789.us-east-1.elb.amazonaws.com',
        },
      });

      // VPC Link should be automatically created
      Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::VpcLink', 1);
    });
  });
});
