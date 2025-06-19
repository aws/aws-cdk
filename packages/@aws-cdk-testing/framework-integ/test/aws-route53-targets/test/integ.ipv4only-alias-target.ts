#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { ROUTE53_TARGETS_LOAD_BALANCER_USE_PLAIN_DNS_FOR_IPV4_ONLY } from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ipv4only-lb-integ');

// Enable the feature flag for IPv4-only load balancer behavior
stack.node.setContext(ROUTE53_TARGETS_LOAD_BALANCER_USE_PLAIN_DNS_FOR_IPV4_ONLY, true);

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
  natGateways: 1,
  subnetConfiguration: [
    {
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
      mapPublicIpOnLaunch: true,
    },
  ],
});

// IPv4-only NLB (explicitly set)
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

// IPv4-only ALB (explicitly set)
const ipv4Alb = new elbv2.ApplicationLoadBalancer(stack, 'IPv4ALB', {
  vpc,
  internetFacing: true,
  ipAddressType: elbv2.IpAddressType.IPV4,
});

// Default ALB (should default to IPv4)
const defaultAlb = new elbv2.ApplicationLoadBalancer(stack, 'DefaultALB', {
  vpc,
  internetFacing: true,
  // ipAddressType not specified - defaults to IPv4
});

const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

// IPv4-only NLB alias record (should NOT have dualstack prefix)
new route53.ARecord(stack, 'IPv4NLBAlias', {
  zone,
  recordName: 'ipv4-nlb',
  target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(ipv4Nlb)),
});

// Default NLB alias record (should NOT have dualstack prefix)
new route53.ARecord(stack, 'DefaultNLBAlias', {
  zone,
  recordName: 'default-nlb',
  target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(defaultNlb)),
});

// IPv4-only ALB alias record (should NOT have dualstack prefix)
new route53.ARecord(stack, 'IPv4ALBAlias', {
  zone,
  recordName: 'ipv4-alb',
  target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(ipv4Alb)),
});

// Default ALB alias record (should NOT have dualstack prefix)
new route53.ARecord(stack, 'DefaultALBAlias', {
  zone,
  recordName: 'default-alb',
  target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(defaultAlb)),
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

// IPv4-only ALB with health check
new route53.ARecord(stack, 'IPv4ALBAliasWithHealthCheck', {
  zone,
  recordName: 'ipv4-alb-health',
  target: route53.RecordTarget.fromAlias(
    new targets.LoadBalancerTarget(ipv4Alb, {
      evaluateTargetHealth: true,
    }),
  ),
});

new IntegTest(app, 'ipv4only-alias-target', {
  testCases: [stack],
});

app.synth();
