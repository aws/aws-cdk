import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { HttpOrigin } from './http-origin';

/**
 * Properties to use to customize an S3 Origin.
 *
 * @experimental
 */
export interface S3OriginProps {
  /**
   * An optional path that CloudFront appends to the origin domain name when CloudFront requests content from the origin.
   * Must begin, but not end, with '/' (e.g., '/production/images').
   *
   * @default '/'
   */
  readonly originPath?: string;
}

/**
 * An Origin that is backed by an S3 bucket.
 *
 * If the bucket is configured for website hosting, this origin will be configured to use the bucket as an
 * HTTP server origin and will use the bucket's configured website redirects and error handling. Otherwise,
 * the origin is created as a bucket origin and will use CloudFront's redirect and error handling.
 *
 * @experimental
 */
export class S3Origin implements cloudfront.IOrigin {
  private readonly origin: cloudfront.IOrigin;

  constructor(bucket: s3.IBucket, props: S3OriginProps = {}) {
    this.origin = bucket.isWebsite ?
      new HttpOrigin(bucket.bucketWebsiteDomainName, {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY, // S3 only supports HTTP for website buckets
        ...props,
      }) :
      new S3BucketOrigin(bucket, props);
  }

  public bind(scope: cdk.Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    return this.origin.bind(scope, options);
  }
}

/**
 * An Origin specific to a S3 bucket (not configured for website hosting).
 *
 * Contains additional logic around bucket permissions and origin access identities.
 */
class S3BucketOrigin extends cloudfront.OriginBase {
  private originAccessIdentity!: cloudfront.OriginAccessIdentity;

  constructor(private readonly bucket: s3.IBucket, props: S3OriginProps) {
    super(bucket.bucketRegionalDomainName, props);
  }

  public bind(scope: cdk.Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    if (!this.originAccessIdentity) {
      this.originAccessIdentity = new cloudfront.OriginAccessIdentity(scope, 'S3Origin', {
        comment: `Access identity for ${options.originId}`,
      });
      this.bucket.grantRead(this.originAccessIdentity);
    }
    return super.bind(scope, options);
  }

  protected renderS3OriginConfig(): cloudfront.CfnDistribution.S3OriginConfigProperty | undefined {
    return { originAccessIdentity: `origin-access-identity/cloudfront/${this.originAccessIdentity.originAccessIdentityName}` };
  }
}
