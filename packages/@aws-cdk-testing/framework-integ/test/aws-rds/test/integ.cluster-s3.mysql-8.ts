import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-s3-mysql-8-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const importExportBucket = new s3.Bucket(stack, 'ImportExportBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new rds.DatabaseCluster(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_07_1,
  }),
  credentials: rds.Credentials.fromUsername('admin', {
    password: cdk.SecretValue.plainText('7959866cacc02c2d243ecfe177464fe6'),
  }),
  writer: rds.ClusterInstance.provisioned('Instance1', { isFromLegacyInstanceProps: true }),
  vpc,
  s3ImportBuckets: [importExportBucket],
  s3ExportBuckets: [importExportBucket],
});

new IntegTest(app, 'aws-cdk-rds-s3-mysql-8-integ-test', {
  testCases: [stack],
});

