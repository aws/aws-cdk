#!/usr/bin/env node
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import glue = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-glue');

const bucket = new s3.Bucket(stack, 'DataBucket');

const database = new glue.Database(stack, 'MyDatabase', {
  databaseName: 'my_database',
});

const columns = [{
  name: 'col1',
  type: glue.Schema.STRING
}, {
  name: 'col2',
  type: glue.Schema.STRING,
  comment: 'col2 comment'
}, {
  name: 'col3',
  type: glue.Schema.array(glue.Schema.STRING)
}, {
  name: 'col4',
  type: glue.Schema.map(glue.Schema.STRING, glue.Schema.STRING)
}, {
  name: 'col5',
  type: glue.Schema.struct([{
    name: 'col1',
    type: glue.Schema.STRING
  }])
}];

const partitionKeys = [{
  name: 'year',
  type: glue.Schema.SMALL_INT
}];

const avroTable = new glue.Table(stack, 'AVROTable', {
  database,
  bucket,
  tableName: 'avro_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.Avro
});

const csvTable = new glue.Table(stack, 'CSVTable', {
  database,
  bucket,
  tableName: 'csv_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.CSV
});

const jsonTable = new glue.Table(stack, 'JSONTable', {
  database,
  bucket,
  tableName: 'json_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.Json
});

const parquetTable = new glue.Table(stack, 'ParquetTable', {
  database,
  bucket,
  tableName: 'parquet_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.Parquet
});

const encryptedTable = new glue.Table(stack, 'MyEncryptedTable', {
  database,
  tableName: 'my_encrypted_table',
  columns,
  partitionKeys: [{
    name: 'year',
    type: glue.Schema.SMALL_INT
  }],
  dataFormat: glue.DataFormat.Json,
  encryption: glue.TableEncryption.KMS,
  encryptionKey: new kms.Key(stack, 'MyKey')
});

const user = new iam.User(stack, 'MyUser');
csvTable.grantReadWrite(user);
encryptedTable.grantReadWrite(user);

const anotherUser = new iam.User(stack, 'AnotherUser');
avroTable.grantReadWrite(anotherUser);
jsonTable.grantReadWrite(anotherUser);
parquetTable.grantReadWrite(anotherUser);

app.synth();
