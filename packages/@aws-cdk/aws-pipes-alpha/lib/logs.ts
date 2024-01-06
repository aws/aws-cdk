import { IRole } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
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