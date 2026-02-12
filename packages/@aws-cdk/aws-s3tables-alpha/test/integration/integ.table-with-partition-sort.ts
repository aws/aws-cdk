import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
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

    const base = id.toLowerCase();

    // Bucket: allow a-z0-9- only
    const baseDash = base.replace(/[^a-z0-9-]/g, '-');

    // Namespace/Table: allow a-z0-9_ only
    const baseUnderscore = base.replace(/[^a-z0-9_]/g, '_');

    // Suffix: make unique, but also conform to underscore rule
    const suffix = core.Names.uniqueId(this).slice(-8).toLowerCase();

    const bucketName = `${baseDash}-${suffix}-bucket`;
    const namespaceName = `${baseUnderscore}_${suffix}_ns`;
    const tableName = `${baseUnderscore}_${suffix}_table`;

    this.tableBucket = new s3tables.TableBucket(this, 'PartitionSortBucket', {
      tableBucketName: bucketName,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.namespace = new s3tables.Namespace(this, 'PartitionSortNamespace', {
      namespaceName,
      tableBucket: this.tableBucket,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.table = new s3tables.Table(this, 'PartitionSortTable', {
      tableName,
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
              transform: 'identity', // Keep as-is (it's already a date)
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
              direction: 'asc',
              nullOrder: 'nulls-last',
            },
            {
              sourceId: 2, // Then by 'person_name'
              transform: 'identity',
              direction: 'asc',
              nullOrder: 'nulls-first',
            },
          ],
        },
        tableProperties: {
          'write.format.default': 'parquet',
          'write.parquet.compression-codec': 'zstd',
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

// Assert table exists (use the actual generated name)
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

app.synth();
