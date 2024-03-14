/**
 * A DeadLetterConfig object that contains information about a dead-letter queue configuration.
 */
export interface DeadLetterConfigParameters {
  /**
   * The ARN of the specified target for the dead-letter queue,
   *
   * For Amazon Kinesis stream and Amazon DynamoDB stream sources, specify either an Amazon SNS topic or Amazon SQS queue ARN.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-deadletterconfig.html#cfn-pipes-pipe-deadletterconfig-arn
   * @default no dead letter target queue
   */
  readonly arn?: string;
}
