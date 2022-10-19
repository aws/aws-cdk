import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as rds from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-instance-s3-postgres-integ');

new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_11_12 }),
  vpc: new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 1 }),
  multiAz: false,
  publiclyAccessible: true,
  iamAuthentication: true,
  s3ImportBuckets: [new s3.Bucket(stack, 'ImportBucket', { removalPolicy: cdk.RemovalPolicy.DESTROY })],
  s3ExportBuckets: [new s3.Bucket(stack, 'ExportBucket', { removalPolicy: cdk.RemovalPolicy.DESTROY })],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

app.synth();
