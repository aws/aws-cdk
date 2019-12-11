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

  'imported network load balancer with no vpc specified throws error when calling addTargets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const nlbArn = "arn:aws:elasticloadbalancing::000000000000::dummyloadbalancer";
    const nlb = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack, 'NLB', {
      loadBalancerArn: nlbArn,
    });
    // WHEN
    const listener = nlb.addListener('Listener', {port: 80});
    test.throws(() => listener.addTargets('targetgroup', {port: 8080}));

    test.done();
  },

  'imported network load balancer with vpc does not throw error when calling addTargets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const nlbArn = "arn:aws:elasticloadbalancing::000000000000::dummyloadbalancer";
    const nlb = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack, 'NLB', {
      loadBalancerArn: nlbArn,
      loadBalancerVpc: vpc,
    });
    // WHEN
    const listener = nlb.addListener('Listener', {port: 80});
    test.doesNotThrow(() => listener.addTargets('targetgroup', {port: 8080}));

    test.done();
  }
};
