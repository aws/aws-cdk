import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as core from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as s3tables from '../../lib';

/**
 * Test for table with partition spec, sort order, and table properties
 */
class TableWithPartitionSortStack extends core.Stack {
  public readonly table: s3tables.Table;
  public readonly namespace: s3tables.Namespace;
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'PartitionSortBucket', {
      tableBucketName: 'partition-sort-table-bucket',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.namespace = new s3tables.Namespace(this, 'PartitionSortNamespace', {
      namespaceName: 'partition_sort_namespace',
      tableBucket: this.tableBucket,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.table = new s3tables.Table(this, 'PartitionSortTable', {
      tableName: 'partition_sort_table',
      namespace: this.namespace,
      openTableFormat: s3tables.OpenTableFormat.ICEBERG,
      icebergMetadata: {
        icebergSchema: {
          schemaFieldList: [
            {
              name: 'id',
              type: 'int',
              required: true,
              id: 1,
            },
            {
              name: 'timestamp',
              type: 'timestamp',
              required: true,
              id: 2,
            },
            {
              name: 'data',
              type: 'string',
              id: 3,
            },
          ],
        },
        icebergPartitionSpec: {
          specId: 0,
          fields: [
            {
              sourceId: 2,
              transform: 'day',
              name: 'timestamp_day',
              fieldId: 1000,
            },
          ],
        },
        icebergSortOrder: {
          orderId: 1,
          fields: [
            {
              sourceId: 1,
              transform: 'identity',
              direction: 'asc',
              nullOrder: 'nulls-first',
            },
          ],
        },
        tableProperties: {
          'write.format.default': 'parquet',
          'write.parquet.compression-codec': 'snappy',
        },
      },
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

const app = new core.App();

const partitionSortTest = new TableWithPartitionSortStack(app, 'TableWithPartitionSortStack');

const integ = new IntegTest(app, 'TablePartitionSortIntegTest', {
  testCases: [partitionSortTest],
});

// Assert table exists
const listTables = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'ListTablesCommand', {
  tableBucketARN: partitionSortTest.tableBucket.tableBucketArn,
  namespace: partitionSortTest.namespace.namespaceName,
});

listTables.expect(ExpectedResult.objectLike({
  tables: [
    {
      name: 'partition_sort_table',
    },
  ],
}));

app.synth();
