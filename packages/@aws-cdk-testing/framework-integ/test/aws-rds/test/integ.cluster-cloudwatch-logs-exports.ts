import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'CloudWatchLogsExportsStack');
const vpc = new ec2.Vpc(stack, 'VPC');

new rds.DatabaseCluster(stack, 'DatabaseClusterMysql', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_07_0 }),
  writer: rds.ClusterInstance.serverlessV2('writerInstance'),
  vpc,
  cloudwatchLogsExports: ['error', 'general', 'slowquery', 'audit', 'instance', 'iam-db-auth-error'],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new rds.DatabaseCluster(stack, 'DatabaseClusterPostgresql', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_16_4 }),
  writer: rds.ClusterInstance.serverlessV2('writerInstance'),
  vpc,
  cloudwatchLogsExports: ['postgresql', 'iam-db-auth-error', 'instance'],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'CloudWatchLogsExportsStackInteg', {
  testCases: [stack],
});
