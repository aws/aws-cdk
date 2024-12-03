import { IDeliveryStream } from '@aws-cdk/aws-kinesisfirehose-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { IPipe } from './pipe';

/**
 * Log data configuration for a pipe.
 */
export enum IncludeExecutionData {
  /**
   * Specify ALL to include the execution data (specifically, the payload, awsRequest, and awsResponse fields) in the log messages for this pipe.
   */
  ALL = 'ALL',
}

/**
 * Log configuration for a pipe.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-logs.html#eb-pipes-logs-level
 */
export enum LogLevel {
  /**
   * No logging
   */
  OFF = 'OFF',
  /**
   * Log only errors
   */
  ERROR = 'ERROR',
  /**
   * Log errors, warnings, and info
   */
  INFO = 'INFO',
  /**
   * Log everything
   */
  TRACE = 'TRACE',
}

/**
 * Log format for `S3LogDestination` logging configuration.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-outputformat
 */
export enum S3OutputFormat {
  /**
  * Plain text
  */
  PLAIN = 'plain',
  /**
  * JSON
  */
  JSON = 'json',
  /**
  * W3C extended log file format
  * @see https://www.w3.org/TR/WD-logfile
  */
  W3C = 'w3c',
}

/**
 * Properties for `S3LogDestination`.
 */
export interface S3LogDestinationProps {
  /**
   * The S3 bucket to deliver the log records for the pipe.
   *
   * The bucket can be in the same or a different AWS Account. If the bucket is in
   * a different acccount, specify `bucketOwner`. You must also allow access to the
   * Pipes role in the bucket policy of the cross-account bucket.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-bucketname
   */
  readonly bucket: IBucket;
  /**
   * The AWS Account that owns the Amazon S3 bucket to which EventBridge delivers the log records for the pipe.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-bucketowner
   * @default - account ID derived from `bucket`
   */
  readonly bucketOwner?: string;
  /**
   * The format for the log records.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-outputformat
   * @default `S3OutputFormat.JSON`
   */
  readonly outputFormat?: S3OutputFormat;
  /**
   * The prefix text with which to begin Amazon S3 log object names.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-prefix
   * @default - no prefix
   */
  readonly prefix?: string;
}

/**
 * Log destination configuration parameters.
 */
export interface LogDestinationParameters {
  /**
   * The logging configuration settings for the pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-cloudwatchlogslogdestination
   *
   * @default - none
   */
  readonly cloudwatchLogsLogDestination?: CfnPipe.CloudwatchLogsLogDestinationProperty;

  /**
   * The Amazon Kinesis Data Firehose logging configuration settings for the pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-firehoselogdestination
   *
   * @default - none
   */
  readonly firehoseLogDestination?: CfnPipe.FirehoseLogDestinationProperty;

  /**
   * The Amazon S3 logging configuration settings for the pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-s3logdestination
   *
   * @default - none
   */
  readonly s3LogDestination?: CfnPipe.S3LogDestinationProperty;
}

/**
 * Log destination configuration.
 */
export interface LogDestinationConfig {
  /**
   * Get the log destination configuration parameters.
   */
  readonly parameters: LogDestinationParameters;
}

/**
 * Log destination base class.
 */
export interface ILogDestination {
  /**
   * Bind the log destination to the pipe.
   */
  bind(pipe: IPipe): LogDestinationConfig;

  /**
   * Grant the pipe role to push to the log destination.
   */
  grantPush(grantee: IRole): void;
}

/**
 * CloudWatch Logs log group for delivery of pipe logs.
 */
export class CloudwatchLogsLogDestination implements ILogDestination {
  private logGroup: ILogGroup;

  constructor(logGroup: ILogGroup) {
    this.logGroup = logGroup;
  }

  bind(_pipe: IPipe): LogDestinationConfig {
    return {
      parameters: {
        cloudwatchLogsLogDestination: {
          logGroupArn: this.logGroup.logGroupArn,
        },
      },
    };
  }

  grantPush(pipeRole: IRole): void {
    this.logGroup.grantWrite(pipeRole);
  }
}

/**
 * Firehose stream for delivery of pipe logs.
 */
export class FirehoseLogDestination implements ILogDestination {
  private deliveryStream: IDeliveryStream;

  constructor(deliveryStream: IDeliveryStream) {
    this.deliveryStream = deliveryStream;
  }

  bind(_pipe: IPipe): LogDestinationConfig {
    return {
      parameters: {
        firehoseLogDestination: {
          deliveryStreamArn: this.deliveryStream.deliveryStreamArn,
        },
      },
    };
  }

  grantPush(pipeRole: IRole): void {
    this.deliveryStream.grantPutRecords(pipeRole);
  }
}

/**
 * S3 bucket for delivery of pipe logs.
 */
export class S3LogDestination implements ILogDestination {
  private parameters: S3LogDestinationProps;

  constructor(parameters: S3LogDestinationProps) {
    this.parameters = parameters;
  }

  bind(_pipe: IPipe): LogDestinationConfig {
    return {
      parameters: {
        s3LogDestination: {
          bucketName: this.parameters.bucket.bucketName,
          bucketOwner: this.parameters.bucketOwner || this.parameters.bucket.env.account,
          outputFormat: this.parameters.outputFormat,
          prefix: this.parameters.prefix,
        },
      },
    };
  }

  grantPush(pipeRole: IRole): void {
    this.parameters.bucket.grantPut(pipeRole);
  }
}
