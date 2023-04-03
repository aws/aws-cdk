import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as route53 from '@aws-cdk/aws-route53';
/**
 * Use an ELBv2 as an alias record target
 */
export declare class LoadBalancerTarget implements route53.IAliasRecordTarget {
    private readonly loadBalancer;
    constructor(loadBalancer: elbv2.ILoadBalancerV2);
    bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig;
}
