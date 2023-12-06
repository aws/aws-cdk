#!/usr/bin/env node
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-glue');

const bucket = new s3.Bucket(stack, 'DataBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

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

const avroTable = new glue.S3Table(stack, 'AVROTable', {
  database,
  bucket,
  tableName: 'avro_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.AVRO,
});

const csvTable = new glue.S3Table(stack, 'CSVTable', {
  database,
  bucket,
  tableName: 'csv_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.CSV,
});

const jsonTable = new glue.S3Table(stack, 'JSONTable', {
  database,
  bucket,
  tableName: 'json_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.JSON,
});

const parquetTable = new glue.S3Table(stack, 'ParquetTable', {
  database,
  bucket,
  tableName: 'parquet_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.PARQUET,
});

const encryptedTable = new glue.S3Table(stack, 'MyEncryptedTable', {
  database,
  tableName: 'my_encrypted_table',
  columns,
  partitionKeys,
  dataFormat: glue.DataFormat.JSON,
  encryption: glue.TableEncryption.KMS,
  encryptionKey: new kms.Key(stack, 'MyKey', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  }),
});

new glue.S3Table(stack, 'MyPartitionFilteredTable', {
  database,
  bucket,
  tableName: 'partition_filtered_table',
  columns,
  dataFormat: glue.DataFormat.JSON,
  enablePartitionFiltering: true,
});

new glue.S3Table(stack, 'MyTableWithConnection', {
  database,
  bucket,
  tableName: 'connection_table',
  columns,
  dataFormat: glue.DataFormat.JSON,
});

new glue.S3Table(stack, 'MyTableWithStorageDescriptorParameters', {
  database,
  bucket,
  tableName: 'table_with_storage_descriptor_parameters',
  columns,
  dataFormat: glue.DataFormat.JSON,
  storageParameters: [
    glue.StorageParameter.skipHeaderLineCount(1),
    glue.StorageParameter.compressionType(glue.CompressionType.GZIP),
    glue.StorageParameter.custom('foo', 'bar'), // Will have no effect
    glue.StorageParameter.custom('separatorChar', ','), // Will describe the separator char used in the data
    glue.StorageParameter.custom(glue.StorageParameters.WRITE_PARALLEL, 'off'),
  ],
});

new glue.S3Table(stack, 'MyTableWithPartitionProjectionParameters', {
  database,
  bucket,
  tableName: 'table_with_partition_projection_parameters',
  columns,
  dataFormat: glue.DataFormat.JSON,
  partitionProjection: new glue.DatePartitionProjection(
    'columnName',
    's3://DOC-EXAMPLE-BUCKET/prefix/${columnName}/',
    'NOW-3YEARS,NOW',
    'dd-MM-yyyy',
    1,
    glue.DateIntervalUnit.DAYS,
  ),
});

new glue.Table(stack, 'MyDeprecatedTable', {
  database,
  bucket,
  tableName: 'deprecated_table',
  columns,
  dataFormat: glue.DataFormat.JSON,
});

const user = new iam.User(stack, 'MyUser');
csvTable.grantReadWrite(user);
encryptedTable.grantReadWrite(user);

const anotherUser = new iam.User(stack, 'AnotherUser');
avroTable.grantReadWrite(anotherUser);
jsonTable.grantReadWrite(anotherUser);
parquetTable.grantReadWrite(anotherUser);

new integ.IntegTest(app, 'aws-cdk-glue-table-integ', {
  testCases: [stack],
});

app.synth();
