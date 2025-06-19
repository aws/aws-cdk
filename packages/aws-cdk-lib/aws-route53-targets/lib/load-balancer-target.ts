import { IAliasRecordTargetProps } from './shared';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as route53 from '../../aws-route53';
import { FeatureFlags, Stack } from '../../core';
import { ROUTE53_TARGETS_LOAD_BALANCER_USE_PLAIN_DNS_FOR_IPV4_ONLY } from '../../cx-api';

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
    const useNewBehavior = FeatureFlags.of(stack).isEnabled(
      ROUTE53_TARGETS_LOAD_BALANCER_USE_PLAIN_DNS_FOR_IPV4_ONLY,
    );

    if (useNewBehavior && this.isIpv4OnlyLoadBalancer()) {
      // IPv4-only load balancers - use plain DNS name
      return this.loadBalancer.loadBalancerDnsName;
    }

    // Default behavior: use dualstack prefix for all load balancers
    return `dualstack.${this.loadBalancer.loadBalancerDnsName}`;
  }

  private isIpv4OnlyLoadBalancer(): boolean {
    const lb = this.loadBalancer as any;
    return lb.ipAddressType === elbv2.IpAddressType.IPV4 ||
          lb.ipAddressType === undefined;
  }
}
