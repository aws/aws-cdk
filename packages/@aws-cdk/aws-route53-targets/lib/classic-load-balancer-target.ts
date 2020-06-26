import * as elb from '@aws-cdk/aws-elasticloadbalancing';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';

/**
 * Use a classic ELB as an alias record target
 */
export class ClassicLoadBalancerTarget implements route53.IAliasRecordTarget {
  constructor(private readonly loadBalancer: elb.LoadBalancer) {
  }

  public bind(_record: route53.IRecordSet): route53.AliasRecordTargetConfig {
    return {
      hostedZoneId: this.loadBalancer.loadBalancerCanonicalHostedZoneNameId,
      dnsName: cdk.Fn.join('.', ['dualstack', this.loadBalancer.loadBalancerDnsName]),
    };
  }
}
