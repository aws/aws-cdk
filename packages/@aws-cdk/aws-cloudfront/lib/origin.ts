import { IBucket } from '@aws-cdk/aws-s3';
import { Token } from '@aws-cdk/core';
import { CfnDistribution } from './cloudfront.generated';

/**
 * Represents a CloudFront Origin and its behaviors.
 */
export interface IOrigin {
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
export class Origin implements IOrigin {

  /**
   * Creates a pre-configured origin for a S3 bucket.
   * If this bucket has been configured for static website hosting, then `fromWebsiteBucket` should be used instead.
   *
   * An Origin Access Identity will be created and granted read access to the bucket, unless **TODO**.
   *
   * @param bucket the bucket to act as an origin.
   */
  public static fromBucket(bucket: IBucket): Origin {
    return new Origin({ domainName: bucket.bucketRegionalDomainName, id: bucket.bucketName });
  }

  /**
   * Creates a pre-configured origin for a S3 bucket, where the bucket has been configured for website hosting.
   *
   * An Origin Access Identity will be created and granted read access to the bucket, unless **TODO**.
   *
   * @param bucket the bucket to act as an origin.
   */
  public static fromWebsiteBucket(bucket: IBucket): Origin {
    return new Origin({ domainName: bucket.bucketWebsiteDomainName, id: bucket.bucketName });
  }

  public readonly domainName: string;
  public readonly id: string;

  constructor(props: OriginProps) {
    this.domainName = props.domainName;
    this.id = props.id || Token.asString(undefined);
  }

  public renderOrigin(): CfnDistribution.OriginProperty {
    return {
      domainName: this.domainName,
      id: this.id,
      s3OriginConfig: {},
    };
  }

}