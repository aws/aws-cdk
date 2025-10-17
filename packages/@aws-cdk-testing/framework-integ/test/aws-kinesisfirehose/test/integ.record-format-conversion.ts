import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  public readonly deliveryStreams: firehose.DeliveryStream[];
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

    const registry = new glue.CfnRegistry(this, 'SchemaRegistry', {
      name: 'my_schema_registry',
    });

    const inlineSchemaTable = this.createTableWithInlineSchema(database);
    const registrySchemaTable = this.createTableWithRegisrySchema(database, registry);

    const deliveryStreams = [
      this.createDeliveryStreamWithDataFormatConversion('CustomHiveJson', {
        schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(inlineSchemaTable),
        inputFormat: new firehose.HiveJsonInputFormat({
          timestampParsers: [
            firehose.TimestampParser.EPOCH_MILLIS,
            firehose.TimestampParser.fromFormatString('yyyy-MM-dd'),
          ],
        }),
        outputFormat: firehose.OutputFormat.ORC,
      }),

      this.createDeliveryStreamWithDataFormatConversion('CustomOpenXJson', {
        schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(inlineSchemaTable),
        inputFormat: new firehose.OpenXJsonInputFormat({
          lowercaseColumnNames: false,
          columnToJsonKeyMappings: { column_yay: 'Column_A' },
          convertDotsInJsonKeysToUnderscores: true,
        }),
        outputFormat: firehose.OutputFormat.PARQUET,
      }),

      this.createDeliveryStreamWithDataFormatConversion('CustomOrc', {
        schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(inlineSchemaTable),
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
      }),

      this.createDeliveryStreamWithDataFormatConversion('CustomOrcZlib', {
        schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(inlineSchemaTable),
        inputFormat: firehose.InputFormat.OPENX_JSON,
        outputFormat: new firehose.OrcOutputFormat({
          compression: firehose.OrcCompression.ZLIB,
          formatVersion: firehose.OrcFormatVersion.V0_12,
        }),
      }),

      this.createDeliveryStreamWithDataFormatConversion('CustomOrcSnappy', {
        schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(inlineSchemaTable),
        inputFormat: firehose.InputFormat.OPENX_JSON,
        outputFormat: new firehose.OrcOutputFormat({
          compression: firehose.OrcCompression.SNAPPY,
        }),
      }),

      this.createDeliveryStreamWithDataFormatConversion('CustomParquet', {
        schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(inlineSchemaTable),
        inputFormat: firehose.InputFormat.OPENX_JSON,
        outputFormat: new firehose.ParquetOutputFormat({
          blockSize: cdk.Size.mebibytes(128),
          pageSize: cdk.Size.mebibytes(2),
          compression: firehose.ParquetCompression.UNCOMPRESSED,
          writerVersion: firehose.ParquetWriterVersion.V2,
          enableDictionaryCompression: true,
          maxPadding: cdk.Size.bytes(100),
        }),
      }),

      this.createDeliveryStreamWithDataFormatConversion('CustomParquetGzip', {
        schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(inlineSchemaTable),
        inputFormat: firehose.InputFormat.OPENX_JSON,
        outputFormat: new firehose.ParquetOutputFormat({
          compression: firehose.ParquetCompression.GZIP,
          writerVersion: firehose.ParquetWriterVersion.V1,
        }),
      }),

      this.createDeliveryStreamWithDataFormatConversion('CustomParquetSnappy', {
        schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(inlineSchemaTable),
        inputFormat: firehose.InputFormat.OPENX_JSON,
        outputFormat: new firehose.ParquetOutputFormat({
          compression: firehose.ParquetCompression.SNAPPY,
        }),
      }),

      this.createDeliveryStreamWithDataFormatConversion('DefaultHiveJsonOrcInlineSchema', {
        schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(inlineSchemaTable),
        inputFormat: firehose.InputFormat.HIVE_JSON,
        outputFormat: firehose.OutputFormat.ORC,
      }),

      this.createDeliveryStreamWithDataFormatConversion('DefaultOpenXJsonParquetInlineSchema', {
        schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(inlineSchemaTable),
        inputFormat: firehose.InputFormat.OPENX_JSON,
        outputFormat: firehose.OutputFormat.PARQUET,
      }),

      this.createDeliveryStreamWithDataFormatConversion('DefaultHiveJsonOrcRegistrySchema', {
        schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(registrySchemaTable),
        inputFormat: firehose.InputFormat.HIVE_JSON,
        outputFormat: firehose.OutputFormat.ORC,
      }),

      this.createDeliveryStreamWithDataFormatConversion('DefaultOpenXJsonParquetRegistrySchema', {
        schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(registrySchemaTable),
        inputFormat: firehose.InputFormat.OPENX_JSON,
        outputFormat: firehose.OutputFormat.PARQUET,
      }),
    ];

    this.deliveryStreams = deliveryStreams;
  }

  private createTableWithInlineSchema(database: glue.CfnDatabase): glue.CfnTable {
    const columns = [
      {
        name: 'column_a',
        type: 'string',
      },
      {
        name: 'column_b',
        type: 'string',
      },
    ];

    return new glue.CfnTable(this, 'InlineSchemaTable', {
      catalogId: database.catalogId,
      databaseName: database.ref,
      tableInput: {
        storageDescriptor: {
          columns: columns,
        },
      },
    });
  }

  private createTableWithRegisrySchema(database: glue.CfnDatabase, registry: glue.CfnRegistry): glue.CfnTable {
    const schemaDefinition = JSON.stringify({
      type: 'record',
      name: 'MyRecord',
      fields: [
        {
          name: 'column_a',
          type: 'string',
        },
        {
          name: 'column_b',
          type: 'string',
        },
      ],
    });

    const schema = new glue.CfnSchema(this, 'Schema', {
      registry: {
        arn: registry.attrArn,
      },
      compatibility: 'NONE',
      dataFormat: 'AVRO',
      name: 'my_schema',
      schemaDefinition: schemaDefinition,
    });

    return new glue.CfnTable(this, 'RegistrySchemaTable', {
      catalogId: database.catalogId,
      databaseName: database.ref,
      tableInput: {
        storageDescriptor: {
          schemaReference: {
            schemaVersionId: schema.attrInitialSchemaVersionId,
          },
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
const testCase = new integ.IntegTest(app, 'RecordFormatConversionTest', {
  testCases: [stack],
});

const assertions = testCase.assertions;

function putData(deliveryStream: firehose.DeliveryStream): integ.IApiCall {
  return assertions.awsApiCall('Firehose', 'putRecord', {
    DeliveryStreamName: deliveryStream.deliveryStreamName,
    Record: {
      Data: JSON.stringify({
        Column_A: 'foo',
        Column_B: 'bar',
      }),
    },
  });
}

function waitForResult(expectedPrefix: String): integ.IApiCall {
  const waitForKey = assertions.awsApiCall('S3', 'listObjectsV2', {
    Bucket: stack.bucket.bucketName,
    Prefix: expectedPrefix,
  }).expect(integ.ExpectedResult.objectLike({
    KeyCount: 1,
  })).waitForAssertions({
    interval: cdk.Duration.seconds(5),
    totalTimeout: cdk.Duration.minutes(2),
  });

  const api = waitForKey as integ.AwsApiCall;
  api.waiterProvider?.addPolicyStatementFromSdkCall('s3', 'ListBucket', [stack.bucket.bucketArn]);
  api.waiterProvider?.addPolicyStatementFromSdkCall('s3', 'GetObject', [stack.bucket.arnForObjects('*')]);
  return waitForKey;
}

stack.deliveryStreams.forEach(deliveryStream => {
  const putDataCall = putData(deliveryStream);
  const waitForResultCall = waitForResult(`success/${deliveryStream.node.id}/`);
  putDataCall.next(waitForResultCall);
});
