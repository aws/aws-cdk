import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { ClusterInstance, DatabaseCluster, DatabaseClusterEngine, MasterUserAuthenticationType } from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-cluster-iam-master-auth');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

new DatabaseCluster(stack, 'Cluster', {
  engine: DatabaseClusterEngine.auroraMysql({
    version: INTEG_TEST_LATEST_AURORA_MYSQL,
  }),
  vpc,
  writer: ClusterInstance.serverlessV2('writer'),
  serverlessV2MinCapacity: 0.5,
  serverlessV2MaxCapacity: 1,
  masterUserAuthenticationType: MasterUserAuthenticationType.IAM,
  iamAuthentication: true,
});

new IntegTest(app, 'cluster-iam-master-auth-integ-test', {
  testCases: [stack],
});
