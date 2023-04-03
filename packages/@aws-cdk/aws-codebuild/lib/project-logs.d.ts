import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
/**
 * Information about logs built to an S3 bucket for a build project.
 */
export interface S3LoggingOptions {
    /**
     * Encrypt the S3 build log output
     *
     * @default true
     */
    readonly encrypted?: boolean;
    /**
     * The S3 Bucket to send logs to
     */
    readonly bucket: s3.IBucket;
    /**
     * The path prefix for S3 logs
     *
     * @default - no prefix
     */
    readonly prefix?: string;
    /**
     * The current status of the logs in Amazon CloudWatch Logs for a build project
     *
     * @default true
     */
    readonly enabled?: boolean;
}
/**
 * Information about logs built to a CloudWatch Log Group for a build project.
 */
export interface CloudWatchLoggingOptions {
    /**
     * The Log Group to send logs to
     *
     * @default - no log group specified
     */
    readonly logGroup?: logs.ILogGroup;
    /**
     * The prefix of the stream name of the Amazon CloudWatch Logs
     *
     * @default - no prefix
     */
    readonly prefix?: string;
    /**
     * The current status of the logs in Amazon CloudWatch Logs for a build project
     *
     * @default true
     */
    readonly enabled?: boolean;
}
/**
 * Information about logs for the build project. A project can create logs in Amazon CloudWatch Logs, an S3 bucket, or both.
 */
export interface LoggingOptions {
    /**
     * Information about logs built to an S3 bucket for a build project.
     *
     * @default - disabled
     */
    readonly s3?: S3LoggingOptions;
    /**
     * Information about Amazon CloudWatch Logs for a build project.
     *
     * @default - enabled
     */
    readonly cloudWatch?: CloudWatchLoggingOptions;
}
