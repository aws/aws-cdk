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
  readonly timeZone?: core.TimeZone;

  readonly dataFormatConversionConfiguration?: DataFormatConversionConfiguration;
}

interface IDeserializer {
  bind(): CfnDeliveryStream.DeserializerProperty;
}

interface OpenXJsonDeserializerProps {
  readonly caseInsensitive?: boolean;
  readonly columnToJsonKeyMappings?: Record<string, string>;
  readonly convertDotsInJsonKeysToUnderscores?: boolean;
}
class OpenXJsonDeserializer implements IDeserializer {
  constructor(readonly props?: OpenXJsonDeserializerProps) {}

  bind(): CfnDeliveryStream.DeserializerProperty {
    return {
      openXJsonSerDe: {
        ...this.props,
      },
    };
  }
}

interface HiveJsonDeserializerProps {
  readonly timestampFormats?: string[];
}

class HiveJsonDeserializer implements IDeserializer {
  constructor(readonly props?: HiveJsonDeserializerProps) {}

  bind(): CfnDeliveryStream.DeserializerProperty {
    return {
      hiveJsonSerDe: {
        ...this.props,
      },
    };
  }
}

class InputFormat {
  constructor(readonly deserializer: IDeserializer) {}

  static readonly OPENX_JSON = new InputFormat(new OpenXJsonDeserializer());
  static readonly HIVE_JSON = new InputFormat(new HiveJsonDeserializer());
}

interface ISerializer {
  bind(): CfnDeliveryStream.SerializerProperty;
}

interface ParquetSerializerProps {
  readonly blockSizeBytes?: number;
  readonly compression?: "UNCOMPRESSED|SNAPPY|GZIP";
  readonly enableDictionaryCompression?: boolean;
  readonly maxPaddingBytes?: number;
  readonly pageSizeBytes?: number;
  readonly writerVersion?: "V1|V2";
}
class ParquetSerializer implements ISerializer {
  constructor(readonly props?: ParquetSerializerProps) {}
  bind(): CfnDeliveryStream.SerializerProperty {
    return {
      parquetSerDe: {
        ...this.props,
      },
    };
  }
}

interface OrcSerializerProps {
  readonly blockSizeBytes?: number;
  readonly bloomFilterColumns?: string[];
  readonly bloomFilterFalsePositiveProbability?: number;
  readonly compression?: "SNAPPY|UNCOMPRESSED|GZIP";
  readonly dictionaryKeyThreshold?: number;
  readonly enablePadding?: boolean;
  readonly formatVersion?: "V0_12|V0_11";
  readonly paddingTolerance?: number;
  readonly rowIndexStride?: number;
  readonly stripeSizeBytes?: number;
}
class OrcSerializer implements ISerializer {
  constructor(readonly props?: OrcSerializerProps) {}
  bind(): CfnDeliveryStream.SerializerProperty {
    return {
      orcSerDe: {
        ...this.props,
      },
    };
  }
}

class OutputFormat {
  constructor(readonly serializer: ISerializer) {}

  static readonly PARQUET = new OutputFormat(new ParquetSerializer());
  static readonly ORC = new OutputFormat(new OrcSerializer());
}

interface DataFormatConversionSchemaProps {
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

class DataFormatConversionSchema {
  static fromCfnTable(table: glue.CfnTable) {
    const stack = core.Stack.of(table);
    return new DataFormatConversionSchema({
      tableName: table.ref,
      databaseName: table.databaseName,
      databaseRegion: stack.region,
      catalogId: stack.account,
      versionId: "LATEST",
    });
  }

  // Once Glue L2 constructs are stable, we can do something like the following to support it
  // static fromTable(table: glue.Table) {}

  constructor(readonly props: DataFormatConversionSchemaProps) {}

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
  readonly schema: DataFormatConversionSchema;
  readonly inputFormat: InputFormat;
  readonly outputFormat: OutputFormat;
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

    const dataFormatConversionConfiguration = this.props.dataFormatConversionConfiguration ? {
      enabled: true,
      schemaConfiguration: this.props.dataFormatConversionConfiguration.schema.bind(scope, { role: role }),
      inputFormatConfiguration: {
        deserializer: this.props.dataFormatConversionConfiguration.inputFormat.deserializer.bind()
      },
      outputFormatConfiguration: { 
        serializer: this.props.dataFormatConversionConfiguration.outputFormat.serializer.bind(),
      }
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
