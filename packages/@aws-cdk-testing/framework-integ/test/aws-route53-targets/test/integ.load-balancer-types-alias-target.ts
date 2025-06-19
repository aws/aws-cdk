import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancing';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { ROUTE53_TARGETS_NLB_USE_PLAIN_DNS_NAME } from 'aws-cdk-lib/cx-api';

/**
 * Integration test for load balancer type-specific DNS naming behavior in Route53 alias records.
 *
 * This test validates the fix for issue #16987 where CDK was incorrectly adding 'dualstack.' prefix
 * to all load balancer DNS names, but AWS Route53 console behavior shows different patterns:
 *
 * EXPECTED BEHAVIOR (matches AWS Route53 console):
 * - Classic Load Balancers (CLB): Use ClassicLoadBalancerTarget (separate implementation)
 * - Application Load Balancers (ALB): Use 'dualstack.' prefix in Route53 alias records ✅
 * - Network Load Balancers (NLB): Use plain DNS names in Route53 alias records ✅
 *
 * FEATURE FLAG: ROUTE53_TARGETS_NLB_USE_PLAIN_DNS_NAME
 * - When enabled: NLBs use plain DNS names, ALBs use dualstack prefix
 * - When disabled: All ALBs/NLBs use dualstack prefix (legacy broken behavior for NLBs)
 * - CLBs are unaffected as they use ClassicLoadBalancerTarget
 *
 * TEST COVERAGE:
 * 1. CLB IPv4-only → uses ClassicLoadBalancerTarget (separate implementation)
 * 2. ALB IPv4-only → should generate 'dualstack.{dns-name}' in Route53 record
 * 3. NLB IPv4-only → should generate '{dns-name}' (plain) in Route53 record
 * 4. Imported NLB → should generate '{dns-name}' (plain) in Route53 record
 * 5. Imported ALB → should generate 'dualstack.{dns-name}' in Route53 record
 *
 * This test focuses on IPv4-only scenarios to avoid IPv6 subnet configuration complexity
 * while still validating the core DNS naming behavior fix.
 */

export class LoadBalancerTypesAliasTargetStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Enable the feature flag for correct load balancer type-specific behavior
    this.node.setContext(ROUTE53_TARGETS_NLB_USE_PLAIN_DNS_NAME, true);

    // Create VPC with proper IPv6 support for dual-stack load balancers
    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });

    // Associate IPv6 CIDR block with VPC
    const ipv6CidrBlock = new ec2.CfnVPCCidrBlock(this, 'Ipv6CidrBlock', {
      vpcId: vpc.vpcId,
      amazonProvidedIpv6CidrBlock: true,
    });

    // Add IPv6 CIDR to public subnets using proper CloudFormation functions
    vpc.publicSubnets.forEach((subnet, index) => {
      const subnetIpv6CidrBlock = new ec2.CfnSubnetCidrBlock(this, `SubnetIpv6CidrBlock${index}`, {
        subnetId: subnet.subnetId,
        ipv6CidrBlock: cdk.Fn.select(index, cdk.Fn.cidr(
          cdk.Fn.select(0, vpc.vpcIpv6CidrBlocks),
          4, // Number of subnets
          '64' // Subnet size
        )),
      });
      subnetIpv6CidrBlock.addDependency(ipv6CidrBlock);
    });

    // Create hosted zone for testing
    const hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: 'foo.com',
    });

    // 1. Classic Load Balancer - IPv4 only
    const clbIpv4 = new elb.LoadBalancer(this, 'CLB-IPv4', {
      vpc,
      internetFacing: true,
      listeners: [{
        externalPort: 80,
        internalPort: 80,
      }],
    });

    new route53.ARecord(this, 'CLB-IPv4-ARecord', {
      zone: hostedZone,
      recordName: 'clb-ipv4',
      target: route53.RecordTarget.fromAlias(new targets.ClassicLoadBalancerTarget(clbIpv4)),
    });

    // 2. Application Load Balancer - IPv4 only
    const albIpv4 = new elbv2.ApplicationLoadBalancer(this, 'ALB-IPv4', {
      vpc,
      internetFacing: true,
      ipAddressType: elbv2.IpAddressType.IPV4,
    });

    new route53.ARecord(this, 'ALB-IPv4-ARecord', {
      zone: hostedZone,
      recordName: 'alb-ipv4',
      target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(albIpv4)),
    });

    // 3. Network Load Balancer - IPv4 only
    const nlbIpv4 = new elbv2.NetworkLoadBalancer(this, 'NLB-IPv4', {
      vpc,
      internetFacing: true,
      ipAddressType: elbv2.IpAddressType.IPV4,
    });

    new route53.ARecord(this, 'NLB-IPv4-ARecord', {
      zone: hostedZone,
      recordName: 'nlb-ipv4',
      target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(nlbIpv4)),
    });

    // Test imported load balancers as well
    const importedNlb = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(this, 'ImportedNLB', {
      loadBalancerArn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/imported-nlb/1234567890123456',
      loadBalancerDnsName: 'imported-nlb-1234567890123456.elb.us-east-1.amazonaws.com',
      loadBalancerCanonicalHostedZoneId: 'Z26RNL4JYFTOTI',
    });

    new route53.ARecord(this, 'ImportedNLB-ARecord', {
      zone: hostedZone,
      recordName: 'imported-nlb',
      target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(importedNlb)),
    });

    const importedAlb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(this, 'ImportedALB', {
      loadBalancerArn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/imported-alb/1234567890123456',
      loadBalancerDnsName: 'imported-alb-1234567890123456.us-east-1.elb.amazonaws.com',
      loadBalancerCanonicalHostedZoneId: 'Z35SXDOTRQ7X7K',
      securityGroupId: 'sg-12345678',
    });

    new route53.ARecord(this, 'ImportedALB-ARecord', {
      zone: hostedZone,
      recordName: 'imported-alb',
      target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(importedAlb)),
    });
  }
}

const app = new App();
const stack = new LoadBalancerTypesAliasTargetStack(app, 'LoadBalancerTypesAliasTargetStack');

new IntegTest(app, 'LoadBalancerTypesAliasTargetTest', {
  testCases: [stack],
  diffAssets: true,
  stackUpdateWorkflow: true,
});
