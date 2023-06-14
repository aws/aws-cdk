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
   * @param bucket an s3 bucket
   */
  public static s3(bucket: s3.IBucket): LoggingDestination {
    return {
      name: bucket.bucketName,
      arn: bucket.bucketArn,
      addr: bucket.node.addr,
    };
  }
  /**
   * Send to CLoudwatch
   * @param logGroup
   */
  public static cloudwatch(logGroup: logs.ILogGroup): LoggingDestination {
    return {
      name: logGroup.logGroupName,
      arn: logGroup.logGroupArn,
      addr: logGroup.node.addr,
    };
  }

  /**
   * Stream to Kinesis
   * @param stream
   */
  public static kinesis(stream: kinesis.IStream): LoggingDestination {
    return {
      name: stream.streamName,
      arn: stream.streamArn,
      addr: stream.node.addr,
    };
  }

  /**
  * A name of the destination
  */
  public abstract readonly name: string;
  /**
   * An Arn of the destination
   */
  public abstract readonly arn: string;
  /**
   * unique addr of the destination
   */
  public abstract readonly addr: string;

  protected constructor() {};
}