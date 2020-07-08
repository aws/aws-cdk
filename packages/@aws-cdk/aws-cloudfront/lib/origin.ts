import { IBucket } from '@aws-cdk/aws-s3';
import { Construct, IConstruct } from '@aws-cdk/core';
import { CfnDistribution } from './cloudfront.generated';
import { OriginAccessIdentity } from './origin_access_identity';
import { OriginProtocolPolicy } from './web_distribution';

/**
 * Represents a CloudFront Origin and its behaviors.
 */
export interface IOrigin extends IConstruct {
  /**
   * A unique identifier for the origin. This value must be unique within the distribution.
   */
  readonly id: string;

  /**
   * The domain name for the origin.
   */
  readonly domainName: string;

  /**
   * Creates and returns the CloudFormation representation of this origin.
   */
  renderOrigin(): CfnDistribution.OriginProperty;
}

/**
 * Properties to be used to create an Origin. Prefer to use one of the Origin.from* factory methods rather than
 * instantiating an Origin directly from these properties.
 */
export interface OriginProps {
  /**
   * A unique identifier for the origin. This value must be unique within the distribution.
   *
   * @default - Assigned automatically.
   */
  readonly id?: string;

  /**
   * The domain name of the Amazon S3 bucket or HTTP server origin.
   */
  readonly domainName: string;
}

/**
 * Represents a distribution origin, that describes the Amazon S3 bucket, HTTP server (for example, a web server),
 * Amazon MediaStore, or other server from which CloudFront gets your files.
 */
export abstract class Origin extends Construct implements IOrigin {

  /**
   * Creates a pre-configured origin for a S3 bucket.
   * If this bucket has been configured for static website hosting, then `fromWebsiteBucket` should be used instead.
   *
   * An Origin Access Identity will be created and granted read access to the bucket, unless **TODO**.
   *
   * @param bucket the bucket to act as an origin.
   */
  public static fromBucket(scope: Construct, id: string, bucket: IBucket): Origin {
    return new S3Origin(scope, id, {
      domainName: bucket.bucketRegionalDomainName,
      id,
      bucket,
    });
  }

  /**
   * Creates a pre-configured origin for a S3 bucket, where the bucket has been configured for website hosting.
   *
   * @param bucket the bucket to act as an origin.
   */
  public static fromWebsiteBucket(scope: Construct, id: string, bucket: IBucket): Origin {
    return new HttpOrigin(scope, id, {
      domainName: bucket.bucketWebsiteDomainName,
      id,
      protocolPolicy: OriginProtocolPolicy.HTTP_ONLY, // S3 only supports HTTP for website buckets
    });
  }

  public readonly domainName: string;
  public readonly id: string;

  constructor(scope: Construct, id: string, props: OriginProps) {
    super(scope, id);
    this.domainName = props.domainName;
    this.id = props.id || id;
  }

  public renderOrigin(): CfnDistribution.OriginProperty {
    const s3OriginConfig = this.renderS3OriginConfig();
    const customOriginConfig = this.renderCustomOriginConfig();

    if (!s3OriginConfig && !customOriginConfig) {
      throw new Error('Subclass must override and provide either s3OriginConfig or customOriginConfig');
    }

    return {
      domainName: this.domainName,
      id: this.id,
      s3OriginConfig,
      customOriginConfig,
    };
  }

  // Overridden by sub-classes to provide S3 origin config.
  protected renderS3OriginConfig(): CfnDistribution.S3OriginConfigProperty | undefined {
    return undefined;
  }

  // Overridden by sub-classes to provide custom origin config.
  protected renderCustomOriginConfig(): CfnDistribution.CustomOriginConfigProperty | undefined {
    return undefined;
  }

}

/**
 * Properties for an Origin backed by an S3 bucket
 */
export interface S3OriginProps extends OriginProps {
  /**
   * The bucket to use as an origin.
   */
  readonly bucket: IBucket;
}

/**
 * An Origin specific to a S3 bucket (not configured for website hosting).
 *
 * Contains additional logic around bucket permissions and origin access identities.
 */
export class S3Origin extends Origin {
  private readonly originAccessIdentity: OriginAccessIdentity;

  constructor(scope: Construct, id: string, props: S3OriginProps) {
    super(scope, id, props);

    this.originAccessIdentity = new OriginAccessIdentity(scope, 'S3OriginIdentity');
    props.bucket.grantRead(this.originAccessIdentity);
  }

  protected renderS3OriginConfig(): CfnDistribution.S3OriginConfigProperty | undefined {
    return { originAccessIdentity: `origin-access-identity/cloudfront/${this.originAccessIdentity.originAccessIdentityName}` };
  }
}

/**
 * Properties for an Origin backed by an S3 website-configured bucket, load balancer, or custom HTTP server.
 */
export interface HttpOriginProps extends OriginProps {
  /**
   * Specifies the protocol (HTTP or HTTPS) that CloudFront uses to connect to the origin.
   *
   * @default OriginProtocolPolicy.HTTPS_ONLY
   */
  readonly protocolPolicy?: OriginProtocolPolicy;
}

/**
 * An Origin specific to a S3 bucket (not configured for website hosting).
 *
 * Contains additional logic around bucket permissions and origin access identities.
 */
export class HttpOrigin extends Origin {

  private readonly protocolPolicy?: OriginProtocolPolicy;

  constructor(scope: Construct, id: string, props: HttpOriginProps) {
    super(scope, id, props);

    this.protocolPolicy = props.protocolPolicy;
  }

  protected renderCustomOriginConfig(): CfnDistribution.CustomOriginConfigProperty | undefined {
    return {
      originProtocolPolicy: this.protocolPolicy ?? OriginProtocolPolicy.HTTPS_ONLY,
    };
  }
}