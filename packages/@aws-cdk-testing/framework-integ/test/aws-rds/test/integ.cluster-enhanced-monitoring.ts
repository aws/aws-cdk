import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-cluster-enhanced-monitoring');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

new rds.DatabaseCluster(stack, 'Cluster', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_17_6 }),
  vpc,
  writer: rds.ClusterInstance.serverlessV2('writer'),
  serverlessV2MinCapacity: 0.5,
  serverlessV2MaxCapacity: 1,
  monitoringInterval: cdk.Duration.seconds(5),
  enableClusterLevelEnhancedMonitoring: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'cluster-enhanced-monitoring-integ-test', {
  testCases: [stack],
});

app.synth();
