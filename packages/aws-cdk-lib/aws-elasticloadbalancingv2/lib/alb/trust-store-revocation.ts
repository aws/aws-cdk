import { Construct } from 'constructs';
import { ITrustStore } from './trust-store';
import { IBucketRef } from '../../../aws-s3';
import { Resource } from '../../../core';
import { addConstructMetadata } from '../../../core/lib/metadata-resource';
import { propertyInjectable } from '../../../core/lib/prop-injectable';
import { CfnTrustStoreRevocation } from '../elasticloadbalancingv2.generated';

/**
 * Properties for the trust store revocation
 */
export interface TrustStoreRevocationProps {

  /**
   * The trust store
   */
  readonly trustStore: ITrustStore;

  /**
   * The revocation file to add
   */
  readonly revocationContents: RevocationContent[];
}

/**
 * Information about a revocation file
 */
export interface RevocationContent {
  /**
   * The type of revocation file
   *
   * @default RevocationType.CRL
   */
  readonly revocationType?: RevocationType;

  /**
   * The Amazon S3 bucket for the revocation file
   */
  readonly bucket: IBucketRef;

  /**
   * The Amazon S3 path for the revocation file
   */
  readonly key: string;

  /**
   * The Amazon S3 object version of the revocation file
   *
   * @default - latest version
   */
  readonly version?: string;
}

/**
 * The type of revocation file
 */
export enum RevocationType {
  /**
   * A signed list of revoked certificates
   */
  CRL = 'CRL',
}

/**
 * A new Trust Store Revocation
 */
@propertyInjectable
export class TrustStoreRevocation extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-elasticloadbalancingv2.TrustStoreRevocation';

  constructor(scope: Construct, id: string, props: TrustStoreRevocationProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    new CfnTrustStoreRevocation(this, 'Resource', {
      trustStoreArn: props.trustStore.trustStoreArn,
      revocationContents: props.revocationContents?.map(content => ({
        revocationType: content.revocationType,
        s3Bucket: content.bucket.bucketRef.bucketName,
        s3Key: content.key,
        s3ObjectVersion: content.version,
      })),
    });
  }
}
