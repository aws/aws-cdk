import elb = require('@aws-cdk/aws-elasticloadbalancing');
import route53 = require('@aws-cdk/aws-route53');

/**
 * Use a classic ELB as an alias record target
 */
export class ClassicLoadBalancerTarget implements route53.IAliasRecordTarget {
  constructor(private readonly loadBalancer: elb.LoadBalancer) {
  }

  public bind(_record: route53.IRecordSet): route53.AliasRecordTargetConfig {
    return {
      hostedZoneId: this.loadBalancer.loadBalancerCanonicalHostedZoneNameId,
      dnsName: this.loadBalancer.loadBalancerDnsName
    };
  }
}
