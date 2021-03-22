import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';

/**
 * The state of the workgroup
 */

export enum WorkGroupState {
  /**
   * Disabled workgroup
   */
  DISABLED = 'DISABLED',
  /**
   * Enabled workgroup
   */
  ENABLED = 'ENABLED',
}

/**
 * Indicates which encryption type is used for query results
 */
export enum EncryptionOption {
  /**
   * Client-side encryption (CSE) with an AWS KMS key managed by the account owner.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingClientSideEncryption.html
   */
  CLIENT_SIDE_KMS = 'CSE_KMS',
  /**
   * Server-side encryption (SSE) with an AWS KMS key managed by the account owner.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html
   */
  KMS = 'SSE_KMS',
  /**
   * Server side encryption (SSE) with an Amazon S3-managed key.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html
   */
  S3_MANAGED = 'SSE_S3',
}

/**
 * Indicates which encryption option and key information is used for query results
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-encryptionconfiguration.html
 */
export interface EncryptionConfiguration {
  /**
   * Indicates which encryption to use
   */
  readonly encryptionOption: EncryptionOption;
  /**
   * KMS key used for encrypting query results
   * For EncryptionOption.CLIENT_SIDE_KMS and EncryptionOption.KMS, kms key has to be provided
   * @default - None
   */
  readonly kmsKey?: kms.IKey;
}

/**
 * The location in Amazon S3 where query results are stored
 */
export interface OutputLocation {
  /**
   * S3 Bucket used for storing query results
   */
  readonly bucket: s3.IBucket;
  /**
   * S3 objects prefix inside the bucket
   *
   * @default - None
   */
  readonly s3Prefix?: string;
}

/**
 * The location in Amazon S3 where query results are stored and the encryption option, if any, used for query results.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfiguration.html
 */
export interface ResultConfiguration {
  /**
   * Whether query results are encrypted
   *
   * @default - Not encrypted
   */
  readonly encryptionConfiguration?: EncryptionConfiguration;
  /**
   * The location in Amazon S3 where to store query results
   *
   * @default - No location specified
   */
  readonly outputLocation?: OutputLocation;
}

/**
 * The configuration of the workgroup
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html
 */
export interface WorkGroupConfiguration {
  /**
   * The upper limit (cutoff) for the amount of bytes a single query in a workgroup is allowed to scan.
   *
   * @default - No limit
   */
  readonly bytesScannedCutoffPerQuery?: number;
  /**
   * Whether workgroup should override client-side setting
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/workgroups-settings-override.html
   * @default - False
   */
  readonly enforceWorkGroupConfiguration?: boolean;
  /**
   * Whether CloudWatch metrics are enabled for the workgroup
   *
   * @default - False
   */
  readonly publishCloudWatchMetricsEnabled?: boolean;
  /**
   * Whether Amazon S3 Requester Pays buckets can be queried
   *
   * @default - False
   */
  readonly requesterPaysEnabled?: boolean;
  /**
   * Specifies the location in Amazon S3 where query results are stored and the encryption option, if any, used for query results.
   *
   * @default - None
   */
  readonly resultConfigurations?: ResultConfiguration;

  /**
   * The Athena engine version for running queries.
   * If None specified, the engine version defaults to Auto and is chosed by Athena
   *
   * @default - Auto
   */
  readonly engineVersion?: string;
}