import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import route53 = require('@aws-cdk/aws-route53');

/**
 * Use an ELBv2 as an alias record target
 */
export class LoadBalancerTarget implements route53.IAliasRecordTarget {
  constructor(private readonly loadBalancer: elbv2.ILoadBalancerV2) {
  }

  public bind(_record: route53.IRecordSet): route53.AliasRecordTargetConfig {
    return {
      hostedZoneId: this.loadBalancer.loadBalancerCanonicalHostedZoneId,
      dnsName: this.loadBalancer.loadBalancerDnsName
    };
  }
}
