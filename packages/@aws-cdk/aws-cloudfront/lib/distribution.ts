import * as acm from '@aws-cdk/aws-certificatemanager';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct, IResource, Lazy, Resource, Stack, Token } from '@aws-cdk/core';
import { CfnDistribution } from './cloudfront.generated';
import { IOrigin, Origin } from './origin';
import { ViewerProtocolPolicy } from './web_distribution';

/**
 * Interface for CloudFront distributions
 */
export interface IDistribution extends IResource {
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

  /**
   * A certificate to associate with the distribution. The certificate must be located in N. Virginia (us-east-1).
   *
   * @default the CloudFront wildcard certificate (*.cloudfront.net) will be used.
   */
  readonly certificate?: acm.ICertificate;
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
export class Distribution extends Resource implements IDistribution {

  /**
   * Creates a Distribution construct that represents an external (imported) distribution.
   */
  public static fromDistributionAttributes(scope: Construct, id: string, attrs: DistributionAttributes): IDistribution {
    return new class extends Resource implements IDistribution {
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
      origin: Origin.fromBucket(scope, 'SingleOriginBucket', bucket),
    });
  }

  /**
   * Creates a Distribution for an S3 bucket, where the bucket has been configured for website hosting.
   *
   * This creates a single-origin distribution with a single default behavior.
   */
  public static forWebsiteBucket(scope: Construct, id: string, bucket: s3.IBucket): Distribution {
    return new Distribution(scope, id, {
      origin: Origin.fromWebsiteBucket(scope, 'SingleOriginWebsiteBucket', bucket),
    });
  }

  public readonly domainName: string;
  public readonly distributionId: string;

  /**
   * Default origin of the distribution.
   */
  public readonly origin: IOrigin;
  /**
   * Certificate associated with the distribution, if any.
   */
  public readonly certificate?: acm.ICertificate;

  constructor(scope: Construct, id: string, props: DistributionProps) {
    super(scope, id);

    if (props.certificate) {
      const certificateRegion = Stack.of(this).parseArn(props.certificate.certificateArn).region;
      if (!Token.isUnresolved(certificateRegion) && certificateRegion !== 'us-east-1') {
        throw new Error('Distribution certificates must be in the us-east-1 region.');
      }
    }

    this.origin = props.origin;
    this.certificate = props.certificate;

    const distribution = new CfnDistribution(this, 'CFDistribution', { distributionConfig: {
      enabled: true,
      origins: Lazy.anyValue({ produce: () => this.renderOrigins() }),
      defaultCacheBehavior: {
        forwardedValues: { queryString: false },
        viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
        targetOriginId: this.origin.id,
      },
      viewerCertificate: this.renderViewerCertificate(),
    } });

    this.domainName = distribution.attrDomainName;
    this.distributionId = distribution.ref;
  }

  private renderOrigins(): CfnDistribution.OriginProperty[] {
    return [this.origin.renderOrigin()];
  }

  private renderViewerCertificate(): CfnDistribution.ViewerCertificateProperty | undefined {
    return this.certificate ? { acmCertificateArn: this.certificate.certificateArn } : undefined;
  }

}
