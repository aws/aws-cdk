import * as route53 from '@aws-cdk/aws-route53';
/**
 * Use another Route 53 record as an alias record target
 */
export declare class Route53RecordTarget implements route53.IAliasRecordTarget {
    private readonly record;
    constructor(record: route53.IRecordSet);
    bind(_record: route53.IRecordSet, zone?: route53.IHostedZone): route53.AliasRecordTargetConfig;
}
