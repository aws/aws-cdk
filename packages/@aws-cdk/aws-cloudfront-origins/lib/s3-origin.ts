import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';

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
export class S3Origin extends cloudfront.Origin {

  private readonly origin: cloudfront.Origin;

  constructor(bucket: s3.IBucket, props: S3OriginProps = {}) {
    let proxyOrigin;
    if (bucket.isWebsite) {
      proxyOrigin = new cloudfront.HttpOrigin(bucket.bucketWebsiteDomainName, {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY, // S3 only supports HTTP for website buckets
        ...props,
      });
    } else {
      proxyOrigin = new cloudfront.S3Origin({
        bucket,
        ...props,
      });
    }

    super(proxyOrigin.domainName);

    this.origin = proxyOrigin;
  }

  public get id() {
    return this.origin.id;
  }

  public bind(scope: cdk.Construct, options: cloudfront.OriginBindOptions) {
    this.origin.bind(scope, options);
  }

  public renderOrigin() {
    return this.origin.renderOrigin();
  }

}
