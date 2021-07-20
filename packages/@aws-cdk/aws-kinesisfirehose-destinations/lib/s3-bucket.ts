import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as s3 from '@aws-cdk/aws-s3';
import { Duration, Size } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Compression, DestinationProps } from './common';
import { createBufferingHints, createLoggingOptions } from './private/helpers';

/**
 * Props for defining an S3 destination of a Kinesis Data Firehose delivery stream.
 */
export interface S3BucketProps extends DestinationProps {
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
 * An S3 bucket destination for data from a Kinesis Data Firehose delivery stream.
 */
export class S3Bucket implements firehose.IDestination {
  constructor(private readonly bucket: s3.IBucket, private props: S3BucketProps = {}) { }

  bind(scope: Construct, _options: firehose.DestinationBindOptions): firehose.DestinationConfig {
    const role = this.props.role ?? new iam.Role(scope, 'S3 Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    this.bucket.grantReadWrite(role);

    return {
      extendedS3DestinationConfiguration: {
        cloudWatchLoggingOptions: createLoggingOptions(scope, { logging: this.props.logging, logGroup: this.props.logGroup, role, streamId: 'S3Destination' }),
        roleArn: role.roleArn,
        bufferingHints: createBufferingHints(this.props.bufferingInterval, this.props.bufferingSize),
        bucketArn: this.bucket.bucketArn,
        compressionFormat: this.props.compression?.value,
        errorOutputPrefix: this.props.errorOutputPrefix,
        prefix: this.props.prefix,
      },
    };
  }
}
