import * as s3 from '@aws-cdk/aws-s3';
import { Construct, IConstruct, Lazy } from '@aws-cdk/core';
import { CfnDistribution } from './cloudfront.generated';
import { IOrigin, Origin } from './origin';
import { ViewerProtocolPolicy } from './web_distribution';

/**
 * Interface for CloudFront distributions
 *
 * Note: IDistribution should extend IResource, not IConstruct, but this breaks backwards compatibility
 * with the CloudFrontWebDistribution.
 */
export interface IDistribution extends IConstruct {
  /**
   * The domain name of the Distribution, such as d111111abcdef8.cloudfront.net.
   *
   * @attribute
   */
  readonly domainName: string;

  /**
   * The distribution ID for this distribution.
   *
   * @attribute
   */
  readonly distributionId: string;
}

// TODO - Do we need a BaseDistribution?

/**
 * Properties for a Distribution
 */
export interface DistributionProps {
  /**
   * The primary origin for the distribution.
   */
  readonly origin: IOrigin;
}

/**
 * Attributes used to import a Distribution.
 */
export interface DistributionAttributes {
  /**
   * The generated domain name of the Distribution, such as d111111abcdef8.cloudfront.net.
   *
   * @attribute
   */
  readonly domainName: string;

  /**
   * The distribution ID for this distribution.
   *
   * @attribute
   */
  readonly distributionId: string;
}

/**
 * A CloudFront distribution with associated origin(s) and caching behavior(s).
 */
export class Distribution extends Construct implements IDistribution {

  /**
   * Creates a Distribution construct that represents an external (imported) distribution.
   */
  public static fromDistributionAttributes(scope: Construct, id: string, attrs: DistributionAttributes): IDistribution {
    return new class extends Construct implements IDistribution {
      public readonly domainName: string;
      public readonly distributionId: string;

      constructor() {
        super(scope, id);
        this.domainName = attrs.domainName;
        this.distributionId = attrs.distributionId;
      }
    }();
  }

  /**
   * Creates a Distribution for an S3 Bucket, where the bucket has not been configured for website hosting.
   *
   * This creates a single-origin distribution with a single default behavior.
   */
  public static forBucket(scope: Construct, id: string, bucket: s3.IBucket): Distribution {
    return new Distribution(scope, id, {
      origin: Origin.fromBucket(bucket),
    });
  }

  /**
   * Creates a Distribution for an S3 bucket, where the bucket has been configured for website hosting.
   *
   * This creates a single-origin distribution with a single default behavior.
   */
  public static forWebsiteBucket(scope: Construct, id: string, bucket: s3.IBucket): Distribution {
    return new Distribution(scope, id, {
      origin: Origin.fromWebsiteBucket(bucket),
    });
  }

  /**
   * Default origin of the distribution.
   */
  public readonly origin: IOrigin;
  public readonly domainName: string;
  public readonly distributionId: string;

  constructor(scope: Construct, id: string, props: DistributionProps) {
    super(scope, id);

    this.origin = props.origin;

    const distribution = new CfnDistribution(this, 'CFDistribution', { distributionConfig: {
      enabled: true,
      origins: Lazy.anyValue({ produce: () => this.renderOrigins() }),
      defaultCacheBehavior: {
        forwardedValues: { queryString: false },
        viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
        targetOriginId: this.origin.id,
      },
    } });

    this.domainName = distribution.attrDomainName;
    this.distributionId = distribution.ref;
  }

  private renderOrigins(): CfnDistribution.OriginProperty[] {
    return [this.origin.renderOrigin()];
  }

}
