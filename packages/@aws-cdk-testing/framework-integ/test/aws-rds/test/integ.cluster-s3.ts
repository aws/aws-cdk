import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import { ClusterInstance, Credentials, DatabaseCluster, DatabaseClusterEngine } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-s3-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const kmsKey = new kms.Key(stack, 'DbSecurity');

const importBucket = new s3.Bucket(stack, 'ImportBucket');
const exportBucket = new s3.Bucket(stack, 'ExportBucket');

const instanceProps = {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  isFromLegacyInstanceProps: true,
};
const cluster = new DatabaseCluster(stack, 'Database', {
  credentials: Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
  engine: DatabaseClusterEngine.auroraMysql({
    version: INTEG_TEST_LATEST_AURORA_MYSQL,
  }),
  vpc,
  writer: ClusterInstance.provisioned('Instance1', {
    ...instanceProps,
  }),
  readers: [
    ClusterInstance.provisioned('Instance2', {
      ...instanceProps,
    }),
  ],
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  storageEncryptionKey: kmsKey,
  s3ImportBuckets: [importBucket],
  s3ExportBuckets: [exportBucket],
});

cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

new IntegTest(app, 'test-rds-cluster-s3', {
  testCases: [stack],
});

