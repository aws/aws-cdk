#!/usr/bin/env node
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Database, DataCatalogEncryptionAtRest, DataFormat, S3Table, Schema } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-glue');

const catalogKey = new Key(stack, 'CatalogKey', {
  enableKeyRotation: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const database = new Database(stack, 'Database', {
  databaseName: 'testdb',
});

// Encrypt this database's catalog, which happens to be the account-wide one,
// since we constructed it without passing an explicit catalog.
database.catalog.encryptAtRest(DataCatalogEncryptionAtRest.kms(catalogKey));

new S3Table(stack, 'MyTable', {
  database: database,
  columns: [
    {
      name: 'col1',
      type: Schema.STRING,
    },
  ],
  partitionKeys: [
    {
      name: 'year',
      type: Schema.SMALL_INT,
    },
  ],
  dataFormat: DataFormat.JSON,
  enablePartitionFiltering: true,
  partitionIndexes: [
    {
      indexName: 'test',
      keyNames: [
        'year',
      ],
    },
  ],
});

new integ.IntegTest(app, 'aws-cdk-glue-table-integ', {
  testCases: [stack],
});

app.synth();
