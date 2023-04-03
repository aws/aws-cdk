import * as route53 from '@aws-cdk/aws-route53';
import * as s3 from '@aws-cdk/aws-s3';
/**
 * Use a S3 as an alias record target
 */
export declare class BucketWebsiteTarget implements route53.IAliasRecordTarget {
    private readonly bucket;
    constructor(bucket: s3.IBucket);
    bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig;
}
