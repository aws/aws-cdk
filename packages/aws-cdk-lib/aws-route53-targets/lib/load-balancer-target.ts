import { IAliasRecordTargetProps } from './shared';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as route53 from '../../aws-route53';

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
    // Check if this is a Network Load Balancer with IPv4-only addressing
    if (this.isNetworkLoadBalancer() && this.isIpv4Only()) {
      // IPv4-only NLB - no dualstack prefix needed
      return this.loadBalancer.loadBalancerDnsName;
    }
    
    // For ALBs and dual-stack NLBs, use dualstack prefix for backward compatibility
    return `dualstack.${this.loadBalancer.loadBalancerDnsName}`;
  }

  private isNetworkLoadBalancer(): boolean {
    // We use constructor name checking as a reliable way to detect NLB vs ALB
    // since both implement ILoadBalancerV2 but have different DNS requirements
    return this.loadBalancer.constructor.name === 'NetworkLoadBalancer' ||
           this.loadBalancer.constructor.name === 'LookedUpNetworkLoadBalancer';
  }

  private isIpv4Only(): boolean {
    const lb = this.loadBalancer as any;
    return lb.ipAddressType === elbv2.IpAddressType.IPV4 || 
           lb.ipAddressType === undefined;
  }
}
