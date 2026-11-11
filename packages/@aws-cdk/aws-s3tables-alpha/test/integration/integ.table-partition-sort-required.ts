import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as s3tables from '../../lib';

/**
 * Test for table with partition spec and sort order using only required fields.
 */
class TablePartitionSortRequiredStack extends Stack {
  public readonly table: s3tables.Table;
  public readonly namespace: s3tables.Namespace;
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'PartitionSortRequiredFieldsBucket', {
      tableBucketName: 'partition-sort-req-bucket-v2',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.namespace = new s3tables.Namespace(this, 'PartitionSortRequiredNamespace', {
      namespaceName: 'partition_sort_required_ns',
      tableBucket: this.tableBucket,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.table = new s3tables.Table(this, 'PartitionSortRequiredTable', {
      tableName: 'events_by_day_v2',
      namespace: this.namespace,
      openTableFormat: s3tables.OpenTableFormat.ICEBERG,
      icebergMetadata: {
        icebergSchema: {
          schemaFieldList: [
            { id: 1, name: 'day', type: 'date', required: true },
          ],
        },
        icebergPartitionSpec: {
          fields: [
            {
              sourceId: 1,
              transform: s3tables.IcebergTransform.IDENTITY,
              name: 'day_partition',
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

const partitionSortRequiredTest = new TablePartitionSortRequiredStack(app, 'TablePartitionSortRequiredFieldsStack');

const integ = new IntegTest(app, 'TablePartitionSortRequiredIntegTest', {
  testCases: [partitionSortRequiredTest],
});

const listTables = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'ListTablesCommand', {
  tableBucketARN: partitionSortRequiredTest.tableBucket.tableBucketArn,
  namespace: partitionSortRequiredTest.namespace.namespaceName,
});

listTables.expect(
  ExpectedResult.objectLike({
    tables: Match.arrayWith([
      Match.objectLike({
        name: partitionSortRequiredTest.table.tableName,
      }),
    ]),
  }),
);

const getMetadataLocation = integ.assertions.awsApiCall(
  '@aws-sdk/client-s3tables',
  'GetTableMetadataLocationCommand',
  {
    tableBucketARN: partitionSortRequiredTest.tableBucket.tableBucketArn,
    namespace: partitionSortRequiredTest.namespace.namespaceName,
    name: partitionSortRequiredTest.table.tableName,
  },
);

getMetadataLocation.expect(
  ExpectedResult.objectLike({
    metadataLocation: Match.stringLikeRegexp('^s3://.*metadata.*\\.json$'),
    warehouseLocation: Match.stringLikeRegexp('^s3://'),
    versionToken: Match.stringLikeRegexp('.+'),
  }),
);

