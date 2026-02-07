import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-rds-cluster-cloudwatch-logs-exports');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

new rds.DatabaseCluster(stack, 'MysqlCluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_11_1,
  }),
  writer: rds.ClusterInstance.provisioned('writer', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  }),
  vpc,
  cloudwatchLogsExports: ['error', 'general', 'slowquery', 'audit', 'instance', 'iam-db-auth-error'],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new rds.DatabaseCluster(stack, 'PostgresCluster', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({
    version: rds.AuroraPostgresEngineVersion.VER_16_6,
  }),
  writer: rds.ClusterInstance.provisioned('writer', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  }),
  vpc,
  cloudwatchLogsExports: ['postgresql', 'iam-db-auth-error', 'instance'],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'cluster-cloudwatch-logs-exports-integ-test', {
  testCases: [stack],
  diffAssets: true,
});

