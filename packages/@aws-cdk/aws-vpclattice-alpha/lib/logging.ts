import { Construct } from 'constructs';
import {
  aws_s3 as s3,
  aws_logs as logs,
  aws_kinesis as kinesis,
}
  from 'aws-cdk-lib';

/**
 * Logging options
 */
export abstract class LoggingDestination {
  /**
   * Construct a logging destination for a S3 Bucket
   * @param s3Bucket
   */
  public static s3(bucket: s3.IBucket): void {

  }
  /**
   * Send to CLoudwatch
   * @param s3Bucket
   */
  public static cloudwatch(logGroup: logs.ILogGroup): void {}

  /**
   * Stream to Kinesis
   * @param s3Bucket
   */
  public static kinesis(stream: kinesis.IStream): void {}
}