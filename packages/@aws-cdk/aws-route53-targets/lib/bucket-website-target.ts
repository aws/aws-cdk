import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import {Stack, Token} from '@aws-cdk/core';
import regionInfo = require('@aws-cdk/region-info');

/**
 * Use a S3 as an alias record target
 */
export class BucketWebsiteTarget implements route53.IAliasRecordTarget {
    constructor(private readonly bucket: s3.Bucket) {
    }

    public bind(_record: route53.IRecordSet): route53.AliasRecordTargetConfig {
        const {region} = Stack.of(this.bucket.stack);

        // FIXME
        if (Token.isUnresolved(region)) {
            throw new Error(`Unresolved region token: ${region}`);
        }

        const hostedZoneId = regionInfo.Fact.find(region, regionInfo.FactName.S3_STATIC_WEBSITE_ZONE_53_HOSTED_ZONE_ID);

        if (!hostedZoneId) {
            throw new Error(`Bucket website target is not supported for the "${region}" region`);
        }

        return {
            hostedZoneId,
            dnsName: this.bucket.bucketWebsiteUrl,
        };
    }
}
