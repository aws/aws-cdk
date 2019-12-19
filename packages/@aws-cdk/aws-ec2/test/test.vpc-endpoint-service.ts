import { expect, haveResource } from '@aws-cdk/assert';
import { ArnPrincipal } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
// tslint:disable-next-line:max-line-length
import { VpcEndpointService } from '../lib';

export = {
  'test vpc endpoint service': {
    'create endpoint service with no principals'(test: Test) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new VpcEndpointService(stack, "EndpointService", {
        networkLoadBalancerArns: ["arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a"],
        acceptanceRequired: false,
        whitelistedPrincipals: []
      });

      // THEN
      expect(stack).to(haveResource('AWS::EC2::VPCEndpointService', {
          NetworkLoadBalancerArns: ["arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a"],
          AcceptanceRequired: false
      }));

      expect(stack).to(haveResource('AWS::EC2::VPCEndpointServicePermissions', {
        ServiceId: {
          Ref: "EndpointServiceED36BE1F"
        },
        AllowedPrincipals: []
      }));

      test.done();
    },

    'create endpoint service with a principal'(test: Test) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new VpcEndpointService(stack, "EndpointService", {
        networkLoadBalancerArns: ["arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a"],
        acceptanceRequired: false,
        whitelistedPrincipals: [new ArnPrincipal("arn:aws:iam::123456789012:root")]
      });

      // THEN
      expect(stack).to(haveResource('AWS::EC2::VPCEndpointService', {
          NetworkLoadBalancerArns: ["arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a"],
          AcceptanceRequired: false
      }));

      expect(stack).to(haveResource('AWS::EC2::VPCEndpointServicePermissions', {
        ServiceId: {
          Ref: "EndpointServiceED36BE1F"
        },
        AllowedPrincipals: ["arn:aws:iam::123456789012:root"]
      }));

      test.done();
    },

    'with acceptance requried'(test: Test) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new VpcEndpointService(stack, "EndpointService", {
        networkLoadBalancerArns: ["arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a"],
        acceptanceRequired: true,
        whitelistedPrincipals: [new ArnPrincipal("arn:aws:iam::123456789012:root")]
      });

      // THEN
      expect(stack).to(haveResource('AWS::EC2::VPCEndpointService', {
          NetworkLoadBalancerArns: ["arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a"],
          AcceptanceRequired: true
      }));

      expect(stack).to(haveResource('AWS::EC2::VPCEndpointServicePermissions', {
        ServiceId: {
          Ref: "EndpointServiceED36BE1F"
        },
        AllowedPrincipals: ["arn:aws:iam::123456789012:root"]
      }));

      test.done();
    }
  }
};
