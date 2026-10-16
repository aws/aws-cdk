import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import * as firehose from '../lib';

describe('IcebergDestination', () => {
  let stack: cdk.Stack;
  let bucket: s3.IBucket;

  beforeEach(() => {
    stack = new cdk.Stack();
    bucket = new s3.Bucket(stack, 'Bucket');
  });

  test('creates destination with minimal configuration', () => {
    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      IcebergDestinationConfiguration: Match.objectLike({
        CatalogConfiguration: {
          CatalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
        RoleARN: Match.anyValue(),
        S3Configuration: Match.objectLike({
          BucketARN: Match.anyValue(),
          RoleARN: Match.anyValue(),
        }),
      }),
    });
  });

  test('creates destination with warehouse location', () => {
    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          warehouseLocation: 's3://my-warehouse/path',
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      IcebergDestinationConfiguration: {
        CatalogConfiguration: {
          WarehouseLocation: 's3://my-warehouse/path',
        },
      },
    });
  });

  test('throws error when neither catalogArn nor warehouseLocation is specified', () => {
    // THEN
    expect(() => {
      new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {},
      });
    }).toThrow(/IcebergDestination requires at least one of catalogConfiguration\.catalogArn or catalogConfiguration\.warehouseLocation/);
  });

  test('grants S3 read/write permissions to role', () => {
    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['s3:PutObject']),
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  test('supports custom role', () => {
    // GIVEN
    const role = new iam.Role(stack, 'CustomRole', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
        role,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      IcebergDestinationConfiguration: Match.objectLike({
        RoleARN: Match.objectLike({
          'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('CustomRole.*')]),
        }),
      }),
    });
  });

  test('supports destination table configurations', () => {
    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
        destinationTableConfigurations: [
          {
            databaseName: 'my_database',
            tableName: 'my_table',
            uniqueKeys: ['id', 'timestamp'],
            s3ErrorOutputPrefix: 'errors/my_table/',
          },
        ],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      IcebergDestinationConfiguration: {
        DestinationTableConfigurationList: [
          {
            DestinationDatabaseName: 'my_database',
            DestinationTableName: 'my_table',
            UniqueKeys: ['id', 'timestamp'],
            S3ErrorOutputPrefix: 'errors/my_table/',
          },
        ],
      },
    });
  });

  test('supports append only mode', () => {
    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
        appendOnly: true,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      IcebergDestinationConfiguration: {
        AppendOnly: true,
      },
    });
  });

  test('supports buffering configuration', () => {
    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
        bufferingInterval: cdk.Duration.minutes(10),
        bufferingSize: cdk.Size.mebibytes(8),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      IcebergDestinationConfiguration: {
        BufferingHints: {
          IntervalInSeconds: 600,
          SizeInMBs: 8,
        },
      },
    });
  });

  test('supports retry configuration', () => {
    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
        retryDuration: cdk.Duration.seconds(7200),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      IcebergDestinationConfiguration: {
        RetryOptions: {
          DurationInSeconds: 7200,
        },
      },
    });
  });

  test('enables CloudWatch logging by default', () => {
    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      IcebergDestinationConfiguration: {
        CloudWatchLoggingOptions: {
          Enabled: true,
          LogGroupName: Match.anyValue(),
          LogStreamName: Match.anyValue(),
        },
      },
    });
  });

  test('supports S3 backup with FAILED mode', () => {
    // GIVEN
    const backupBucket = new s3.Bucket(stack, 'BackupBucket');

    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
        s3Backup: {
          bucket: backupBucket,
          mode: firehose.BackupMode.FAILED,
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      IcebergDestinationConfiguration: {
        s3BackupMode: 'FailedDataOnly',
      },
    });
  });

  test('throws error when S3 backup mode is ALL', () => {
    // GIVEN
    const backupBucket = new s3.Bucket(stack, 'BackupBucket');

    // THEN
    expect(() => {
      new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
        s3Backup: {
          bucket: backupBucket,
          mode: firehose.BackupMode.ALL,
        },
      });
    }).toThrow(/Iceberg destinations only support BackupMode.FAILED/);
  });

  describe('validation', () => {
    describe('bufferingInterval', () => {
      test('throws error when bufferingInterval exceeds maximum', () => {
        expect(() => {
          new firehose.IcebergDestination(bucket, {
            catalogConfiguration: {
              catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
            },
            bufferingInterval: cdk.Duration.seconds(901),
          });
        }).toThrow(/`bufferingInterval` must be between 0 and 900 seconds, got 901 seconds/);
      });

      test('accepts valid bufferingInterval at minimum boundary', () => {
        expect(() => {
          new firehose.IcebergDestination(bucket, {
            catalogConfiguration: {
              catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
            },
            bufferingInterval: cdk.Duration.seconds(0),
          });
        }).not.toThrow();
      });

      test('accepts valid bufferingInterval at maximum boundary', () => {
        expect(() => {
          new firehose.IcebergDestination(bucket, {
            catalogConfiguration: {
              catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
            },
            bufferingInterval: cdk.Duration.seconds(900),
          });
        }).not.toThrow();
      });
    });

    describe('bufferingSize', () => {
      test('throws error when bufferingSize is below minimum', () => {
        expect(() => {
          new firehose.IcebergDestination(bucket, {
            catalogConfiguration: {
              catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
            },
            bufferingSize: cdk.Size.mebibytes(0.5),
          });
        }).toThrow(/`bufferingSize` must be between 1 and 128 MiB, got 0.5 MiB/);
      });

      test('throws error when bufferingSize exceeds maximum', () => {
        expect(() => {
          new firehose.IcebergDestination(bucket, {
            catalogConfiguration: {
              catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
            },
            bufferingSize: cdk.Size.mebibytes(129),
          });
        }).toThrow(/`bufferingSize` must be between 1 and 128 MiB, got 129 MiB/);
      });

      test('accepts valid bufferingSize at minimum boundary', () => {
        expect(() => {
          new firehose.IcebergDestination(bucket, {
            catalogConfiguration: {
              catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
            },
            bufferingSize: cdk.Size.mebibytes(1),
          });
        }).not.toThrow();
      });

      test('accepts valid bufferingSize at maximum boundary', () => {
        expect(() => {
          new firehose.IcebergDestination(bucket, {
            catalogConfiguration: {
              catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
            },
            bufferingSize: cdk.Size.mebibytes(128),
          });
        }).not.toThrow();
      });
    });

    describe('retryDuration', () => {
      test('throws error when retryDuration exceeds maximum', () => {
        expect(() => {
          new firehose.IcebergDestination(bucket, {
            catalogConfiguration: {
              catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
            },
            retryDuration: cdk.Duration.seconds(7201),
          });
        }).toThrow(/`retryDuration` must be between 0 and 7200 seconds, got 7201 seconds/);
      });

      test('accepts valid retryDuration at minimum boundary', () => {
        expect(() => {
          new firehose.IcebergDestination(bucket, {
            catalogConfiguration: {
              catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
            },
            retryDuration: cdk.Duration.seconds(0),
          });
        }).not.toThrow();
      });

      test('accepts valid retryDuration at maximum boundary', () => {
        expect(() => {
          new firehose.IcebergDestination(bucket, {
            catalogConfiguration: {
              catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
            },
            retryDuration: cdk.Duration.seconds(7200),
          });
        }).not.toThrow();
      });
    });
  });

  test('validates warehouseLocation when schema evolution is enabled', () => {
    expect(() => {
      new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
        schemaEvolutionEnabled: true,
      });
    }).toThrow(/catalogConfiguration.warehouseLocation is required when schemaEvolutionEnabled or tableCreationEnabled is true/);
  });

  test('validates warehouseLocation when table creation is enabled', () => {
    expect(() => {
      new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
        tableCreationEnabled: true,
      });
    }).toThrow(/catalogConfiguration.warehouseLocation is required when schemaEvolutionEnabled or tableCreationEnabled is true/);
  });

  test('supports schema evolution configuration', () => {
    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream2', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
          warehouseLocation: 's3://my-warehouse/path',
        },
        schemaEvolutionEnabled: true,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      IcebergDestinationConfiguration: {
        SchemaEvolutionConfiguration: {
          Enabled: true,
        },
      },
    });
  });

  test('supports table creation configuration', () => {
    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream3', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
          warehouseLocation: 's3://my-warehouse/path',
        },
        tableCreationEnabled: true,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      IcebergDestinationConfiguration: {
        TableCreationConfiguration: {
          Enabled: true,
        },
      },
    });
  });

  test('supports partition spec in destination table configuration', () => {
    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream4', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
        },
        destinationTableConfigurations: [
          {
            databaseName: 'my_database',
            tableName: 'my_table',
            partitionSpec: {
              identity: [
                { sourceName: 'year' },
                { sourceName: 'month' },
                { sourceName: 'day' },
              ],
            },
          },
        ],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      IcebergDestinationConfiguration: {
        DestinationTableConfigurationList: [
          {
            DestinationDatabaseName: 'my_database',
            DestinationTableName: 'my_table',
            PartitionSpec: {
              Identity: [
                { SourceName: 'year' },
                { SourceName: 'month' },
                { SourceName: 'day' },
              ],
            },
          },
        ],
      },
    });
  });

  test('grants CreateTable permission when table creation is enabled', () => {
    // WHEN
    new firehose.DeliveryStream(stack, 'DeliveryStream5', {
      destination: new firehose.IcebergDestination(bucket, {
        catalogConfiguration: {
          catalogArn: 'arn:aws:glue:us-east-1:123456789012:catalog',
          warehouseLocation: 's3://my-warehouse/path',
        },
        tableCreationEnabled: true,
      }),
    });

    // THEN - Without destinationTableConfigurations, wildcard permissions are granted
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: [
              'glue:GetDatabase',
              'glue:GetTable',
              'glue:UpdateTable',
              'glue:CreateTable',
            ],
            Effect: 'Allow',
            Resource: Match.arrayWith([
              Match.objectLike({
                'Fn::Join': [
                  '',
                  Match.arrayWith([
                    Match.stringLikeRegexp('database/\\*'),
                  ]),
                ],
              }),
            ]),
          }),
        ]),
      },
    });
  });
});
