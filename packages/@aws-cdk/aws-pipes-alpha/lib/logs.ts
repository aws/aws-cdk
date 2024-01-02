import { IRole } from 'aws-cdk-lib/aws-iam';

/**
 * Log data output format configuration for a pipe.
 */
export enum S3LogDestinationOutputFormat {
  /**
   * Specify JSON as the output format.
   */
  JSON = 'json',
  /**
   * Specify PLAIN as the output format.
   */
  PLAIN = 'plain',

  /**
   * Specify W3C as the output format.
   * @see https://www.w3.org/TR/WD-logfile
   */
  W3C = 'w3c',

}

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
 * Represents the Amazon CloudWatch Logs logging configuration settings for the pipe.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-cloudwatchlogslogdestination.html
 */
export interface CloudwatchLogsLogDestinationProperty {
  /**
   * The AWS Resource Name (ARN) for the CloudWatch log group to which EventBridge sends the log records.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-cloudwatchlogslogdestination.html#cfn-pipes-pipe-cloudwatchlogslogdestination-loggrouparn
   * @default - if logging is enabled, the default log group is used. Otherwise, no log group is created.
   */
  readonly logGroupArn?: string;
}

/**
 * Represents the Amazon Kinesis Data Firehose logging configuration settings for the pipe.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-firehoselogdestination.html
 */
export interface FirehoseLogDestinationProperty {
  /**
   * The Amazon Resource Name (ARN) of the Kinesis Data Firehose delivery stream to which EventBridge delivers the pipe log records.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-firehoselogdestination.html#cfn-pipes-pipe-firehoselogdestination-deliverystreamarn
   * @default - none
   */
  readonly deliveryStreamArn?: string;
}

/**
 * Represents the Amazon S3 logging configuration settings for the pipe.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html
 */
export interface S3LogDestinationProperty {
  /**
   * The name of the Amazon S3 bucket to which EventBridge delivers the log records for the pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-bucketname
   * @default - none
   */
  readonly bucketName?: string;

  /**
   * The AWS account that owns the Amazon S3 bucket to which EventBridge delivers the log records for the pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-bucketowner
   * @default - none
   */
  readonly bucketOwner?: string;

  /**
   * The format EventBridge uses for the log records.
   *
   * - `json` : JSON
   * - `plain` : Plain text
   * - `w3c` : [W3C extended logging file format](https://docs.aws.amazon.com/https://www.w3.org/TR/WD-logfile)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-outputformat
   * @default - S3LogDestinationOutputFormat.PLAIN
   */
  readonly outputFormat?: S3LogDestinationOutputFormat;

  /**
   * The prefix text with which to begin Amazon S3 log object names.
   *
   * For more information, see [Organizing objects using prefixes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-prefixes.html) in the *Amazon Simple Storage Service User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-prefix
   * @default - none
   */
  readonly prefix?: string;
}

/**
 * Log destination base class.
 */
export interface ILogDestination {
  /**
   * Get the log destination configuration parameters.
   */
  parameters: LogDestinationParameters

  /**
   * Grant the pipe role to push to the log destination.
   */
  grantPush(grantee: IRole): void;
}

/**
 * Log destination parameters.
 */
export interface LogDestinationParameters {
  /**
   * The logging configuration settings for the pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-cloudwatchlogslogdestination
   * @default - if logging is enabled, the default log group is used. Otherwise, no log group is created.
   */
  readonly cloudwatchLogsLogDestination?: CloudwatchLogsLogDestinationProperty;

  /**
   * The Amazon Kinesis Data Firehose logging configuration settings for the pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-firehoselogdestination
   * @default - none
   */
  readonly firehoseLogDestination?: FirehoseLogDestinationProperty;

  /**
   * The Amazon S3 logging configuration settings for the pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-s3logdestination
   * @default - none
   */
  readonly s3LogDestination?: S3LogDestinationProperty;
}

/**
 * Represents the Amazon S3 logging configuration settings for the pipe.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html
 */
export interface S3LogDestinationProperty {
  /**
   * The name of the Amazon S3 bucket to which EventBridge delivers the log records for the pipe.
   * Length Constraints: Minimum length of 3. Maximum length of 63.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-bucketname
   * @default - none
   */
  readonly bucketName?: string;

  /**
   * The AWS account that owns the Amazon S3 bucket to which EventBridge delivers the log records for the pipe.
   * Only 12-digit AWS account numbers are supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-bucketowner
   * @default - the account the pipe is created in
   */
  readonly bucketOwner?: string;

  /**
   * The format EventBridge uses for the log records.
   *
   * - `json` : JSON
   * - `plain` : Plain text
   * - `w3c` : [W3C extended logging file format](https://docs.aws.amazon.com/https://www.w3.org/TR/WD-logfile)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-outputformat
   * @default - S3LogDestinationOutputFormat.PLAIN
   */
  readonly outputFormat?: S3LogDestinationOutputFormat;

  /**
   * The prefix text with which to begin Amazon S3 log object names.
   *
   * Length Constraints: Minimum length of 0. Maximum length of 256.
   *
   * For more information, see [Organizing objects using prefixes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-prefixes.html) in the *Amazon Simple Storage Service User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-prefix
   * @default - none
   */
  readonly prefix?: string;
}

/**
 * Represents the Amazon Kinesis Data Firehose logging configuration settings for the pipe.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-firehoselogdestination.html
 */
export interface FirehoseLogDestinationProperty {
  /**
   * The Amazon Resource Name (ARN) of the Kinesis Data Firehose delivery stream to which EventBridge delivers the pipe log records.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-firehoselogdestination.html#cfn-pipes-pipe-firehoselogdestination-deliverystreamarn
   */
  readonly deliveryStreamArn?: string;
}

/**
 * Represents the Amazon CloudWatch Logs logging configuration settings for the pipe.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-cloudwatchlogslogdestination.html
 */
export interface CloudwatchLogsLogDestinationProperty {
  /**
   * The AWS Resource Name (ARN) for the CloudWatch log group to which EventBridge sends the log records.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-cloudwatchlogslogdestination.html#cfn-pipes-pipe-cloudwatchlogslogdestination-loggrouparn
   * @default - if logging is enabled, the default log group is used. Otherwise, no log group is created.
   */
  readonly logGroupArn?: string;
}
