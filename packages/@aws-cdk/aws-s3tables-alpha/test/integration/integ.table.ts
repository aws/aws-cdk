import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../../lib';
import { Construct } from 'constructs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Test for table with default parameters
 */
class DefaultTableStack extends core.Stack {
  public readonly table: s3tables.Table;
  public readonly namespace: s3tables.Namespace;
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'DefaultBucket', {
      tableBucketName: 'table-test-bucket',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.namespace = new s3tables.Namespace(this, 'DefaultNamespace', {
      namespaceName: 'table_test_namespace',
      tableBucket: this.tableBucket,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.table = new s3tables.Table(this, 'DefaultTable', {
      tableName: 'default_test_table',
      namespace: this.namespace,
      openTableFormat: s3tables.OpenTableFormat.ICEBERG,
      withoutMetadata: true,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

/**
 * Test for table with schema and compaction settings
 */
class SchemaTableStack extends core.Stack {
  public readonly table: s3tables.Table;
  public readonly namespace: s3tables.Namespace;
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'SchemaBucket', {
      tableBucketName: 'schema-table-bucket',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.namespace = new s3tables.Namespace(this, 'SchemaNamespace', {
      namespaceName: 'schema_table_namespace',
      tableBucket: this.tableBucket,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.table = new s3tables.Table(this, 'SchemaTable', {
      tableName: 'schema_test_table',
      namespace: this.namespace,
      openTableFormat: s3tables.OpenTableFormat.ICEBERG,
      icebergMetadata: {
        icebergSchema: {
          schemaFieldList: [
            {
              name: 'id',
              type: 'int',
              required: true,
            },
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'timestamp',
              type: 'timestamp',
            },
          ],
        },
      },
      compaction: {
        status: s3tables.Status.ENABLED,
        targetFileSizeMb: 128,
      },
      snapshotManagement: {
        status: s3tables.Status.ENABLED,
        maxSnapshotAgeHours: 48,
        minSnapshotsToKeep: 5,
      },
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

/**
 * Test for importing an existing table
 */
class ImportedTableStack extends core.Stack {
  public readonly importedTable: s3tables.ITable;
  public readonly createdTable: s3tables.Table;
  public readonly namespace: s3tables.Namespace;
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'ImportBucket', {
      tableBucketName: 'import-table-bucket',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.namespace = new s3tables.Namespace(this, 'ImportNamespace', {
      namespaceName: 'import_table_namespace',
      tableBucket: this.tableBucket,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    // Create a table to import
    this.createdTable = new s3tables.Table(this, 'CreatedTable', {
      tableName: 'import_test_table',
      namespace: this.namespace,
      openTableFormat: s3tables.OpenTableFormat.ICEBERG,
      withoutMetadata: true,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    // Import the table using fromTableAttributes
    this.importedTable = s3tables.Table.fromTableAttributes(this, 'ImportedTable', {
      tableName: this.createdTable.tableName,
      tableArn: this.createdTable.tableArn,
    });
  }
}

const app = new core.App();

const defaultTableTest = new DefaultTableStack(app, 'DefaultTableStack');
const schemaTableTest = new SchemaTableStack(app, 'SchemaTableStack');
const importedTableTest = new ImportedTableStack(app, 'ImportedTableStack');

const integ = new IntegTest(app, 'TableIntegTest', {
  testCases: [defaultTableTest, schemaTableTest, importedTableTest],
});

// Add assertions for table existence
const listTables = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'ListTablesCommand', {
  tableBucketARN: defaultTableTest.tableBucket.tableBucketArn,
  namespace: defaultTableTest.namespace.namespaceName,
});

listTables.expect(ExpectedResult.objectLike({
  tables: [
    {
      name: 'default_test_table',
    },
  ],
}));

const getTableMaintenanceConfig = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'GetTableMaintenanceConfigurationCommand', {
  name: schemaTableTest.table.tableName,
  namespace: schemaTableTest.namespace.namespaceName,
  tableBucketARN: schemaTableTest.tableBucket.tableBucketArn,
});

getTableMaintenanceConfig.expect(ExpectedResult.objectLike({
  configuration: {
    icebergCompaction: {
      status: 'enabled',
      settings: {
        icebergCompaction: {
          targetFileSizeMB: 128,
        },
      },
    },
    icebergSnapshotManagement: {
      status: 'enabled',
      settings: {
        icebergSnapshotManagement: {
          maxSnapshotAgeHours: 48,
          minSnapshotsToKeep: 5,
        },
      },
    },
  },
}));

app.synth();
