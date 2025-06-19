import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as route53 from '../../aws-route53';
import { Stack } from '../../core';
import { ROUTE53_TARGETS_LOAD_BALANCER_USE_PLAIN_DNS_FOR_IPV4_ONLY } from '../../cx-api';
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

test('use IPv4-only NLB as record target (feature flag disabled)', () => {
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

  // THEN - With feature flag disabled, IPv4-only NLB should still use dualstack prefix (current behavior)
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { 'Fn::Join': ['', ['dualstack.', { 'Fn::GetAtt': ['NLB55158F82', 'DNSName'] }]] },
      HostedZoneId: { 'Fn::GetAtt': ['NLB55158F82', 'CanonicalHostedZoneID'] },
    },
  });
});

test('use IPv4-only NLB as record target (feature flag enabled)', () => {
  // GIVEN
  const stack = new Stack();
  stack.node.setContext(ROUTE53_TARGETS_LOAD_BALANCER_USE_PLAIN_DNS_FOR_IPV4_ONLY, true);

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

  // THEN - With feature flag enabled, IPv4-only NLB should NOT use dualstack prefix
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { 'Fn::GetAtt': ['NLB55158F82', 'DNSName'] },
      HostedZoneId: { 'Fn::GetAtt': ['NLB55158F82', 'CanonicalHostedZoneID'] },
    },
  });
});

test('use IPv4-only ALB as record target (feature flag enabled)', () => {
  // GIVEN
  const stack = new Stack();
  stack.node.setContext(ROUTE53_TARGETS_LOAD_BALANCER_USE_PLAIN_DNS_FOR_IPV4_ONLY, true);

  const vpc = new ec2.Vpc(stack, 'VPC', {
    maxAzs: 2,
  });
  const lb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', {
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

  // THEN - With feature flag enabled, IPv4-only ALB should NOT use dualstack prefix
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { 'Fn::GetAtt': ['ALBAEE750D2', 'DNSName'] },
      HostedZoneId: { 'Fn::GetAtt': ['ALBAEE750D2', 'CanonicalHostedZoneID'] },
    },
  });
});

test('use dual-stack NLB as record target (feature flag enabled)', () => {
  // GIVEN
  const stack = new Stack();
  stack.node.setContext(ROUTE53_TARGETS_LOAD_BALANCER_USE_PLAIN_DNS_FOR_IPV4_ONLY, true);

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

  // THEN - Even with feature flag enabled, dual-stack NLB should still use dualstack prefix
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { 'Fn::Join': ['', ['dualstack.', { 'Fn::GetAtt': ['NLB55158F82', 'DNSName'] }]] },
      HostedZoneId: { 'Fn::GetAtt': ['NLB55158F82', 'CanonicalHostedZoneID'] },
    },
  });
});

test('use default NLB as record target (feature flag disabled)', () => {
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

  // THEN - With feature flag disabled, default NLB should use dualstack prefix (current behavior)
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { 'Fn::Join': ['', ['dualstack.', { 'Fn::GetAtt': ['NLB55158F82', 'DNSName'] }]] },
      HostedZoneId: { 'Fn::GetAtt': ['NLB55158F82', 'CanonicalHostedZoneID'] },
    },
  });
});

test('use default NLB as record target (feature flag enabled)', () => {
  // GIVEN
  const stack = new Stack();
  stack.node.setContext(ROUTE53_TARGETS_LOAD_BALANCER_USE_PLAIN_DNS_FOR_IPV4_ONLY, true);

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

  // THEN - With feature flag enabled, default NLB should NOT use dualstack prefix
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { 'Fn::GetAtt': ['NLB55158F82', 'DNSName'] },
      HostedZoneId: { 'Fn::GetAtt': ['NLB55158F82', 'CanonicalHostedZoneID'] },
    },
  });
});
