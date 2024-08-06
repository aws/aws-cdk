import { Construct } from 'constructs';
import { IBucket } from '../../../aws-s3';
import { IResource, Resource, Fn, Names, Lazy, Token } from '../../../core';
import { CfnTrustStore } from '../elasticloadbalancingv2.generated';

/**
 * Represents a Trust Store
 */
export interface ITrustStore extends IResource {
  /**
   * The name of the trust store
   * @attribute
   */
  readonly trustStoreName: string;

  /**
   * The ARN of the trust store
   * @attribute
   */
  readonly trustStoreArn: string;
}

/**
 * Properties used for the Trust Store
 */
export interface TrustStoreProps {

  /**
   * The name of the trust store
   *
   * @default - Auto generated
   */
  readonly trustStoreName?: string;

  /**
   * The bucket that the trust store is hosted in
   */
  readonly bucket: IBucket;

  /**
   * The key in S3 to look at for the trust store
   */
  readonly key: string;

  /**
   * The version of the S3 object that contains your truststore.
   * To specify a version, you must have versioning enabled for the S3 bucket.
   *
   * @default - latest version
   */
  readonly version?: string;
}

/**
 * A new Trust Store
 */
export class TrustStore extends Resource implements ITrustStore {
  /**
   * Import from ARN
   */
  public static fromTrustStoreArn(scope: Construct, id: string, trustStoreArn: string): ITrustStore {
    const resourceParts = Fn.split('/', trustStoreArn);

    const trustStoreName = Fn.select(0, resourceParts);

    class Import extends Resource implements ITrustStore {
      public readonly trustStoreArn = trustStoreArn;
      public readonly trustStoreName = trustStoreName;
    }
    return new Import(scope, id);
  }

  /**
   * The name of the trust store
   *
   * @attribute
   */
  public readonly trustStoreName: string;

  /**
   * The number of CA certificates in the trust store
   *
   * @attribute
   */
  public readonly numberOfCaCertificates: number;

  /**
   * The status of the trust store
   *
   * @attribute
   */
  public readonly status: string;

  /**
   * The ARN of the trust store
   *
   * @attribute
   */
  public readonly trustStoreArn: string;

  constructor(scope: Construct, id: string, props: TrustStoreProps) {
    super(scope, id, {
      physicalName: props.trustStoreName ?? Lazy.string({
        produce: () => Names.uniqueResourceName(this, { maxLength: 32 }),
      }),
    });

    if (props.trustStoreName !== undefined && !Token.isUnresolved(props.trustStoreName)) {

      if (props.trustStoreName.length < 1 || props.trustStoreName.length > 32) {
        throw new Error(`trustStoreName '${props.trustStoreName}' must be 1-32 characters long.`);
      }
      const validNameRegex = /^([a-zA-Z0-9]+-)*[a-zA-Z0-9]+$/;
      if (!validNameRegex.test(props.trustStoreName)) {
        throw new Error(`trustStoreName '${props.trustStoreName}' must contain only alphanumeric characters and hyphens, and cannot begin or end with a hyphen.`);
      }

    }

    const resource = new CfnTrustStore(this, 'Resource', {
      name: this.physicalName,
      caCertificatesBundleS3Bucket: props.bucket.bucketName,
      caCertificatesBundleS3Key: props.key,
      caCertificatesBundleS3ObjectVersion: props.version,
    });

    this.trustStoreName = resource.ref;
    this.numberOfCaCertificates = resource.attrNumberOfCaCertificates;
    this.status = resource.attrStatus;
    this.trustStoreArn = resource.attrTrustStoreArn;
  }
}
