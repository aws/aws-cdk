import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-cluster-major-version-only');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

new rds.DatabaseCluster(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.ofMajorVersion('8.0'),
  }),
  credentials: rds.Credentials.fromUsername('admin', {
    password: cdk.SecretValue.plainText('7959866cacc02c2d243ecfe177464fe6'),
  }),
  writer: rds.ClusterInstance.provisioned('Instance1', {
    isFromLegacyInstanceProps: true,
  }),
  vpc,
});

new IntegTest(app, 'rds-cluster-major-version-only-test', {
  testCases: [stack],
});
