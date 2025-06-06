#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-nlb-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

// IPv4-only NLB (default) - explicitly set for clarity
const ipv4Nlb = new elbv2.NetworkLoadBalancer(stack, 'IPv4NLB', {
  vpc,
  internetFacing: true,
  ipAddressType: elbv2.IpAddressType.IPV4,
});

// Default NLB (should default to IPv4)
const defaultNlb = new elbv2.NetworkLoadBalancer(stack, 'DefaultNLB', {
  vpc,
  internetFacing: true,
  // ipAddressType not specified - defaults to IPv4
});

// Dual-stack NLB
const dualStackNlb = new elbv2.NetworkLoadBalancer(stack, 'DualStackNLB', {
  vpc,
  internetFacing: true,
  ipAddressType: elbv2.IpAddressType.DUAL_STACK,
});

const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

// IPv4-only NLB alias record (should NOT have dualstack prefix)
new route53.ARecord(zone, 'IPv4NLBAlias', {
  zone,
  recordName: 'ipv4-nlb',
  target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(ipv4Nlb)),
});

// Default NLB alias record (should NOT have dualstack prefix)
new route53.ARecord(zone, 'DefaultNLBAlias', {
  zone,
  recordName: 'default-nlb',
  target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(defaultNlb)),
});

// Dual-stack NLB alias record (should have dualstack prefix)
new route53.ARecord(zone, 'DualStackNLBAlias', {
  zone,
  recordName: 'dualstack-nlb',
  target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(dualStackNlb)),
});

// IPv4-only NLB with health check
new route53.ARecord(stack, 'IPv4NLBAliasWithHealthCheck', {
  zone,
  recordName: 'ipv4-nlb-health',
  target: route53.RecordTarget.fromAlias(
    new targets.LoadBalancerTarget(ipv4Nlb, {
      evaluateTargetHealth: true,
    }),
  ),
});

new IntegTest(app, 'nlb-alias-target', {
  testCases: [stack],
});

app.synth();
