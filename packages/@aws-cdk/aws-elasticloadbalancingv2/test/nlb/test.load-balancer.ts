import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import elbv2 = require('../../lib');

export = {
  'Trivial construction: internet facing'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'Stack');

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', {
      vpc,
      internetFacing: true,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: "internet-facing",
      Subnets: [
        { Ref: "StackPublicSubnet1Subnet0AD81D22" },
        { Ref: "StackPublicSubnet2Subnet3C7D2288" },
        { Ref: "StackPublicSubnet3SubnetCC1055D9" }
      ],
      Type: "network"
    }));

    test.done();
  },

  'Trivial construction: internal'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'Stack');

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: "internal",
      Subnets: [
        { Ref: "StackPrivateSubnet1Subnet47AC2BC7" },
        { Ref: "StackPrivateSubnet2SubnetA2F8EDD8" },
        { Ref: "StackPrivateSubnet3Subnet28548F2E" }
      ],
      Type: "network"
    }));

    test.done();
  },

  'Attributes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'Stack');

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', {
      vpc,
      crossZoneEnabled: true,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      LoadBalancerAttributes: [
        {
          Key: "load_balancing.cross_zone.enabled",
          Value: "true"
        }
      ]
    }));

    test.done();
  },
};
