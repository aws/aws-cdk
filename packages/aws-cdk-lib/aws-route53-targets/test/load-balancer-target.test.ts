import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as route53 from '../../aws-route53';
import { Stack } from '../../core';
import * as targets from '../lib';

test('use ALB as record target', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'VPC', {
    maxAzs: 2,
  });
  const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
    vpc,
    internetFacing: true,
  });

  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // WHEN
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(lb)),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { 'Fn::Join': ['', ['dualstack.', { 'Fn::GetAtt': ['LB8A12904C', 'DNSName'] }]] },
      HostedZoneId: { 'Fn::GetAtt': ['LB8A12904C', 'CanonicalHostedZoneID'] },
    },
  });
});

test('use ALB as record target with health check', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'VPC', {
    maxAzs: 2,
  });
  const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
    vpc,
    internetFacing: true,
  });

  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // WHEN
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.RecordTarget.fromAlias(
      new targets.LoadBalancerTarget(lb, {
        evaluateTargetHealth: true,
      }),
    ),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      EvaluateTargetHealth: true,
    },
  });
});

test('use IPv4-only NLB as record target', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'VPC', {
    maxAzs: 2,
  });
  const lb = new elbv2.NetworkLoadBalancer(stack, 'NLB', {
    vpc,
    internetFacing: true,
    ipAddressType: elbv2.IpAddressType.IPV4,
  });

  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // WHEN
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(lb)),
  });

  // THEN - IPv4-only NLB should NOT use dualstack prefix
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { 'Fn::GetAtt': ['NLB55158F82', 'DNSName'] },
      HostedZoneId: { 'Fn::GetAtt': ['NLB55158F82', 'CanonicalHostedZoneID'] },
    },
  });
});

test('use dual-stack NLB as record target', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'VPC', {
    maxAzs: 2,
  });
  const lb = new elbv2.NetworkLoadBalancer(stack, 'NLB', {
    vpc,
    internetFacing: true,
    ipAddressType: elbv2.IpAddressType.DUAL_STACK,
  });

  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // WHEN
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(lb)),
  });

  // THEN - Dual-stack NLB should use dualstack prefix
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { 'Fn::Join': ['', ['dualstack.', { 'Fn::GetAtt': ['NLB55158F82', 'DNSName'] }]] },
      HostedZoneId: { 'Fn::GetAtt': ['NLB55158F82', 'CanonicalHostedZoneID'] },
    },
  });
});

test('use default NLB as record target (should be IPv4-only)', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'VPC', {
    maxAzs: 2,
  });
  const lb = new elbv2.NetworkLoadBalancer(stack, 'NLB', {
    vpc,
    internetFacing: true,
    // ipAddressType not specified - defaults to IPv4
  });

  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // WHEN
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(lb)),
  });

  // THEN - Default NLB should NOT use dualstack prefix
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { 'Fn::GetAtt': ['NLB55158F82', 'DNSName'] },
      HostedZoneId: { 'Fn::GetAtt': ['NLB55158F82', 'CanonicalHostedZoneID'] },
    },
  });
});
