import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import { Duration, Size } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IDeliveryStream } from './delivery-stream';
import { CfnDeliveryStream } from './kinesisfirehose.generated';
import { IDataProcessor } from './processor';

/**
 * A Kinesis Data Firehose delivery stream destination configuration.
 */
export interface DestinationConfig {
  /**
   * Schema-less properties that will be injected directly into `CfnDeliveryStream`.
   */
  readonly properties: object;
}

/**
 * Options when binding a destination to a delivery stream.
 */
export interface DestinationBindOptions {
  /**
   * The delivery stream.
   */
  readonly deliveryStream: IDeliveryStream;
}

/**
 * A Kinesis Data Firehose delivery stream destination.
 */
export interface IDestination {
  /**
   * Binds this destination to the Kinesis Data Firehose delivery stream.
   *
   * Implementers should use this method to bind resources to the stack and initialize values using the provided stream.
   */
  bind(scope: Construct, options: DestinationBindOptions): DestinationConfig;
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

  /**
   * No records are backed up.
   */
  DISABLED,
}

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
   * Uncompressed
   */
  public static readonly UNCOMPRESSED = new Compression('UNCOMPRESSED');

  /**
   * ZIP
   */
  public static readonly ZIP = new Compression('ZIP');

  constructor(
    /**
     * String value of the Compression.
     */
    public readonly value: string,
  ) { }
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
export interface CommonS3Props {
  /**
   * The length of time that Firehose buffers incoming data before delivering
   * it to the S3 bucket.
   *
   * If bufferingInterval is specified, bufferingSize must also be specified.
   * Minimum: Duration.seconds(60)
   * Maximum: Duration.seconds(900)
   *
   * @default Duration.seconds(300)
   */
  readonly bufferingInterval?: Duration;

  /**
   * The size of the buffer that Kinesis Data Firehose uses for incoming data before
   * delivering it to the S3 bucket.
   *
   * If bufferingSize is specified, bufferingInterval must also be specified.
   * Minimum: Size.mebibytes(1)
   * Maximum: Size.mebibytes(128)
   *
   * @default Size.mebibytes(5)
   */
  readonly bufferingSize?: Size;

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
  readonly prefix?: string;
}

/**
 * Properties for defining an S3 backup destination.
 *
 * S3 backup is available for all destinations, regardless of whether the final destination is S3 or not.
 */
export interface S3BackupDestinationProps extends DestinationLoggingProps, CommonS3Props {
  /**
   * The S3 bucket that will store data and failed records.
   *
   * @default - If `backup` is set to `BackupMode.ALL` or `BackupMode.FAILED`, a bucket will be created for you.
   */
  readonly backupBucket?: s3.IBucket;

  /**
   * Indicates the mode by which incoming records should be backed up to S3, if any.
   *
   * If `backupBucket ` is provided, this will be implicitly set to `BackupMode.ALL`.
   *
   * @default - If `backupBucket` is provided, the default will be `BackupMode.ALL`. Otherwise, the default is
   * `BackupMode.DISABLED` and source records are not backed up to S3.
  */
  readonly backupMode?: BackupMode;
}

/**
 * Generic properties for defining a delivery stream destination.
 */
export interface DestinationProps extends DestinationLoggingProps {
  /**
   * The series of data transformations that should be performed on the data before writing to the destination.
   *
   * @default [] - no data transformation will occur.
   */
  readonly processors?: IDataProcessor[];

  /**
   * The configuration for backing up source records to S3.
   *
   * @default - source records will not be backed up to S3.
   */
  readonly backupConfiguration?: S3BackupDestinationProps;
}

/**
 * Abstract base class that destination types can extend to benefit from methods that create generic configuration.
 */
export abstract class DestinationBase implements IDestination {
  private logGroup?: logs.ILogGroup;

  constructor(protected readonly props: DestinationProps = {}) { }

  abstract bind(scope: Construct, options: DestinationBindOptions): DestinationConfig;

  protected createLoggingOptions(
    scope: Construct,
    deliveryStream: IDeliveryStream,
    streamId: string,
  ): CfnDeliveryStream.CloudWatchLoggingOptionsProperty | undefined {
    if (this.props.logging === false && this.props.logGroup) {
      throw new Error('Destination logging cannot be set to false when logGroup is provided');
    }
    if (this.props.logging !== false || this.props.logGroup) {
      this.logGroup = this.logGroup ?? this.props.logGroup ?? new logs.LogGroup(scope, 'Log Group');
      this.logGroup.grantWrite(deliveryStream);
      return {
        enabled: true,
        logGroupName: this.logGroup.logGroupName,
        logStreamName: this.logGroup.addStream(streamId).logStreamName,
      };
    }
    return undefined;
  }

