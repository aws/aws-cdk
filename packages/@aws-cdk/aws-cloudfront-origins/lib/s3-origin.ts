import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { HttpOrigin } from './http-origin';
// eslint-disable-next-line import/order
import { DistributionPolicySetter } from '@aws-cdk/aws-cloudfront/lib/private/distribution-policy-setter';

/**
 * Resource policy modification settings for S3 origins.
 */
export enum S3OriginAutoResourcePolicy {
  /**
   * No modifications are made to resource policies
   */
  NONE = 'none',
  /**
   * Read (but not write) permissions are added to resource policies
   */
  READ_ONLY = 'readonly',
  /**
   * Read and write permissions are added to resource policies.
   * This setting cannot be used with origin access identity (OAI).
   */
  READ_WRITE = 'readwrite',
};

/**
 * Properties to use to customize an S3 Origin.
 */
export interface S3OriginProps extends cloudfront.OriginProps {
  /**
   * Controls how the resource policies of origin buckets and keys should be automatically modified.
   * The behavior is slightly different for "origin access control" (OAC) and "origin access identity"
   * (OAI) origin configurations.
   *
   * If this property is NONE, then no modifications are made to any resource policies. S3 bucket
   * policy must be configured manually to grant necessary permissions to the CloudFront distribution.
   *
   * If this property is READ_ONLY, then s3:GetObject and kms:Decrypt permissions are granted to the
   * CloudFront distribution on the bucket and its associated KMS key, if any.
   *
   * If this property is READ_WRITE, then s3:PutObject, kms:Encrypt, and kms:GenerateDataKey* permissions
   * are granted to the CloudFront distrubution on the bucket and its associated KMS key, if any.
   *
   * When used in combination with OAC, the described behavior is mandatory. If any resource policies
   * cannot be set due to imported or cross-stack resources, an error will be raised.
   *
   * When used in a stack with a legacy OAI configuration, only a best-effort attempt will be made to set
   * resource policies. Any failures due to imported or cross-stack resources will be ignored.
   *
   * `true` is a convenience alias for READ_ONLY and `false` is an alias for NONE.
   *
   * @default S3OriginAutoResourcePolicyConfig.READ_ONLY
   */
  readonly autoResourcePolicy?: S3OriginAutoResourcePolicy | boolean;
  /**
   * An optional "origin access control" (OAC) resource which describes how the distribution should
   * sign its requests for the S3 bucket origin. Can also be set to `true` to apply a default OAC.
   * OAC is the preferred way to authenticate S3 requests and should be enabled whenever possible.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
   *
   * @default - OAC is disabled by default, `originAccessIdentity` settings will be used insead
   */
  readonly originAccessControl?: cloudfront.IOriginAccessControl | true;
  /**
   * An optional "origin access identity" (OAI) that CloudFront will use to access the S3 bucket.
   * OAI is a legacy feature which remains enabled by default for backwards-compatibility reasons.
   * New origin configurations should use OAC instead, via the `originAccessControl` property.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
   *
   * @default - OAI is enabled with default settings, unless `originAccessControl` is set
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

  private originAccessControl?: cloudfront.IOriginAccessControl | true;
  private originAccessIdentity?: cloudfront.IOriginAccessIdentity;
  private autoResourcePolicy: S3OriginAutoResourcePolicy;

  constructor(private readonly bucket: s3.IBucket, props: S3OriginProps) {
    super(bucket.bucketRegionalDomainName, props);
    if (props.originAccessControl && props.originAccessIdentity) {
      throw new Error('The same origin cannot specify both originAccessControl and originAccessIdentity');
    }
    this.originAccessControl = props.originAccessControl;
    this.originAccessIdentity = props.originAccessIdentity;
    const autopolicy = props.autoResourcePolicy ?? true;
    if (autopolicy === true) {
      this.autoResourcePolicy = S3OriginAutoResourcePolicy.READ_ONLY;
    } else if (autopolicy === false) {
      this.autoResourcePolicy = S3OriginAutoResourcePolicy.NONE;
    } else {
      this.autoResourcePolicy = autopolicy;
    }
  }

  private bindOAC(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    if (this.autoResourcePolicy != S3OriginAutoResourcePolicy.NONE) {
      const readonly = this.autoResourcePolicy == S3OriginAutoResourcePolicy.READ_ONLY;
      const dist = scope.node.scope as cloudfront.Distribution;
      const lazyDistArn = cdk.Lazy.string({ produce: () => dist.distributionArn });
      if (cdk.Stack.of(this.bucket) == cdk.Stack.of(scope)) {
        // same stack - this "just works", the distribution does not depend on
        // the resource policy (although it absolutely should, ideally)
        const added = this.bucket.addToResourcePolicy(new iam.PolicyStatement({
          principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
          actions: readonly ? ['s3:GetObject'] : ['s3:GetObject', 's3:PutObject'],
          resources: [this.bucket.arnForObjects('*')],
          conditions: { StringEquals: { 'aws:SourceArn': lazyDistArn } },
        }));
        if (!added.statementAdded) {
          throw new Error('Cannot apply autoResourcePolicy to imported buckets');
        }
      } else {
        if (!DistributionPolicySetter.configureBucket(dist, this.bucket, !readonly)) {
          throw new Error('Cannot apply autoResourcePolicy to imported buckets');
        }
      }
      if (this.bucket.encryptionKey) {
        if (!DistributionPolicySetter.configureKey(dist, this.bucket.encryptionKey, !readonly)) {
          throw new Error('Cannot apply autoResourcePolicy to imported KMS keys');
        }
      }
    }
    let oac = this.originAccessControl ?? true;
    if (oac === true) {
      oac = cloudfront.OriginAccessControl.fromS3Defaults(scope);
    }
    // Wrap base-class results and directly inject OAC Id property
    const baseConfig = super.bind(scope, options);
    return {
      ...baseConfig,
      originProperty: {
        ...baseConfig.originProperty!,
        originAccessControlId: oac.originAccessControlId,
      },
    };
  }

  public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    if (this.originAccessControl) {
      return this.bindOAC(scope, options);
    }
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
    if (this.autoResourcePolicy == S3OriginAutoResourcePolicy.READ_WRITE) {
      throw new Error('S3OriginAutoResourcePolicy.READ_WRITE cannot be used with originAccessIdentity');
    }
    if (this.autoResourcePolicy != S3OriginAutoResourcePolicy.NONE) {
      // Used rather than `grantRead` because `grantRead` will grant overly-permissive policies.
      // Only GetObject is needed to retrieve objects for the distribution.
      // This also excludes KMS permissions; currently, OAI only supports SSE-S3 for buckets.
      // Source: https://aws.amazon.com/blogs/networking-and-content-delivery/serving-sse-kms-encrypted-content-from-s3-using-cloudfront/
      this.bucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: [this.bucket.arnForObjects('*')],
        actions: ['s3:GetObject'],
        principals: [this.originAccessIdentity.grantPrincipal],
      }));
    }
    return super.bind(scope, options);
  }

  protected renderS3OriginConfig(): cloudfront.CfnDistribution.S3OriginConfigProperty | undefined {
    if (this.originAccessControl) {
      return { };
    }
    return { originAccessIdentity: `origin-access-identity/cloudfront/${this.originAccessIdentity!.originAccessIdentityId}` };
  }
}
