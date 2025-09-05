import { Construct } from 'constructs';
import { BackupMode, CommonDestinationProps, CommonDestinationS3Props } from './common';
import { DestinationBindOptions, DestinationConfig, IDestination } from './destination';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import { createBackupConfig, createBufferingHints, createEncryptionConfig, createLoggingOptions, createProcessingConfig } from './private/helpers';
import * as core from '../../core';
import { CfnDeliveryStream } from './kinesisfirehose.generated';
import * as glue from '../../aws-glue';

/**
 * Props for defining an S3 destination of an Amazon Data Firehose delivery stream.
 */
export interface S3BucketProps extends CommonDestinationS3Props, CommonDestinationProps {
  /**
   * Specify a file extension.
   * It will override the default file extension appended by Data Format Conversion or S3 compression features such as `.parquet` or `.gz`.
   *
   * File extension is invalid, it must start with a period (`.`) and can contain allowed characters: `0-9a-z!-_.*'()`.
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
  readonly timeZone?: core.TimeZone;

  readonly dataFormatConversionConfiguration?: DataFormatConversionConfiguration;
}

interface IInputFormat {
  render(): CfnDeliveryStream.InputFormatConfigurationProperty;
}

interface OpenXJsonInputFormatProps {
  readonly caseInsensitive?: boolean;
  readonly columnToJsonKeyMappings?: Record<string, string>;
  readonly convertDotsInJsonKeysToUnderscores?: boolean;
}
class OpenXJsonInputFormat implements IInputFormat {
  constructor(readonly props?: OpenXJsonInputFormatProps) {}

  private createOpenXJsonSerde(): CfnDeliveryStream.OpenXJsonSerDeProperty {
    const props = this.props
    return props ? {
      caseInsensitive: props.caseInsensitive,
      columnToJsonKeyMappings: props.columnToJsonKeyMappings,
      convertDotsInJsonKeysToUnderscores: props.convertDotsInJsonKeysToUnderscores,
    } : {}
  }

  render(): CfnDeliveryStream.InputFormatConfigurationProperty {
    return {
      deserializer: {
        openXJsonSerDe: this.createOpenXJsonSerde(),
      },
    };
  }
}

// Validation of Joda time formats is possible but requires third party dependency.
class TimestampParser {
  private constructor(readonly format: string) {}

  static readonly EPOCH_MILLIS = new TimestampParser('millis')
  static readonly DEFAULT = new TimestampParser('java.sql.Timestamp::valueOf')

  static fromFormatString(format: string) {
    return new TimestampParser(format)
  }
}

interface HiveJsonInputFormatProps {
  readonly timestampFormats?: TimestampParser[];
}

class HiveJsonInputFormat implements IInputFormat {
  constructor(readonly props?: HiveJsonInputFormatProps) {}

  private createHiveJsonSerde(): CfnDeliveryStream.HiveJsonSerDeProperty {
    const props = this.props
    return props ? {
      timestampFormats: props.timestampFormats?.map(format => format.format),
    } : {}
  }

  render(): CfnDeliveryStream.InputFormatConfigurationProperty {
    return {
      deserializer: {
        hiveJsonSerDe: this.createHiveJsonSerde(),
      },
    };
  }
}

class InputFormat {
  static readonly OPENX_JSON = new OpenXJsonInputFormat();
  static readonly HIVE_JSON = new HiveJsonInputFormat();
}

interface IOutputFormat {
  render(): CfnDeliveryStream.OutputFormatConfigurationProperty;
}

enum WriterVersion {
  V1 = "V1",
  V2 = "V2",
}

enum Compression {
  UNCOMPRESSED = "UNCOMPRESSED",
  SNAPPY = "SNAPPY",
  GZIP = "GZIP",
}

interface ParquetOutputFormatProps {
  readonly blockSize?: core.Size;
  readonly compression?: Compression;
  readonly enableDictionaryCompression?: boolean;
  readonly maxPadding?: core.Size;
  readonly pageSize?: core.Size;
  readonly writerVersion?: WriterVersion;
}
class ParquetOutputFormat implements IOutputFormat {
  constructor(readonly props?: ParquetOutputFormatProps) {
    this.validateProps(props)
  }

  private validateProps(props?: ParquetOutputFormatProps) {
    if (!props) {
      return
    }

    if (props.blockSize !== undefined && props.blockSize.toMebibytes() < 64) {
      throw new core.UnscopedValidationError(`Block size ${props.blockSize.toMebibytes()} is invalid, it must be at least 64 MiB`)
    }

    if (props.pageSize !== undefined && props.pageSize.toKibibytes() < 64) {
      throw new core.UnscopedValidationError(`Page size ${props.pageSize.toKibibytes()} is invalid, it must be at least 64 KiB`)
    }
  }

  private createParquetSerDeProps(): CfnDeliveryStream.ParquetSerDeProperty {
    const props = this.props
    return props ? {
      blockSizeBytes: props.blockSize?.toBytes(),
      compression: props.compression,
      enableDictionaryCompression: props.enableDictionaryCompression,
      maxPaddingBytes: props.maxPadding?.toBytes(),
      pageSizeBytes: props.pageSize?.toBytes(),
      writerVersion: props.writerVersion,
    } : {}
  }

  render(): CfnDeliveryStream.OutputFormatConfigurationProperty {
    return {
      serializer: {
        parquetSerDe: this.createParquetSerDeProps()
      },
    };
  }
}

enum FormatVersion {
  V0_11 = "V0_11",
  V0_12 = "V0_12",
}

interface OrcOutputFormatProps {
  readonly blockSize?: core.Size;
  readonly bloomFilterColumns?: string[];
  readonly bloomFilterFalsePositiveProbability?: number;
  readonly compression?: Compression;
  readonly dictionaryKeyThreshold?: number;
  readonly enablePadding?: boolean;
  readonly formatVersion?: FormatVersion;
  readonly paddingTolerance?: number;
  readonly rowIndexStride?: number;
  readonly stripeSize?: core.Size;
}
class OrcOutputFormat implements IOutputFormat {
  constructor(readonly props?: OrcOutputFormatProps) {
    this.validateProps(props)
  }

  private betweenInclusive(num: number, min: number, max: number) {
    return num >= min && num <= max
  }

  private validateProps(props?: OrcOutputFormatProps) {
    if (!props) {
      return
    }

    if (props.blockSize !== undefined && props.blockSize.toMebibytes() < 64) {
      throw new core.UnscopedValidationError(`Block size ${props.blockSize.toMebibytes()} is invalid, it must be at least 64 MiB`)
    }

    if (props.stripeSize !== undefined && props.stripeSize.toMebibytes() < 8) {
      throw new core.UnscopedValidationError(`Stripe size ${props.stripeSize.toMebibytes()} is invalid, it must be at least 8 MiB`)
    }

    if (props.bloomFilterFalsePositiveProbability !== undefined && !this.betweenInclusive(props.bloomFilterFalsePositiveProbability, 0, 1)) {
      throw new core.UnscopedValidationError(`Bloom filter false positive probability ${props.bloomFilterFalsePositiveProbability} is invalid, it must be between 0 and 1, inclusive`)
    }

    if (props.dictionaryKeyThreshold !== undefined && !this.betweenInclusive(props.dictionaryKeyThreshold, 0, 1)) {
      throw new core.UnscopedValidationError(`Invalid Dictioanry key threshold ${props.dictionaryKeyThreshold} is invalid, it must be between 0 and 1, inclusive`)
    }

    if (props.paddingTolerance !== undefined && !this.betweenInclusive(props.paddingTolerance, 0, 1)) {
      throw new core.UnscopedValidationError(`Padding tolerance ${props.paddingTolerance} is invalid, it must be between 0 and 1, inclusive`)
    }

    if (props.rowIndexStride !== undefined && props.rowIndexStride < 1000) {
      throw new core.UnscopedValidationError(`Row index stride ${props.rowIndexStride} is invalid, it must be at least 1000`)
    }
  }

  private createOrcSerDeProps(): CfnDeliveryStream.OrcSerDeProperty {
    const props = this.props;
    return props ? {
      blockSizeBytes: props.blockSize?.toBytes(),
      bloomFilterColumns: props.bloomFilterColumns,
      bloomFilterFalsePositiveProbability: props.bloomFilterFalsePositiveProbability,
      compression: props.compression,
      dictionaryKeyThreshold: props.dictionaryKeyThreshold,
      enablePadding: props.enablePadding,
      formatVersion: props.formatVersion,
      paddingTolerance: props.paddingTolerance,
      rowIndexStride: props.rowIndexStride,
      stripeSizeBytes: props.stripeSize?.toBytes(),
    } : {}
  }
  render(): CfnDeliveryStream.OutputFormatConfigurationProperty {
    return {
      serializer: {
        orcSerDe: this.createOrcSerDeProps(),
      },
    };
  }
}

class OutputFormat {
  static readonly PARQUET = new ParquetOutputFormat();
  static readonly ORC = new OrcOutputFormat();
}

interface ConversionSchemaProps {
  /**
   * The ID of the AWS Glue Data Catalog.
   *
   * If you don't supply this, the AWS account ID is used by default.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-catalogid
   */
  readonly catalogId?: string;

