import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as s3tables from '../../lib';

/**
 * Test for table with partition spec, sort order, and table properties
 */
class TableWithPartitionSortStack extends Stack {
  public readonly table: s3tables.Table;
  public readonly namespace: s3tables.Namespace;
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'PartitionSortBucket', {
      tableBucketName: 'cdk-partition-sort',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.namespace = new s3tables.Namespace(this, 'PartitionSortNamespace', {
      namespaceName: 'partition_sort_ns',
      tableBucket: this.tableBucket,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.table = new s3tables.Table(this, 'PartitionSortTable', {
      tableName: 'events_by_day_sorted',
      namespace: this.namespace,
      openTableFormat: s3tables.OpenTableFormat.ICEBERG,
      icebergMetadata: {
        icebergSchema: {
          schemaFieldList: [
            { id: 1, name: 'day', type: 'date', required: true },
            { id: 2, name: 'person_name', type: 'string', required: true },
            { id: 3, name: 'classes_taken', type: 'int', required: false },
          ],
        },
        // Partition by day
        icebergPartitionSpec: {
          specId: 0,
          fields: [
            {
              sourceId: 1, // References 'day' field (id: 1)
              transform: s3tables.PartitionTransform.IDENTITY,
              name: 'day_partition',
              fieldId: 1000,
            },
          ],
        },
        // Sort by day ascending, then by person_name
        icebergSortOrder: {
          orderId: 1,
          fields: [
            {
              sourceId: 1, // Sort by 'day' first
              transform: 'identity',
              direction: s3tables.SortDirection.ASC,
              nullOrder: s3tables.NullOrder.NULLS_LAST,
            },
            {
              sourceId: 2, // Then by 'person_name'
              transform: 'identity',
              direction: s3tables.SortDirection.ASC,
              nullOrder: s3tables.NullOrder.NULLS_FIRST,
            },
          ],
        },
        tableProperties: [
          { key: 'write.format.default', value: 'parquet' },
          { key: 'write.parquet.compression-codec', value: 'zstd' },
        ],
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

const app = new App();

const partitionSortTest = new TableWithPartitionSortStack(app, 'TableWithPartitionSortStack');

const integ = new IntegTest(app, 'TablePartitionSortIntegTest', {
  testCases: [partitionSortTest],
});

// Assert table exists
const listTables = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'ListTablesCommand', {
  tableBucketARN: partitionSortTest.tableBucket.tableBucketArn,
  namespace: partitionSortTest.namespace.namespaceName,
});

listTables.expect(
  ExpectedResult.objectLike({
    tables: Match.arrayWith([
      Match.objectLike({
        name: partitionSortTest.table.tableName,
      }),
    ]),
  }),
);

// Assert metadata location exists
const getMetadataLocation = integ.assertions.awsApiCall(
  '@aws-sdk/client-s3tables',
  'GetTableMetadataLocationCommand',
  {
    tableBucketARN: partitionSortTest.tableBucket.tableBucketArn,
    namespace: partitionSortTest.namespace.namespaceName,
    name: partitionSortTest.table.tableName,
  },
);

getMetadataLocation.expect(
  ExpectedResult.objectLike({
    metadataLocation: Match.stringLikeRegexp('^s3://.*metadata.*\\.json$'),
    warehouseLocation: Match.stringLikeRegexp('^s3://'),
    versionToken: Match.stringLikeRegexp('.+'),
  }),
);
