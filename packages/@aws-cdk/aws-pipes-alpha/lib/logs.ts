/**
   * Represents the Amazon CloudWatch Logs logging configuration settings for the pipe.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-cloudwatchlogslogdestination.html
   */
export interface CloudwatchLogsLogDestinationProperty {
  /**
     * The AWS Resource Name (ARN) for the CloudWatch log group to which EventBridge sends the log records.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-cloudwatchlogslogdestination.html#cfn-pipes-pipe-cloudwatchlogslogdestination-loggrouparn
     */
  readonly logGroupArn?: string;
}

/**
   * Represents the Amazon Kinesis Data Firehose logging configuration settings for the pipe.
   *
   * @struct
   * @stability external
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
   * Represents the Amazon S3 logging configuration settings for the pipe.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html
   */
export interface S3LogDestinationProperty {
  /**
     * The name of the Amazon S3 bucket to which EventBridge delivers the log records for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-bucketname
     */
  readonly bucketName?: string;

  /**
     * The AWS account that owns the Amazon S3 bucket to which EventBridge delivers the log records for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-bucketowner
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
     */
  readonly outputFormat?: string;

  /**
     * The prefix text with which to begin Amazon S3 log object names.
     *
     * For more information, see [Organizing objects using prefixes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-prefixes.html) in the *Amazon Simple Storage Service User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-prefix
     */
  readonly prefix?: string;
}

export interface PipeLogConfigurationProperty {
  /**
     * The logging configuration settings for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-cloudwatchlogslogdestination
     */
  readonly cloudwatchLogsLogDestination?: CloudwatchLogsLogDestinationProperty;

  /**
     * The Amazon Kinesis Data Firehose logging configuration settings for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-firehoselogdestination
     */
  readonly firehoseLogDestination?: FirehoseLogDestinationProperty ;

  /**
     * Whether the execution data (specifically, the `payload` , `awsRequest` , and `awsResponse` fields) is included in the log messages for this pipe.
     *
     * This applies to all log destinations for the pipe.
     *
     * For more information, see [Including execution data in logs](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-logs.html#eb-pipes-logs-execution-data) in the *Amazon EventBridge User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-includeexecutiondata
     */
  readonly includeExecutionData?: Array<string>;

  /**
     * The level of logging detail to include.
     *
     * This applies to all log destinations for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-level
     */
  readonly level?: string;

  /**
     * The Amazon S3 logging configuration settings for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-s3logdestination
     */
  readonly s3LogDestination?: S3LogDestinationProperty;
}

/**
   * Represents the Amazon S3 logging configuration settings for the pipe.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html
   */
export interface S3LogDestinationProperty {
  /**
     * The name of the Amazon S3 bucket to which EventBridge delivers the log records for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-bucketname
     */
  readonly bucketName?: string;

  /**
     * The AWS account that owns the Amazon S3 bucket to which EventBridge delivers the log records for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-bucketowner
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
     */
  readonly outputFormat?: string;

  /**
     * The prefix text with which to begin Amazon S3 log object names.
     *
     * For more information, see [Organizing objects using prefixes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-prefixes.html) in the *Amazon Simple Storage Service User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-prefix
     */
  readonly prefix?: string;
}

/**
   * Represents the Amazon Kinesis Data Firehose logging configuration settings for the pipe.
   *
   * @struct
   * @stability external
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
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-cloudwatchlogslogdestination.html
   */
export interface CloudwatchLogsLogDestinationProperty {
  /**
     * The AWS Resource Name (ARN) for the CloudWatch log group to which EventBridge sends the log records.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-cloudwatchlogslogdestination.html#cfn-pipes-pipe-cloudwatchlogslogdestination-loggrouparn
     */
  readonly logGroupArn?: string;
}
