import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as elbv2 from '../../lib';

export = {
  'Trivial construction: internet facing'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

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
      ],
      Type: "network"
    }));

    test.done();
  },

  'Trivial construction: internal'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: "internal",
      Subnets: [
        { Ref: "StackPrivateSubnet1Subnet47AC2BC7" },
        { Ref: "StackPrivateSubnet2SubnetA2F8EDD8" },
      ],
      Type: "network"
    }));

    test.done();
  },

  'Attributes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

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

  'loadBalancerName'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'ALB', {
      loadBalancerName: 'myLoadBalancer',
      vpc
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Name: 'myLoadBalancer'
    }));
    test.done();
  },
  'Trivial construction: internal with Isolated subnets only'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', {
      subnetConfiguration: [{
           cidrMask: 20,
           name: 'Isolated',
           subnetType: ec2.SubnetType.ISOLATED,
         }]
    });

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', {
      vpc,
      internetFacing: false,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: "internal",
      Subnets: [
        { Ref: "VPCIsolatedSubnet1SubnetEBD00FC6" },
        { Ref: "VPCIsolatedSubnet2Subnet4B1C8CAA" },
      ],
      Type: "network"
    }));

    test.done();
  },
    'Internal with Public, Private, and Isolated subnets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', {
      subnetConfiguration: [{
           cidrMask: 24,
           name: 'Public',
           subnetType: ec2.SubnetType.PUBLIC,
         }, {
           cidrMask: 24,
           name: 'Private',
           subnetType: ec2.SubnetType.PRIVATE,
         }, {
           cidrMask: 28,
           name: 'Isolated',
           subnetType: ec2.SubnetType.ISOLATED,
         }
         ]
    });

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', {
      vpc,
      internetFacing: false,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: "internal",
      Subnets: [
        { Ref: "VPCPrivateSubnet1Subnet8BCA10E0" },
        { Ref: "VPCPrivateSubnet2SubnetCFCDAA7A" },
      ],
      Type: "network"
    }));

    test.done();
  },
    'Internet-facing with Public, Private, and Isolated subnets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', {
      subnetConfiguration: [{
           cidrMask: 24,
           name: 'Public',
           subnetType: ec2.SubnetType.PUBLIC,
         }, {
           cidrMask: 24,
           name: 'Private',
           subnetType: ec2.SubnetType.PRIVATE,
         }, {
           cidrMask: 28,
           name: 'Isolated',
           subnetType: ec2.SubnetType.ISOLATED,
         }
         ]
    });

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', {
      vpc,
      internetFacing: true,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: "internet-facing",
      Subnets: [
        { Ref: "VPCPublicSubnet1SubnetB4246D30" },
        { Ref: "VPCPublicSubnet2Subnet74179F39" },
      ],
      Type: "network"
    }));

    test.done();
  }
};
