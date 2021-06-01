import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import { Duration, Size } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IDeliveryStream } from './delivery-stream';

/**
 * Options for S3 record backup of a delivery stream
 */
export enum BackupMode {
  /**
   * All records are backed up.
   */
  ENABLED,

  /**
   * Only records that failed to deliver or transform are backed up.
   */
  FAILED_ONLY,

  /**
   * No records are backed up.
   */
  DISABLED
}

/**
 * Possible compression options Firehose can use to compress data on delivery
 */
export enum Compression {
  /**
   * gzip
   */
  GZIP,

  /**
   * Hadoop-compatible Snappy
   */
  HADOOP_SNAPPY,

  /**
   * Snappy
   */
  SNAPPY,

  /**
   * Uncompressed
   */
  UNCOMPRESSED,

  /**
   * ZIP
   */
  ZIP
}

/**
 * Configuration for delivery stream destinations
 */
export interface DestinationConfig {
  /**
   * Schema-less properties that will be injected directly into `CfnDeliveryStream`.
   */
  readonly properties: object;
}

/**
 * Each destination type should implement this interface and register its in `DeliveryStream`.
 */
export interface IDestination {
  /**
   * Bind the destination to the `DeliveryStream`.
   *
   * Implementers should use this method to bind resources to the stack and initialize values using the provided stream.
   */
  bind(scope: Construct, _deliveryStream: IDeliveryStream): DestinationConfig
}

/**
 * Specification of a data processor that Firehose will call to transform records before delivering data.
 * TODO: make this more generic since the CFN resource seems to be future-proofing the Lambda-only integration
 */
export interface DataProcessor {
  /**
   * The Lambda function that will be called to transform records.
   * TODO: inspect timeout to validate < 5 minutes?
   */
  readonly lambdaFunction: lambda.IFunction;

  /**
   * The length of time Firehose will buffer incoming data before calling the processor.
   *
   * @default Duration.minutes(1)
   */
  readonly bufferInterval: Duration;

  /**
   * The amount of incoming data Firehose will buffer before calling the processor.
   *
   * @default Size.mebibytes(3)
   */
  readonly bufferSize?: Size;

  /**
   * The number of times Firehose will retry the Lambda function invocation due to network timeout or invocation limits.
   *
   * @default 3
   */
  readonly retries?: number;
}

/**
 * Generic properties for defining a delivery stream destination
 */
export interface DestinationProps {
  /**
   * If true, log errors when Lambda invocation for data transformation or data delivery fails.
   *
   * @default false - do not log errors.
   */
  readonly logging?: boolean;

  /**
   * The CloudWatch log group where log streams will be created to hold error logs.
   *
   * @default - if `logging` is set to `true`, a log group will be created for you.
   */
  readonly logGroup?: logs.ILogGroup;

  /**
   * The CloudWatch log stream where error logs will be written.
   *
   * @default - if `logging` is set to true, a log stream will be created for you.
   */
  readonly logStream?: logs.ILogStream;

  /**
   * The series of data transformations that should be performed on the data before writing to the destination.
   *
   * TODO: this seems to only allow a single transformation but seems to accept an array?
   * TODO: add connection to Lambda VPC from fixed Firehose CIDR
   *
   * @default [] - no data transformation will occur.
   */
  readonly processors?: DataProcessor[];

  /**
   * Indicates the mode by which incoming records should be backed up to S3, if any.
   *
   * If `backupBucket` is provided, this will be implicitly set to `ENABLED`.
   *
   * @default BackupMode.DISABLED - source records are not backed up to S3.
   */
  readonly backup?: BackupMode;

  /**
   * The S3 bucket that will store data and failed records.
   *
   * @default - if `backup` is set to `ENABLED` or `FAILED_ONLY`, a bucket will be created for you.
   */
  readonly backupBucket?: s3.IBucket;

  /**
   * The prefix Firehose will prepend to all source records backed up to S3.
   *
   * @default 'source'
   */
  readonly backupPrefix?: string;
}
