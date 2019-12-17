#!/usr/bin/env node
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import * as glue from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-glue');

const database = new glue.Database(stack, 'MyDatabase', {
  databaseName: 'my_database',
});

const ordinaryTable = new glue.Table(stack, 'MyTable', {
  database,
  tableName: 'my_table',
  columns: [{
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
  }],
  partitionKeys: [{
    name: 'year',
    type: glue.Schema.SMALL_INT
  }],
  dataFormat: glue.DataFormat.Json
});

const encryptedTable = new glue.Table(stack, 'MyEncryptedTable', {
  database,
  tableName: 'my_encrypted_table',
  columns: [{
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
  }],
  partitionKeys: [{
    name: 'year',
    type: glue.Schema.SMALL_INT
  }],
  dataFormat: glue.DataFormat.Json,
  encryption: glue.TableEncryption.KMS,
  encryptionKey: new kms.Key(stack, 'MyKey')
});

const user = new iam.User(stack, 'MyUser');
ordinaryTable.grantReadWrite(user);
encryptedTable.grantReadWrite(user);

app.synth();
