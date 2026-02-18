import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { IntegTestBaseStack } from './integ-test-base-stack';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'CloudWatchLogsExportsStack');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

// Test CloudWatch log exports for Aurora MySQL
new rds.DatabaseCluster(stack, 'DatabaseClusterMysql', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_08_0 }),
  vpc,
  writer: rds.ClusterInstance.serverlessV2('writer'),
  serverlessV2MinCapacity: 0.5,
  serverlessV2MaxCapacity: 2,
  cloudwatchLogsExports: ['error', 'general', 'slowquery', 'audit'],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Test CloudWatch log exports for Aurora PostgreSQL
new rds.DatabaseCluster(stack, 'DatabaseClusterPostgresql', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_15_14 }),
  vpc,
  writer: rds.ClusterInstance.serverlessV2('writer'),
  serverlessV2MinCapacity: 0.5,
  serverlessV2MaxCapacity: 2,
  cloudwatchLogsExports: ['postgresql'],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'cluster-cloudwatch-logs-exports-integ-test', {
  testCases: [stack],
});
