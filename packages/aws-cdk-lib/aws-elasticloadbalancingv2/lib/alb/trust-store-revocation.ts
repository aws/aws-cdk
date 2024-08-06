import { Construct } from 'constructs';
import { ITrustStore } from './trust-store';
import { IBucket } from '../../../aws-s3';
import { Resource } from '../../../core';
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
  readonly bucket: IBucket;

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
export class TrustStoreRevocation extends Resource {

  constructor(scope: Construct, id: string, props: TrustStoreRevocationProps) {
    super(scope, id);

    new CfnTrustStoreRevocation(this, 'Resource', {
      trustStoreArn: props.trustStore.trustStoreArn,
      revocationContents: props.revocationContents?.map(content => ({
        revocationType: content.revocationType,
        s3Bucket: content.bucket.bucketName,
        s3Key: content.key,
        s3ObjectVersion: content.version,
      })),
    });
  }
}
