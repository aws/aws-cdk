import * as elb from '@aws-cdk/aws-elasticloadbalancing';
import * as route53 from '@aws-cdk/aws-route53';
/**
 * Use a classic ELB as an alias record target
 */
export declare class ClassicLoadBalancerTarget implements route53.IAliasRecordTarget {
    private readonly loadBalancer;
    constructor(loadBalancer: elb.LoadBalancer);
    bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig;
}
