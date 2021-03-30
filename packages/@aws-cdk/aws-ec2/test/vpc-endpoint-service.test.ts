import { expect, haveResource } from '@aws-cdk/assert-internal';
import { ArnPrincipal } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';

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

nodeunitShim({
  'test vpc endpoint service': {
    'create endpoint service with no principals'(test: Test) {
      // GIVEN
      const stack = new Stack();
      new Vpc(stack, 'MyVPC');

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: false,
        whitelistedPrincipals: [new ArnPrincipal('arn:aws:iam::123456789012:root')],
      });
      // THEN
      expect(stack).to(haveResource('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: false,
      }));

      expect(stack).notTo(haveResource('AWS::EC2::VPCEndpointServicePermissions', {
        ServiceId: {
          Ref: 'EndpointServiceED36BE1F',
        },
        AllowedPrincipals: [],
      }));

      test.done();
    },
    'create endpoint service with a principal'(test: Test) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: false,
        whitelistedPrincipals: [new ArnPrincipal('arn:aws:iam::123456789012:root')],
      });

      // THEN
      expect(stack).to(haveResource('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: false,
      }));

      expect(stack).to(haveResource('AWS::EC2::VPCEndpointServicePermissions', {
        ServiceId: {
          Ref: 'EndpointServiceED36BE1F',
        },
        AllowedPrincipals: ['arn:aws:iam::123456789012:root'],
      }));

      test.done();
    },

    'with acceptance requried'(test: Test) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
      new VpcEndpointService(stack, 'EndpointService', {
        vpcEndpointServiceLoadBalancers: [lb],
        acceptanceRequired: true,
        whitelistedPrincipals: [new ArnPrincipal('arn:aws:iam::123456789012:root')],
      });

      // THEN
      expect(stack).to(haveResource('AWS::EC2::VPCEndpointService', {
        NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
        AcceptanceRequired: true,
      }));

      expect(stack).to(haveResource('AWS::EC2::VPCEndpointServicePermissions', {
        ServiceId: {
          Ref: 'EndpointServiceED36BE1F',
        },
        AllowedPrincipals: ['arn:aws:iam::123456789012:root'],
      }));

      test.done();
    },
  },
});
