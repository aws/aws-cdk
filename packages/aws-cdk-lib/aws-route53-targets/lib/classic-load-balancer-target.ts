import { IAliasRecordTargetProps } from './shared';
import * as elb from '../../aws-elasticloadbalancing';
import * as route53 from '../../aws-route53';

/**
 * Use a classic ELB as an alias record target
 */
export class ClassicLoadBalancerTarget implements route53.IAliasRecordTarget {
  constructor(private readonly loadBalancer: elb.LoadBalancer, private readonly props?: IAliasRecordTargetProps) {}

  public bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig {
    return {
      hostedZoneId: this.loadBalancer.loadBalancerCanonicalHostedZoneNameId,
      dnsName: `dualstack.${this.loadBalancer.loadBalancerDnsName}`,
      evaluateTargetHealth: this.props?.evaluateTargetHealth,
    };
  }
}
