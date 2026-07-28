import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_MYSQL, INTEG_TEST_LATEST_AURORA_POSTGRES } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { IntegTestBaseStack } from './integ-test-base-stack';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'CloudWatchLogsExportsStack');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

// Test CloudWatch log exports for Aurora MySQL
const mysql = new rds.DatabaseCluster(stack, 'DatabaseClusterMysql', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: INTEG_TEST_LATEST_AURORA_MYSQL }),
  vpc,
  writer: rds.ClusterInstance.serverlessV2('writer'),
  serverlessV2MinCapacity: 0.5,
  serverlessV2MaxCapacity: 2,
  cloudwatchLogsExports: ['error', 'general', 'slowquery', 'audit', 'instance', 'iam-db-auth-error'],
});

// Test CloudWatch log exports for Aurora PostgreSQL
const postgresql = new rds.DatabaseCluster(stack, 'DatabaseClusterPostgresql', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({ version: INTEG_TEST_LATEST_AURORA_POSTGRES }),
  vpc,
  writer: rds.ClusterInstance.serverlessV2('writer'),
  serverlessV2MinCapacity: 0.5,
  serverlessV2MaxCapacity: 2,
  cloudwatchLogsExports: ['postgresql', 'iam-db-auth-error', 'instance'],
});

const integ = new IntegTest(app, 'cluster-cloudwatch-logs-exports-integ-test', {
  testCases: [stack],
});

integ.assertions.awsApiCall('RDS', 'describeDBClusters', {
  DBClusterIdentifier: mysql.clusterIdentifier,
}).expect(ExpectedResult.objectLike({
  DBClusters: [{
    EnabledCloudwatchLogsExports: [
      'audit',
      'error',
      'general',
      'iam-db-auth-error',
      'instance',
      'slowquery',
    ],
  }],
}));

integ.assertions.awsApiCall('RDS', 'describeDBClusters', {
  DBClusterIdentifier: postgresql.clusterIdentifier,
}).expect(ExpectedResult.objectLike({
  DBClusters: [{
    EnabledCloudwatchLogsExports: [
      'iam-db-auth-error',
      'instance',
      'postgresql',
    ],
  }],
}));