  /**
   * Specifies the name of the AWS Glue database that contains the schema for the output data.
   *
   * > If the `SchemaConfiguration` request parameter is used as part of invoking the `CreateDeliveryStream` API, then the `DatabaseName` property is required and its value must be specified.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-databasename
   */
  readonly databaseName: string;

  /**
   * If you don't specify an AWS Region, the default is the current Region.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-region
   */
  readonly databaseRegion?: string;

  /**
   * Specifies the AWS Glue table that contains the column information that constitutes your data schema.
   *
   * > If the `SchemaConfiguration` request parameter is used as part of invoking the `CreateDeliveryStream` API, then the `TableName` property is required and its value must be specified.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-tablename
   */
  readonly tableName: string;

  /**
   * Specifies the table version for the output data schema.
   *
   * If you don't specify this version ID, or if you set it to `LATEST` , Firehose uses the most recent version. This means that any updates to the table are automatically picked up.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-versionid
   */
  readonly versionId?: string;
}

interface SchemaBindOptions {
  readonly role: iam.IRole;
}

class ConversionSchema {
  static fromCfnTable(table: glue.CfnTable) {
    const stack = core.Stack.of(table);
    return new ConversionSchema({
      tableName: table.ref,
      databaseName: table.databaseName,
      databaseRegion: stack.region,
      catalogId: stack.account,
      versionId: "LATEST",
    });
  }

