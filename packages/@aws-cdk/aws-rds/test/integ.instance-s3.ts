import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { DatabaseInstance, DatabaseInstanceEngine, SqlServerEngineVersion } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-instance-s3-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

const importBucket = new s3.Bucket(stack, 'ImportBucket');
const exportBucket = new s3.Bucket(stack, 'ExportBucket');

new DatabaseInstance(stack, 'Database', {
  engine: DatabaseInstanceEngine.sqlServerSe({ version: SqlServerEngineVersion.VER_14_00_3192_2_V1 }),
  masterUsername: 'admin',
  vpc,
  s3ImportBuckets: [importBucket],
  s3ExportBuckets: [exportBucket],
});

app.synth();
