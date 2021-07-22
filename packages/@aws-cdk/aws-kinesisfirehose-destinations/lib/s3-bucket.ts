import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from 'constructs';
import { CommonDestinationProps, Compression } from './common';
import { createLoggingOptions } from './private/helpers';

/**
 * Props for defining an S3 destination of a Kinesis Data Firehose delivery stream.
 */
export interface S3BucketProps extends CommonDestinationProps {
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
}

/**
 * An S3 bucket destination for data from a Kinesis Data Firehose delivery stream.
 */
export class S3Bucket implements firehose.IDestination {
  constructor(private readonly bucket: s3.IBucket, private readonly props: S3BucketProps = {}) { }

  bind(scope: Construct, _options: firehose.DestinationBindOptions): firehose.DestinationConfig {
    const role = this.props.role ?? new iam.Role(scope, 'S3 Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    const bucketGrant = this.bucket.grantReadWrite(role);

    const { loggingOptions, dependables: loggingDependables } = createLoggingOptions(scope, {
      logging: this.props.logging,
      logGroup: this.props.logGroup,
      role,
      streamId: 'S3Destination',
    }) ?? {};

    return {
      extendedS3DestinationConfiguration: {
        cloudWatchLoggingOptions: loggingOptions,
        roleArn: role.roleArn,
        bucketArn: this.bucket.bucketArn,
        compressionFormat: this.props.compression?.value,
      },
      dependables: [bucketGrant, ...(loggingDependables ?? [])],
    };
  }
}
