#!/usr/bin/env node
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import cdk = require('@aws-cdk/cdk');
import glue = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-glue');

const database = new glue.Database(stack, 'MyDatabase', {
  databaseName: 'my_database'
});

const ordinaryTable = new glue.Table(stack, 'MyTable', {
  database,
  tableName: 'my_table',
  columns: [{
    name: 'col1',
    type: glue.Schema.string
  }, {
    name: 'col2',
    type: glue.Schema.string,
    comment: 'col2 comment'
  }, {
    name: 'col3',
    type: glue.Schema.array(glue.Schema.string)
  }, {
    name: 'col4',
    type: glue.Schema.map(glue.Schema.string, glue.Schema.string)
  }, {
    name: 'col5',
    type: glue.Schema.struct([{
      name: 'col1',
      type: glue.Schema.string
    }])
  }],
  partitionKeys: [{
    name: 'year',
    type: glue.Schema.smallint
  }],
  storageType: glue.StorageType.Json
});

const encryptedTable = new glue.Table(stack, 'MyEncryptedTable', {
  database,
  tableName: 'my_encrypted_table',
  columns: [{
    name: 'col1',
    type: glue.Schema.string
  }, {
    name: 'col2',
    type: glue.Schema.string,
    comment: 'col2 comment'
  }, {
    name: 'col3',
    type: glue.Schema.array(glue.Schema.string)
  }, {
    name: 'col4',
    type: glue.Schema.map(glue.Schema.string, glue.Schema.string)
  }, {
    name: 'col5',
    type: glue.Schema.struct([{
      name: 'col1',
      type: glue.Schema.string
    }])
  }],
  partitionKeys: [{
    name: 'year',
    type: glue.Schema.smallint
  }],
  storageType: glue.StorageType.Json,
  encryption: glue.TableEncryption.SSE_KMS,
  encryptionKey: new kms.EncryptionKey(stack, 'MyKey')
});

const user = new iam.User(stack, 'MyUser');
ordinaryTable.grantReadWrite(user);
encryptedTable.grantReadWrite(user);

app.run();
