import { Construct } from 'constructs';
import { BackupMode, CommonDestinationProps, CommonDestinationS3Props } from './common';
import { DestinationBindOptions, DestinationConfig, IDestination } from './destination';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import { createBackupConfig, createBufferingHints, createEncryptionConfig, createLoggingOptions, createProcessingConfig } from './private/helpers';
import { TimeZone, Token, UnscopedValidationError, ValidationError } from '../../core';

/**
 * Props for defining an S3 destination of an Amazon Data Firehose delivery stream.
 */
export interface S3BucketProps extends CommonDestinationS3Props, CommonDestinationProps {
  /**
   * Specify a file extension.
   * It will override the default file extension appended by Data Format Conversion or S3 compression features such as `.parquet` or `.gz`.
   *
   * File extension must start with a period (`.`) and can contain allowed characters: `0-9a-z!-_.*'()`.
   *
   * @see https://docs.aws.amazon.com/firehose/latest/dev/create-destination.html#create-destination-s3
   * @default - The default file extension appended by Data Format Conversion or S3 compression features
   */
  readonly fileExtension?: string;

  /**
   * The time zone you prefer.
   *
   * @see https://docs.aws.amazon.com/firehose/latest/dev/s3-prefixes.html#timestamp-namespace
   *
   * @default - UTC
   */
  readonly timeZone?: TimeZone;
}

/**
 * An S3 bucket destination for data from an Amazon Data Firehose delivery stream.
 */
export class S3Bucket implements IDestination {
  constructor(private readonly bucket: s3.IBucket, private readonly props: S3BucketProps = {}) {
    if (this.props.s3Backup?.mode === BackupMode.FAILED) {
      throw new UnscopedValidationError('S3 destinations do not support BackupMode.FAILED');
    }
  }

  bind(scope: Construct, _options: DestinationBindOptions): DestinationConfig {
    const role = this.props.role ?? new iam.Role(scope, 'S3 Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    const bucketGrant = this.bucket.grantReadWrite(role);

    const { loggingOptions, dependables: loggingDependables } = createLoggingOptions(scope, {
      loggingConfig: this.props.loggingConfig,
      role,
      streamId: 'S3Destination',
    }) ?? {};

    const { backupConfig, dependables: backupDependables } = createBackupConfig(scope, role, this.props.s3Backup) ?? {};

    const fileExtension = this.props.fileExtension;
    if (fileExtension && !Token.isUnresolved(fileExtension)) {
      if (!fileExtension.startsWith('.')) {
        throw new ValidationError("fileExtension must start with '.'", scope);
      }
      if (/[^0-9a-z!\-_.*'()]/.test(fileExtension)) {
        throw new ValidationError("fileExtension can contain allowed characters: 0-9a-z!-_.*'()", scope);
      }
    }

    return {
      extendedS3DestinationConfiguration: {
        cloudWatchLoggingOptions: loggingOptions,
        processingConfiguration: createProcessingConfig(scope, role, this.props.processor),
        roleArn: role.roleArn,
        s3BackupConfiguration: backupConfig,
        s3BackupMode: this.getS3BackupMode(),
        bufferingHints: createBufferingHints(scope, this.props.bufferingInterval, this.props.bufferingSize),
        bucketArn: this.bucket.bucketArn,
        compressionFormat: this.props.compression?.value,
        encryptionConfiguration: createEncryptionConfig(role, this.props.encryptionKey),
        errorOutputPrefix: this.props.errorOutputPrefix,
        prefix: this.props.dataOutputPrefix,
        fileExtension: this.props.fileExtension,
        customTimeZone: this.props.timeZone?.timezoneName,
      },
      dependables: [bucketGrant, ...(loggingDependables ?? []), ...(backupDependables ?? [])],
    };
  }

  private getS3BackupMode(): string | undefined {
    return this.props.s3Backup?.bucket || this.props.s3Backup?.mode === BackupMode.ALL
      ? 'Enabled'
      : undefined;
  }
}
