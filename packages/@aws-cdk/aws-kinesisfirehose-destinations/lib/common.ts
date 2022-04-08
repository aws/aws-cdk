import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';

/**
 * Possible compression options Kinesis Data Firehose can use to compress data on delivery.
 */
export class Compression {
  /**
   * gzip
   */
  public static readonly GZIP = new Compression('GZIP');

  /**
   * Hadoop-compatible Snappy
   */
  public static readonly HADOOP_SNAPPY = new Compression('HADOOP_SNAPPY');

  /**
   * Snappy
   */
  public static readonly SNAPPY = new Compression('Snappy');

  /**
   * ZIP
   */
  public static readonly ZIP = new Compression('ZIP');

  /**
   * Creates a new Compression instance with a custom value.
   */
  public static of(value: string): Compression {
    return new Compression(value);
  }

  /**
   * @param value the string value of the Compression.
   */
  private constructor(public readonly value: string) { }
}

/**
 * Options for S3 record backup of a delivery stream.
 */
export enum BackupMode {
  /**
   * All records are backed up.
   */
  ALL,

  /**
   * Only records that failed to deliver or transform are backed up.
   */
  FAILED,
}

/**
 * Logging related properties for a delivery stream destination.
 */
interface DestinationLoggingProps {
  /**
   * If true, log errors when data transformation or data delivery fails.
   *
   * If `logGroup` is provided, this will be implicitly set to `true`.
   *
   * @default true - errors are logged.
   */
  readonly logging?: boolean;

  /**
   * The CloudWatch log group where log streams will be created to hold error logs.
   *
   * @default - if `logging` is set to `true`, a log group will be created for you.
   */
  readonly logGroup?: logs.ILogGroup;
}

/**
 * Common properties for defining a backup, intermediary, or final S3 destination for a Kinesis Data Firehose delivery stream.
 */
export interface CommonDestinationS3Props {
  /**
   * The length of time that Firehose buffers incoming data before delivering
   * it to the S3 bucket.
   *
   * Minimum: Duration.seconds(60)
   * Maximum: Duration.seconds(900)
   *
   * @default Duration.seconds(300)
   */
  readonly bufferingInterval?: cdk.Duration;

  /**
   * The size of the buffer that Kinesis Data Firehose uses for incoming data before
   * delivering it to the S3 bucket.
   *
   * Minimum: Size.mebibytes(1)
   * Maximum: Size.mebibytes(128)
   *
   * @default Size.mebibytes(5)
   */
  readonly bufferingSize?: cdk.Size;

  /**
   * The type of compression that Kinesis Data Firehose uses to compress the data
   * that it delivers to the Amazon S3 bucket.
   *
   * The compression formats SNAPPY or ZIP cannot be specified for Amazon Redshift
   * destinations because they are not supported by the Amazon Redshift COPY operation
   * that reads from the S3 bucket.
   *
   * @default - UNCOMPRESSED
   */
  readonly compression?: Compression;

  /**
   * The AWS KMS key used to encrypt the data that it delivers to your Amazon S3 bucket.
   *
   * @default - Data is not encrypted.
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * A prefix that Kinesis Data Firehose evaluates and adds to failed records before writing them to S3.
   *
   * This prefix appears immediately following the bucket name.
   * @see https://docs.aws.amazon.com/firehose/latest/dev/s3-prefixes.html
   *
   * @default "YYYY/MM/DD/HH"
   */
  readonly errorOutputPrefix?: string;

  /**
   * A prefix that Kinesis Data Firehose evaluates and adds to records before writing them to S3.
   *
   * This prefix appears immediately following the bucket name.
   * @see https://docs.aws.amazon.com/firehose/latest/dev/s3-prefixes.html
   *
   * @default "YYYY/MM/DD/HH"
   */
  readonly dataOutputPrefix?: string;
}

/**
 * Properties for defining an S3 backup destination.
 *
 * S3 backup is available for all destinations, regardless of whether the final destination is S3 or not.
 */
export interface DestinationS3BackupProps extends DestinationLoggingProps, CommonDestinationS3Props {
  /**
   * The S3 bucket that will store data and failed records.
   *
   * @default - If `mode` is set to `BackupMode.ALL` or `BackupMode.FAILED`, a bucket will be created for you.
   */
  readonly bucket?: s3.IBucket;

  /**
   * Indicates the mode by which incoming records should be backed up to S3, if any.
   *
   * If `bucket` is provided, this will be implicitly set to `BackupMode.ALL`.
   *
   * @default - If `bucket` is provided, the default will be `BackupMode.ALL`. Otherwise,
   * source records are not backed up to S3.
  */
  readonly mode?: BackupMode;
}

/**
 * Generic properties for defining a delivery stream destination.
 */
export interface CommonDestinationProps extends DestinationLoggingProps {
  /**
   * The IAM role associated with this destination.
   *
   * Assumed by Kinesis Data Firehose to invoke processors and write to destinations
   *
   * @default - a role will be created with default permissions.
   */
  readonly role?: iam.IRole;

  /**
   * The data transformation that should be performed on the data before writing to the destination.
   *
   * @default - no data transformation will occur.
   */
  readonly processor?: firehose.IDataProcessor;

  /**
   * The configuration for backing up source records to S3.
   *
   * @default - source records will not be backed up to S3.
   */
  readonly s3Backup?: DestinationS3BackupProps;
}
