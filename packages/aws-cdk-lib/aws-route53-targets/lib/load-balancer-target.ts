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
    // Check if it's a Network Load Balancer by constructor name or ARN pattern
    const constructorName = this.loadBalancer.constructor.name;
    const hasNetworkInName = constructorName.includes('NetworkLoadBalancer');

    // For imported load balancers, check if they have loadBalancerArn property
    const lb = this.loadBalancer as any;
    const hasNetworkArn = lb.loadBalancerArn && typeof lb.loadBalancerArn === 'string' &&
                         lb.loadBalancerArn.includes(':loadbalancer/net/');

    return hasNetworkInName || hasNetworkArn;
  }
}
