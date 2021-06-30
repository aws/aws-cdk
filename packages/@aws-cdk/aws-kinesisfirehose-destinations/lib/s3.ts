import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import { CfnDeliveryStream } from '@aws-cdk/aws-kinesisfirehose';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from 'constructs';

/**
 * Props for defining an S3 destination of a Kinesis Data Firehose delivery stream.
 */
export interface S3Props extends firehose.DestinationProps, firehose.CommonS3Props { }

/**
 * An S3 bucket destination for data from a Kinesis Data Firehose delivery stream.
 */
export class S3 extends firehose.DestinationBase {
  constructor(private readonly bucket: s3.IBucket, private readonly s3Props: S3Props = {}) {
    super(s3Props);
  }

  bind(scope: Construct, options: firehose.DestinationBindOptions): firehose.DestinationConfig {
    return {
      properties: {
        extendedS3DestinationConfiguration: this.createExtendedS3DestinationConfiguration(scope, options.deliveryStream),
      },
    };
  }

  private createExtendedS3DestinationConfiguration(
    scope: Construct,
    deliveryStream: firehose.IDeliveryStream,
  ): CfnDeliveryStream.ExtendedS3DestinationConfigurationProperty {
    this.bucket.grantReadWrite(deliveryStream);
    return {
      cloudWatchLoggingOptions: this.createLoggingOptions(scope, deliveryStream, 'S3Destination'),
      processingConfiguration: this.createProcessingConfig(deliveryStream),
      roleArn: (deliveryStream.grantPrincipal as iam.IRole).roleArn,
      s3BackupConfiguration: this.createBackupConfig(scope, deliveryStream),
      s3BackupMode: this.getS3BackupMode(),
      bufferingHints: this.createBufferingHints(this.s3Props.bufferingInterval, this.s3Props.bufferingSize),
      bucketArn: this.bucket.bucketArn,
      compressionFormat: this.s3Props.compression?.toString(),
      encryptionConfiguration: this.createEncryptionConfig(deliveryStream, this.s3Props.encryptionKey),
      errorOutputPrefix: this.s3Props.errorOutputPrefix,
      prefix: this.s3Props.prefix,
    };
  }

  private getS3BackupMode(): string | undefined {
    if (this.s3Props.backupConfiguration?.backupBucket && !this.s3Props.backupConfiguration.backupMode) {
      return 'Enabled';
    }

    switch (this.s3Props.backupConfiguration?.backupMode) {
      case firehose.BackupMode.ALL:
        return 'Enabled';
      case firehose.BackupMode.DISABLED:
        return 'Disabled';
      case firehose.BackupMode.FAILED:
        throw new Error('Invalid backup mode. Kinesis Data Firehose does not support backup of only failed records for S3 destinations.');
      default:
        return undefined;
    }
  }
}