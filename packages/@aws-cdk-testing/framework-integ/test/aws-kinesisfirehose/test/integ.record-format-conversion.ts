import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as cdk from 'aws-cdk-lib';
import { AwsApiCall, ExpectedResult, IApiCall, IDeployAssert, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

const app = new cdk.App();

interface DeliveryStreamExpectedConfig {
  deliveryStream: firehose.DeliveryStream;
  expectedConfig: any;
}

function verifyDeliveryStreamAndPutData(assertions: IDeployAssert, deliveryStreamConfig: DeliveryStreamExpectedConfig): IApiCall {
  const { deliveryStream, expectedConfig } = deliveryStreamConfig;

  const describeCall = assertions.awsApiCall('Firehose', 'describeDeliveryStream', {
    DeliveryStreamName: deliveryStream.deliveryStreamName,
  }).expect(ExpectedResult.objectLike({
    DeliveryStreamDescription: {
      Destinations: [
        {
          ExtendedS3DestinationDescription: {
            DataFormatConversionConfiguration: expectedConfig,
          },
        },
      ],
    },
  }));

  const putDataCall = assertions.awsApiCall('Firehose', 'putRecord', {
    DeliveryStreamName: deliveryStream.deliveryStreamName,
    Record: {
      Data: '{"Column_A":"foo","Column_B":"bar"}',
    },
  });
  describeCall.next(putDataCall);
  return putDataCall;
}

class TestStack extends cdk.Stack {
  public readonly deliveryStreamsConfigs: DeliveryStreamExpectedConfig[];
  public readonly bucket: s3.Bucket;
  private readonly table: glue.CfnTable;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new glue.CfnDatabase(this, 'Database', {
      databaseInput: {
        description: 'My database',
      },
      catalogId: this.account,
    });

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

    const table = new glue.CfnTable(this, 'SchemaTable', {
      catalogId: database.catalogId,
      databaseName: database.ref,
      tableInput: {
        storageDescriptor: {
          columns: columns,
        },
      },
    });

    const bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    this.table = table;
    this.bucket = bucket;

    const deliveryStreamsWithExpectedConfigurations: DeliveryStreamExpectedConfig[] = [
      {
        deliveryStream: this.createDeliveryStreamWithDataFormatConversion('CustomHiveJson', {
          schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(this.table),
          inputFormat: new firehose.HiveJsonInputFormat({
            timestampParsers: [
              firehose.TimestampParser.EPOCH_MILLIS,
              firehose.TimestampParser.fromFormatString('yyyy-MM-dd'),
            ],
          }),
          outputFormat: firehose.OutputFormat.ORC,
        }),
        expectedConfig: {
          InputFormatConfiguration: {
            Deserializer: {
              HiveJsonSerDe: {
                TimestampFormats: [
                  'millis',
                  'yyyy-MM-dd',
                ],
              },
            },
          },
        },
      },

      {
        deliveryStream: this.createDeliveryStreamWithDataFormatConversion('CustomOpenXJson', {
          schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(this.table),
          inputFormat: new firehose.OpenXJsonInputFormat({
            lowercaseColumnNames: false,
            columnToJsonKeyMappings: { column_yay: 'Column_A' },
            convertDotsInJsonKeysToUnderscores: true,
          }),
          outputFormat: firehose.OutputFormat.PARQUET,
        }),
        expectedConfig: {
          InputFormatConfiguration: {
            Deserializer: {
              OpenXJsonSerDe: {
                CaseInsensitive: false,
                ColumnToJsonKeyMappings: { column_yay: 'Column_A' },
                ConvertDotsInJsonKeysToUnderscores: true,
              },
            },
          },
        },
      },

      {
        deliveryStream: this.createDeliveryStreamWithDataFormatConversion('CustomOrc', {
          schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(this.table),
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
        expectedConfig: {
          OutputFormatConfiguration: {
            Serializer: {
              OrcSerDe: {
                BlockSizeBytes: cdk.Size.mebibytes(256).toBytes(),
                BloomFilterColumns: ['column_a'],
                BloomFilterFalsePositiveProbability: 0.5,
                Compression: 'NONE',
                DictionaryKeyThreshold: 0.3,
                FormatVersion: 'V0_11',
                EnablePadding: true,
                PaddingTolerance: 0.4,
                RowIndexStride: 5000,
                StripeSizeBytes: cdk.Size.mebibytes(32).toBytes(),
              },
            },
          },
        },
      },

      {
        deliveryStream: this.createDeliveryStreamWithDataFormatConversion('CustomParquet', {
          schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(this.table),
          inputFormat: firehose.InputFormat.OPENX_JSON,
          outputFormat: new firehose.ParquetOutputFormat({
            blockSize: cdk.Size.mebibytes(128),
            pageSize: cdk.Size.mebibytes(2),
            compression: firehose.Compression.GZIP,
            writerVersion: firehose.ParquetWriterVersion.V2,
            enableDictionaryCompression: true,
            maxPadding: cdk.Size.bytes(100),
          }),
        }),
        expectedConfig: {
          OutputFormatConfiguration: {
            Serializer: {
              ParquetSerDe: {
                BlockSizeBytes: cdk.Size.mebibytes(128).toBytes(),
                PageSizeBytes: cdk.Size.mebibytes(2).toBytes(),
                Compression: 'GZIP',
                WriterVersion: 'V2',
                EnableDictionaryCompression: true,
                MaxPaddingBytes: cdk.Size.bytes(100).toBytes(),
              },
            },
          },
        },
      },

      {
        deliveryStream: this.createDeliveryStreamWithDataFormatConversion('DefaultHiveJsonOrc', {
          schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(this.table),
          inputFormat: firehose.InputFormat.HIVE_JSON,
          outputFormat: firehose.OutputFormat.ORC,
        }),
        expectedConfig: {
          InputFormatConfiguration: {
            Deserializer: {
              HiveJsonSerDe: {},
            },
          },
          OutputFormatConfiguration: {
            Serializer: {
              OrcSerDe: {},
            },
          },
        },
      },

      {
        deliveryStream: this.createDeliveryStreamWithDataFormatConversion('DefaultOpenXJsonParquet', {
          schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(this.table),
          inputFormat: firehose.InputFormat.OPENX_JSON,
          outputFormat: firehose.OutputFormat.PARQUET,
        }),
        expectedConfig: {
          InputFormatConfiguration: {
            Deserializer: {
              OpenXJsonSerDe: {},
            },
          },
          OutputFormatConfiguration: {
            Serializer: {
              ParquetSerDe: {},
            },
          },
        },
      },
    ];

    this.deliveryStreamsConfigs = deliveryStreamsWithExpectedConfigurations;
  }

  private createDeliveryStreamWithDataFormatConversion(
    id: string,
    dataFormatConversion: firehose.DataFormatConversionProps,
  ): firehose.DeliveryStream {
    return new firehose.DeliveryStream(this, id, {
      destination: new firehose.S3Bucket(this.bucket, {
        dataOutputPrefix: 'success/',
        errorOutputPrefix: 'error/',
        bufferingInterval: cdk.Duration.seconds(0),
        dataFormatConversion: dataFormatConversion,
      }),
    });
  }
}
const stack = new TestStack(app, 'RecordFormatConversion');

const testCase = new IntegTest(app, 'RecordFormatConversionTest', {
  testCases: [stack],
});

const assertions = testCase.assertions;
const putDataCalls = stack.deliveryStreamsConfigs.map(config => verifyDeliveryStreamAndPutData(assertions, config));

const waitForResults = assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: stack.bucket.bucketName,
  Prefix: 'success',
}).expect(ExpectedResult.objectLike({
  KeyCount: stack.deliveryStreamsConfigs.length,
})).waitForAssertions({
  interval: cdk.Duration.seconds(5),
  totalTimeout: cdk.Duration.minutes(2),
});

const api = waitForResults as AwsApiCall;
api.waiterProvider?.addPolicyStatementFromSdkCall('s3', 'ListBucket', [stack.bucket.bucketArn]);
api.waiterProvider?.addPolicyStatementFromSdkCall('s3', 'GetObject', [stack.bucket.arnForObjects('*')]);

putDataCalls.forEach(call => call.next(waitForResults));
