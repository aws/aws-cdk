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
    // Check if this has the NLB-specific properties/methods
    // NLBs have addListener method that returns NetworkListener, ALBs return ApplicationListener
    // We'll use a duck-typing approach by checking the constructor name
    return this.loadBalancer.constructor.name === 'NetworkLoadBalancer' || 
           this.loadBalancer.constructor.name === 'LookedUpNetworkLoadBalancer';
  }

  private isIpv4Only(): boolean {
    const ipAddressType = (this.loadBalancer as any).ipAddressType;
    return ipAddressType === elbv2.IpAddressType.IPV4 || ipAddressType === undefined;
  }
}
