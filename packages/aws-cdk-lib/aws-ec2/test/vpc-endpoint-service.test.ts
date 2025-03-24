import * as elbv2 from '../../../aws-cdk-lib/aws-elasticloadbalancingv2';
import { Template } from '../../assertions';
import { ArnPrincipal } from '../../aws-iam';
import { Stack } from '../../core';

// eslint-disable-next-line max-len
import { IpAddressType, IVpcEndpointServiceLoadBalancer, Vpc, VpcEndpointService } from '../lib';

/**
 * A load balancer that can host a VPC Endpoint Service
 */
class DummyEndpointLoadBalacer implements IVpcEndpointServiceLoadBalancer {
  /**
   * The ARN of the load balancer that hosts the VPC Endpoint Service
   */
  public readonly loadBalancerArn: string;
  constructor(arn: string) {
    this.loadBalancerArn = arn;
  }
}

describe('vpc endpoint service', () => {
  describe('test vpc endpoint service', () => {
    test('create endpoint service with no principals', () => {
      // GIVEN
      const stack = new Stack();
      new Vpc(stack, 'MyVPC');

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: false,
        allowedPrincipals: [new ArnPrincipal('arn:aws:iam::123456789012:root')],
      });
      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: false,
      });

      const servicePermissions = Template.fromStack(stack).findResources('AWS::EC2::VPCEndpointServicePermissions', {
        ServiceId: {
          Ref: 'EndpointServiceED36BE1F',
        },
        AllowedPrincipals: [],
      });
      expect(Object.keys(servicePermissions).length).toBe(0);
    });
    test('create endpoint service with a principal', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: false,
        allowedPrincipals: [new ArnPrincipal('arn:aws:iam::123456789012:root')],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: false,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointServicePermissions', {
        ServiceId: {
          Ref: 'EndpointServiceED36BE1F',
        },
        AllowedPrincipals: ['arn:aws:iam::123456789012:root'],
      });
    });

    test('create endpoint service with a service principal (workaround)', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: false,
        allowedPrincipals: [new ArnPrincipal('ec2.amazonaws.com')],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: false,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointServicePermissions', {
        ServiceId: {
          Ref: 'EndpointServiceED36BE1F',
        },
        AllowedPrincipals: ['ec2.amazonaws.com'],
      });
    });

    test('with acceptance required', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: true,
        allowedPrincipals: [new ArnPrincipal('arn:aws:iam::123456789012:root')],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: true,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointServicePermissions', {
        ServiceId: {
          Ref: 'EndpointServiceED36BE1F',
        },
        AllowedPrincipals: ['arn:aws:iam::123456789012:root'],
      });
    });

    test('with contributor insights enabled', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'MyVPC');

      // WHEN
      const lb = new elbv2.NetworkLoadBalancer(stack, 'NLB', { vpc });
      new VpcEndpointService(stack, 'VpcEndpointService', {
        vpcEndpointServiceLoadBalancers: [{
          loadBalancerArn: lb.loadBalancerArn,
        }],
        acceptanceRequired: true,
        contributorInsights: true,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
        ContributorInsightsEnabled: true,
      });
    });

    test('without specifying supported IP address types', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: false,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: false,
      });

      // Verify SupportedIpAddressTypes is not present when not specified
      const template = Template.fromStack(stack);
      const resources = template.findResources('AWS::EC2::VPCEndpointService');
      const resourceKey = Object.keys(resources)[0];
      expect(resources[resourceKey].Properties.SupportedIpAddressTypes).toBeUndefined();
    });

    test('with IPv4 supported IP address type', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: false,
        supportedIpAddressTypes: [IpAddressType.IPV4],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: false,
        SupportedIpAddressTypes: ['ipv4'],
      });
    });

    test('with IPv6 supported IP address type', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: false,
        supportedIpAddressTypes: [IpAddressType.IPV6],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: false,
        SupportedIpAddressTypes: ['ipv6'],
      });
    });

    test('with both IPv4 and IPv6 supported IP address types', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: false,
        supportedIpAddressTypes: [IpAddressType.IPV4, IpAddressType.IPV6],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: false,
        SupportedIpAddressTypes: ['ipv4', 'ipv6'],
      });
    });
  });
});
