import { Construct } from 'constructs';
import { BackupMode, CommonDestinationProps, CommonDestinationS3Props } from './common';
import { DestinationBindOptions, DestinationConfig, IDestination } from './destination';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import { createBackupConfig, createBufferingHints, createDynamicPartitioningConfiguration, createEncryptionConfig, createLoggingOptions, createProcessingConfig } from './private/helpers';
import { Duration, Size, Token, ValidationError } from '../../core';

/**
 * Props for defining an S3 destination of an Amazon Data Firehose delivery stream.
 */
export interface S3BucketProps extends CommonDestinationS3Props, CommonDestinationProps {
  /**
   * Specify dynamic partitioning.
   * @see https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning.html
   * @default - Dynamic partitioning is disabled.
   */
  readonly dynamicPartitioning?: DynamicPartitioningProps;
}

/**
 * Props for defining dynamic partitioning.
 * @see https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning.html
 */
export interface DynamicPartitioningProps {
  /**
   * Whether to enable the dynamic partitioning.
   *
   * You can enable dynamic partitioning only when you create a new Firehose stream.
   * You cannot enable dynamic partitioning for an existing Firehose stream that does not have dynamic partitioning already enabled.
   *
   * @see https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning-enable.html
   */
  readonly enabled: boolean;

  /**
   * The total amount of time that Data Firehose spends on retries.
   * @default - TBD
   */
  readonly retry?: Duration;
}

/**
 * An S3 bucket destination for data from an Amazon Data Firehose delivery stream.
 */
export class S3Bucket implements IDestination {
  constructor(private readonly bucket: s3.IBucket, private readonly props: S3BucketProps = {}) {
    if (this.props.s3Backup?.mode === BackupMode.FAILED) {
      throw new Error('S3 destinations do not support BackupMode.FAILED');
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

    let bufferingSize = this.props.bufferingSize;
    if (this.props.dynamicPartitioning?.enabled) {
      // From testing, CFN deployment will fail if `BufferingHints.SizeInMBs` is less than 64.
      // The message is: "BufferingHints.SizeInMBs must be at least 64 when Dynamic Partitioning is enabled."
      if (!bufferingSize) {
        bufferingSize = Size.mebibytes(64);
      } else if (!bufferingSize.isUnresolved() && bufferingSize.toMebibytes() < 64) {
        throw new ValidationError(`'bufferingSize' must be at least 64 MiB when Dynamic Partitioning is enabled, got ${bufferingSize?.toMebibytes()}.`, scope);
      }
    }

    // Validations about prefixes:
    // https://docs.aws.amazon.com/firehose/latest/dev/s3-prefixes.html
    if (this.props.dataOutputPrefix && !Token.isUnresolved(this.props.dataOutputPrefix)) {
      if (this.props.dataOutputPrefix.includes('!{') && !this.props.errorOutputPrefix) {
        throw new ValidationError("'errorOutputPrefix' cannot be null or empty when 'dataOutputPrefix' contains expressions.", scope);
      }
      if (this.props.dataOutputPrefix.includes('!{firehose:error-output-type}')) {
        throw new ValidationError("'dataOutputPrefix' cannot contain '!{firehose:error-output-type}'.", scope);
      }
    }
    if (this.props.errorOutputPrefix && !Token.isUnresolved(this.props.errorOutputPrefix)) {
      if (!this.props.errorOutputPrefix.includes('!{firehose:error-output-type}')) {
        throw new ValidationError("'errorOutputPrefix' must include at least one instance of '!{firehose:error-output-type}'.", scope);
      }
    }

    return {
      extendedS3DestinationConfiguration: {
        cloudWatchLoggingOptions: loggingOptions,
        processingConfiguration: createProcessingConfig(scope, role, this.props.processor),
        roleArn: role.roleArn,
        s3BackupConfiguration: backupConfig,
        s3BackupMode: this.getS3BackupMode(),
        bufferingHints: createBufferingHints(this.props.bufferingInterval, bufferingSize),
        bucketArn: this.bucket.bucketArn,
        compressionFormat: this.props.compression?.value,
        encryptionConfiguration: createEncryptionConfig(role, this.props.encryptionKey),
        errorOutputPrefix: this.props.errorOutputPrefix,
        prefix: this.props.dataOutputPrefix,
        dynamicPartitioningConfiguration: createDynamicPartitioningConfiguration(scope, this.props.dynamicPartitioning),
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
