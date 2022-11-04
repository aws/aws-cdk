#!/usr/bin/env node
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as glue from '../lib';

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
  comment: 'col2 comment',
}, {
  name: 'col3',
  type: glue.Schema.array(glue.Schema.STRING),
}, {
  name: 'col4',
  type: glue.Schema.map(glue.Schema.STRING, glue.Schema.STRING),
}, {
  name: 'col5',
  type: glue.Schema.struct([{
    name: 'col1',
    type: glue.Schema.STRING,
  }]),
}];

const partitionKeys = [{
  name: 'year',
  type: glue.Schema.SMALL_INT,
}];

const avroTable = new glue.Table(stack, 'SerDeAvroTable', {
  database,
  bucket,
  tableName: 'serde_avro_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.avro(),
});

const csvTable = new glue.Table(stack, 'SerDeCsvTable', {
  database,
  bucket,
  tableName: 'serde_csv_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.csv({
    skipHeaderLineCount: 1,
    quoteChar: '\'',
  }),
});

const jsonTable = new glue.Table(stack, 'SerDeJsonTable', {
  database,
  bucket,
  tableName: 'serde_json_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.json({
    ignoreMalformedJson: false,
  }),
});

const logstashTable = new glue.Table(stack, 'SerDeLogstashTable', {
  database,
  bucket,
  tableName: 'serde_logstash_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.logstash({
    format: '%{NOTSPACE:coL1} %{NOTSPACE:coL2} ',
  }),
});

const orcTable = new glue.Table(stack, 'SerDeOrcTable', {
  database,
  bucket,
  tableName: 'serde_orc_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.orc({
    compression: glue.OrcSerDeOptionCompress.ZLIB,
  }),
});

const parquetTable = new glue.Table(stack, 'SerDeParquetTable', {
  database,
  bucket,
  tableName: 'serde_parquet_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.parquet({
    compression: glue.ParquetSerDeOptionCompress.SNAPPY,
  }),
});

const tsvTable = new glue.Table(stack, 'SerDeTsvTable', {
  database,
  bucket,
  tableName: 'serde_tsv_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.tsv({
    skipHeaderLineCount: 1,
    escapeDelimiter: '\\',
    lineDelimiter: '\n',
    fieldDelimiter: ',',
  }),
});

const encryptedTable = new glue.Table(stack, 'MyEncryptedTable', {
  database,
  tableName: 'my_encrypted_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.json(),
  encryption: glue.TableEncryption.KMS,
  encryptionKey: new kms.Key(stack, 'MyKey'),
});

new glue.Table(stack, 'MyPartitionFilteredTable', {
  database,
  tableName: 'partition_filtered_table',
  columns,
  dataFormat: glue.DataFormat.json(),
  enablePartitionFiltering: true,
});

new glue.Table(stack, 'TableWithSerDeParameters', {
  database,
  tableName: 'json_table_with_serde_parameters',
  columns,
  dataFormat: glue.DataFormat.json({
    caseInsensitive: false,
    mappings: {
      col1: 'Col1',
    },
  }),
});

const user = new iam.User(stack, 'MyUser');
csvTable.grantReadWrite(user);
encryptedTable.grantReadWrite(user);

const anotherUser = new iam.User(stack, 'AnotherUser');
avroTable.grantReadWrite(anotherUser);
jsonTable.grantReadWrite(anotherUser);
parquetTable.grantReadWrite(anotherUser);
logstashTable.grantReadWrite(anotherUser);
orcTable.grantReadWrite(anotherUser);
tsvTable.grantReadWrite(anotherUser);

app.synth();
