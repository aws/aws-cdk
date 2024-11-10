import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as route53 from '../../aws-route53';

/**
 * Use an ELBv2 as an alias record target
 */
export class LoadBalancerTarget implements route53.IAliasRecordTarget {
  constructor(private readonly loadBalancer: elbv2.ILoadBalancerV2, private readonly props?: LoadBalancerTargetProps) {}

  public bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig {
    return {
      hostedZoneId: this.loadBalancer.loadBalancerCanonicalHostedZoneId,
      dnsName: `dualstack.${this.loadBalancer.loadBalancerDnsName}`,
      evaluateTargetHealth: this.props?.evaluateTargetHealth,
    };
  }
}

/**
 * Properties for an ELBv2 target
 */
export interface LoadBalancerTargetProps {
  /**
   * Evaluate target health
   *
   * @default - no health check configuration
   */
  readonly evaluateTargetHealth?: boolean;
}
