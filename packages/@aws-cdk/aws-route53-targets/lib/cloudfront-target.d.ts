import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import { IConstruct } from 'constructs';
/**
 * Use a CloudFront Distribution as an alias record target
 */
export declare class CloudFrontTarget implements route53.IAliasRecordTarget {
    private readonly distribution;
    /**
     * The hosted zone Id if using an alias record in Route53.
     * This value never changes.
     */
    static readonly CLOUDFRONT_ZONE_ID = "Z2FDTNDATAQYW2";
    /**
     * Get the hosted zone id for the current scope.
     *
     * @param scope - scope in which this resource is defined
     */
    static getHostedZoneId(scope: IConstruct): string;
    constructor(distribution: cloudfront.IDistribution);
    bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig;
}
