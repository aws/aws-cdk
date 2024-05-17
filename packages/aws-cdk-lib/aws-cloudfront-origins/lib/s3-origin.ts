import { Construct } from 'constructs';
import { HttpOrigin } from './http-origin';
import * as cloudfront from '../../aws-cloudfront';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import { Stack, Names, FeatureFlags, Aws, Lazy } from '../../core';
import * as cxapi from '../../cx-api';

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

  /**
   * An optional Origin Access Control
   * @default - An Origin Access Control will be created.
   */
  readonly originAccessControl?: cloudfront.IOriginAccessControl;
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
      }) : new S3BucketOrigin(bucket, props);
  }

  public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    return this.origin.bind(scope, options);
  }
}

/**
 * An Origin specific to a S3 bucket (not configured for website hosting).
 *
 * Contains additional logic around bucket permissions and origin access controls.
 */
class S3BucketOacOrigin extends cloudfront.OriginBase {
  private originAccessControl!: cloudfront.IOriginAccessControl;

  constructor(private readonly bucket: s3.IBucket, { originAccessControl, ...props }: S3OriginProps) {
    super(bucket.bucketRegionalDomainName, props);
    if (originAccessControl) {
      this.originAccessControl = originAccessControl;
    }
  }

  public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    if (!this.originAccessControl) {
      this.originAccessControl = new cloudfront.OriginAccessControl(scope, options.originId);
    }
    return super.bind(scope, options);
  }

  /**
   * If you're using origin access control (OAC) instead of origin access identity, specify an empty `OriginAccessIdentity` element.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-s3originconfig.html#cfn-cloudfront-distribution-s3originconfig-originaccessidentity
   */
  protected renderS3OriginConfig(): cloudfront.CfnDistribution.S3OriginConfigProperty | undefined {
    return { originAccessIdentity: '' };
  }
}

/**
 * An Origin specific to a S3 bucket (not configured for website hosting).
 *
 * Contains additional logic around bucket permissions and origin access identities.
 */
class S3BucketOrigin extends cloudfront.OriginBase {
  private originAccessIdentity?: cloudfront.IOriginAccessIdentity;
  private originAccessControl?: cloudfront.IOriginAccessControl;

  constructor(private readonly bucket: s3.IBucket, props: S3OriginProps) {
    super(bucket.bucketRegionalDomainName, props);
    // if (originAccessIdentity) {
    //   this.originAccessIdentity = originAccessIdentity;
    // }
    if (props.originAccessControl && props.originAccessIdentity) {
      throw new Error('Only one of originAccessControl or originAccessIdentity can be specified for an origin.');
    }
    this.originAccessControl = props.originAccessControl;
    this.originAccessIdentity = props.originAccessIdentity;
  }

  public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    if (FeatureFlags.of(scope).isEnabled(cxapi.CLOUDFRONT_USE_ORIGIN_ACCESS_CONTROL)) {
      if (!this.originAccessControl) {
        // Create a new origin access control if not specified
        this.originAccessControl = new cloudfront.OriginAccessControl(scope, 'S3OriginAccessControl');
      }
      const distribution = scope.node.scope as cloudfront.Distribution;
      const distributionId = Lazy.string({ produce: () => distribution.distributionId });
      const oacReadOnlyBucketPolicyStatement = new iam.PolicyStatement(
        {
          sid: 'AllowS3OACAccess',
          effect: iam.Effect.ALLOW,
          principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
          actions: ['s3:GetObject'],
          resources: [this.bucket.arnForObjects('*')],
          conditions: {
            StringEquals: {
              // eslint-disable-next-line @aws-cdk/no-literal-partition
              'AWS:SourceArn': `arn:aws:cloudfront::${Aws.ACCOUNT_ID}:distribution/${distributionId}`,
            },
          },
        },
      );
      const result = this.bucket.addToResourcePolicy(oacReadOnlyBucketPolicyStatement);

      if (!result.statementAdded) {
        throw new Error('Policy statement was not added to bucket policy');
      }

      const originBindConfig = super.bind(scope, options);

      // Update configuration to set OriginControlAccessId property
      return {
        ...originBindConfig,
        originProperty: {
          ...originBindConfig.originProperty!,
          originAccessControlId: this.originAccessControl.originAccessControlId,
        },
      };
    } else if (!this.originAccessIdentity && !(FeatureFlags.of(scope).isEnabled(cxapi.CLOUDFRONT_USE_ORIGIN_ACCESS_CONTROL))) {
      // Using a bucket from another stack creates a cyclic reference with
      // the bucket taking a dependency on the generated S3CanonicalUserId for the grant principal,
      // and the distribution having a dependency on the bucket's domain name.
      // Fix this by parenting the OAI in the bucket's stack when cross-stack usage is detected.
      const bucketStack = Stack.of(this.bucket);
      const bucketInDifferentStack = bucketStack !== Stack.of(scope);
      const oaiScope = bucketInDifferentStack ? bucketStack : scope;
      const oaiId = bucketInDifferentStack ? `${Names.uniqueId(scope)}S3Origin` : 'S3Origin';

      this.originAccessIdentity = new cloudfront.OriginAccessIdentity(oaiScope, oaiId, {
        comment: `Identity for ${options.originId}`,
      });

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
    if (this.originAccessIdentity) {
      return { originAccessIdentity: `origin-access-identity/cloudfront/${this.originAccessIdentity.originAccessIdentityId}` };
    }
    return { originAccessIdentity: '' };
  }
}
