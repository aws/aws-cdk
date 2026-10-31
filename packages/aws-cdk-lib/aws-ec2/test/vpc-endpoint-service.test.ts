import { Template } from '../../assertions';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import { ArnPrincipal } from '../../aws-iam';
import type { CfnResource } from '../../core';
import { RemovalPolicy, Stack } from '../../core';

import type { IVpcEndpointServiceLoadBalancer } from '../lib';
import { IpAddressType, Vpc, VpcEndpointService } from '../lib';

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
  test.each([RemovalPolicy.RETAIN, RemovalPolicy.DESTROY])('applies removal policy %s to the endpoint service', policy => {
    const stack = new Stack();
    const service = new VpcEndpointService(stack, 'EndpointService', {
      vpcEndpointServiceLoadBalancers: [new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a')],
    });
    const resource = service.node.defaultChild as CfnResource;
    expect(resource).toBe(service.node.findChild('EndpointService'));
    const logicalId = stack.getLogicalId(resource);
    service.applyRemovalPolicy(policy);
    const resources = Template.fromStack(stack).findResources('AWS::EC2::VPCEndpointService');
    expect(Object.keys(resources)).toEqual([logicalId]);
    expect(logicalId).toBe('EndpointServiceED36BE1F');
    Template.fromStack(stack).hasResource('AWS::EC2::VPCEndpointService', {
      DeletionPolicy: policy === RemovalPolicy.RETAIN ? 'Retain' : 'Delete',
      UpdateReplacePolicy: policy === RemovalPolicy.RETAIN ? 'Retain' : 'Delete',
    });
  });

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

    test('without specifying allowed regions', () => {
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

      // Verify SupportedRegions is not present when not specified
      const template = Template.fromStack(stack);
      const resources = template.findResources('AWS::EC2::VPCEndpointService');
      const resourceKey = Object.keys(resources)[0];
      expect(resources[resourceKey].Properties.SupportedRegions).toBeUndefined();
    });

    test('with a single allowed region', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: false,
        allowedRegions: ['us-east-1'],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: false,
        SupportedRegions: ['us-east-1'],
      });
    });

    test('with multiple allowed regions', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: false,
        allowedRegions: ['us-east-1', 'us-west-1', 'eu-west-1'],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: false,
        SupportedRegions: ['us-east-1', 'us-west-1', 'eu-west-1'],
      });
    });

    test('with combined options including allowed regions', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: true,
        allowedRegions: ['us-east-1', 'us-west-2'],
        supportedIpAddressTypes: [IpAddressType.IPV4],
        contributorInsights: true,
        allowedPrincipals: [new ArnPrincipal('arn:aws:iam::123456789012:root')],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: true,
        SupportedRegions: ['us-east-1', 'us-west-2'],
        SupportedIpAddressTypes: ['ipv4'],
        ContributorInsightsEnabled: true,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointServicePermissions', {
        ServiceId: {
          Ref: 'EndpointServiceED36BE1F',
        },
        AllowedPrincipals: ['arn:aws:iam::123456789012:root'],
      });
    });
  });
});
