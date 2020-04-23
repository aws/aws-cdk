import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';

/**
 * Use a CloudFront Distribution as an alias record target
 */
export class CloudFrontTarget implements route53.IAliasRecordTarget {
  /**
   * The hosted zone Id if using an alias record in Route53.
   * This value never changes.
   */
  public static readonly CLOUDFRONT_ZONE_ID = 'Z2FDTNDATAQYW2';

  constructor(private readonly distribution: cloudfront.CloudFrontWebDistribution) {
  }

  public bind(_record: route53.IRecordSet): route53.AliasRecordTargetConfig {
    return {
      hostedZoneId: CloudFrontTarget.CLOUDFRONT_ZONE_ID,
      dnsName: this.distribution.domainName,
    };
  }
}
