import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Key } from '@aws-cdk/aws-kms';
import { App, Stack } from '@aws-cdk/core';
import { Database } from '../lib';

const env = {
  account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
};


const app = new App();
const stack = new Stack(app, 'aws-timestream-database-integ', { env });

const key = new Key(stack, 'TestKey');

new Database(stack, 'TestDatabase', {
  databaseName: 'ATestDB',
  kmsKey: key,
});

const database = new Database(stack, 'TestDatabase_2');

const role = new Role(stack, 'testrole', {
  assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
});

database.grantRead(role);


app.synth();