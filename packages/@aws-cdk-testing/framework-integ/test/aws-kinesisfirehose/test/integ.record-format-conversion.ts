import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

const app = new cdk.App();

const SCHEMA_COLUMNS = [
  {
    name: 'column_a',
    type: 'string',
  },
  {
    name: 'column_b',
    type: 'string',
  },
];

class TestStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const database = new glue.CfnDatabase(this, 'Database', {
      databaseInput: {
        description: 'My database',
      },
      catalogId: this.account,
    });

    const schemaTable = this.createTableWithInlineSchema(database);

    // default hive json input with default orc output
    this.createDeliveryStreamWithDataFormatConversion('DefaultHiveJsonOrc', {
      schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(schemaTable),
      inputFormat: firehose.InputFormat.HIVE_JSON,
      outputFormat: firehose.OutputFormat.ORC,
    });

    // default openx json input with default parquet output
    this.createDeliveryStreamWithDataFormatConversion('DefaultOpenXJsonParquet', {
      schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(schemaTable),
      inputFormat: firehose.InputFormat.OPENX_JSON,
      outputFormat: firehose.OutputFormat.PARQUET,
    });

    // custom hive json input
    this.createDeliveryStreamWithDataFormatConversion('CustomHiveJson', {
      schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(schemaTable),
      inputFormat: new firehose.HiveJsonInputFormat({
        timestampParsers: [
          firehose.TimestampParser.EPOCH_MILLIS,
          firehose.TimestampParser.fromFormatString('yyyy-MM-dd'),
        ],
      }),
      outputFormat: firehose.OutputFormat.ORC,
    });

    // custom openx json input
    this.createDeliveryStreamWithDataFormatConversion('CustomOpenXJson', {
      schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(schemaTable),
      inputFormat: new firehose.OpenXJsonInputFormat({
        lowercaseColumnNames: false,
        columnToJsonKeyMappings: { column_yay: 'Column_A' },
        convertDotsInJsonKeysToUnderscores: true,
      }),
      outputFormat: firehose.OutputFormat.PARQUET,
    });

    // custom orc output
    this.createDeliveryStreamWithDataFormatConversion('CustomOrc', {
      schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(schemaTable),
      inputFormat: firehose.InputFormat.OPENX_JSON,
      outputFormat: new firehose.OrcOutputFormat({
        blockSize: cdk.Size.mebibytes(256),
        bloomFilterColumns: ['column_a'],
        bloomFilterFalsePositiveProbability: 0.5,
        compression: firehose.OrcCompression.NONE,
        dictionaryKeyThreshold: 0.3,
        formatVersion: firehose.OrcFormatVersion.V0_11,
        enablePadding: true,
        paddingTolerance: 0.4,
        rowIndexStride: 5000,
        stripeSize: cdk.Size.mebibytes(32),
      }),
    });

    // ORC ZLIB compression
    this.createDeliveryStreamWithDataFormatConversion('CustomOrcZlib', {
      schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(schemaTable),
      inputFormat: firehose.InputFormat.OPENX_JSON,
      outputFormat: new firehose.OrcOutputFormat({
        compression: firehose.OrcCompression.ZLIB,
        formatVersion: firehose.OrcFormatVersion.V0_12,
      }),
    });

    // ORC SNAPPY compression
    this.createDeliveryStreamWithDataFormatConversion('CustomOrcSnappy', {
      schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(schemaTable),
      inputFormat: firehose.InputFormat.OPENX_JSON,
      outputFormat: new firehose.OrcOutputFormat({
        compression: firehose.OrcCompression.SNAPPY,
      }),
    });

    // custom parquet output format
    this.createDeliveryStreamWithDataFormatConversion('CustomParquet', {
      schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(schemaTable),
      inputFormat: firehose.InputFormat.OPENX_JSON,
      outputFormat: new firehose.ParquetOutputFormat({
        blockSize: cdk.Size.mebibytes(128),
        pageSize: cdk.Size.mebibytes(2),
        compression: firehose.ParquetCompression.UNCOMPRESSED,
        writerVersion: firehose.ParquetWriterVersion.V2,
        enableDictionaryCompression: true,
        maxPadding: cdk.Size.bytes(100),
      }),
    });

    // Parquet GZIP compression
    this.createDeliveryStreamWithDataFormatConversion('CustomParquetGzip', {
      schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(schemaTable),
      inputFormat: firehose.InputFormat.OPENX_JSON,
      outputFormat: new firehose.ParquetOutputFormat({
        compression: firehose.ParquetCompression.GZIP,
        writerVersion: firehose.ParquetWriterVersion.V1,
      }),
    });

    // Parquet SNAPPY compression
    this.createDeliveryStreamWithDataFormatConversion('CustomParquetSnappy', {
      schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(schemaTable),
      inputFormat: firehose.InputFormat.OPENX_JSON,
      outputFormat: new firehose.ParquetOutputFormat({
        compression: firehose.ParquetCompression.SNAPPY,
      }),
    });
  }

  private createTableWithInlineSchema(database: glue.CfnDatabase): glue.CfnTable {
    return new glue.CfnTable(this, 'InlineSchemaTable', {
      catalogId: database.catalogId,
      databaseName: database.ref,
      tableInput: {
        storageDescriptor: {
          columns: SCHEMA_COLUMNS,
        },
      },
    });
  }

  private createDeliveryStreamWithDataFormatConversion(
    id: string,
    dataFormatConversion: firehose.DataFormatConversionProps,
  ): firehose.DeliveryStream {
    return new firehose.DeliveryStream(this, id, {
      destination: new firehose.S3Bucket(this.bucket, {
        dataOutputPrefix: `success/${id}/`,
        errorOutputPrefix: `error/${id}/`,
        bufferingInterval: cdk.Duration.seconds(0),
        dataFormatConversion: dataFormatConversion,
      }),
    });
  }
}

const stack = new TestStack(app, 'RecordFormatConversion');
new integ.IntegTest(app, 'RecordFormatConversionTest', {
  testCases: [stack],
});
