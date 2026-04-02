import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'cluster-applyimmediately-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 0, restrictDefaultSecurityGroup: false });

const instanceProps = {
  publiclyAccessible: false,
  applyImmediately: false,
};

new rds.DatabaseCluster(stack, 'DatabaseCluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: INTEG_TEST_LATEST_AURORA_MYSQL }),
  credentials: rds.Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  vpc,
  writer: rds.ClusterInstance.provisioned('Instance1', { ...instanceProps }),
  readers: [
    rds.ClusterInstance.serverlessV2('Instance2', { ...instanceProps }),
  ],
});

new IntegTest(app, 'test-cluster-applyimmediately-integ', {
  testCases: [stack],
});
