import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { HttpOrigin } from './http-origin';

/**
 * Properties to use to customize an S3 Origin.
 */
export interface S3OriginProps extends cloudfront.OriginProps {
  /**
   * An optional Origin Access Identity of the origin identity cloudfront will use when calling your s3 bucket.
   *
   * @default - An Origin Access Identity will be created.
   */
  readonly originAccessIdentity?: cloudfront.IOriginAccessIdentity;
}

/**
 * An Origin that is backed by an S3 bucket.
 *
 * If the bucket is configured for website hosting, this origin will be configured to use the bucket as an
 * HTTP server origin and will use the bucket's configured website redirects and error handling. Otherwise,
 * the origin is created as a bucket origin and will use CloudFront's redirect and error handling.
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

  public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    return this.origin.bind(scope, options);
  }
}

/**
 * An Origin specific to a S3 bucket (not configured for website hosting).
 *
 * Contains additional logic around bucket permissions and origin access identities.
 */
class S3BucketOrigin extends cloudfront.OriginBase {
  private originAccessIdentity!: cloudfront.IOriginAccessIdentity;

  constructor(private readonly bucket: s3.IBucket, { originAccessIdentity, ...props }: S3OriginProps) {
    super(bucket.bucketRegionalDomainName, props);
    if (originAccessIdentity) {
      this.originAccessIdentity = originAccessIdentity;
    }
  }

  public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    if (!this.originAccessIdentity) {
      // Using a bucket from another stack creates a cyclic reference with
      // the bucket taking a dependency on the generated S3CanonicalUserId for the grant principal,
      // and the distribution having a dependency on the bucket's domain name.
      // Fix this by parenting the OAI in the bucket's stack when cross-stack usage is detected.
      const bucketStack = cdk.Stack.of(this.bucket);
      const bucketInDifferentStack = bucketStack !== cdk.Stack.of(scope);
      const oaiScope = bucketInDifferentStack ? bucketStack : scope;
      const oaiId = bucketInDifferentStack ? `${cdk.Names.uniqueId(scope)}S3Origin` : 'S3Origin';

      this.originAccessIdentity = new cloudfront.OriginAccessIdentity(oaiScope, oaiId, {
        comment: `Identity for ${options.originId}`,
      });
    }
    // Used rather than `grantRead` because `grantRead` will grant overly-permissive policies.
    // Only GetObject is needed to retrieve objects for the distribution.
    // This also excludes KMS permissions; currently, OAI only supports SSE-S3 for buckets.
    // Source: https://aws.amazon.com/blogs/networking-and-content-delivery/serving-sse-kms-encrypted-content-from-s3-using-cloudfront/
    this.bucket.addToResourcePolicy(new iam.PolicyStatement({
      resources: [this.bucket.arnForObjects('*')],
      actions: ['s3:GetObject'],
      principals: [this.originAccessIdentity.grantPrincipal],
    }));
    return super.bind(scope, options);
  }

  protected renderS3OriginConfig(): cloudfront.CfnDistribution.S3OriginConfigProperty | undefined {
    return { originAccessIdentity: `origin-access-identity/cloudfront/${this.originAccessIdentity.originAccessIdentityName}` };
  }
}
