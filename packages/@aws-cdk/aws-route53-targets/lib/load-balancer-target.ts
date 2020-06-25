import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';

/**
 * Use an ELBv2 as an alias record target
 */
export class LoadBalancerTarget implements route53.IAliasRecordTarget {
  constructor(private readonly loadBalancer: elbv2.ILoadBalancerV2) {
  }

  public bind(_record: route53.IRecordSet): route53.AliasRecordTargetConfig {
    const delimiter: string = '.';
    const prefix: string[] = ['dualstack'];
    return {
      hostedZoneId: this.loadBalancer.loadBalancerCanonicalHostedZoneId,
      dnsName: cdk.Fn.join(delimiter, prefix.concat([this.loadBalancer.loadBalancerDnsName])),
    };
  }
}
