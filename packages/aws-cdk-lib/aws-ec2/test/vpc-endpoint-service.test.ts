import * as elbv2 from '../../../aws-cdk-lib/aws-elasticloadbalancingv2';
import { Template } from '../../assertions';
import { ArnPrincipal } from '../../aws-iam';
import { Stack } from '../../core';

// eslint-disable-next-line max-len
import { IVpcEndpointServiceLoadBalancer, Vpc, VpcEndpointService } from '../lib';

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
  });
});
