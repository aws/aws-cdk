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
      tableName: 'test_table',
      namespace: this.namespace,
      openTableFormat: s3tables.OpenTableFormat.ICEBERG,
      icebergMetadata: {
        icebergSchema: {
          schemaFieldList: [
            { id: 1, name: 'event_date', type: 'date', required: true },
          ],
        },
        icebergPartitionSpec: {
          fields: [
            {
              sourceId: 1,
              transform: s3tables.IcebergTransform.IDENTITY,
              name: 'date_partition',
            },
          ],
        },
        icebergSortOrder: {
          fields: [
            {
              sourceId: 1,
              transform: s3tables.IcebergTransform.IDENTITY,
              direction: s3tables.SortDirection.ASC,
              nullOrder: s3tables.NullOrder.NULLS_LAST,
            },
          ],
        },
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
