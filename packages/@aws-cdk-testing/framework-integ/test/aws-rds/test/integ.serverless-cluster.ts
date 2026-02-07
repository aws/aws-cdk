import * as ec2 from 'aws-cdk-lib/aws-ec2';
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
new rds.DatabaseCluster(stack, 'Serverless Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_11_1,
  }),
  writer: rds.ClusterInstance.serverlessV2('writer'),
  serverlessV2MinCapacity: 0.5,
  serverlessV2MaxCapacity: 1,
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  subnetGroup,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  copyTagsToSnapshot: true,
});

new IntegTest(app, 'integ.serverless-cluster', {
  testCases: [stack],
});
