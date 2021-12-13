#!/usr/bin/env node
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as glue from '../lib';

/**
 * Stack verification steps:
 * * aws cloudformation describe-stacks --stack-name aws-cdk-glue --query Stacks[0].Outputs[0].OutputValue
 * * aws glue get-partition-indexes --catalog-id <output-from-above> --database-name my_database --table-name csv_table
 * returns an index with name 'my-index' and one key with name 'year'
 * * aws glue get-partition-indexes --catalog-id <output-from-above> --database-name my_database --table-name json_table
 * returns an index with name 'year-month...' and keys 'year' and 'month'
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-glue');
const bucket = new s3.Bucket(stack, 'DataBucket');
const database = new glue.Database(stack, 'MyDatabase', {
  databaseName: 'my_database',
});

const columns = [{
  name: 'col1',
  type: glue.Schema.STRING,
}, {
  name: 'col2',
  type: glue.Schema.STRING,
}, {
  name: 'col3',
  type: glue.Schema.STRING,
}];

const partitionKeys = [{
  name: 'year',
  type: glue.Schema.SMALL_INT,
}, {
  name: 'month',
  type: glue.Schema.BIG_INT,
}];

const csvTable = new glue.Table(stack, 'CSVTable', {
  database,
  bucket,
  tableName: 'csv_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.CSV,
});

const jsonTable = new glue.Table(stack, 'JSONTable', {
  database,
  bucket,
  tableName: 'json_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.JSON,
});

const partitionIndexProps: glue.PartitionIndexProps = {
  indexName: 'my-index',
  keys: ['year'],
};

const partitionIndexPropsWithoutName: glue.PartitionIndexProps = {
  keys: ['year', 'month'],
};

csvTable.addPartitionIndex(partitionIndexProps);
jsonTable.addPartitionIndex(partitionIndexPropsWithoutName);

// output necessary for stack verification
new cdk.CfnOutput(stack, 'CatalogId', {
  value: database.catalogId,
});

app.synth();
