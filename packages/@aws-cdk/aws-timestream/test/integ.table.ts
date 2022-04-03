import { Key } from '@aws-cdk/aws-kms';
import { App, Stack } from '@aws-cdk/core';
import { Database, Table } from '../lib';

const env = {
  account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
};

const app = new App();
const stack = new Stack(app, 'aws-timestream-table-integ', { env });

const key = new Key(stack, 'TestKey');

const database = new Database(stack, 'TestDatabase', {
  databaseName: 'ATestDB',
  kmsKey: key,
});

new Table(stack, 'TestTable', {
  database,
});

app.synth();