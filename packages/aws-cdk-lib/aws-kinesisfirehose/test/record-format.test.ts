import * as cdk from '../..';
import { Match, Template } from '../../assertions';
import * as glue from '../../aws-glue';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import * as firehose from '../lib';

describe('Record format conversion', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let bucket: s3.IBucket;
  let destinationRole: iam.IRole;
  let database: glue.CfnDatabase;
  let table: glue.CfnTable;

  function expectRecordFormatPropertiesLike(properties: any) {
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      ExtendedS3DestinationConfiguration: {
        DataFormatConversionConfiguration: properties,
      },
    });
  }

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
    bucket = new s3.Bucket(stack, 'Bucket');
    destinationRole = new iam.Role(stack, 'Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
    database = new glue.CfnDatabase(stack, 'Database', {
      databaseInput: {
        description: 'A database',
      },
      catalogId: stack.account,
    });

    table = new glue.CfnTable(stack, 'Table', {
      databaseName: database.ref,
      catalogId: database.catalogId,
      tableInput: {
        description: 'A table',
      },
    });
  });

  it('enabled by default when data format config is set', () => {
    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: new firehose.S3Bucket(bucket, {
        role: destinationRole,
        dataFormatConversion: {
          schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
          inputFormat: firehose.InputFormat.OPENX_JSON,
          outputFormat: firehose.OutputFormat.PARQUET,
        },
      }),
    });

    expectRecordFormatPropertiesLike({
      Enabled: true,
      SchemaConfiguration: { },
      InputFormatConfiguration: { },
      OutputFormatConfiguration: { },
    });
  });

  it('disabled when data format config not set', () => {
    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: new firehose.S3Bucket(bucket, {
        role: destinationRole,
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      ExtendedS3DestinationConfiguration: {
        DataFormatConversionConfiguration: Match.absent(),
      },
    });
  });

  describe('enabled property', () => {
    it('enbled when data format config explicitly enabled', () => {
      new firehose.DeliveryStream(stack, 'Delivery Stream', {
        destination: new firehose.S3Bucket(bucket, {
          role: destinationRole,
          dataFormatConversion: {
            enabled: true,
            schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
            inputFormat: firehose.InputFormat.OPENX_JSON,
            outputFormat: firehose.OutputFormat.PARQUET,
          },
        }),
      });

      expectRecordFormatPropertiesLike({
        Enabled: true,
        SchemaConfiguration: { },
        InputFormatConfiguration: { },
        OutputFormatConfiguration: { },
      });
    });

    it('disabled when data format config explicitly disabled', () => {
      new firehose.DeliveryStream(stack, 'Delivery Stream', {
        destination: new firehose.S3Bucket(bucket, {
          role: destinationRole,
          dataFormatConversion: {
            enabled: false,
            schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
            inputFormat: firehose.InputFormat.OPENX_JSON,
            outputFormat: firehose.OutputFormat.PARQUET,
          },
        }),
      });

      expectRecordFormatPropertiesLike({
        Enabled: false,
        SchemaConfiguration: { },
        InputFormatConfiguration: { },
        OutputFormatConfiguration: { },
      });
    });
  });

  describe('SchemaConfig property', () => {
    describe('fromCfnTable', () => {
      it('without optional props', () => {
        new firehose.DeliveryStream(stack, 'Delivery Stream', {
          destination: new firehose.S3Bucket(bucket, {
            role: destinationRole,
            dataFormatConversion: {
              schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
              inputFormat: firehose.InputFormat.OPENX_JSON,
              outputFormat: firehose.OutputFormat.PARQUET,
            },
          }),
        });

        expectRecordFormatPropertiesLike({
          SchemaConfiguration: {
            DatabaseName: stack.resolve(database.ref),
            TableName: stack.resolve(table.ref),
            CatalogId: table.catalogId,
            Region: stack.region,
            VersionId: 'LATEST',
          },
        });

        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          Roles: [stack.resolve(destinationRole.roleName)],
          PolicyDocument: {
            Statement: Match.arrayWith([
              {
                Action: [
                  'glue:GetTable',
                  'glue:GetTableVersion',
                  'glue:GetTableVersions',
                ],
                Effect: 'Allow',
                Resource: [
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        stack.resolve(stack.partition),
                        `:glue:${stack.region}:123456789012:catalog`,
                      ],
                    ],
                  },
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        stack.resolve(stack.partition),
                        `:glue:${stack.region}:123456789012:database/`,
                        stack.resolve(database.ref),
                      ],
                    ],
                  },
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        stack.resolve(stack.partition),
                        `:glue:${stack.region}:123456789012:table/`,
                        stack.resolve(database.ref),
                        '/',
                        stack.resolve(table.ref),
                      ],
                    ],
                  },
                ],
              },
              {
                Action: 'glue:GetSchemaVersion',
                Effect: 'Allow',
                Resource: '*',
              },
            ]),
          },
        });
      });

      it('with all optional props', () => {
        new firehose.DeliveryStream(stack, 'Delivery Stream', {
          destination: new firehose.S3Bucket(bucket, {
            role: destinationRole,
            dataFormatConversion: {
              schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table, {
                versionId: 'some_version',
                region: 'some_region',
              }),
              inputFormat: firehose.InputFormat.OPENX_JSON,
              outputFormat: firehose.OutputFormat.PARQUET,
            },
          }),
        });

        expectRecordFormatPropertiesLike({
          SchemaConfiguration: {
            DatabaseName: stack.resolve(database.ref),
            TableName: stack.resolve(table.ref),
            CatalogId: table.catalogId,
            Region: 'some_region',
            VersionId: 'some_version',
          },
        });

        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          Roles: [stack.resolve(destinationRole.roleName)],
          PolicyDocument: {
            Statement: Match.arrayWith([
              {
                Action: [
                  'glue:GetTable',
                  'glue:GetTableVersion',
                  'glue:GetTableVersions',
                ],
                Effect: 'Allow',
                Resource: [
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        stack.resolve(stack.partition),
                        ':glue:some_region:123456789012:catalog',
                      ],
                    ],
                  },
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        stack.resolve(stack.partition),
                        ':glue:some_region:123456789012:database/',
                        stack.resolve(database.ref),
                      ],
                    ],
                  },
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        stack.resolve(stack.partition),
                        ':glue:some_region:123456789012:table/',
                        stack.resolve(database.ref),
                        '/',
                        stack.resolve(table.ref),
                      ],
                    ],
                  },
                ],
              },
              {
                Action: 'glue:GetSchemaVersion',
                Effect: 'Allow',
                Resource: '*',
              },
            ]),
          },
        });
      });
    });
  });

  describe('Input Format property', () => {
    describe('OpenX JSON', () => {
      it('set default', () => {
        new firehose.DeliveryStream(stack, 'Delivery Stream', {
          destination: new firehose.S3Bucket(bucket, {
            dataFormatConversion: {
              schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
              inputFormat: firehose.InputFormat.OPENX_JSON,
              outputFormat: firehose.OutputFormat.PARQUET,
            },
          }),
        });

        expectRecordFormatPropertiesLike({
          InputFormatConfiguration: {
            Deserializer: Match.objectEquals({
              OpenXJsonSerDe: { },
            }),
          },
        });
      });

      it('set custom', () => {
        new firehose.DeliveryStream(stack, 'Delivery Stream', {
          destination: new firehose.S3Bucket(bucket, {
            dataFormatConversion: {
              schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
              inputFormat: new firehose.OpenXJsonInputFormat({
                lowercaseColumnNames: false,
                columnToJsonKeyMappings: { ColumnA: 'KeyA' },
                convertDotsInJsonKeysToUnderscores: true,
              }),
              outputFormat: firehose.OutputFormat.PARQUET,
            },
          }),
        });

        expectRecordFormatPropertiesLike({
          InputFormatConfiguration: {
            Deserializer: Match.objectEquals({
              OpenXJsonSerDe: {
                CaseInsensitive: false,
                ColumnToJsonKeyMappings: { ColumnA: 'KeyA' },
                ConvertDotsInJsonKeysToUnderscores: true,
              },
            }),
          },
        });
      });
    });

    describe('Hive JSON', () => {
      it('set default', () => {
        new firehose.DeliveryStream(stack, 'Delivery Stream', {
          destination: new firehose.S3Bucket(bucket, {
            dataFormatConversion: {
              schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
              inputFormat: firehose.InputFormat.HIVE_JSON,
              outputFormat: firehose.OutputFormat.PARQUET,
            },
          }),
        });

        expectRecordFormatPropertiesLike({
          InputFormatConfiguration: {
            Deserializer: Match.objectEquals({
              HiveJsonSerDe: { },
            }),
          },
        });
      });

      it('set custom', () => {
        new firehose.DeliveryStream(stack, 'Delivery Stream', {
          destination: new firehose.S3Bucket(bucket, {
            dataFormatConversion: {
              schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
              inputFormat: new firehose.HiveJsonInputFormat({
                timestampParsers: [
                  firehose.TimestampParser.EPOCH_MILLIS,
                  firehose.TimestampParser.fromFormatString('yyyy-MM-dd'),
                ],
              }),
              outputFormat: firehose.OutputFormat.PARQUET,
            },
          }),
        });

        expectRecordFormatPropertiesLike({
          InputFormatConfiguration: {
            Deserializer: Match.objectEquals({
              HiveJsonSerDe: {
                TimestampFormats: [
                  'millis',
                  'yyyy-MM-dd',
                ],
              },
            }),
          },
        });
      });

      it.each([['millis'], [''], [' '], ['\t']])
      ('set custom invalid timestamp format string `%s`', (format: string) => {
        expect(() => {
          new firehose.DeliveryStream(stack, 'Delivery Stream', {
            destination: new firehose.S3Bucket(bucket, {
              dataFormatConversion: {
                schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
                inputFormat: new firehose.HiveJsonInputFormat({
                  timestampParsers: [
                    firehose.TimestampParser.fromFormatString(format),
                  ],
                }),
                outputFormat: firehose.OutputFormat.PARQUET,
              },
            }),
          });
        }).toThrow(cdk.UnscopedValidationError);
      });
    });
  });

  describe('Output Format property', () => {
    describe('Parquet', () => {
      it('set default', () => {
        new firehose.DeliveryStream(stack, 'Delivery Stream', {
          destination: new firehose.S3Bucket(bucket, {
            dataFormatConversion: {
              schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
              inputFormat: firehose.InputFormat.HIVE_JSON,
              outputFormat: firehose.OutputFormat.PARQUET,
            },
          }),
        });

        expectRecordFormatPropertiesLike({
          OutputFormatConfiguration: {
            Serializer: Match.objectEquals({
              ParquetSerDe: { },
            }),
          },
        });
      });

      it('set custom', () => {
        new firehose.DeliveryStream(stack, 'Delivery Stream', {
          destination: new firehose.S3Bucket(bucket, {
            dataFormatConversion: {
              schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
              inputFormat: firehose.InputFormat.HIVE_JSON,
              outputFormat: new firehose.ParquetOutputFormat({
                blockSize: cdk.Size.mebibytes(128),
                pageSize: cdk.Size.mebibytes(2),
                compression: firehose.ParquetCompression.GZIP,
                writerVersion: firehose.ParquetWriterVersion.V2,
                enableDictionaryCompression: true,
                maxPadding: cdk.Size.bytes(100),
              }),
            },
          }),
        });

        expectRecordFormatPropertiesLike({
          OutputFormatConfiguration: {
            Serializer: Match.objectEquals({
              ParquetSerDe: {
                BlockSizeBytes: cdk.Size.mebibytes(128).toBytes(),
                PageSizeBytes: cdk.Size.mebibytes(2).toBytes(),
                Compression: 'GZIP',
                WriterVersion: 'V2',
                EnableDictionaryCompression: true,
                MaxPaddingBytes: cdk.Size.bytes(100).toBytes(),
              },
            }),
          },
        });
      });

      it('set custom invalid block size', () => {
        expect(() => {
          new firehose.DeliveryStream(stack, 'Delivery Stream', {
            destination: new firehose.S3Bucket(bucket, {
              dataFormatConversion: {
                schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
                inputFormat: firehose.InputFormat.OPENX_JSON,
                outputFormat: new firehose.ParquetOutputFormat({
                  blockSize: cdk.Size.kibibytes(12),
                }),
              },
            }),
          });
        }).toThrow(cdk.UnscopedValidationError);
      });

      it('set custom invalid page size', () => {
        expect(() => {
          new firehose.DeliveryStream(stack, 'Delivery Stream', {
            destination: new firehose.S3Bucket(bucket, {
              dataFormatConversion: {
                schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
                inputFormat: firehose.InputFormat.OPENX_JSON,
                outputFormat: new firehose.ParquetOutputFormat({
                  pageSize: cdk.Size.kibibytes(2),
                }),
              },
            }),
          });
        }).toThrow(cdk.UnscopedValidationError);
      });
    });

    describe('ORC', () => {
      it('set default', () => {
        new firehose.DeliveryStream(stack, 'Delivery Stream', {
          destination: new firehose.S3Bucket(bucket, {
            dataFormatConversion: {
              schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
              inputFormat: firehose.InputFormat.HIVE_JSON,
              outputFormat: firehose.OutputFormat.ORC,
            },
          }),
        });

        expectRecordFormatPropertiesLike({
          OutputFormatConfiguration: {
            Serializer: Match.objectEquals({
              OrcSerDe: { },
            }),
          },
        });
      });

      it('set custom', () => {
        new firehose.DeliveryStream(stack, 'Delivery Stream', {
          destination: new firehose.S3Bucket(bucket, {
            dataFormatConversion: {
              schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
              inputFormat: firehose.InputFormat.HIVE_JSON,
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
            },
          }),
        });

        expectRecordFormatPropertiesLike({
          OutputFormatConfiguration: {
            Serializer: Match.objectEquals({
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
            }),
          },
        });
      });

      it('set custom invalid block size', () => {
        expect(() => {
          new firehose.DeliveryStream(stack, 'Delivery Stream', {
            destination: new firehose.S3Bucket(bucket, {
              dataFormatConversion: {
                schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
                inputFormat: firehose.InputFormat.OPENX_JSON,
                outputFormat: new firehose.OrcOutputFormat({
                  blockSize: cdk.Size.kibibytes(12),
                }),
              },
            }),
          });
        }).toThrow(cdk.UnscopedValidationError);
      });

      it('set custom invalid stripe size', () => {
        expect(() => {
          new firehose.DeliveryStream(stack, 'Delivery Stream', {
            destination: new firehose.S3Bucket(bucket, {
              dataFormatConversion: {
                schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
                inputFormat: firehose.InputFormat.OPENX_JSON,
                outputFormat: new firehose.OrcOutputFormat({
                  stripeSize: cdk.Size.kibibytes(12),
                }),
              },
            }),
          });
        }).toThrow(cdk.UnscopedValidationError);
      });

      it('set custom invalid row index stride', () => {
        expect(() => {
          new firehose.DeliveryStream(stack, 'Delivery Stream', {
            destination: new firehose.S3Bucket(bucket, {
              dataFormatConversion: {
                schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
                inputFormat: firehose.InputFormat.OPENX_JSON,
                outputFormat: new firehose.OrcOutputFormat({
                  rowIndexStride: 450,
                }),
              },
            }),
          });
        }).toThrow(cdk.UnscopedValidationError);
      });

      it.each([[-1], [100]])
      ('set custom invalid bloom filter false positive probability %i', (probability: number) => {
        expect(() => {
          new firehose.DeliveryStream(stack, 'Delivery Stream', {
            destination: new firehose.S3Bucket(bucket, {
              dataFormatConversion: {
                schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
                inputFormat: firehose.InputFormat.OPENX_JSON,
                outputFormat: new firehose.OrcOutputFormat({
                  bloomFilterFalsePositiveProbability: probability,
                }),
              },
            }),
          });
        }).toThrow(cdk.UnscopedValidationError);
      });

      it.each([[-1], [100]])
      ('set custom invalid dictionary key threshold %i', (threshold: number) => {
        expect(() => {
          new firehose.DeliveryStream(stack, 'Delivery Stream', {
            destination: new firehose.S3Bucket(bucket, {
              dataFormatConversion: {
                schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
                inputFormat: firehose.InputFormat.OPENX_JSON,
                outputFormat: new firehose.OrcOutputFormat({
                  dictionaryKeyThreshold: threshold,
                }),
              },
            }),
          });
        }).toThrow(cdk.UnscopedValidationError);
      });

      it.each([[-1], [100]])
      ('set custom invalid padding tolerance %i', (tolerance: number) => {
        expect(() => {
          new firehose.DeliveryStream(stack, 'Delivery Stream', {
            destination: new firehose.S3Bucket(bucket, {
              dataFormatConversion: {
                schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(table),
                inputFormat: firehose.InputFormat.OPENX_JSON,
                outputFormat: new firehose.OrcOutputFormat({
                  paddingTolerance: tolerance,
                }),
              },
            }),
          });
        }).toThrow(cdk.UnscopedValidationError);
      });
    });
  });
});
