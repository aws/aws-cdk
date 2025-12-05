import { Construct } from 'constructs';
import { CfnTrustStore, ITrustStoreRef, TrustStoreReference } from './cloudfront.generated';
import { IBucket } from '../../aws-s3';
import { IResource, Names, Resource, Stack, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Represents a CloudFront Trust Store
 */
export interface ITrustStore extends IResource, ITrustStoreRef {
  /**
   * The ID of the trust store.
   * @attribute
   */
  readonly trustStoreId: string;

  /**
   * The ARN of the trust store.
   * @attribute
   */
  readonly trustStoreArn: string;
}

/**
 * The S3 location of the CA certificates bundle
 */
export interface CaCertificatesBundleS3Location {
  /**
   * The S3 bucket containing the CA certificates bundle.
   * The bucket's region will be used as the region for the CA bundle.
   */
  readonly bucket: IBucket;

  /**
   * The key (path) to the CA certificates bundle file in the S3 bucket.
   * The file must be in PEM format containing one or more CA certificates.
   */
  readonly key: string;

  /**
   * The version of the S3 object to use.
   *
   * @default undefined - AWS Cloudfront default is using the latest version
   */
  readonly version?: string;
}

/**
 * Properties for creating a TrustStore
 */
export interface TrustStoreProps {
  /**
   * A unique name to identify the trust store.
   *
   * @default - generated from the construct id
   */
  readonly trustStoreName?: string;

  /**
   * The S3 location of the CA certificates bundle.
   * The bundle must be a PEM file containing one or more CA certificates.
   */
  readonly caCertificatesBundleS3Location: CaCertificatesBundleS3Location;
}

/**
 * Attributes for importing an existing Trust Store
 */
export interface TrustStoreAttributes {
  /**
   * The ID of the trust store.
   */
  readonly trustStoreId: string;

  /**
   * The ARN of the trust store.
   *
   * @default - derived from `trustStoreId`
   */
  readonly trustStoreArn?: string;
}

/**
 * A CloudFront Trust Store for mTLS authentication
 *
 * Trust stores contain CA certificates that CloudFront uses to authenticate
 * client certificates during mutual TLS (mTLS) handshakes.
 *
 * @resource AWS::CloudFront::TrustStore
 */
@propertyInjectable
export class TrustStore extends Resource implements ITrustStore {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-cloudfront.TrustStore';

  /**
   * Import an existing Trust Store by its ID.
   */
  public static fromTrustStoreId(
    scope: Construct,
    id: string,
    trustStoreId: string,
  ): ITrustStore {
    return TrustStore.fromTrustStoreAttributes(scope, id, { trustStoreId });
  }

  /**
   * Import an existing Trust Store by its attributes.
   */
  public static fromTrustStoreAttributes(
    scope: Construct,
    id: string,
    attrs: TrustStoreAttributes,
  ): ITrustStore {
    const trustStoreArn = attrs.trustStoreArn ?? Stack.of(scope).formatArn({
      service: 'cloudfront',
      region: '',
      resource: 'trust-store',
      resourceName: attrs.trustStoreId,
    });

    class Import extends Resource implements ITrustStore {
      public readonly trustStoreId = attrs.trustStoreId;
      public readonly trustStoreArn = trustStoreArn;
      public readonly trustStoreRef: TrustStoreReference = {
        trustStoreId: attrs.trustStoreId,
        trustStoreArn: trustStoreArn,
      };
    }
    return new Import(scope, id);
  }

  public readonly trustStoreId: string;
  public readonly trustStoreArn: string;
  public readonly trustStoreRef: TrustStoreReference;

  constructor(scope: Construct, id: string, props: TrustStoreProps) {
    super(scope, id);
    addConstructMetadata(this, props);

    this.validateName(props.trustStoreName);

    const resource = new CfnTrustStore(this, 'Resource', {
      name: props.trustStoreName ?? Names.uniqueResourceName(this, { maxLength: 64 }),
      caCertificatesBundleSource: this.renderCaCertificatesBundleSource(props),
    });

    this.trustStoreId = resource.attrId;
    this.trustStoreArn = resource.attrArn;
    this.trustStoreRef = resource.trustStoreRef;
  }

  private validateName(name?: string): void {
    if (name === undefined || Token.isUnresolved(name)) {
      return;
    }

    if (name.length < 2 || name.length > 64) {
      throw new ValidationError(`'trustStoreName' must be between 2 and 64 characters, got ${name.length} characters`, this);
    }
  }

  private renderCaCertificatesBundleSource(
    props: TrustStoreProps,
  ): CfnTrustStore.CaCertificatesBundleSourceProperty {
    const location = props.caCertificatesBundleS3Location;
    return {
      caCertificatesBundleS3Location: {
        bucket: location.bucket.bucketName,
        key: location.key,
        region: location.bucket.env.region,
        version: location.version,
      },
    };
  }
}
