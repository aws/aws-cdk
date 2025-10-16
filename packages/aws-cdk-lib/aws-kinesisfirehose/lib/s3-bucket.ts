import { Construct } from 'constructs';
import { BackupMode, CommonDestinationProps, CommonDestinationS3Props } from './common';
import { DestinationBindOptions, DestinationConfig, IDestination } from './destination';
import { IInputFormat, IOutputFormat, SchemaConfiguration } from './record-format';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import { createBackupConfig, createBufferingHints, createEncryptionConfig, createLoggingOptions, createProcessingConfig } from './private/helpers';
import * as cdk from '../../core';

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
  readonly timeZone?: cdk.TimeZone;

  /**
   * The input format, output format, and schema config for converting data from the JSON format to the Parquet or ORC format before writing to Amazon S3.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-dataformatconversionconfiguration
   *
   * @default no data format conversion is done
   */
  readonly dataFormatConversion?: DataFormatConversionProps;
}

/**
 * Props for specifying data format conversion for Firehose
 *
 * @see https://docs.aws.amazon.com/firehose/latest/dev/record-format-conversion.html */
export interface DataFormatConversionProps {

  /**
   * Whether data format conversion is enabled or not.
   *
   * @default `true`
   */
  readonly enabled?: boolean;

  /**
   * The schema configuration to use in converting the input format to output format
   */
  readonly schemaConfiguration: SchemaConfiguration;

  /**
   * The input format to convert from for record format conversion
   */
  readonly inputFormat: IInputFormat;

  /**
   * The output format to convert to for record format conversion
   */
  readonly outputFormat: IOutputFormat;
}

/**
 * An S3 bucket destination for data from an Amazon Data Firehose delivery stream.
 */
export class S3Bucket implements IDestination {
  constructor(private readonly bucket: s3.IBucket, private readonly props: S3BucketProps = {}) {
    if (this.props.s3Backup?.mode === BackupMode.FAILED) {
      throw new cdk.UnscopedValidationError('S3 destinations do not support BackupMode.FAILED');
    }

    if (this.props.dataFormatConversion && this.props.compression) {
      throw new cdk.UnscopedValidationError('When data record format conversion is enabled, compression cannot be set on the S3 Destination. Compression may only be set in the OutputFormat. By default, this compression is SNAPPY');
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
    if (fileExtension && !cdk.Token.isUnresolved(fileExtension)) {
      if (!fileExtension.startsWith('.')) {
        throw new cdk.ValidationError("fileExtension must start with '.'", scope);
      }
      if (/[^0-9a-z!\-_.*'()]/.test(fileExtension)) {
        throw new cdk.ValidationError("fileExtension can contain allowed characters: 0-9a-z!-_.*'()", scope);
      }
    }

    const dataFormatConfig = this.props.dataFormatConversion;

    const dataFormatConversionConfiguration = dataFormatConfig ? {
      enabled: dataFormatConfig.enabled ?? true,
      schemaConfiguration: dataFormatConfig.schemaConfiguration.bind(scope, { role: role }),
      inputFormatConfiguration: dataFormatConfig.inputFormat.createInputFormatConfig(),
      outputFormatConfiguration: dataFormatConfig.outputFormat.createOutputFormatConfig(),
    } : undefined;

    return {
      extendedS3DestinationConfiguration: {
        cloudWatchLoggingOptions: loggingOptions,
        processingConfiguration: createProcessingConfig(scope, role, this.props.processor),
        roleArn: role.roleArn,
        s3BackupConfiguration: backupConfig,
        s3BackupMode: this.getS3BackupMode(),
        bufferingHints: createBufferingHints(scope, this.props.bufferingInterval, this.props.bufferingSize, dataFormatConversionConfiguration),
        bucketArn: this.bucket.bucketArn,
        dataFormatConversionConfiguration: dataFormatConversionConfiguration,
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
