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
  ipProtocol: ec2.IpProtocol.DUAL_STACK,
  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  natGateways: 1,
  subnetConfiguration: [
    {
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
      mapPublicIpOnLaunch: true,
    }
  ]
});

// Add IPv6 CIDRs to public subnets and enable auto-assign
vpc.publicSubnets.forEach((subnet, index) => {
  const cfnSubnet = subnet.node.defaultChild as ec2.CfnSubnet;
  // Assign IPv6 CIDR block to the subnet
  cfnSubnet.ipv6CidrBlock = cdk.Fn.select(index, cdk.Fn.cidr(
    cdk.Fn.select(0, vpc.vpcIpv6CidrBlocks), 
    vpc.publicSubnets.length,
    '64'
  ));
  // Enable auto-assign IPv6 for the subnet
  cfnSubnet.assignIpv6AddressOnCreation = true;
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

// Dual-stack NLB in IPv6-enabled subnet
const dualStackNlb = new elbv2.NetworkLoadBalancer(stack, 'DualStackNLB', {
  vpc,
  internetFacing: true,
  ipAddressType: elbv2.IpAddressType.DUAL_STACK,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  }
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

// Dual-stack NLB alias records (IPv4 and IPv6)
new route53.ARecord(stack, 'DualStackNLBAlias', {
  zone,
  recordName: 'dualstack-nlb',
  target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(dualStackNlb)),
});

// IPv6 record for dual-stack NLB
new route53.AaaaRecord(stack, 'DualStackNLBIpv6Alias', {
  zone,
  recordName: 'dualstack-nlb-ipv6',
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
