import { IAliasRecordTargetProps } from './shared';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as route53 from '../../aws-route53';
import { FeatureFlags, Stack } from '../../core';
import { ROUTE53_TARGETS_NLB_USE_PLAIN_DNS_NAME } from '../../cx-api';

/**
 * Use an ELBv2 as an alias record target
 */
export class LoadBalancerTarget implements route53.IAliasRecordTarget {
  constructor(private readonly loadBalancer: elbv2.ILoadBalancerV2, private readonly props?: IAliasRecordTargetProps) {}

  public bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig {
    return {
      hostedZoneId: this.loadBalancer.loadBalancerCanonicalHostedZoneId,
      dnsName: this.getDnsName(),
      evaluateTargetHealth: this.props?.evaluateTargetHealth,
    };
  }

  private getDnsName(): string {
    const stack = Stack.of(this.loadBalancer);
    const nlbUsePlainDnsName = FeatureFlags.of(stack).isEnabled(
      ROUTE53_TARGETS_NLB_USE_PLAIN_DNS_NAME,
    );

    if (nlbUsePlainDnsName && this.isNetworkLoadBalancer()) {
      // NLBs: Use plain DNS name (matches Route53 console behavior)
      return this.loadBalancer.loadBalancerDnsName;
    }

    // CLBs and ALBs: Use dualstack prefix (matches Route53 console behavior)
    return `dualstack.${this.loadBalancer.loadBalancerDnsName}`;
  }

  private isNetworkLoadBalancer(): boolean {
    // Comprehensive NLB detection for all scenarios:

    // 1. Direct instanceof check for created NLBs
    if (this.loadBalancer instanceof elbv2.NetworkLoadBalancer) {
      return true;
    }

    // 2. Check PROPERTY_INJECTION_ID for looked-up NLBs
    const propertyInjectionId = (this.loadBalancer.constructor as any)?.PROPERTY_INJECTION_ID;
    if (propertyInjectionId === 'aws-cdk-lib.aws-elasticloadbalancingv2.LookedUpNetworkLoadBalancer') {
      return true;
    }

    // 3. For imported NLBs from attributes, use ARN pattern matching
    // This is the most reliable way since imported NLBs create anonymous Import classes
    const lb = this.loadBalancer as any;
    if (lb.loadBalancerArn && typeof lb.loadBalancerArn === 'string') {
      return lb.loadBalancerArn.includes('/net/');
    }

    // 4. Fallback: Check for NLB-specific properties
    // NLBs have securityGroups property that ALBs handle differently
    if ('addListener' in this.loadBalancer &&
        'securityGroups' in this.loadBalancer &&
        typeof lb.addListener === 'function') {
      // This is likely an NLB, but we can't be 100% certain without ARN
      // Default to false to avoid false positives
      return false;
    }

    return false;
  }
}
