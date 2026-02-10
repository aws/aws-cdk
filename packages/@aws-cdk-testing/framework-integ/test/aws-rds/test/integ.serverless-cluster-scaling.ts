import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-rds-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false, natGateways: 1 });

const subnetGroup = new rds.SubnetGroup(stack, 'SubnetGroup', {
  vpc,
  description: 'Subnet group for serverless cluster',
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Migrate from ServerlessCluster to DatabaseCluster with serverlessV2
// Original had scaling: { minCapacity: ACU_8, maxCapacity: ACU_32 }
// ServerlessV2 uses different units: 0.5-128 ACUs (each ACU = 2GB RAM)
new rds.DatabaseCluster(stack, 'Serverless Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: INTEG_TEST_LATEST_AURORA_MYSQL,
  }),
  writer: rds.ClusterInstance.serverlessV2('writer'),
  serverlessV2MinCapacity: 0.5, // Minimum capacity
  serverlessV2MaxCapacity: 16, // Maximum capacity (scales up to 16 ACUs)
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  subnetGroup,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'cluster-dual-test', {
  testCases: [stack],
});