  protected createProcessingConfig(deliveryStream: IDeliveryStream): CfnDeliveryStream.ProcessingConfigurationProperty | undefined {
    if (this.props.processors && this.props.processors.length > 1) {
      throw new Error('Only one processor is allowed per delivery stream destination');
    }
    if (this.props.processors && this.props.processors.length > 0) {
      const processors = this.props.processors.map((processor) => {
        const processorConfig = processor.bind(deliveryStream);
        const parameters = [{ parameterName: 'RoleArn', parameterValue: (deliveryStream.grantPrincipal as iam.Role).roleArn }];
        parameters.push(processorConfig.processorIdentifier);
        if (processorConfig.bufferInterval) {
          parameters.push({ parameterName: 'BufferIntervalInSeconds', parameterValue: processorConfig.bufferInterval.toSeconds().toString() });
        }
        if (processorConfig.bufferSize) {
          parameters.push({ parameterName: 'BufferSizeInMBs', parameterValue: processorConfig.bufferSize.toMebibytes().toString() });
        }
        if (processorConfig.retries) {
          parameters.push({ parameterName: 'NumberOfRetries', parameterValue: processorConfig.retries.toString() });
        }
        return {
          type: processorConfig.processorType,
          parameters: parameters,
        };
      });
      return {
        enabled: true,
        processors: processors,
      };
    }
    return undefined;
  }

  protected createBackupConfig(scope: Construct, deliveryStream: IDeliveryStream): CfnDeliveryStream.S3DestinationConfigurationProperty | undefined {
    if (!this.props.backupConfiguration) {
      return undefined;
    }
    if (this.props.backupConfiguration.backupMode === BackupMode.DISABLED && this.props.backupConfiguration.backupBucket) {
      throw new Error('Destination backup cannot be set to DISABLED when backupBucket is provided');
    }

    if ((this.props.backupConfiguration.backupMode !== undefined && this.props.backupConfiguration.backupMode !== BackupMode.DISABLED) ||
      this.props.backupConfiguration.backupBucket
    ) {
      const bucket = this.props.backupConfiguration.backupBucket ?? new s3.Bucket(scope, 'BackupBucket');
      bucket.grantReadWrite(deliveryStream);
      return {
        bucketArn: bucket.bucketArn,
        roleArn: (deliveryStream.grantPrincipal as iam.Role).roleArn,
        prefix: this.props.backupConfiguration.prefix,
        errorOutputPrefix: this.props.backupConfiguration.errorOutputPrefix,
        bufferingHints: this.createBufferingHints(this.props.backupConfiguration.bufferingInterval, this.props.backupConfiguration.bufferingSize),
        compressionFormat: this.props.backupConfiguration.compression?.value,
        encryptionConfiguration: this.createEncryptionConfig(deliveryStream, this.props.backupConfiguration.encryptionKey),
      };
    }
    return undefined;
  }

  protected createBufferingHints(bufferingInterval?: Duration, bufferingSize?: Size): CfnDeliveryStream.BufferingHintsProperty | undefined {
    if (bufferingInterval && bufferingSize) {
      if (bufferingInterval.toSeconds() < 60 || bufferingInterval.toSeconds() > 900) {
        throw new Error('Buffering interval must be between 60 and 900 seconds');
      }
      if (bufferingSize.toMebibytes() < 1 || bufferingSize.toMebibytes() > 128) {
        throw new Error('Buffering size must be between 1 and 128 MBs');
      }
      return {
        intervalInSeconds: bufferingInterval.toSeconds(),
        sizeInMBs: bufferingSize.toMebibytes(),
      };
    } else if (!bufferingInterval && bufferingSize) {
      throw new Error('If bufferingSize is specified, bufferingInterval must also be specified');
    } else if (bufferingInterval && !bufferingSize) {
      throw new Error('If bufferingInterval is specified, bufferingSize must also be specified');
    }
    return undefined;
  }

  protected createEncryptionConfig(deliveryStream: IDeliveryStream, encryptionKey?: kms.IKey): CfnDeliveryStream.EncryptionConfigurationProperty {
    encryptionKey?.grantEncryptDecrypt(deliveryStream);
    return encryptionKey != null
      ? { kmsEncryptionConfig: { awskmsKeyArn: encryptionKey.keyArn } }
      : { noEncryptionConfig: 'NoEncryption' };
  }
}
