import * as cdk from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'EnhancedMonitoringClusterStack');
const vpc = new ec2.Vpc(stack, 'Vpc');

new rds.DatabaseCluster(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_16_1 }),
  writer: rds.ClusterInstance.serverlessV2('writerInstance'),
  vpc,
  monitoringInterval: cdk.Duration.seconds(5),
  enableClusterLevelEnhancedMonitoring: true,
});

new IntegTest(app, 'EnhancedMonitoringClusterInteg', {
  testCases: [stack],
});
