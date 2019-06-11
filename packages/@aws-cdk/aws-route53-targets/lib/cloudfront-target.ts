import cloudfront = require('@aws-cdk/aws-cloudfront');
import route53 = require('@aws-cdk/aws-route53');

/**
 * The hosted zone Id if using an alias record in Route53.
 * This value never changes.
 */
const CLOUDFRONT_ZONE_ID = "Z2FDTNDATAQYW2";

/**
 * Use a CloudFront Distribution as an alias record target
 */
export class CloudFrontTarget implements route53.IAliasRecordTarget {
  constructor(private readonly distribution: cloudfront.CloudFrontWebDistribution) {
  }

  public bind(_record: route53.IRecordSet): route53.AliasRecordTargetConfig {
    return {
      hostedZoneId: CLOUDFRONT_ZONE_ID,
      dnsName: this.distribution.domainName
    };
  }
}
