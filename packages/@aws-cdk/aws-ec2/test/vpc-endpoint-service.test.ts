import { Template } from '@aws-cdk/assertions';
import { ArnPrincipal } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';

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

    test('with acceptance requried', () => {
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
  });
});
