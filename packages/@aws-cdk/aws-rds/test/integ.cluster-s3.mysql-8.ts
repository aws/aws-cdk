import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as rds from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-s3-mysql-8-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });
const importExportBucket = new s3.Bucket(stack, 'ImportExportBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new rds.DatabaseCluster(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_01_0,
  }),
  credentials: rds.Credentials.fromUsername('admin', {
    password: cdk.SecretValue.plainText('7959866cacc02c2d243ecfe177464fe6'),
  }),
  instances: 1,
  instanceProps: { vpc },
  s3ImportBuckets: [importExportBucket],
  s3ExportBuckets: [importExportBucket],
});

app.synth();
