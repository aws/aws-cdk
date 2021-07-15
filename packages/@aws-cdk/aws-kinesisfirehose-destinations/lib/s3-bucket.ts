import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import { CfnDeliveryStream } from '@aws-cdk/aws-kinesisfirehose';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from 'constructs';

/**
 * Props for defining an S3 destination of a Kinesis Data Firehose delivery stream.
 */
export interface S3Props extends firehose.DestinationProps { }

/**
 * An S3 bucket destination for data from a Kinesis Data Firehose delivery stream.
 */
export class S3Bucket extends firehose.DestinationBase {
  constructor(private readonly bucket: s3.IBucket, s3Props: S3Props = {}) {
    super(s3Props);
  }

  bind(scope: Construct, options: firehose.DestinationBindOptions): firehose.DestinationConfig {
    return {
      properties: {
        extendedS3DestinationConfiguration: this.createExtendedS3DestinationConfiguration(scope, options.deliveryStream, options.role),
      },
    };
  }

  private createExtendedS3DestinationConfiguration(
    scope: Construct,
    deliveryStream: firehose.IDeliveryStream,
    role: iam.IRole,
  ): CfnDeliveryStream.ExtendedS3DestinationConfigurationProperty {
    this.bucket.grantReadWrite(deliveryStream);
    return {
      cloudWatchLoggingOptions: this.createLoggingOptions(scope, deliveryStream, 'S3Destination'),
      roleArn: role.roleArn,
      bucketArn: this.bucket.bucketArn,
    };
  }
}
