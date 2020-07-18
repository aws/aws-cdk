import { IBucket } from '@aws-cdk/aws-s3';
import { Construct } from '@aws-cdk/core';
import { CfnDistribution } from './cloudfront.generated';
import { OriginProtocolPolicy } from './distribution';
import { OriginAccessIdentity } from './origin_access_identity';

/**
 * Properties to be used to create an Origin. Prefer to use one of the Origin.from* factory methods rather than
 * instantiating an Origin directly from these properties.
 *
 * @experimental
 */
export interface OriginProps {
  /**
   * The domain name of the Amazon S3 bucket or HTTP server origin.
   */
  readonly domainName: string;
}

/**
 * Options passed to Origin.bind().
 */
interface OriginBindOptions {
  /**
   * The positional index of this origin within the distribution. Used for ensuring unique IDs.
   */
  readonly originIndex: number;
}

/**
 * Represents a distribution origin, that describes the Amazon S3 bucket, HTTP server (for example, a web server),
 * Amazon MediaStore, or other server from which CloudFront gets your files.
 *
 * @experimental
 */
export abstract class Origin {

  /**
   * Creates a pre-configured origin for a S3 bucket.
   * If this bucket has been configured for static website hosting, then `fromWebsiteBucket` should be used instead.
   *
   * An Origin Access Identity will be created and granted read access to the bucket.
   *
   * @param bucket the bucket to act as an origin.
   */
  public static fromBucket(bucket: IBucket): Origin {
    if (bucket.isWebsite) {
      return new HttpOrigin({
        domainName: bucket.bucketWebsiteDomainName,
        protocolPolicy: OriginProtocolPolicy.HTTP_ONLY, // S3 only supports HTTP for website buckets
      });
    } else {
      return new S3Origin({ domainName: bucket.bucketRegionalDomainName, bucket });
    }
  }

  /**
   * The domain name of the origin.
   */
  public readonly domainName: string;

  private originId!: string;

  constructor(props: OriginProps) {
    this.domainName = props.domainName;
  }

  /**
   * The unique id for this origin.
   *
   * Cannot be accesed until bind() is called.
   */
  public get id(): string {
    if (!this.originId) { throw new Error('Cannot access originId until `bind` is called.'); }
    return this.originId;
  }

  /**
   * Binds the origin to the associated Distribution. Can be used to grant permissions, create dependent resources, etc.
   *
   * @internal
   */
  public _bind(scope: Construct, options: OriginBindOptions): void {
    this.originId = new Construct(scope, `Origin${options.originIndex}`).node.uniqueId;
  }

  /**
   * Creates and returns the CloudFormation representation of this origin.
   *
   * @internal
   */
  public _renderOrigin(): CfnDistribution.OriginProperty {
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
 *
 * @experimental
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
 *
 * @experimental
 */
export class S3Origin extends Origin {
  private readonly bucket: IBucket;
  private originAccessIdentity!: OriginAccessIdentity;

  constructor(props: S3OriginProps) {
    super(props);
    this.bucket = props.bucket;
  }

  /** @internal */
  public _bind(scope: Construct, options: OriginBindOptions) {
    super._bind(scope, options);
    if (!this.originAccessIdentity) {
      this.originAccessIdentity = new OriginAccessIdentity(scope, `S3Origin${options.originIndex}`);
      this.bucket.grantRead(this.originAccessIdentity);
    }
  }

  protected renderS3OriginConfig(): CfnDistribution.S3OriginConfigProperty | undefined {
    return { originAccessIdentity: `origin-access-identity/cloudfront/${this.originAccessIdentity.originAccessIdentityName}` };
  }
}

/**
 * Properties for an Origin backed by an S3 website-configured bucket, load balancer, or custom HTTP server.
 *
 * @experimental
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
 * An Origin for an HTTP server or S3 bucket configured for website hosting.
 *
 * @experimental
 */
export class HttpOrigin extends Origin {

  private readonly protocolPolicy?: OriginProtocolPolicy;

  constructor(props: HttpOriginProps) {
    super(props);
    this.protocolPolicy = props.protocolPolicy;
  }

  protected renderCustomOriginConfig(): CfnDistribution.CustomOriginConfigProperty | undefined {
    return {
      originProtocolPolicy: this.protocolPolicy ?? OriginProtocolPolicy.HTTPS_ONLY,
    };
  }
}
