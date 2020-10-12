import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Credentials, DatabaseCluster, DatabaseClusterEngine } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-s3-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

const kmsKey = new kms.Key(stack, 'DbSecurity');

const importBucket = new s3.Bucket(stack, 'ImportBucket');
const exportBucket = new s3.Bucket(stack, 'ExportBucket');

const cluster = new DatabaseCluster(stack, 'Database', {
  engine: DatabaseClusterEngine.AURORA,
  credentials: Credentials.fromUsername('admin', { password: cdk.SecretValue.plainText('7959866cacc02c2d243ecfe177464fe6') }),
  instanceProps: {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
    vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    vpc,
  },
  storageEncryptionKey: kmsKey,
  s3ImportBuckets: [importBucket],
  s3ExportBuckets: [exportBucket],
});

cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

app.synth();