  // Once Glue L2 constructs are stable, we can do something like the following to support it
  // static fromTable(table: glue.Table) {}

  constructor(readonly props: ConversionSchemaProps) {}

  bind(
    scope: Construct,
    options: SchemaBindOptions,
  ): CfnDeliveryStream.SchemaConfigurationProperty {
    const stack = core.Stack.of(scope);
    const region = this.props.databaseRegion ?? stack.region;

    const tableArn = stack.formatArn({
      service: "glue",
      resource: "table",
      resourceName: `${this.props.databaseName}/${this.props.tableName}`,
      region: region,
      account: this.props.catalogId,
    });

    iam.Grant.addToPrincipal({
      actions: [
        "glue:GetTable",
        "glue:GetTableVersion",
        "glue:GetTableVersions",
      ],
      grantee: options.role,
      resourceArns: [tableArn],
    });

    iam.Grant.addToPrincipal({
      actions: ["glue:GetSchemaVersion"],
      grantee: options.role,
      resourceArns: ['*']
    })

    return {
      roleArn: options.role.roleArn,
      region: region,
      ...this.props,
    };
  }
}

interface DataFormatConversionConfiguration {
  readonly schema: ConversionSchema;
  readonly inputFormat: IInputFormat;
  readonly outputFormat: IOutputFormat;
}

/*
const dataFormatConversionConfiguration: CfnDeliveryStream.DataFormatConversionConfigurationProperty =  {
  outputFormatConfiguration: {
    serializer: {
      orcSerDe: {
        blockSizeBytes: 256,
        bloomFilterColumns: undefined,
        bloomFilterFalsePositiveProbability: 0.05,
        compression: 'SNAPPY|UNCOMPRESSED|GZIP',
        dictionaryKeyThreshold: 0,
        enablePadding: false,
        formatVersion: 'V0_12|V0_11',
        paddingTolerance: 0.05,
        rowIndexStride: 10000,
        stripeSizeBytes: 64,
      },
      parquetSerDe: {
        blockSizeBytes: 256,
        compression: 'UNCOMPRESSED|SNAPPY|GZIP',
        enableDictionaryCompression: false,
        maxPaddingBytes: 10,
        pageSizeBytes: 10,
        writerVersion: 'V1|V2',
      }
    }
  }
}
*/


/**
 * An S3 bucket destination for data from an Amazon Data Firehose delivery stream.
 */
export class S3Bucket implements IDestination {
  constructor(private readonly bucket: s3.IBucket, private readonly props: S3BucketProps = {}) {
    if (this.props.s3Backup?.mode === BackupMode.FAILED) {
      throw new core.UnscopedValidationError('S3 destinations do not support BackupMode.FAILED');
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
    if (fileExtension && !core.Token.isUnresolved(fileExtension)) {
      if (!fileExtension.startsWith('.')) {
        throw new core.ValidationError("fileExtension must start with '.'", scope);
      }
      if (/[^0-9a-z!\-_.*'()]/.test(fileExtension)) {
        throw new core.ValidationError("fileExtension can contain allowed characters: 0-9a-z!-_.*'()", scope);
      }
    }

    const dataFormatConfig = this.props.dataFormatConversionConfiguration
    const dataFormatConversionConfiguration = dataFormatConfig ? {
      enabled: true,
      schemaConfiguration: dataFormatConfig.schema.bind(scope, { role: role }),
      inputFormatConfiguration: dataFormatConfig.inputFormat.render(),
      outputFormatConfiguration: dataFormatConfig.outputFormat.render(),
    } : undefined

    return {
      extendedS3DestinationConfiguration: {
        cloudWatchLoggingOptions: loggingOptions,
        processingConfiguration: createProcessingConfig(scope, role, this.props.processor),
        roleArn: role.roleArn,
        s3BackupConfiguration: backupConfig,
        s3BackupMode: this.getS3BackupMode(),
        bufferingHints: createBufferingHints(scope, this.props.bufferingInterval, this.props.bufferingSize),
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
